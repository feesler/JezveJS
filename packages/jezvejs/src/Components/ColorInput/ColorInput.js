import { createElement, enable } from '@jezvejs/dom';

import { Component } from '../../Component.js';
import { ColorItem } from '../ColorItem/ColorItem.js';
import { Input } from '../Input/Input.js';

import './ColorInput.scss';

/** CSS classes */
const CONTAINER_CLASS = 'color-input';
const INPUT_CLASS = 'color-input__input';
const VALUE_CLASS = 'color-input__value';

const defauptProps = {
    value: '',
    colorProp: '--color-item-value',
    inputId: undefined,
    name: undefined,
    disabled: false,
    onInput: null,
    onChange: null,
    onFocus: null,
    onBlur: null,
};

/**
 * Color input component class
 */
export class ColorInput extends Component {
    constructor(props = {}) {
        super({
            ...defauptProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        this.init();
        this.postInit();
        this.render(this.state);
    }

    /** Returns id of root element of component */
    get id() {
        return this.props.id;
    }

    /** Returns value of input element */
    get value() {
        return this.state.value;
    }

    /** Returns disabled state of component */
    get disabled() {
        return this.state.disabled;
    }

    init() {
        this.input = Input.create({
            id: this.props.inputId,
            className: INPUT_CLASS,
            type: 'color',
            name: this.props.name,
            tabIndex: this.props.tabIndex,
            onFocus: (e) => this.onFocus(e),
            onBlur: (e) => this.onBlur(e),
            onInput: (e) => this.onInput(e),
            onChange: (e) => this.onChange(e),
        });

        this.colorValue = ColorItem.create({
            value: this.props.value,
            colorProp: this.props.colorProp,
            className: VALUE_CLASS,
        });

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: [
                this.input.elem,
                this.colorValue.elem,
            ],
        });
    }

    postInit() {
        this.setClassNames();
    }

    onFocus(e) {
        this.notifyEvent('onFocus', e);
    }

    onBlur(e) {
        this.notifyEvent('onBlur', e);
    }

    onInput(e) {
        this.setValue(e.target.value);

        this.notifyEvent('onInput', e);
    }

    onChange(e) {
        this.setValue(e.target.value);

        this.notifyEvent('onChange', e);
    }

    enable(value = true) {
        if (this.state.disabled === !value) {
            return;
        }

        this.setState({ ...this.state, disabled: !value });
    }

    setValue(value) {
        if (this.state.value === value) {
            return;
        }

        this.setState({ ...this.state, value });
    }

    renderValue(state) {
        this.colorValue.setValue(state.value);
    }

    renderInput(state, prevState) {
        this.input.value = state.value;

        if (state.disabled !== prevState?.disabled) {
            this.input.enable(!state.disabled);
        }
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        enable(this.elem, !state.disabled);

        this.renderValue(state, prevState);
        this.renderInput(state, prevState);
    }
}
