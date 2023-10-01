import {
    isFunction,
    createElement,
    removeChilds,
    addChilds,
    setEvents,
    afterTransition,
    px,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './Collapsible.scss';

/* CSS classes */
const CONTAINER_CLASS = 'collapsible';
const CONTENT_CLASS = 'collapsible-content';
const EXPANDED_CLASS = 'collapsible__expanded';
const ANIMATED_CLASS = 'collapsible_animated';
const HEADER_CLASS = 'collapsible-header';

const TRANSITION_END_TIMEOUT = 500;

const defaultProps = {
    expanded: false,
    animated: false,
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

    onStateChange(state, prevState) {
        if (state.expanded === prevState?.expanded) {
            return state;
        }

        if (isFunction(this.props.onStateChange)) {
            this.props.onStateChange(state.expanded);
        }

        return state;
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
    collapse(value = true) {
        this.setState({ ...this.state, expanded: !value });
    }

    /** Expand content */
    expand(value = true) {
        this.setState({ ...this.state, expanded: !!value });
    }

    /** Toggle expand/collapse content */
    toggle() {
        this.setState({ ...this.state, expanded: !this.state.expanded });
    }

    onAnimationDone() {
        this.elem.classList.remove(ANIMATED_CLASS);
        this.contentContainer.style.height = '';

        if (!this.state.expanded) {
            this.elem.classList.remove(EXPANDED_CLASS);
        }
    }

    /** Render component state */
    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (state.expanded === prevState.expanded) {
            return;
        }

        if (!this.props.animated) {
            this.elem.classList.toggle(EXPANDED_CLASS, !!state.expanded);
            return;
        }

        if (state.expanded) {
            this.elem.classList.add(EXPANDED_CLASS);

            const height = this.contentContainer.offsetHeight;
            this.elem.classList.add(ANIMATED_CLASS);

            requestAnimationFrame(() => {
                this.contentContainer.style.height = px(height);
            });
        } else {
            const height = this.contentContainer.offsetHeight;
            this.contentContainer.style.height = px(height);

            this.elem.classList.add(ANIMATED_CLASS);

            requestAnimationFrame(() => {
                this.contentContainer.style.height = px(0);
            });
        }

        afterTransition(this.contentContainer, {
            property: 'height',
            duration: TRANSITION_END_TIMEOUT,
            target: this.contentContainer,
        }, () => this.onAnimationDone());
    }
}
