import {
    isFunction,
    setEvents,
    removeChilds,
    createElement,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

const CONTAINER_CLASS = 'radio';
const CHECK_CLASS = 'radio__check';
const LABEL_CLASS = 'radio__label';
const defaultProps = {
    checked: false,
    disabled: false,
    label: null,
    value: '',
};

export class Radio extends Component {
    static create(props = {}) {
        const instance = new Radio(props);
        instance.init();
        return instance;
    }

    static fromElement(elem, props = {}) {
        const instance = new Radio(props);
        instance.parse(elem);
        return instance;
    }

    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.onChangeHandler = this.props.onChange;
    }

    get checked() {
        return this.state.checked;
    }

    get disabled() {
        return this.state.disabled;
    }

    createLabel() {
        return createElement('span', { props: { className: LABEL_CLASS } });
    }

    init() {
        if (!this.props.name) {
            throw new Error('Name not specified');
        }

        this.state = {
            checked: this.props.checked,
            disabled: this.props.disabled,
            label: this.props.label,
        };

        this.input = createElement('input', {
            props: {
                type: 'radio',
                name: this.props.name,
                checked: this.state.checked,
                value: this.props.value,
            },
        });
        this.checkIcon = createElement('span', { props: { className: CHECK_CLASS } });
        this.label = this.createLabel();
        this.elem = createElement('label', {
            props: { className: CONTAINER_CLASS },
            children: [this.input, this.checkIcon, this.label],
        });

        this.setClassNames();
        this.setHandlers();

        this.render(this.state);
    }

    parse(elem) {
        if (!elem?.classList?.contains(CONTAINER_CLASS)) {
            throw new Error('Invalid element');
        }

        this.elem = elem;
        this.input = elem.querySelector('input[type="radio"]');
        this.checkIcon = elem.querySelector(`.${CHECK_CLASS}`);
        this.label = elem.querySelector(`.${LABEL_CLASS}`);
        if (!this.input || !this.checkIcon) {
            throw new Error('Invalid structure of radio button');
        }

        this.state = {
            checked: this.input.checked,
            disabled: elem.hasAttribute('disabled'),
        };

        if (this.label) {
            if (this.label.firstElementChild) {
                this.state.label = this.label.firstElementChild;
            } else {
                this.state.label = this.label.textContent;
            }
        }

        this.setClassNames();
        this.setHandlers();

        this.render(this.state);
    }

    setHandlers() {
        setEvents(this.input, { change: (e) => this.onChange(e) });
    }

    onChange(e) {
        this.setState({
            ...this.state,
            checked: e.target.checked,
        });

        if (isFunction(this.onChangeHandler)) {
            this.onChangeHandler(this.state.checked);
        }
    }

    setState(state) {
        if (
            state.checked === this.state.checked
            && state.disabled === this.state.disabled
            && state.label === this.state.label
        ) {
            return;
        }

        super.setState(state);
    }

    /** Set label content */
    setLabel(label) {
        this.setState({
            ...this.state,
            label,
            checked: this.input.checked,
        });
    }

    /** Set checked state */
    check(value) {
        this.setState({
            ...this.state,
            checked: !!value,
        });
    }

    /** Enable/disable component */
    enable(value) {
        this.setState({
            ...this.state,
            disabled: !value,
            checked: this.input.checked,
        });
    }

    /** Render label content */
    renderLabel(state) {
        if (!state.label && !this.label) {
            return;
        }

        if (state.label && !this.label) {
            this.label = this.createLabel();
        }

        if (typeof state.label === 'string' || state.label == null) {
            this.label.textContent = state.label;
        } else if (state.label instanceof Element) {
            removeChilds(this.label);
            this.label.appendChild(state.label);
        }
    }

    /** Render component state */
    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.input.checked = state.checked;
        if (state.disabled) {
            this.input.setAttribute('disabled', true);
        } else {
            this.input.removeAttribute('disabled');
        }

        this.renderLabel(state);
    }
}
