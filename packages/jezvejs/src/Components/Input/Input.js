import {
    createElement,
    setEvents,
    enable,
} from '@jezvejs/dom';
import { Component } from '../../Component.js';
import '../../common.scss';
import './Input.scss';

/* CSS classes */
const INPUT_CLASS = 'input';

const defaultProps = {
    id: undefined,
    name: undefined,
    form: undefined,
    tabIndex: undefined,
    inputMode: undefined,
    placeholder: '',
    type: 'text',
    disabled: false,
    value: undefined,
    onInput: null,
    onFocus: null,
    onBlur: null,
    onChange: null,
};

/**
 * Input component
 */
export class Input extends Component {
    static userProps = {
        elem: ['id', 'type', 'name', 'form', 'tabIndex', 'value', 'inputMode', 'placeholder'],
    };

    constructor(props) {
        super({
            ...defaultProps,
            ...props,
        });

        this.props.value = this.props.value ?? this.value ?? '';

        this.state = { ...this.props };

        this.init();
        this.postInit();
    }

    /** Returns id of root element of component */
    get id() {
        return this.props.id;
    }

    /** Returns value of input element */
    get value() {
        return (this.elem) ? this.elem.value : null;
    }

    /** Sets new value for input element */
    set value(val) {
        if (this.elem) {
            this.elem.value = val;
        }
    }

    /** Returns disabled state of component */
    get disabled() {
        return this.state.disabled;
    }

    init() {
        if (!this.elem) {
            this.elem = createElement('input', {
                props: { className: INPUT_CLASS },
            });
        }
    }

    postInit() {
        this.setClassNames();
        this.setHandlers();
        this.setUserProps();
        this.render(this.state);
    }

    setHandlers() {
        setEvents(this.elem, {
            focus: (e) => this.onFocus(e),
            blur: (e) => this.onBlur(e),
            input: (e) => this.onInput(e),
            change: (e) => this.onChange(e),
        });
    }

    onFocus(e) {
        this.notifyEvent('onFocus', e);
    }

    onBlur(e) {
        this.notifyEvent('onBlur', e);
    }

    onInput(e) {
        this.notifyEvent('onInput', e);
    }

    onChange(e) {
        this.notifyEvent('onChange', e);
    }

    /** Enables/disabled component */
    enable(value = true) {
        if (this.state.disabled === !value) {
            return;
        }

        this.setState({ ...this.state, disabled: !value });
    }

    /** Render component */
    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        enable(this.elem, !state.disabled);
    }
}
