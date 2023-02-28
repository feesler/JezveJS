import {
    px,
    createElement,
    re,
    asArray,
    minmax,
    afterTransition,
} from '../../js/common.js';
import '../../css/common.scss';
import { Component } from '../../js/Component.js';
import { Slidable } from '../Slidable/Slidable.js';
import './style.scss';

/* CSS classes */
const SLIDER_CLASS = 'slider';
const CONTENT_CLASS = 'slider__content';
const VERTICAL_CLASS = 'slider_vertical';
const ANIMATE_CLASS = 'animate';

const TRANSITION_END_TIMEOUT = 500;
const SWIPE_THRESHOLD = 20;

const defaultProps = {
    width: 400,
    height: 300,
    vertical: false,
    items: [],
    slideByMouse: false,
    slideByTouch: true,
};

/** Slider component */
export class Slider extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        this.items = [];
        this.position = 0;
        this.slideIndex = 0;
        this.items.length = 0;
        this.waitingForAnimation = false;

        this.init();
    }

    init() {
        const { vertical, slideByMouse, slideByTouch } = this.props;

        this.content = createElement('div', {
            props: { className: CONTENT_CLASS },
        });
        this.elem = createElement('div', {
            props: { className: SLIDER_CLASS },
            children: this.content,
        });
        this.setContentPosition(0);

        if (this.props.items) {
            this.append(this.props.items);
        }

        if (slideByMouse || slideByTouch) {
            Slidable.create({
                elem: this.elem,
                content: this.content,
                vertical,
                slideByMouse,
                slideByTouch,
                updatePosition: (position) => this.setContentPosition(position),
                onDragEnd: (...args) => this.onDragEnd(...args),
            });
        }

        this.render(this.state);
    }

    get clientSize() {
        return (this.state.vertical) ? this.elem.clientHeight : this.elem.clientWidth;
    }

    get contentSize() {
        return (this.state.vertical) ? this.content.offsetHeight : this.content.offsetWidth;
    }

    isFirst() {
        return (this.slideIndex === 0);
    }

    isLast() {
        return (this.slideIndex === this.items.length - 1);
    }

    resetAnimation() {
        this.waitingForAnimation = false;
    }

    complete() {
        this.content.classList.remove(ANIMATE_CLASS);
        this.resetAnimation();
    }

    onAnimationDone() {
        if (this.waitingForAnimation) {
            this.complete();
        }
    }

    onDragEnd(position, distance) {
        const passThreshold = Math.abs(distance) > SWIPE_THRESHOLD;
        let slideNum = -position / this.clientSize;
        if (passThreshold) {
            slideNum = (distance > 0) ? Math.ceil(slideNum) : Math.floor(slideNum);
        } else {
            slideNum = Math.round(slideNum);
        }

        const num = minmax(0, this.items.length - 1, slideNum);
        this.slideTo(num);
    }

    calculatePosition(num) {
        if (num < 0 || num > this.items.length - 1) {
            return false;
        }

        const direction = (num < this.slideIndex) ? 1 : -1;
        const distance = this.clientSize * Math.abs(num - this.slideIndex);
        this.position += (distance * direction);
        this.slideIndex = Math.round(-this.position / this.clientSize);

        return true;
    }

    slideToPrev() {
        this.slideTo(this.slideIndex + -1);
    }

    slideToNext() {
        this.slideTo(this.slideIndex + 1);
    }

    slideTo(num) {
        if (!this.calculatePosition(num)) {
            return;
        }

        this.content.classList.add(ANIMATE_CLASS);

        this.waitingForAnimation = true;
        this.setContentPosition(this.position);

        afterTransition(this.content, {
            duration: TRANSITION_END_TIMEOUT,
            target: this.content,
        }, () => this.onAnimationDone());
    }

    switchTo(num) {
        if (!this.calculatePosition(num)) {
            return;
        }

        this.resetAnimation();
        this.setContentPosition(this.position);
        this.complete();
    }

    setContentPosition(position) {
        if (this.state.vertical) {
            this.content.style.top = px(position);
        } else {
            this.content.style.left = px(position);
        }
    }

    append(items) {
        asArray(items).forEach((item) => this.addSlide(item));
    }

    addSlide(props) {
        const { content, id, name } = props;
        if (!content) {
            return false;
        }

        const elem = createElement('div', {
            props: {
                className: 'slide',
                style: {
                    width: px(this.state.width),
                    height: px(this.state.height),
                },
            },
            children: content,
        });
        if (typeof id !== 'undefined') {
            elem.id = id;
        }
        if (typeof name !== 'undefined') {
            elem.dataset.name = name;
        }

        this.content.append(elem);

        this.items.push({
            ...props,
            elem,
        });

        return true;
    }

    removeSlide(slideId) {
        const index = this.items.findIndex((item) => item.id === slideId);
        if (index === -1) {
            return false;
        }

        const itemToRemove = this.items[index];
        re(itemToRemove?.elem);

        this.position = Math.max(this.position, -this.contentSize + this.clientSize);
        this.slideIndex = Math.round(-this.position / this.clientSize);

        this.items.splice(index, 1);

        return true;
    }

    render(state) {
        this.elem.classList.toggle(VERTICAL_CLASS, state.vertical);
        this.elem.style.width = px(state.width);
        this.elem.style.height = px(state.height);
    }
}
