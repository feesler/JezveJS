import {
    isFunction,
    ce,
    removeChilds,
    addChilds,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import './style.css';

const EXPANDED_CLASS = 'collapsible__expanded';
const defaultProps = {
    expanded: false,
    header: 'Show',
};

export class Collapsible extends Component {
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.stateChangeHandler = this.props.onStateChange;

        this.state = {
            expanded: this.props.expanded,
        };

        this.headerContainer = ce(
            'button',
            { className: 'collapsible-header' },
            null,
            { click: () => this.toggle() },
        );
        this.setHeader(this.props.header);

        this.contentContainer = ce('div', { className: 'collapsible-content' });
        this.setContent(this.props.content);

        this.elem = ce('div', {
            className: 'collapsible',
        }, [
            this.headerContainer,
            this.contentContainer,
        ]);

        if (this.props.className) {
            if (!Array.isArray(this.props.className)) {
                this.props.className = [this.props.className];
            }
            this.elem.classList.add(...this.props.className);
        }
    }

    setState(state) {
        if (state.expanded === this.state.expanded) {
            return;
        }

        this.state = state;

        if (isFunction(this.stateChangeHandler)) {
            this.stateChangeHandler(this.state.expanded);
        }

        this.render(this.state);
    }

    setHeader(header) {
        removeChilds(this.headerContainer);

        if (!header) {
            return;
        }

        if (typeof header === 'string') {
            this.headerContainer.textContent = header;
        } else {
            addChilds(this.headerContainer, header);
        }
    }

    setContent(content) {
        removeChilds(this.contentContainer);

        if (!content) {
            return;
        }

        if (typeof content === 'string') {
            this.contentContainer.textContent = content;
        } else {
            addChilds(this.contentContainer, content);
        }
    }

    /** Collapse content */
    collapse() {
        this.setState({ expanded: false });
    }

    /** Expand content */
    expand() {
        this.setState({ expanded: true });
    }

    /** Toggle expand/collapse content */
    toggle() {
        this.setState({ expanded: !this.state.expanded });
    }

    /** Render component state */
    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (state.expanded) {
            this.elem.classList.add(EXPANDED_CLASS);
        } else {
            this.elem.classList.remove(EXPANDED_CLASS);
        }
    }
}
