import {
    isFunction,
    ce,
    setEvents,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

const CONTAINER_CLASS = 'switch';
const SLIDER_CLASS = 'switch-slider';
const defaultProps = {
    checked: false,
    disabled: false,
};

export class Switch extends Component {
    static create(props = {}) {
        const instance = new Switch(props);
        instance.init();
        return instance;
    }

    static fromElement(elem, props = {}) {
        const instance = new Switch(props);
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

    init() {
        this.state = {
            checked: this.props.checked,
            disabled: this.props.disabled,
        };

        this.checkbox = ce('input', { type: 'checkbox', checked: this.state.checked });
        this.slider = ce('div', { className: SLIDER_CLASS });
        this.elem = ce(
            'label',
            { className: CONTAINER_CLASS },
            [this.checkbox, this.slider],
        );

        this.setClassNames();
        this.setHandlers();

        this.render(this.state);
    }

    parse(elem) {
        if (!elem?.classList?.contains(CONTAINER_CLASS)) {
            throw new Error('Invalid element');
        }

        this.elem = elem;
        this.checkbox = elem.querySelector('input[type="checkbox"]');
        this.slider = elem.querySelector(`.${SLIDER_CLASS}`);
        if (!this.checkbox || !this.slider) {
            throw new Error('Invalid structure of switch');
        }

        this.state = {
            checked: this.checkbox.checked,
            disabled: elem.hasAttribute('disabled'),
        };

        this.setClassNames();
        this.setHandlers();

        this.render(this.state);
    }

    setHandlers() {
        setEvents(this.checkbox, { change: (e) => this.onChange(e) });
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
        ) {
            return;
        }

        this.state = state;

        this.render(this.state);
    }

    /** Set checked state */
    check(value) {
        this.setState({
            ...this.state,
            checked: !!value,
        });
    }

    /** Toggle checked state */
    toggle() {
        this.setState({
            ...this.state,
            checked: !this.state.checked,
        });
    }

    /** Enable/disable component */
    enable(value) {
        this.setState({
            ...this.state,
            disabled: !value,
        });
    }

    /** Render component state */
    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.checkbox.checked = state.checked;
        if (state.disabled) {
            this.elem.setAttribute('disabled', true);
        } else {
            this.elem.removeAttribute('disabled');
        }
    }
}
