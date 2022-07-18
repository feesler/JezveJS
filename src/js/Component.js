import { ge, show, isVisible } from './common.js';

/**
 * Base component constructor
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class Component {
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

    setClassNames() {
        if (!this.props.className) {
            return;
        }

        if (!Array.isArray(this.props.className)) {
            this.props.className = [this.props.className];
        }
        this.elem.classList.add(...this.props.className);
    }
}
