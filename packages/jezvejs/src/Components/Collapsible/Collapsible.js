import { asArray } from '@jezvejs/types';
import {
    createElement,
    setEvents,
    afterTransition,
} from '@jezvejs/dom';
import { px } from '../../common.js';
import { Component } from '../../Component.js';
import '../../common.scss';
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

        this.animationFrame = 0;
        this.cancelTransition = null;

        this.init();
        this.render(this.state);
    }

    init() {
        this.headerContainer = createElement('div', { className: HEADER_CLASS });
        if (this.props.toggleOnClick) {
            setEvents(this.headerContainer, { click: () => this.toggle() });
        }
        this.setHeader(this.props.header);

        this.contentContainer = createElement('div', { className: CONTENT_CLASS });
        this.setContent(this.props.content);

        this.elem = createElement('div', {
            className: CONTAINER_CLASS,
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

        this.notifyEvent('onStateChange', state.expanded);

        return state;
    }

    setHeader(header) {
        this.headerContainer.replaceChildren(...asArray(header));
    }

    setContent(content) {
        this.contentContainer.replaceChildren(...asArray(content));
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
        this.cancelTransition = null;
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
        }

        const height = this.contentContainer.offsetHeight;
        const newHeight = (state.expanded) ? height : 0;

        if (!state.expanded) {
            this.contentContainer.style.height = px(height);
        }

        this.elem.classList.add(ANIMATED_CLASS);

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.cancelTransition) {
            this.cancelTransition();
        }

        this.animationFrame = requestAnimationFrame(() => {
            this.animationFrame = 0;

            this.contentContainer.style.height = px(newHeight);

            this.cancelTransition = afterTransition(this.contentContainer, {
                property: 'height',
                duration: TRANSITION_END_TIMEOUT,
                target: this.contentContainer,
            }, () => this.onAnimationDone());
        });
    }
}
