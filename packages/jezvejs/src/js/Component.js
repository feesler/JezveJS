import { isFunction, isObject, asArray } from '@jezvejs/types';
import {
    ge,
    show,
    enable,
    isVisible,
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
        this.props = props ?? {};

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

    /**
     * Replaces root element of component
     * @param {Element} elem
     */
    setElement(elem) {
        if (elem && this.elem?.parentNode) {
            this.elem.replaceWith(elem);
        }
        this.elem = elem;
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

    /**
     * Obtain specified elements from DOM and assign as properties to component instance
     * @param {Array|String} ids - id or array of element ids
     */
    loadElementsByIds(ids) {
        asArray(ids).forEach((id) => {
            if (typeof id !== 'string') {
                throw new Error('Invalid element id');
            }

            this[id] = ge(id);
            if (!this[id]) {
                throw new Error(`Failed to initialize view: element '${id}' not found`);
            }
        });
    }

    /** Subscribes view to store updates */
    subscribeToStore(store) {
        if (!store) {
            throw new Error('Invalid store');
        }

        store.subscribe((state, prevState) => {
            if (state !== prevState) {
                this.render(state, prevState);
            }
        });
    }

    /** Update state of component and render changes */
    setState(state) {
        let newState = isFunction(state) ? state(this.state) : state;
        if (this.state === newState) {
            return;
        }

        newState = this.onStateChange(newState, this.state);

        this.render(newState, this.state);
        this.state = newState;
    }

    /** Process state */
    onStateChange(state) {
        return state;
    }

    /** Render component state */
    render() { }
}
