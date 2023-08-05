import { Component, createElement, isFunction } from 'jezvejs';
import './RangeInputField.scss';

/* CSS classes */
const FIELD_CLASS = 'range-field';

const defaultProps = {
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
        });

        this.init();
    }

    init() {
        this.label = createElement('label', { props: { textContent: this.props.title } });

        this.input = createElement('input', {
            props: {
                type: 'range',
                min: this.props.min,
                max: this.props.max,
                value: this.props.value,
            },
            events: {
                input: (e) => this.onInput(e),
                change: (e) => this.onChange(e),
            },
        });

        this.valueEl = createElement('span', { props: { textContent: this.props.value } });

        this.elem = createElement('div', {
            props: { className: FIELD_CLASS },
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

        if (isFunction(this.props.onInput)) {
            this.props.onInput(e.target.value);
        }
    }

    onChange(e) {
        this.setState({ ...this.state, value: e.target.value });

        if (isFunction(this.props.onChange)) {
            this.props.onChange(e.target.value);
        }
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.valueEl.textContent = state.value;
        this.input.value = state.value;
    }
}