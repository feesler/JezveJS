import { ge, show } from './common.js';

/**
 * Base component constructor
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class Component {
    constructor(props) {
        if (typeof props === 'undefined') {
            this.props = {};
        } else {
            this.props = props;
        }

        if (this.props.parent) {
            this.parent = this.props.parent;
        }

        if (typeof this.props.elem === 'string') {
            this.elem = ge(this.props.elem);
        } else {
            this.elem = this.props.elem;
        }
    }

    /**
     * Parse DOM to obtain child elements and build state of component
     */
    parse() { }

    /** Render component state */
    render() { }

    /**
     * Show/hide base element of component
     * @param {boolean} val - if true component will be shown, hidden otherwise. Default is true
     */
    show(val) {
        const toShow = (typeof val === 'undefined') ? true : !!val;

        if (this.elem) {
            show(this.elem, toShow);
        }
    }

    /** Hide base element of component */
    hide() {
        this.show(false);
    }
}
