import {
    isFunction,
    ce,
    svg,
    setEvents,
    removeChilds,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.css';
import './style.css';

const CONTAINER_CLASS = 'checkbox';
const CHECK_CLASS = 'checkbox__check';
const LABEL_CLASS = 'checkbox__label';
const CHECK_PATH = 'M1.08 4.93a.28.28 0 000 .4l2.35 2.34c.1.11.29.11.4 0l4.59-4.59a.28.28 0 000-.4l-.6-.6a.28.28 0 00-.4 0l-3.8 3.8-1.54-1.55a.28.28 0 00-.4 0z';
const CHECK_VIEWBOX = '0 0 9.2604 9.2604';
const defaultProps = {
    checked: false,
    disabled: false,
    label: null,
};

export class Checkbox extends Component {
    static create(props = {}) {
        const instance = new Checkbox(props);
        instance.init();
        return instance;
    }

    static fromElement(elem, props = {}) {
        const instance = new Checkbox(props);
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

    createCheckPath() {
        return svg('svg', { viewBox: CHECK_VIEWBOX }, svg('path', { d: CHECK_PATH }));
    }

    createLabel() {
        return ce('span', { className: LABEL_CLASS });
    }

    init() {
        this.state = {
            checked: this.props.checked,
            disabled: this.props.disabled,
            label: this.props.label,
        };

        this.input = ce('input', { type: 'checkbox', checked: this.state.checked });
        const checkSVG = this.createCheckPath();
        this.checkIcon = ce('span', { className: CHECK_CLASS }, checkSVG);
        this.label = this.createLabel();
        this.elem = ce(
            'label',
            { className: CONTAINER_CLASS },
            [this.input, this.checkIcon, this.label],
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
        this.input = elem.querySelector('input[type="checkbox"]');
        this.checkIcon = elem.querySelector(`.${CHECK_CLASS}`);
        this.label = elem.querySelector(`.${LABEL_CLASS}`);
        if (!this.input || !this.checkIcon) {
            throw new Error('Invalid structure of checkbox');
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

    setClassNames() {
        if (!this.props.className) {
            return;
        }

        if (!Array.isArray(this.props.className)) {
            this.props.className = [this.props.className];
        }
        this.elem.classList.add(...this.props.className);
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

        this.state = state;

        this.render(this.state);
    }

    /** Set label content */
    setLabel(label) {
        this.setState({
            ...this.state,
            label,
        });
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
