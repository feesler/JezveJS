import {
    isFunction,
    ce,
    removeChilds,
    addChilds,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

const CONTAINER_CLASS = 'collapsible';
const CONTENT_CLASS = 'collapsible-content';
const EXPANDED_CLASS = 'collapsible__expanded';
const HEADER_CLASS = 'collapsible-header';

const defaultProps = {
    expanded: false,
    header: 'Show',
    content: null,
    onStateChange: null,
};

export class Collapsible extends Component {
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.state = {
            expanded: this.props.expanded,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.headerContainer = ce(
            'div',
            { className: HEADER_CLASS },
            null,
            { click: () => this.toggle() },
        );
        this.setHeader(this.props.header);

        this.contentContainer = ce('div', { className: CONTENT_CLASS });
        this.setContent(this.props.content);

        this.elem = ce('div', {
            className: CONTAINER_CLASS,
        }, [
            this.headerContainer,
            this.contentContainer,
        ]);

        this.setClassNames();
    }

    setState(state) {
        if (state.expanded === this.state.expanded) {
            return;
        }

        this.state = state;

        if (isFunction(this.props.onStateChange)) {
            this.props.onStateChange(this.state.expanded);
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
