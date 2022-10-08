import {
    isFunction,
    setEvents,
    removeChilds,
    enable,
    createElement,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

/** CSS classes */
const CONTAINER_CLASS = 'radio';
const CHECK_CLASS = 'radio__check';
const LABEL_CLASS = 'radio__label';

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

    get checked() {
        return this.input.checked;
    }

    get disabled() {
        return this.input.disabled;
    }

    createLabel() {
        return createElement('span', { props: { className: LABEL_CLASS } });
    }

    init() {
        if (!this.props.name) {
            throw new Error('Name not specified');
        }

        this.input = createElement('input', { props: { type: 'radio' } });
        this.checkIcon = createElement('span', { props: { className: CHECK_CLASS } });
        this.label = this.createLabel();
        this.elem = createElement('label', {
            props: { className: CONTAINER_CLASS },
            children: [this.input, this.checkIcon, this.label],
        });

        this.postInit();
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

        this.postInit();
    }

    postInit() {
        this.setClassNames();
        setEvents(this.input, { change: (e) => this.onChange(e) });

        // Apply props
        if ('checked' in this.props) {
            this.check(this.props.checked);
        }
        if ('disabled' in this.props) {
            this.enable(!this.props.disabled);
        }
        if (typeof this.props.name === 'string') {
            this.input.name = this.props.name;
        }
        if ('value' in this.props) {
            this.input.value = this.props.value;
        }
        if ('label' in this.props) {
            this.setLabel(this.props.label);
        }
    }

    onChange() {
        if (isFunction(this.props.onChange)) {
            this.props.onChange(this.checked);
        }
    }

    /** Set label content */
    setLabel(value) {
        if (!value && !this.label) {
            return;
        }

        if (value && !this.label) {
            this.label = this.createLabel();
        }

        if (typeof value === 'string' || value == null) {
            this.label.textContent = value;
        } else if (value instanceof Element) {
            removeChilds(this.label);
            this.label.append(value);
        }
    }

    /** Set checked state */
    check(value) {
        this.input.checked = !!value;
    }

    /** Toggle checked state */
    toggle() {
        this.input.checked = !this.checked;
    }

    /** Enable/disable component */
    enable(value) {
        enable(this.input, value);
    }
}
