import { isFunction, isObject } from '@jezvejs/types';
import { removeEvents, setEvents, transform } from '@jezvejs/dom';
import { px } from '../../common.js';

import {
    getFixedParent,
    isAbsoluteParent,
    getScrollParent,
    isTop,
    isVerticalFlip,
    getInitialTopPosition,
    getInitialLeftPosition,
    isHorizontalFlip,
    isLeft,
    isBottom,
    isRight,
    getScreenRect,
    getElementVerticalOverflow,
    getElementHorizontalOverflow,
    isHorizontalCrossFlip,
    isVerticalCrossFlip,
    isVertical,
    isHorizontal,
} from './helpers.js';

const defaultProps = {
    elem: null,
    refElem: null,
    updateProps: null,
    position: 'bottom-start',
    margin: 0,
    screenPadding: 0,
    bottomSafeArea: 70,
    useRefWidth: false,
    allowFlip: true,
    scrollOnOverflow: true,
    allowResize: true,
    minRefHeight: 20,
    onScrollDone: null,
    onWindowScroll: null,
    onViewportResize: null,
};

export class PopupPosition {
    static create(props = {}) {
        return new this(props);
    }

    constructor(props = {}) {
        this.props = {
            ...defaultProps,
            ...props,
        };

        if (!this.props.elem) {
            throw new Error('Element not specified');
        }
        if (!this.props.refElem) {
            throw new Error('Reference element not specified');
        }

        this.viewportEvents = {
            resize: (e) => this.onViewportResize(e),
        };
        this.windowEvents = {
            scroll: {
                listener: (e) => this.onWindowScroll(e),
                options: { passive: true, capture: true },
            },
        };

        this.state = {
            isInitial: true,
            listeningWindow: false,
        };

        this.update(this.props);
    }

    /* Assignes window and viewport event handlers */
    listenWindowEvents() {
        if (this.state.listeningWindow) {
            return;
        }

        this.state.listeningWindow = true;
        setEvents(window.visualViewport, this.viewportEvents);
        setEvents(window, this.windowEvents);
    }

    /* Removes window and viewport event handlers */
    stopWindowEvents() {
        if (!this.state.listeningWindow) {
            return;
        }

        this.state.listeningWindow = false;
        removeEvents(window.visualViewport, this.viewportEvents);
        removeEvents(window, this.windowEvents);
    }

    /** Window 'scroll' event handler */
    onWindowScroll(e) {
        if (
            this.state.elem
            && !e.target.contains(this.state.elem)
            && !e.target.contains(this.state.refElem)
        ) {
            return;
        }

        const updateRequired = isFunction(this.state.onWindowScroll)
            ? this.state.onWindowScroll(e)
            : true;

        if (updateRequired) {
            this.updatePosition();
        }
    }

    /** viewPort 'resize' event handler */
    onViewportResize(e) {
        const updateRequired = isFunction(this.state.onViewportResize)
            ? this.state.onViewportResize(e)
            : true;

        if (updateRequired) {
            this.updatePosition();
        }
    }

    updatePosition() {
        const updateProps = isFunction(this.state.updateProps)
            ? this.state.updateProps()
            : this.state.updateProps;
        const props = isObject(updateProps) ? updateProps : {};

        this.update(props);
    }

    /** Calls 'onScrollDone' callback function */
    notifyScrollDone() {
        if (isFunction(this.props.onScrollDone)) {
            this.props.onScrollDone();
        }
    }

    /** Calculates vertical and horizontal offsets and size of popup element */
    update(options = {}) {
        const { elem, refElem } = this.props;

        const html = document.documentElement;
        const screen = getScreenRect();
        const { isInitial } = this.state;

        const current = {
            width: elem.offsetWidth,
            height: elem.offsetHeight,
        };

        this.state = {
            ...this.state,
            ...options,
            screen,
            current,
            reference: refElem.getBoundingClientRect(),
            fixedParent: getFixedParent(elem),
            absoluteParent: isAbsoluteParent(elem),
            fixedElement: !elem.offsetParent,
            flip: false,
            crossFlip: false,
            isInitial: false,
        };
        const { state } = this;
        const {
            reference,
            minRefHeight,
            screenPadding,
        } = state;

        const scrollParent = state.fixedParent || getScrollParent(elem);
        state.scrollLeft = scrollParent.scrollLeft;
        state.scrollTop = scrollParent.scrollTop;
        state.horScrollAvailable = scrollParent.scrollWidth >= scrollParent.clientWidth;
        state.vertScrollAvailable = scrollParent.scrollHeight >= scrollParent.clientHeight;
        state.scrollParent = scrollParent;

        state.scrollParentBox = (scrollParent && !state.fixedElement)
            ? state.scrollParent.getBoundingClientRect()
            : { ...screen, left: 0, top: 0 };

        state.offset = (state.fixedElement)
            ? { ...screen, left: 0, top: 0 }
            : elem.offsetParent.getBoundingClientRect();

        state.bottomSafe = (screen.height - html.clientHeight > 50)
            ? state.bottomSafeArea
            : screenPadding;

        state.scrollWidth = (state.horScrollAvailable)
            ? scrollParent.scrollWidth
            : screen.right;
        state.scrollHeight = (state.vertScrollAvailable)
            ? scrollParent.scrollHeight
            : screen.bottom;

        const windowScrollLeft = (state.fixedParent) ? state.scrollLeft : screen.left;
        const windowScrollTop = (state.fixedParent) ? state.scrollTop : screen.top;
        const windowScrollWidth = (state.fixedParent)
            ? state.scrollWidth
            : html.scrollWidth;
        const windowScrollHeight = (state.fixedParent)
            ? state.scrollHeight
            : html.scrollHeight;
        const windowScrollRight = windowScrollLeft + screen.width;
        const windowScrollBottom = windowScrollTop + screen.height;

        const refScrollParentLeft = Math.max(0, state.scrollParentBox.left);
        const refScrollParentTop = Math.max(0, state.scrollParentBox.top);
        const refScrollParentWidth = Math.min(
            screen.width,
            state.scrollParentBox.width,
        );
        const refScrollParentHeight = Math.min(
            screen.height,
            state.scrollParentBox.height,
        );

        state.scrollRight = state.scrollLeft + refScrollParentWidth;
        state.scrollBottom = state.scrollTop + refScrollParentHeight;

        state.refScroll = {
            left: reference.left - refScrollParentLeft,
            top: reference.top - refScrollParentTop,
        };

        const screenTopDist = refScrollParentHeight - state.refScroll.top;
        const screenBottomDist = reference.bottom - refScrollParentTop;
        const screenLeftDist = refScrollParentWidth - state.refScroll.left;
        const screenRightDist = reference.right - refScrollParentLeft;

        // Maximum scroll distance inside scroll parent:
        //  top: scroll from top to bottom (decrease scrollTop)
        //  left: scroll from left to right (decrease scrollLeft)
        //  bottom: scroll from bottom to top (increase scrollTop)
        //  right: scroll from right to left (increase scrollLeft)
        state.dist = {
            left: Math.min(screenLeftDist, state.scrollLeft),
            top: Math.min(screenTopDist - minRefHeight, state.scrollTop),
            bottom: Math.min(
                screenBottomDist - minRefHeight,
                state.scrollHeight - state.scrollBottom,
            ),
            right: Math.min(
                screenRightDist,
                state.scrollWidth - state.scrollRight,
            ),
        };
        state.windowDist = {
            left: windowScrollLeft,
            right: windowScrollWidth - windowScrollRight,
            top: windowScrollTop,
            bottom: windowScrollHeight - windowScrollBottom,
        };

        current.left = getInitialLeftPosition(state);
        current.top = getInitialTopPosition(state);
        this.renderPosition();

        this.handleVerticalPosition();
        this.handleHorizontalPosition();

        if (isInitial) {
            setTimeout(() => {
                this.listenWindowEvents();
                this.notifyScrollDone();
            });
        }
    }

    renderPosition() {
        const { state } = this;
        if (!state?.elem) {
            return;
        }

        const { style } = state.elem;
        const { left, top } = state.current;

        style.left = px(0);
        style.top = px(0);

        transform(state.elem, `translate(${px(left)}, ${px(top)})`);
    }

    handleVerticalPosition() {
        const { state } = this;
        const {
            screen,
            scrollParent,
            margin,
            screenPadding,
            reference,
            minRefHeight,
            current,
        } = state;
        const { style } = state.elem;

        // Check element is taller than screen
        const minHeight = minRefHeight + margin + screenPadding + current.height;
        if (minHeight > screen.height && state.allowResize) {
            current.height = screen.height - minRefHeight - screenPadding - margin;
            style.maxHeight = px(current.height);
        }

        const top = isVertical(state)
            ? (reference.top - current.height - margin)
            : (reference.top - current.height + reference.height);

        const bottom = isVertical(state)
            ? (reference.bottom + margin + current.height)
            : (reference.top + current.height);

        state.overflowBottom = bottom - screen.height + state.bottomSafe;
        state.overflowTop = -(top - screenPadding);

        // Check element flip is required
        state.flip = isVerticalFlip(state);
        state.crossFlip = isVerticalCrossFlip(state);
        current.top = getInitialTopPosition(state);
        this.renderPosition();

        const isTopPosition = isTop(state);
        const isBottomPosition = isBottom(state);
        const elemVertOverflow = getElementVerticalOverflow(state);
        const refOverflowTop = -state.refScroll.top;
        const refOverflowBottom = reference.bottom - screen.height;

        let refVertOverflow = 0;
        if (isTopPosition) {
            refVertOverflow = refOverflowBottom;
        } else if (isBottomPosition) {
            refVertOverflow = refOverflowTop;
        }

        const isRefOverflow = elemVertOverflow < 0 && refVertOverflow > 1;
        const topToBottom = isTopPosition !== isRefOverflow;
        const direction = (topToBottom) ? -1 : 1;

        let overflow = (isRefOverflow) ? refVertOverflow : elemVertOverflow;
        if (overflow > 1 && state.vertScrollAvailable && state.scrollOnOverflow) {
            const maxDistance = (topToBottom) ? state.dist.top : state.dist.bottom;
            const distance = Math.min(overflow, maxDistance) * direction;
            const newScrollTop = scrollParent.scrollTop + distance;

            if ((topToBottom && distance < 0) || (!topToBottom && distance > 0)) {
                overflow -= Math.abs(distance);
            }

            // Scroll window if overflow is not cleared yet
            let windowScrollDistance = 0;
            if (overflow > 1) {
                const maxWindowDistance = (topToBottom)
                    ? state.windowDist.top
                    : state.windowDist.bottom;

                windowScrollDistance = Math.min(overflow, maxWindowDistance) * direction;
                overflow -= Math.abs(windowScrollDistance);
            }
            const newWindowScrollY = window.scrollY + windowScrollDistance;

            scrollParent.scrollTop = newScrollTop;
            if (Math.abs(windowScrollDistance) > 0) {
                window.scrollTo(window.scrollX, newWindowScrollY);
            }
        }

        state.reference = state.refElem.getBoundingClientRect();
        current.top = getInitialTopPosition(state);

        // Decrease height of element if overflow is not cleared
        if (overflow > 1 && state.allowResize) {
            current.height -= overflow;
            style.maxHeight = px(current.height);
            if (isTopPosition) {
                current.top += overflow;
            }
        }

        this.renderPosition();
    }

    handleHorizontalPosition() {
        const { state } = this;
        const {
            screen,
            scrollParent,
            offset,
            margin,
            screenPadding,
            windowDist,
            reference,
            current,
        } = state;
        const { style } = state.elem;
        const html = document.documentElement;

        if (state.useRefWidth) {
            style.minWidth = px(reference.width);
            style.width = '';
        }

        state.maxWidth = html.clientWidth - (screenPadding * 2);
        state.minLeft = screenPadding - offset.left;

        // Check element is wider than screen
        if (state.width >= state.maxWidth) {
            style.width = px(state.maxWidth);
            current.left = state.minLeft;
            this.renderPosition();
            return;
        }

        current.left = getInitialLeftPosition(state);

        const left = isHorizontal(state)
            ? (reference.left - current.width - margin)
            : (reference.right - current.width);

        const right = isHorizontal(state)
            ? (reference.right + margin + current.width)
            : (reference.left + current.width);

        state.overflowRight = right - screen.width + screenPadding;
        state.overflowLeft = -(left - screenPadding);

        state.flip = isHorizontalFlip(state);
        state.crossFlip = isHorizontalCrossFlip(state);
        current.left = getInitialLeftPosition(state);
        this.renderPosition();

        const isLeftPosition = isLeft(state);
        const isRightPosition = isRight(state);
        const elemHorOverflow = getElementHorizontalOverflow(state);
        const refOverflowLeft = -state.refScroll.left;
        const refOverflowRight = reference.right - screen.width;

        let refHorOverflow = 0;
        if (isLeftPosition) {
            refHorOverflow = refOverflowRight;
        } else if (isRightPosition) {
            refHorOverflow = refOverflowLeft;
        }

        const isRefHorOverflow = elemHorOverflow < 0 && refHorOverflow > 1;
        const leftToRight = isLeftPosition !== isRefHorOverflow;
        const horDirection = (leftToRight) ? -1 : 1;

        let hOverflow = (isRefHorOverflow) ? refHorOverflow : elemHorOverflow;
        if (hOverflow > 1 && state.horScrollAvailable && state.scrollOnOverflow) {
            const maxDistance = (leftToRight) ? state.dist.left : state.dist.right;
            const hDistance = Math.min(hOverflow, maxDistance) * horDirection;
            const newScrollLeft = scrollParent.scrollLeft + hDistance;

            if ((leftToRight && hDistance < 0) || (!leftToRight && hDistance > 0)) {
                hOverflow -= Math.abs(hDistance);
            }

            // Scroll window if overflow is not cleared yet
            let windowHScrollDistance = 0;
            if (hOverflow > 1) {
                const maxWindowDistance = (leftToRight) ? windowDist.left : windowDist.right;
                windowHScrollDistance = (
                    Math.min(hOverflow, maxWindowDistance) * horDirection
                );
                hOverflow -= Math.abs(windowHScrollDistance);
            }
            const newWindowScrollX = window.scrollX + windowHScrollDistance;

            scrollParent.scrollLeft = newScrollLeft;
            if (Math.abs(windowHScrollDistance) > 0) {
                window.scrollTo(newWindowScrollX, window.scrollY);
            }

            state.reference = state.refElem.getBoundingClientRect();
            current.left = getInitialLeftPosition(state);
            this.renderPosition();
        }
    }

    /* Reset previously applied style properties of element */
    reset() {
        const { style } = this.props.elem;

        style.top = '';
        style.bottom = '';
        style.left = '';
        style.minWidth = '';
        style.width = '';
        style.maxHeight = '';

        setTimeout(() => this.stopWindowEvents());
    }
}
