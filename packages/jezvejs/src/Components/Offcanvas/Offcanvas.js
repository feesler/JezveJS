import {
    isFunction,
    createElement,
    removeChilds,
    show,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'offcanvas';
const RIGHT_CONTAINER_CLASS = 'offcanvas_right';
const TOP_CONTAINER_CLASS = 'offcanvas_top';
const BOTTOM_CONTAINER_CLASS = 'offcanvas_bottom';
const CONTENT_CLASS = 'offcanvas__content';
const CLOSED_CLASS = 'offcanvas_closed';
const BACKGROUND_CLASS = 'offcanvas__bg';

const defaultProps = {
    placement: 'left',
    closed: true,
};

export class Offcanvas extends Component {
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.init();
    }

    init() {
        this.state = {
            closed: this.props.closed,
        };

        this.contentElem = createElement('div', { props: { className: CONTENT_CLASS } });
        if (this.props.content) {
            this.setContent(this.props.content);
        }

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: [this.contentElem],
        });

        if (this.props.placement === 'right') {
            this.elem.classList.add(RIGHT_CONTAINER_CLASS);
        } else if (this.props.placement === 'top') {
            this.elem.classList.add(TOP_CONTAINER_CLASS);
        } else if (this.props.placement === 'bottom') {
            this.elem.classList.add(BOTTOM_CONTAINER_CLASS);
        }

        this.backgroundElem = createElement('div', {
            props: { className: BACKGROUND_CLASS },
            events: { click: () => this.close() },
        });

        this.setClassNames();

        document.body.append(this.elem);
        document.body.append(this.backgroundElem);

        this.render(this.state);
    }

    setContent(content) {
        removeChilds(this.contentElem);
        if (typeof content === 'string') {
            this.contentElem.textContent = content;
        } else {
            show(content, true);
            this.contentElem.append(content);
        }
    }

    open() {
        this.setState({ ...this.state, closed: false });
    }

    close() {
        this.setState({ ...this.state, closed: true });
    }

    toggle() {
        this.setState({ ...this.state, closed: !this.state.closed });
    }

    setState(state) {
        const newState = isFunction(state) ? state(this.state) : state;
        if (newState.closed === this.state.closed) {
            return;
        }

        super.setState(newState);
    }

    /** Render component state */
    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.elem.classList.toggle(CLOSED_CLASS, !!state.closed);
        show(this.backgroundElem, !state.closed);
    }
}
