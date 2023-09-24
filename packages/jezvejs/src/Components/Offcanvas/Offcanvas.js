import {
    isFunction,
    createElement,
    re,
    removeChilds,
    show,
    reflow,
    isVisible,
    afterTransition,
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

const TRANSITION_END_TIMEOUT = 500;

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
            transitionInProgress: false,
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
        });
        this.elem.classList.toggle(CLOSED_CLASS, !!this.props.closed);

        if (this.props.placement === 'right') {
            this.elem.classList.add(RIGHT_CONTAINER_CLASS);
        } else if (this.props.placement === 'top') {
            this.elem.classList.add(TOP_CONTAINER_CLASS);
        } else if (this.props.placement === 'bottom') {
            this.elem.classList.add(BOTTOM_CONTAINER_CLASS);
        }

        this.setClassNames();

        document.body.append(this.elem);

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

    onAnimationDone() {
        this.setState({ ...this.state, transitionInProgress: false });

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

    waitForAnimation() {
        afterTransition(this.elem, {
            property: 'transform',
            duration: TRANSITION_END_TIMEOUT,
            target: this.elem,
        }, () => this.onAnimationDone());
    }

    open() {
        if (!this.state.closed) {
            return;
        }

        this.setState({
            ...this.state,
            transitionInProgress: true,
            closed: false,
        });
        this.waitForAnimation();
    }

    close() {
        if (this.state.closed) {
            return;
        }

        this.setState({
            ...this.state,
            transitionInProgress: true,
            closed: true,
        });
        this.waitForAnimation();
    }

    toggle() {
        this.setState({
            ...this.state,
            transitionInProgress: true,
            closed: !this.state.closed,
        });
        this.waitForAnimation();
    }

    renderScrollLock(state, prevState) {
        if (state.closed === prevState?.closed) {
            return;
        }

        const backdropVisible = isVisible(this.backgroundElem, true);
        const opened = !state.closed && backdropVisible;

        if (opened) {
            ScrollLock.lock();
        } else {
            ScrollLock.unlock();
        }
    }

    renderBackground(state, prevState) {
        const showBackground = state.transitionInProgress || state.closed === false;
        const showBefore = prevState.transitionInProgress || prevState.closed === false;

        if (showBackground && !showBefore) {
            if (!this.backgroundElem) {
                this.backgroundElem = createElement('div', {
                    props: { className: BACKGROUND_CLASS },
                    events: { click: () => this.close() },
                });
            }

            this.elem.after(this.backgroundElem);
            reflow(this.backgroundElem);
        } else if (!showBackground && showBefore) {
            re(this.backgroundElem);
        }

        this.backgroundElem?.classList.toggle('closed', state.closed);
    }

    /** Render component state */
    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.renderBackground(state, prevState);

        if (this.props.useScrollLock) {
            this.renderScrollLock(state, prevState);
        }

        this.elem.classList.toggle(CLOSED_CLASS, !!state.closed);
    }
}
