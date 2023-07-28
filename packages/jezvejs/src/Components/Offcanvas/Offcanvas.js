import {
    isFunction,
    createElement,
    removeChilds,
    show,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { ScrollLock } from '../ScrollLock/ScrollLock.js';
import '../../css/common.scss';
import './Offcanvas.scss';

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
    useScrollLock: true,
    onOpened: null,
    onClosed: null,
    onToggle: null,
};

export class Offcanvas extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.scrollLocked = false;
        this.scrollTop = null;

        this.state = {
            closed: this.props.closed,
        };

        this.init();
    }

    init() {
        this.contentElem = createElement('div', { props: { className: CONTENT_CLASS } });
        if (this.props.content) {
            this.setContent(this.props.content);
        }

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: [this.contentElem],
            events: { transitionend: (e) => this.onTransitionEnd(e) },
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

        document.body.append(this.elem, this.backgroundElem);

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

    onTransitionEnd(e) {
        if (e?.target !== this.elem) {
            return;
        }

        if (this.state.closed) {
            if (isFunction(this.props.onClosed)) {
                this.props.onClosed();
            }
        } else if (isFunction(this.props.onOpened)) {
            this.props.onOpened();
        }

        if (isFunction(this.props.onToggle)) {
            this.props.onToggle(this.state.closed);
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

    renderScrollLock(state, prevState) {
        if (state.closed === prevState?.closed) {
            return;
        }

        if (state.closed) {
            ScrollLock.unlock();
        } else {
            ScrollLock.lock();
        }
    }

    /** Render component state */
    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (this.props.useScrollLock) {
            this.renderScrollLock(state, prevState);
        }

        this.elem.classList.toggle(CLOSED_CLASS, !!state.closed);
        show(this.backgroundElem, !state.closed);
    }
}
