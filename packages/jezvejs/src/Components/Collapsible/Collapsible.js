import {
    isFunction,
    createElement,
    removeChilds,
    addChilds,
    setEvents,
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
    toggleOnClick: true,
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
        this.headerContainer = createElement('div', { props: { className: HEADER_CLASS } });
        if (this.props.toggleOnClick) {
            setEvents(this.headerContainer, { click: () => this.toggle() });
        }
        this.setHeader(this.props.header);

        this.contentContainer = createElement('div', { props: { className: CONTENT_CLASS } });
        this.setContent(this.props.content);

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: [
                this.headerContainer,
                this.contentContainer,
            ],
        });

        this.setClassNames();
    }

    setState(state) {
        if (state.expanded === this.state.expanded) {
            return;
        }

        if (isFunction(this.props.onStateChange)) {
            this.props.onStateChange(state.expanded);
        }

        super.setState(state);
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
