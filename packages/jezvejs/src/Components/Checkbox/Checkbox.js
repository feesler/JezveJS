import { isFunction } from '@jezvejs/types';
import {
    createSVGElement,
    setEvents,
    enable,
    removeChilds,
    createElement,
    re,
} from '@jezvejs/dom';
import { Component } from '../../Component.js';
import '../../common.scss';
import './Checkbox.scss';

/* CSS classes */
const CONTAINER_CLASS = 'checkbox';
const CHECK_CLASS = 'checkbox__check';
const ICON_CLASS = 'checkbox__icon';
const LABEL_CLASS = 'checkbox__label';
/* Check icon */
const ICON_PATH = 'M1.08 4.93a.28.28 0 000 .4l2.35 2.34c.1.11.29.11.4 0l4.59-4.59a.28.28 0 000-.4l-.6-.6a.28.28 0 00-.4 0l-3.8 3.8-1.54-1.55a.28.28 0 00-.4 0z';
const ICON_VIEWBOX = '0 0 9.2604 9.2604';

const defaultProps = {
    id: undefined,
    name: undefined,
    form: undefined,
    checked: undefined,
    disabled: undefined,
    label: undefined,
    tooltip: undefined,
    checkIcon: null,
    onChange: null,
};

export class Checkbox extends Component {
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

    createCheckPath() {
        return createSVGElement('svg', {
            attrs: { class: ICON_CLASS, viewBox: ICON_VIEWBOX },
            children: createSVGElement('path', { attrs: { d: ICON_PATH } }),
        });
    }

    init() {
        this.input = createElement('input', { props: { type: 'checkbox' } });

        const icon = this.props.checkIcon ?? this.createCheckPath();
        this.checkIcon = createElement('span', {
            props: { className: CHECK_CLASS },
            children: icon,
        });
        this.elem = createElement('label', {
            props: { className: CONTAINER_CLASS },
            children: [this.input, this.checkIcon],
        });

        this.postInit();
    }

    parse() {
        if (!this.elem?.classList?.contains(CONTAINER_CLASS)) {
            throw new Error('Invalid element');
        }

        this.input = this.elem.querySelector('input[type="checkbox"]');
        this.checkIcon = this.elem.querySelector(`.${CHECK_CLASS}`);
        if (!this.input || !this.checkIcon) {
            throw new Error('Invalid structure of checkbox');
        }

        const label = this.elem.querySelector(`.${LABEL_CLASS}`);
        if (label?.childElementCount === 0) {
            this.props.label = label.textContent;
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
