import {
    isFunction,
    svg,
    setEvents,
    enable,
    removeChilds,
    createElement,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'checkbox';
const CHECK_CLASS = 'checkbox__check';
const ICON_CLASS = 'checkbox__icon';
const LABEL_CLASS = 'checkbox__label';
/* Check icon */
const ICON_PATH = 'M1.08 4.93a.28.28 0 000 .4l2.35 2.34c.1.11.29.11.4 0l4.59-4.59a.28.28 0 000-.4l-.6-.6a.28.28 0 00-.4 0l-3.8 3.8-1.54-1.55a.28.28 0 00-.4 0z';
const ICON_VIEWBOX = '0 0 9.2604 9.2604';

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

    get checked() {
        return this.input.checked;
    }

    get disabled() {
        return this.input.disabled;
    }

    createCheckPath() {
        return svg(
            'svg',
            { class: ICON_CLASS, viewBox: ICON_VIEWBOX },
            svg('path', { d: ICON_PATH }),
        );
    }

    createLabel() {
        return createElement('span', { props: { className: LABEL_CLASS } });
    }

    init() {
        this.input = createElement('input', { props: { type: 'checkbox' } });
        const checkSVG = this.createCheckPath();
        this.checkIcon = createElement('span', {
            props: { className: CHECK_CLASS },
            children: checkSVG,
        });
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
        this.input = elem.querySelector('input[type="checkbox"]');
        this.checkIcon = elem.querySelector(`.${CHECK_CLASS}`);
        this.label = elem.querySelector(`.${LABEL_CLASS}`);
        if (!this.input || !this.checkIcon) {
            throw new Error('Invalid structure of checkbox');
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
        if (typeof this.props.form === 'string') {
            this.input.form = this.props.form;
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
