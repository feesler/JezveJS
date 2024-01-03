import { asArray } from '@jezvejs/types';
import {
    setEvents,
    createElement,
    enable,
} from '@jezvejs/dom';
import { Component } from '../../Component.js';
import '../../common.scss';
import './Switch.scss';

/* CSS classes */
const CONTAINER_CLASS = 'switch';
const SLIDER_CLASS = 'switch-slider';
const LABEL_CLASS = 'switch__label';

const defaultProps = {
    id: undefined,
    name: undefined,
    form: undefined,
    checked: undefined,
    disabled: undefined,
    label: undefined,
    tooltip: undefined,
    onChange: null,
};

export class Switch extends Component {
    static userProps = {
        elem: ['id'],
        input: ['name', 'form', 'checked'],
    };

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        if (this.elem) {
            this.parse(this.elem);
        } else {
            this.init();
        }
    }

    /** Returns id of root element of component */
    get id() {
        return this.props.id;
    }

    /** Returns checked state of component */
    get checked() {
        return this.input.checked;
    }

    /** Returns disabled state of component */
    get disabled() {
        return this.input.disabled;
    }

    init() {
        this.input = createElement('input', { type: 'checkbox' });
        this.slider = createElement('div', { className: SLIDER_CLASS });
        this.elem = createElement('label', {
            className: CONTAINER_CLASS,
            children: [this.input, this.slider],
        });

        this.postInit();
    }

    parse(elem) {
        if (!elem?.classList?.contains(CONTAINER_CLASS)) {
            throw new Error('Invalid element');
        }

        this.elem = elem;
        this.input = elem.querySelector('input[type="checkbox"]');
        this.slider = elem.querySelector(`.${SLIDER_CLASS}`);
        this.label = elem.querySelector(`.${LABEL_CLASS}`);
        if (!this.input || !this.slider) {
            throw new Error('Invalid structure of switch');
        }

        if (this.label?.childElementCount === 0) {
            this.props.label = this.label.textContent;
        }

        this.postInit();
    }

    postInit() {
        this.setClassNames();
        setEvents(this.input, { change: (e) => this.onChange(e) });

        // Apply props
        if (typeof this.props.disabled !== 'undefined') {
            this.enable(!this.props.disabled);
        }
        this.setUserProps();

        if (typeof this.props.label !== 'undefined') {
            this.setLabel(this.props.label);
        }

        const tooltip = this.props.tooltip ?? null;
        this.elem.title = (tooltip === null && typeof this.props.label === 'string')
            ? this.props.label
            : (tooltip ?? '');
    }

    onChange() {
        this.notifyEvent('onChange', this.checked);
    }

    /** Set label content */
    setLabel(value) {
        if (!value && !this.label) {
            return;
        }
        // Remove label element if value is empty
        if (!value && this.label) {
            this.label.remove();
            this.label = null;
            return;
        }
        // Create label element
        if (value && !this.label) {
            this.label = createElement('span', { className: LABEL_CLASS });
            this.elem.append(this.label);
        }

        this.label.replaceChildren(...asArray(value));
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
