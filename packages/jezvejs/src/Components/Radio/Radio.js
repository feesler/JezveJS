import {
    isFunction,
    setEvents,
    removeChilds,
    enable,
    createElement,
    re,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

/** CSS classes */
const CONTAINER_CLASS = 'radio';
const CHECK_CLASS = 'radio__check';
const LABEL_CLASS = 'radio__label';

const defaultProps = {
    id: undefined,
    name: undefined,
    form: undefined,
    checked: undefined,
    disabled: undefined,
    value: undefined,
    label: undefined,
    onChange: null,
};

export class Radio extends Component {
    static userProps = {
        elem: ['id'],
        input: ['name', 'form', 'checked', 'value'],
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
        if (!this.props.name) {
            throw new Error('Name not specified');
        }

        this.input = createElement('input', { props: { type: 'radio' } });
        this.checkIcon = createElement('span', { props: { className: CHECK_CLASS } });
        this.elem = createElement('label', {
            props: { className: CONTAINER_CLASS },
            children: [this.input, this.checkIcon],
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
        if (typeof this.props.disabled !== 'undefined') {
            this.enable(!this.props.disabled);
        }
        this.setUserProps();

        if (typeof this.props.label !== 'undefined') {
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
        // Remove label element if value is empty
        if (!value && this.label) {
            re(this.label);
            this.label = null;
            return;
        }
        // Create label element
        if (value && !this.label) {
            this.label = createElement('span', { props: { className: LABEL_CLASS } });
            this.elem.append(this.label);
        }

        if (typeof value === 'string') {
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
