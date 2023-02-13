import {
    createElement,
    enable,
    isFunction,
    setEvents,
    setProps,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';

/* CSS classes */
const INPUT_CLASS = 'dd__input';

const defaultProps = {
    id: undefined,
    value: '',
    type: 'text',
    placeholder: '',
    tabIndex: 0,
    disabled: false,
    onInput: null,
};

const validInputTypes = [
    'email',
    'number',
    'password',
    'search',
    'tel',
    'text',
    'url',
];

export class DropDownInput extends Component {
    static userProps = {
        elem: ['id', 'type', 'placeholder', 'value', 'tabIndex'],
    };

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        if (this.elem) {
            this.parse();
        } else {
            this.init();
        }
    }

    get value() {
        return this.elem.value;
    }

    init() {
        this.elem = createElement('input');

        this.postInit();
    }

    parse() {
        if (this.elem?.tagName !== 'INPUT') {
            throw new Error('Invalid input element');
        }
        if (!this.isValidInputType(this.elem.type)) {
            throw new Error('Invalid type of input');
        }

        this.postInit();
    }

    postInit() {
        setProps(this.elem, {
            className: INPUT_CLASS,
            autocomplete: 'off',
        });
        setEvents(this.elem, {
            input: (e) => this.onInput(e),
        });

        this.setClassNames();
        this.setUserProps();
        this.render(this.state);
    }

    /**
     * Returns true if specified type is valid
     * @param {string} type value to validate
     * @returns
     */
    isValidInputType(type) {
        return validInputTypes.includes(type);
    }

    /** Sets focus to input element */
    focus() {
        this.elem.focus();
    }

    /** Removes focus from input element */
    blur() {
        this.elem.blur();
    }

    /** Enables/disabled component */
    enable(value = true) {
        if (this.state.disabled === !value) {
            return;
        }

        this.setState({ ...this.state, disabled: !value });
    }

    /** 'input' event handler  */
    onInput(e) {
        if (isFunction(this.props.onInput)) {
            this.props.onInput(e);
        }
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (state.disabled) {
            this.elem.removeAttribute('tabindex');
        } else {
            this.elem.setAttribute('tabindex', state.tabIndex);
        }

        if (state.disabled !== prevState?.disabled) {
            enable(this.elem, !state.disabled);
        }

        if (state.placeholder !== prevState?.placeholder) {
            this.elem.placeholder = state.placeholder ?? '';
        }

        if (state.value !== prevState?.value) {
            this.elem.value = state.value ?? '';
        }
    }
}
