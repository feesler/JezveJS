import {
    ge,
    show,
    enable,
    isVisible,
    isFunction,
} from './common.js';

/**
 * Base component constructor
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class Component {
    static create(props) {
        return new this(props);
    }

    static fromElement(elem, props = {}) {
        return new this({ elem, ...props });
    }

    constructor(props = {}) {
        this.props = props;

        if (this.props.parent) {
            this.parent = this.props.parent;
        }

        if (typeof this.props.elem === 'string') {
            this.elem = ge(this.props.elem);
        } else {
            this.elem = this.props.elem;
        }
    }

    /** Parse DOM to obtain child elements and build state of component */
    parse() { }

    /** Update state of component and render changes */
    setState(state) {
        const newState = isFunction(state) ? state(this.state) : state;
        if (this.state === newState) {
            return;
        }

        this.render(newState, this.state);
        this.state = newState;
    }

    /** Render component state */
    render() { }

    /** Check root element of component is visible */
    isVisible() {
        return isVisible(this.elem, true);
    }

    /**
     * Show/hide base element of component
     * @param {boolean} val - if true component will be shown, hidden otherwise. Default is true
     */
    show(value = true) {
        if (this.elem) {
            show(this.elem, value);
        }
    }

    /** Hide base element of component */
    hide() {
        this.show(false);
    }

    /**
     * Enable/disable base element of component
     * @param {boolean} val - if true component will be enabled, disabled otherwise. Default is true
     */
    enable(value = true) {
        enable(this.elem, value);
    }

    /** Disable base element of component */
    disable() {
        this.enable(false);
    }

    setClassNames() {
        if (!this.props.className) {
            return;
        }

        if (!Array.isArray(this.props.className)) {
            this.props.className = [this.props.className];
        }
        const classNames = this.props.className
            .flatMap((cln) => cln.split(' '))
            .filter((cln) => cln.length > 0);

        this.elem.classList.add(...classNames);
    }
}
