import { isFunction } from '@jezvejs/types';
import {
    createElement,
    setEvents,
    enable,
} from '@jezvejs/dom';
import { Component } from '../../Component.js';
import { minmax, px } from '../../common.js';

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
const BEFORE_AREA_CLASS = 'range-slider__before-area';
const AFTER_AREA_CLASS = 'range-slider__after-area';

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
    beforeArea: false,
    afterArea: false,
    scrollOnClickOutsideRange: false,
    onFocus: null,
    onBlur: null,
    onBeforeChange: null,
    onChange: null,
    onScroll: null,
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
            originalValue: null,
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

    /** Returns current start value of range mode component or null for single value mode */
    get start() {
        return (this.props.range) ? this.state.start : null;
    }

    /** Returns current end value of range mode component or null for single value mode */
    get end() {
        return (this.props.range) ? this.state.end : null;
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

        if (this.props.beforeArea) {
            this.beforeArea = createElement('div', { props: { className: BEFORE_AREA_CLASS } });
        }

        if (this.props.afterArea) {
            this.afterArea = createElement('div', { props: { className: AFTER_AREA_CLASS } });
        }

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: [
                this.sliderArea,
                this.beforeArea,
                this.afterArea,
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
            onDragStart: (params) => this.onDragStart(params),
            onDragCancel: (params) => this.onDragCancel(params),
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
            ? (offset.width - rect.width)
            : (offset.height - rect.height);
    }

    getStartValue(state = this.state) {
        return (this.props.range) ? state.start : state.value;
    }

    getEndValue(state = this.state) {
        return (this.props.range) ? state.end : state.value;
    }

    positionToValue(pos) {
        const value = positionToValue(pos, this.state.min, this.state.max, this.getMaxPos());
        return stepValue(value, this.state.step, this.precision);
    }

    onClick(e) {
        const availTargets = [
            this.sliderArea,
            this.beforeArea,
            this.afterArea,
        ];

        if (e.target && !availTargets.includes(e.target)) {
            return;
        }

        let pos = null;
        const { axis } = this.props;

        const rect = this.slider.getBoundingClientRect();
        const offset = this.elem.getBoundingClientRect();
        if (axis === 'x') {
            pos = (e.clientX - offset.left) - (rect.width / 2);
        } else if (axis === 'y') {
            pos = (e.clientY - offset.top) - (rect.height / 2);
        }

        if (pos !== null) {
            const value = this.positionToValue(pos);

            if (this.props.range) {
                const { start, end, maxPos } = this.state;
                const delta = Math.abs(end - start) * 0.9;

                if (value < start) {
                    if (this.props.scrollOnClickOutsideRange) {
                        const newValue = this.valueToPosition(start - delta);
                        const newPos = Math.max(0, newValue);
                        this.onScroll(newPos);
                    } else {
                        this.onStartPosChange(pos);
                    }
                } else if (value > end) {
                    if (this.props.scrollOnClickOutsideRange) {
                        const newValue = this.valueToPosition(start + delta);
                        const newPos = Math.min(maxPos, newValue);
                        this.onScroll(newPos);
                    } else {
                        this.onEndPosChange(pos);
                    }
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

    onDragStart() {
        this.setState({
            ...this.state,
            originalValue: this.value,
        });
    }

    onDragCancel() {
        const { originalValue } = this.state;
        if (originalValue === null) {
            return;
        }

        if (this.props.range) {
            const { start, end } = originalValue;
            this.setState({
                ...this.state,
                start,
                end,
                originalValue: null,
            });
        } else {
            this.setState({
                ...this.state,
                value: originalValue,
                originalValue: null,
            });
        }

        this.notifyChanged();
    }

    onPosChange(pos) {
        if (this.props.range) {
            this.onStartPosChange(pos);
            return;
        }

        const newValue = this.positionToValue(pos);
        const value = this.beforeChange(newValue);
        if (this.state.value === value) {
            return;
        }

        this.setState({ ...this.state, value });

        this.notifyChanged();
    }

    changeRange(range, scroll = false) {
        const { start, end } = range;
        if (
            this.state.start === start
            && this.state.end === end
        ) {
            return;
        }

        this.setState({ ...this.state, start, end });

        if (scroll) {
            this.notifyScroll();
        }
        this.notifyChanged();
    }

    onStartPosChange(pos) {
        if (!this.props.range) {
            return;
        }

        const value = this.positionToValue(pos);
        const newRange = {
            start: Math.min(this.state.end, value),
            end: this.state.end,
        };

        const range = this.beforeChange(newRange, 'start');
        this.changeRange(range);
    }

    onEndPosChange(pos) {
        if (!this.props.range) {
            return;
        }

        const value = this.positionToValue(pos);
        const newRange = {
            start: this.state.start,
            end: Math.max(this.state.start, value),
        };

        const range = this.beforeChange(newRange, 'end');
        this.changeRange(range);
    }

    onScroll(pos) {
        if (!this.props.range) {
            return;
        }

        const value = this.positionToValue(pos);
        const size = Math.abs(this.state.end - this.state.start);
        const start = minmax(this.state.min, this.state.max - size, value);
        const end = minmax(this.state.min + size, this.state.max, start + size);

        this.changeRange({ start, end }, true);
    }

    beforeChange(value, changeType = 'value') {
        return isFunction(this.props.onBeforeChange)
            ? this.props.onBeforeChange(value, changeType)
            : value;
    }

    notifyChanged() {
        if (isFunction(this.props.onChange)) {
            this.props.onChange(this.value);
        }
    }

    notifyScroll() {
        if (isFunction(this.props.onScroll)) {
            this.props.onScroll(this.value);
        }
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
        const value = this.getStartValue(state);
        const prevValue = this.getStartValue(prevState);
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

        const maxPos = this.getMaxPos(slider);
        const pos = valueToPosition(value, state.min, state.max, maxPos);

        this.setAreaPosition(slider, pos);
    }

    setAreaPosition(area, position) {
        const { style } = area;
        if (this.props.axis === 'x') {
            style.left = px(position);
        } else {
            style.top = px(position);
        }
    }

    setAreaSize(area, size) {
        const { style } = area;
        if (this.props.axis === 'x') {
            style.width = px(size);
        } else {
            style.height = px(size);
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

        const startPos = this.valueToPosition(state.start, state);
        const endPos = this.valueToPosition(state.end, state);
        const size = Math.abs(endPos - startPos);

        this.setAreaPosition(this.selectedArea, startPos);
        this.setAreaSize(this.selectedArea, size);
    }

    renderBeforeArea(state, prevState) {
        if (!this.beforeArea) {
            return;
        }

        const value = this.getStartValue(state);
        if (
            value === this.getStartValue(prevState)
            && state.maxPos === prevState.maxPos
        ) {
            return;
        }

        const startPos = this.valueToPosition(value, state);

        this.setAreaSize(this.beforeArea, startPos);
    }

    renderAfterArea(state, prevState) {
        if (!this.afterArea) {
            return;
        }

        const value = this.getEndValue(state);
        if (
            value === this.getEndValue(prevState)
            && state.maxPos === prevState.maxPos
        ) {
            return;
        }

        const endPos = this.valueToPosition(value, state);
        const size = Math.abs(state.maxPos - endPos);

        this.setAreaSize(this.afterArea, size);
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
        this.renderBeforeArea(state, prevState);
        this.renderAfterArea(state, prevState);
    }
}
