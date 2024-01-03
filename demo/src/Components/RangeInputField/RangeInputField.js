import { Component } from 'jezvejs';
import { createElement } from '@jezvejs/dom';
import { generateId } from '../../Application/utils.js';
import './RangeInputField.scss';

/* CSS classes */
const FIELD_CLASS = 'range-field';

const defaultProps = {
    inputId: undefined,
    title: null,
    min: 1,
    max: 10,
    value: 5,
    onInput: null,
    onChange: null,
};

/**
 * Range input field
 */
export class RangeInputField extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            inputId: props.inputId ?? generateId(),
        });

        this.init();
    }

    get value() {
        return this.input?.value;
    }

    init() {
        this.label = createElement('label', {
            htmlFor: this.props.inputId,
            textContent: this.props.title,
        });

        this.input = createElement('input', {
            id: this.props.inputId,
            type: 'range',
            min: this.props.min,
            max: this.props.max,
            value: this.props.value,
            events: {
                input: (e) => this.onInput(e),
                change: (e) => this.onChange(e),
            },
        });

        this.valueEl = createElement('span', { textContent: this.props.value });

        this.elem = createElement('div', {
            className: FIELD_CLASS,
            children: [
                this.label,
                createElement('div', {
                    children: [
                        this.input,
                        this.valueEl,
                    ],
                }),
            ],
        });
    }

    onInput(e) {
        this.setState({ ...this.state, value: e.target.value });

        this.notifyEvent('onInput', e.target.value);
    }

    onChange(e) {
        this.setState({ ...this.state, value: e.target.value });

        this.notifyEvent('onChange', e.target.value);
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.valueEl.textContent = state.value;
        this.input.value = state.value;
    }
}
