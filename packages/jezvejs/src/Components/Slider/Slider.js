import {
    ge,
    px,
    createElement,
} from '../../js/common.js';
import '../../css/common.scss';
import { Component } from '../../js/Component.js';
import { SliderDragZone } from './components/SliderDragZone.js';
import { SliderDropTarget } from './components/SliderDropTarget.js';
import './style.scss';

/* CSS classes */
const SLIDER_CLASS = 'slider';
const CONTENT_CLASS = 'slider__content';
const VERTICAL_CLASS = 'slider_vertical';
const ANIMATE_CLASS = 'animate';

const TRANSITION_END_TIMEOUT = 700;
const SWIPE_THRESHODL = 35;

const defaultProps = {
    width: 400,
    height: 300,
    vertical: false,
};

// Slider constructor
export class Slider extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        this.curshift = 0;
        this.direction = false;
        this.curslide = 0;
        this.slidecount = 0;
        this.update = null;
        this.waitingForAnimation = false;

        this.init();
    }

    init() {
        this.content = createElement('div', {
            props: { className: CONTENT_CLASS },
            events: {
                transitionend: (e) => this.onTransitionEnd(e),
            },
        });
        this.elem = createElement('div', {
            props: { className: SLIDER_CLASS },
            children: this.content,
        });
        this.setContentPosition(0);

        SliderDragZone.create({
            elem: this.content,
            vertical: this.state.vertical,
            isReady: () => !this.waitingForAnimation,
            updatePosition: (position) => this.setContentPosition(position),
        });
        SliderDropTarget.create({
            elem: this.elem,
            onDragEnd: (...args) => this.onDragEnd(...args),
        });

        this.slidecount = 0;

        this.render(this.state);
    }

    clsize() {
        return ((this.state.vertical) ? this.elem.clientHeight : this.elem.clientWidth);
    }

    isFirst() {
        return (this.curslide === 0);
    }

    isLast() {
        return (this.curslide === this.slidecount - 1);
    }

    complete() {
        this.curslide = Math.round(-this.curshift / (this.clsize() - 1));

        if (this.update) {
            this.update();
        }

        this.waitingForAnimation = false;
    }

    onDragEnd(position, distance) {
        const passThreshold = Math.abs(distance) > SWIPE_THRESHODL;
        let slideNum = -position / this.clsize();
        if (passThreshold) {
            slideNum = (distance > 0) ? Math.ceil(slideNum) : Math.floor(slideNum);
        } else {
            slideNum = Math.round(slideNum);
        }

        const num = Math.max(0, Math.min(this.slidecount - 1, slideNum));
        this.slideTo(num);
    }

    onTransitionEnd(e) {
        if (e.target !== this.content) {
            return;
        }

        if (this.waitingForAnimation) {
            this.complete();
        }
    }

    slide(dir) {
        // check slide is applicable
        if ((!dir && this.curslide === this.slidecount) || (dir && this.curslide === 0)) {
            return;
        }

        this.slideTo(this.curslide + (dir ? -1 : 1));
    }

    slideTo(num) {
        if (num < 0 || num > this.slidecount - 1) {
            return;
        }

        const dir = (num < this.curslide);
        this.direction = dir;

        const distance = this.clsize() * Math.abs(num - this.curslide);
        this.targetPos = this.curshift + (dir ? distance : -distance);
        this.startPos = this.curshift;
        this.curshift = this.targetPos;

        this.content.classList.add(ANIMATE_CLASS);

        this.waitingForAnimation = true;
        this.setContentPosition(this.curshift);
        setTimeout(() => {
            if (this.waitingForAnimation) {
                this.complete();
            }
        }, TRANSITION_END_TIMEOUT);
    }

    switchTo(num) {
        if (num < 0 || num > this.slidecount - 1 || num === this.curslide) {
            return;
        }

        this.direction = (num < this.curslide);
        this.slidesize = (this.clsize() - 1) * Math.abs(num - this.curslide);
        this.curshift += (this.direction ? this.slidesize : -this.slidesize);

        this.content.classList.remove(ANIMATE_CLASS);

        this.setContentPosition(this.curshift);
        this.complete();
    }

    setContentPosition(position) {
        if (this.state.vertical) {
            this.content.style.top = px(position);
        } else {
            this.content.style.left = px(position);
        }
    }

    addSlide(slideId) {
        if (!this.content) {
            return false;
        }

        const slDiv = createElement('div', {
            props: {
                id: slideId,
                className: 'slide',
                style: {
                    width: px(this.state.width),
                    height: px(this.state.height),
                },
            },
        });
        this.content.append(slDiv);

        this.slidecount += 1;

        return true;
    }

    removeSlide(slideId) {
        if (!this.content) {
            return false;
        }

        const slDiv = ge(slideId);
        if (!slDiv) {
            return false;
        }

        this.content.removeChild(slDiv);

        this.slidecount -= 1;
        const contentSize = (this.state.vertical)
            ? this.content.offsetHeight
            : this.content.offsetWidth;

        this.curshift = Math.max(this.curshift, -contentSize + this.clsize());
        this.curslide = Math.round(-this.curshift / (this.clsize() - 1));

        return true;
    }

    render(state) {
        this.elem.classList.toggle(VERTICAL_CLASS, state.vertical);
        this.elem.style.width = px(state.width);
        this.elem.style.height = px(state.height);
    }
}
