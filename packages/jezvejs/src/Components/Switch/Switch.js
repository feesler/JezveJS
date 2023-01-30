import {
    isFunction,
    setEvents,
    createElement,
    enable,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'switch';
const SLIDER_CLASS = 'switch-slider';

const defaultProps = {
    id: undefined,
    name: undefined,
    form: undefined,
    checked: undefined,
    disabled: undefined,
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
        this.input = createElement('input', { props: { type: 'checkbox' } });
        this.slider = createElement('div', { props: { className: SLIDER_CLASS } });
        this.elem = createElement('label', {
            props: { className: CONTAINER_CLASS },
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
        if (!this.input || !this.slider) {
            throw new Error('Invalid structure of switch');
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
    }

    onChange() {
        if (isFunction(this.props.onChange)) {
            this.props.onChange(this.checked);
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
