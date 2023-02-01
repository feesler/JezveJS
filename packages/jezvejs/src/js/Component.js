import {
    ge,
    show,
    enable,
    isVisible,
    isFunction,
    isObject,
    asArray,
    getClassNames,
} from './common.js';

/**
 * Base component constructor
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class Component {
    /** Object with map of available props to set to elements of component */
    static userProps = {};

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

    /** Applies 'className' property to the root element of component */
    setClassNames() {
        const classNames = getClassNames(this.props.className);
        if (classNames.length > 0) {
            this.elem.classList.add(...classNames);
        }
    }

    /** Apply props to elements of component according to userProps map */
    setUserProps() {
        const { userProps } = this.constructor;
        if (!isObject(userProps)) {
            return;
        }

        Object.keys(userProps).forEach((elemName) => {
            const availProps = asArray(userProps[elemName]);
            if (!this[elemName]) {
                return;
            }

            availProps.forEach((prop) => {
                if (typeof this.props[prop] !== 'undefined') {
                    this[elemName][prop] = this.props[prop];
                }
            });
        });
    }

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
}
