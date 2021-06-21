import {
    isFunction,
    ge,
    ce,
    setParam,
    px,
} from '../../js/common.js';

// Return reverce function for delta
export function easeOut(delta) {
    return function (progress) {
        return 1 - delta(1 - progress);
    };
}

// Default (linear) delta function
function defDelta(progress) {
    return progress;
}

// Slider constructor
export class Slider {
    constructor() {
        this.slider = null;
        this.inslide = null;
        this.type = false;
        this.curshift = 0;
        this.direction = false;
        this.timerId = 0;
        this.slidesize = 0;
        this.inslsize = 0;
        this.curslide = 0;
        this.slidecount = 0;
        this.update = null;
        this.delay = 0;

        this.duration = 0;
        this.startTime = 0;
        this.curProgress = 0;
        this.onstep = null;
        this.delta = null;

        this.startPos = 0;
        this.targetPos = 0;

        this.swidth = 0;
        this.sheight = 0;
    }

    updateInslide() {
        if (!this.inslide) {
            return;
        }

        if (this.type) {
            this.inslide.style.height = px(this.inslsize);
        } else {
            this.inslide.style.width = px(this.inslsize);
        }
    }

    moveInslide() {
        if (!this.inslide) {
            return;
        }

        if (this.type) {
            this.inslide.style.top = px(this.curshift);
        } else {
            this.inslide.style.left = px(this.curshift);
        }
    }

    init(params) {
        if (!params || !params.width || !params.height) {
            return false;
        }

        this.swidth = params.width;
        this.sheight = params.height;

        this.slider = ge(params.id);
        if (!this.slider) {
            return false;
        }

        setParam(this.slider.style, {
            width: px(this.swidth),
            height: px(this.sheight),
            styleFloat: 'left',
            position: 'relative',
            overflow: 'hidden',
        });

        this.inslide = this.slider.firstElementChild;
        if (!this.inslide) {
            return false;
        }

        setParam(this.inslide.style, { position: 'absolute', top: '0px', left: '0px' });

        this.type = params.vert || false;

        this.inslsize = 0;
        this.slidecount = 0;
        const chnodes = this.inslide.childNodes;
        for (let i = 0; i < chnodes.length; i += 1) {
            const node = chnodes[i];
            if (node.nodeType === 1) {
                this.setupSlide(node);
            }
        }

        this.updateInslide();

        this.delay = params.delay || 100;
        this.duration = params.duration || 1000;

        if (params.onstep && isFunction(params.onstep)) {
            this.onstep = params.onstep.bind(this);
        } else {
            this.onstep = this.defStep;
        }

        if (params.delta && isFunction(params.delta)) {
            this.delta = params.delta;
        } else {
            this.delta = defDelta;
        }

        this.update = params.updcb || null;
        if (this.update) {
            this.update();
        }

        return true;
    }

    clsize() {
        return ((this.type) ? this.slider.clientHeight : this.slider.clientWidth);
    }

    isFirst() {
        return (this.curslide === 0);
    }

    isLast() {
        return (this.curslide === this.slidecount - 1);
    }

    complete() {
        clearInterval(this.timerId);
        this.timerId = 0;
        this.slidesize = 0;
        this.curslide = Math.round(-this.curshift / (this.clsize() - 1));

        if (this.update) {
            this.update();
        }
    }

    defStep(progress) {
        if (!this.inslide) {
            return;
        }

        this.curshift = this.startPos + (this.targetPos - this.startPos) * progress;
        this.moveInslide();
    }

    onTimer() {
        this.curProgress = (new Date() - this.startTime) / this.duration;
        if (this.curProgress > 1) {
            this.curProgress = 1;
        }

        if (this.onstep) {
            this.onstep(this.delta(this.curProgress));
        }

        if (this.curProgress === 1) {
            if (this.onstep) {
                this.onstep(1);
            }

            this.complete();
        }
    }

    slide(dir) {
        if (!this.slider || this.timerId !== 0) {
            return;
        }

        // check slide is applicable
        if ((!dir && this.curslide === this.slidecount) || (dir && this.curslide === 0)) {
            return;
        }

        this.slideTo(this.curslide + (dir ? -1 : 1));
    }

    slideTo(num) {
        if (!this.slider || this.timerId !== 0) {
            return;
        }

        if (num < 0 || num > this.slidecount - 1 || num === this.curslide) {
            return;
        }

        const dir = (num < this.curslide);
        this.direction = dir;

        this.slidesize = this.clsize() * Math.abs(num - this.curslide);
        this.targetPos = this.curshift + (dir ? this.slidesize : -this.slidesize);
        this.startPos = this.curshift;
        this.startTime = new Date();
        this.curProgress = 0;

        this.timerId = setInterval(this.onTimer.bind(this), this.delay);
    }

    switchTo(num) {
        if (!this.slider || this.timerId !== 0) {
            return;
        }

        if (num < 0 || num > this.slidecount - 1 || num === this.curslide) {
            return;
        }

        this.direction = (num < this.curslide);
        this.slidesize = (this.clsize() - 1) * Math.abs(num - this.curslide);
        this.curshift += (this.direction ? this.slidesize : -this.slidesize);

        this.moveInslide();

        this.complete();
    }

    setupSlide(slideObj) {
        if (!slideObj) {
            return;
        }

        setParam(slideObj, {
            className: 'slide',
            style: {
                width: px(this.swidth),
                height: px(this.sheight),
                styleFloat: 'left',
                position: 'relative',
                display: 'inline-block',
                textAlign: 'left',
            },
        });

        this.slidecount += 1;
        this.inslsize += ((this.type) ? this.sheight : this.swidth);
    }

    addSlide(slideId) {
        if (!this.inslide) {
            return false;
        }

        const slDiv = ce('div', { id: slideId });
        if (!slDiv) {
            return false;
        }

        this.setupSlide(slDiv);

        this.inslide.appendChild(slDiv);
        this.updateInslide();

        return true;
    }

    removeSlide(slideId) {
        if (!this.inslide) {
            return false;
        }

        const slDiv = ge(slideId);
        if (!slDiv) {
            return false;
        }

        this.inslide.removeChild(slDiv);

        this.slidecount -= 1;
        this.inslsize -= this.clsize();
        this.curshift = Math.max(this.curshift, -this.inslsize + this.clsize());
        this.curslide = Math.round(-this.curshift / (this.clsize() - 1));
        this.updateInslide();
        this.moveInslide();

        return true;
    }
}
