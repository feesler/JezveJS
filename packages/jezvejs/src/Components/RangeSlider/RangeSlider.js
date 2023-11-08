import { isFunction } from '@jezvejs/types';
import {
    createElement,
    setEvents,
    enable,
} from '@jezvejs/dom';
import { Component } from '../../js/Component.js';
import { minmax, px } from '../../js/common.js';

import { RangeSliderDragZone } from './components/RangeSliderDragZone.js';
import { RangeSliderDropTarget } from './components/RangeSliderDropTarget.js';
import {
    getStepPrecision,
    positionToValue,
    stepValue,
    valueToPosition,
} from './helpers.js';
import './RangeSlider.scss';

/* CSS classes */
const CONTAINER_CLASS = 'range-slider';
const X_AXIS_CLASS = 'range-slider_x-axis';
const Y_AXIS_CLASS = 'range-slider_y-axis';
const SLIDER_CLASS = 'range-slider__slider';
const SLIDER_AREA_CLASS = 'range-slider__area';
const SELECTED_AREA_CLASS = 'range-slider__selected-area';

const defaultProps = {
    id: undefined,
    tabIndex: 0,
    disabled: false,
    value: undefined,
    start: undefined,
    end: undefined,
    axis: 'x',
    min: 0,
    max: 100,
    step: 1,
    range: false,
    onFocus: null,
    onBlur: null,
    onChange: null,
};

/**
 * Range slider component
 */
export class RangeSlider extends Component {
    static userProps = {
        elem: ['id', 'tabIndex'],
    };

    constructor(props) {
        super({
            ...defaultProps,
            ...props,
        });

        this.resizeHandler = () => this.onResize();

        this.state = {
            ...this.props,
            maxPos: 0,
        };

        if (this.props.range) {
            const values = [this.props.min, this.props.max];
            this.state.min = Math.min(...values);
            this.state.max = Math.max(...values);
            this.state.start = this.state.start ?? this.props.min;
            this.state.end = this.state.end ?? this.props.max;
        } else {
            this.state.value = this.state.value ?? this.props.min;
        }

        this.precision = getStepPrecision(this.props.step);

        this.init();
        this.postInit();
        this.render(this.state);
    }

    /** Returns id of root element of component */
    get id() {
        return this.props.id;
    }

    /** Returns current value of component */
    get value() {
        return (this.props.range)
            ? { start: this.state.start, end: this.state.end }
            : this.state.value;
    }

    /** Returns disabled state of component */
    get disabled() {
        return this.state.disabled;
    }

    init() {
        this.slider = this.createSlider();
        if (this.props.range) {
            this.selectedArea = createElement('div', { props: { className: SELECTED_AREA_CLASS } });
            this.endSlider = this.createSlider();
        }

        this.sliderArea = createElement('div', { props: { className: SLIDER_AREA_CLASS } });

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: [
                this.sliderArea,
                this.selectedArea,
                this.slider,
                this.endSlider,
            ],
        });

        this.initSlider(this.slider, (pos) => this.onPosChange(pos));
        this.initSlider(this.endSlider, (pos) => this.onEndPosChange(pos));
        this.initSlider(this.selectedArea, (pos) => this.onScroll(pos));
        RangeSliderDropTarget.create({ elem: this.elem });
    }

    createSlider() {
        return createElement('div', { props: { className: SLIDER_CLASS } });
    }

    initSlider(slider, onChange) {
        if (!slider) {
            return;
        }

        RangeSliderDragZone.create({
            elem: slider,
            axis: this.props.axis,
            onChange,
        });
    }

    postInit() {
        this.setClassNames();
        this.setHandlers();
        this.setUserProps();
        this.observeSize();
    }

    setHandlers() {
        setEvents(this.elem, {
            focus: (e) => this.onFocus(e),
            blur: (e) => this.onBlur(e),
            click: (e) => this.onClick(e),
        });
    }

    observeSize() {
        const observer = new ResizeObserver(this.resizeHandler);
        observer.observe(this.elem);
    }

    getMaxPos(slider = this.slider) {
        const rect = slider.getBoundingClientRect();
        const offset = this.elem.getBoundingClientRect();
        return (this.props.axis === 'x')
            ? Math.round(offset.width - rect.width)
            : Math.round(offset.height - rect.height);
    }

    positionToValue(pos) {
        const value = positionToValue(pos, this.state.min, this.state.max, this.getMaxPos());
        return stepValue(value, this.state.step, this.precision);
    }

    onClick(e) {
        if (e.target !== this.sliderArea) {
            return;
        }

        let pos = null;
        const { axis } = this.props;

        const rect = this.slider.getBoundingClientRect();
        if (axis === 'x') {
            pos = e.offsetX - (rect.width / 2);
        } else if (axis === 'y') {
            pos = e.offsetY - (rect.height / 2);
        }

        if (pos !== null) {
            const value = this.positionToValue(pos);

            if (this.props.range) {
                const { start, end } = this.state;
                if (value < start) {
                    this.onPosChange(pos);
                } else if (value > end) {
                    this.onEndPosChange(pos);
                }
            } else {
                this.onPosChange(pos);
            }
        }

        if (isFunction(this.props.onClick)) {
            this.props.onClick(e);
        }
    }

    onFocus(e) {
        if (isFunction(this.props.onFocus)) {
            this.props.onFocus(e);
        }
    }

    onBlur(e) {
        if (isFunction(this.props.onBlur)) {
            this.props.onBlur(e);
        }
    }

    onResize() {
        this.setState({ ...this.state, maxPos: this.getMaxPos() });
    }

    onPosChange(pos) {
        const value = this.positionToValue(pos);
        if (this.props.range) {
            const start = Math.min(this.state.end, value);
            this.setState({ ...this.state, start });
        } else {
            this.setState({ ...this.state, value });
        }

        this.notifyChanged();
    }

    onEndPosChange(pos) {
        if (!this.props.range) {
            return;
        }

        const value = this.positionToValue(pos);
        const end = Math.max(this.state.start, value);
        this.setState({ ...this.state, end });
        this.notifyChanged();
    }

    onScroll(pos) {
        if (!this.props.range) {
            return;
        }

        const value = this.positionToValue(pos);
        const size = Math.abs(this.state.end - this.state.start);
        const start = minmax(this.state.min, this.state.max - size, value);
        const end = start + size;

        this.setState({ ...this.state, start, end });
        this.notifyChanged();
    }

    notifyChanged() {
        if (!isFunction(this.props.onChange)) {
            return;
        }

        this.props.onChange(this.value);
    }

    notifyRangeChanged() {
        if (!this.props.range || !isFunction(this.props.onChange)) {
            return;
        }

        const { start, end } = this.state;
        this.props.onChange({ start, end });
    }

    /** Enables/disabled component */
    enable(value = true) {
        if (this.state.disabled === !value) {
            return;
        }

        this.setState({ ...this.state, disabled: !value });
    }

    updatePrecision(state, prevState) {
        if (state.step === prevState?.step) {
            return;
        }

        this.precision = getStepPrecision(state.step);
    }

    renderSlider(state, prevState) {
        const value = (this.props.range) ? state.start : state.value;
        const prevValue = (this.props.range) ? prevState.start : prevState.value;

        if (
            value === prevValue
            && state.maxPos === prevState.maxPos
        ) {
            return;
        }

        this.setSliderValue(this.slider, value, state);
    }

    renderEndSlider(state, prevState) {
        if (
            !this.props.range
            || (
                state.end === prevState.end
                && state.maxPos === prevState.maxPos
            )
        ) {
            return;
        }

        this.setSliderValue(this.endSlider, state.end, state);
    }

    setSliderValue(slider, value, state) {
        if (!slider) {
            return;
        }

        const { style } = slider;
        const { axis } = this.props;
        const maxPos = this.getMaxPos(slider);
        const pos = valueToPosition(value, state.min, state.max, maxPos);

        if (axis === 'x') {
            style.left = px(pos);
        } else if (axis === 'y') {
            style.top = px(pos);
        }
    }

    renderSelectedRange(state, prevState) {
        if (!this.props.range || !this.selectedArea) {
            return;
        }

        if (
            state.start === prevState.start
            && state.end === prevState.end
            && state.maxPos === prevState.maxPos
        ) {
            return;
        }

        const { axis } = this.props;
        const startPos = this.valueToPosition(state.start, state);
        const endPos = this.valueToPosition(state.end, state);
        const size = Math.abs(endPos - startPos);

        if (axis === 'x') {
            this.selectedArea.style.left = px(startPos);
            this.selectedArea.style.width = px(size);
        } else if (axis === 'y') {
            this.selectedArea.style.top = px(startPos);
            this.selectedArea.style.height = px(size);
        }
    }

    valueToPosition(value, state = this.state) {
        return valueToPosition(value, state.min, state.max, state.maxPos);
    }

    /** Render component */
    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.elem.classList.toggle(X_AXIS_CLASS, state.axis === 'x');
        this.elem.classList.toggle(Y_AXIS_CLASS, state.axis === 'y');

        enable(this.elem, !state.disabled);

        if (!state.disabled && typeof this.props.tabIndex !== 'undefined') {
            this.elem.setAttribute('tabindex', this.props.tabIndex);
        } else {
            this.elem.removeAttribute('tabindex');
        }

        this.updatePrecision(state, prevState);
        this.renderSlider(state, prevState);
        this.renderEndSlider(state, prevState);
        this.renderSelectedRange(state, prevState);
    }
}
