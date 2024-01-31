import { isFunction, isObject } from '@jezvejs/types';
import { removeEvents, setEvents, transform } from '@jezvejs/dom';
import { debounce, minmax, px } from '../../common.js';

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
    isVerticalCenterPosition,
    isHorizontalCenterPosition,
    getLeftOverflow,
    getRightOverflow,
    getTopOverflow,
    getBottomOverflow,
    isVerticalToHorizontalAxisChange,
    isHorizontalToVerticalAxisChange,
    changeAxisToVertical,
    changeAxisToHorizontal,
    isVerticalEnd,
    isHorizontalEnd,
} from './helpers.js';

const UPDATE_TIMEOUT = 75;

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
    allowChangeAxis: false,
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

        const handler = () => this.updatePosition();
        this.updateHandler = debounce(handler, UPDATE_TIMEOUT);

        this.state = {
            current: {},
            isInitial: true,
            listeningWindow: false,
            scrollRequested: false,
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
            if (this.state.scrollRequested) {
                this.updateHandler();
            } else {
                this.updatePosition();
            }
        }
    }

    /** viewPort 'resize' event handler */
    onViewportResize(e) {
        const updateRequired = isFunction(this.state.onViewportResize)
            ? this.state.onViewportResize(e)
            : true;

        if (updateRequired) {
            if (this.state.scrollRequested) {
                this.updateHandler();
            } else {
                this.updatePosition();
            }
        }
    }

    updatePosition() {
        const updateProps = isFunction(this.state.updateProps)
            ? this.state.updateProps()
            : this.state.updateProps;
        const props = isObject(updateProps) ? updateProps : {};

        this.state.scrollRequested = false;

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
        const { isInitial } = this.state;

        this.state = {
            ...this.state,
            ...options,
        };

        this.calculate();
        this.renderPosition();
        this.calculate();

        this.handleMaxSize();
        this.calculateOverflow();
        this.handleFlip();
        this.handleAxisChange();

        this.handleVerticalPosition();
        this.handleHorizontalPosition();

        if (isInitial) {
            setTimeout(() => {
                this.listenWindowEvents();
                this.notifyScrollDone();
            });
        }
    }

    calculate() {
        const { elem } = this.props;
        const { isInitial } = this.state;

        this.state = {
            ...this.state,
            screen: getScreenRect(),
            fixedParent: getFixedParent(elem),
            absoluteParent: isAbsoluteParent(elem),
            fixedElement: !elem.offsetParent,
            flip: false,
            crossFlip: false,
            isInitial: false,
        };

        this.state.current.width = elem.offsetWidth;
        this.state.current.height = elem.offsetHeight;

        this.getRefClientRect(isInitial);
        this.getOffsetParentRect();
        this.getScrollParentRect();
        this.getBottomSafe();

        this.calculateRefScroll();
        this.calculateScroll();

        this.calculateMaxScrollDistance();
        this.calculateMaxWindowScrollDistance();

        this.state.current.left = getInitialLeftPosition(this.state);
        this.state.current.top = getInitialTopPosition(this.state);
    }

    recalculate() {
        this.state.current.left = getInitialLeftPosition(this.state);
        this.state.current.top = getInitialTopPosition(this.state);
        this.renderPosition();
        this.calculate();
        this.calculateOverflow();
    }

    getRefClientRect(isInitial = false) {
        const { state } = this;
        const refRect = state.refElem.getBoundingClientRect();

        if (isInitial || refRect.width > 0 || refRect.height > 0) {
            state.reference = refRect;
        }
    }

    getOffsetParentRect() {
        const { state } = this;

        state.offset = (state.fixedElement)
            ? { ...state.screen, left: 0, top: 0 }
            : state.elem.offsetParent.getBoundingClientRect();
    }

    getScrollParentRect() {
        const { state } = this;

        const scrollParent = state.fixedParent || getScrollParent(this.props.elem);
        state.scrollParent = scrollParent;

        state.scrollParentBox = (scrollParent && !state.fixedElement)
            ? state.scrollParent.getBoundingClientRect()
            : { ...state.screen, left: 0, top: 0 };
    }

    getBottomSafe() {
        const { state } = this;
        const html = document.documentElement;

        state.bottomSafe = (state.screen.height - html.clientHeight > 50)
            ? state.bottomSafeArea
            : state.screenPadding;
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

    calculateRefScroll() {
        const { state } = this;
        const {
            screen,
            scrollParentBox,
            reference,
        } = state;

        state.refScrollParent = {
            left: Math.max(0, scrollParentBox.left),
            top: Math.max(0, scrollParentBox.top),
            width: Math.min(screen.width, scrollParentBox.width),
            height: Math.min(screen.height, scrollParentBox.height),
        };

        state.refScroll = {
            left: reference.left - state.refScrollParent.left,
            top: reference.top - state.refScrollParent.top,
        };
    }

    calculateScroll() {
        const { state } = this;
        const {
            scrollParent,
            screen,
            refScrollParent,
        } = state;

        state.scrollLeft = scrollParent.scrollLeft;
        state.scrollTop = scrollParent.scrollTop;
        state.horScrollAvailable = scrollParent.scrollWidth >= scrollParent.clientWidth;
        state.vertScrollAvailable = scrollParent.scrollHeight >= scrollParent.clientHeight;

        state.scrollWidth = (state.horScrollAvailable)
            ? scrollParent.scrollWidth
            : screen.right;
        state.scrollHeight = (state.vertScrollAvailable)
            ? scrollParent.scrollHeight
            : screen.bottom;
        state.scrollRight = state.scrollLeft + refScrollParent.width;
        state.scrollBottom = state.scrollTop + refScrollParent.height;
    }

    /**
     * Calculates maximum scroll distance inside scroll parent:
     *    top: scroll from top to bottom (decrease scrollTop)
     *    left: scroll from left to right (decrease scrollLeft)
     *    bottom: scroll from bottom to top (increase scrollTop)
     *    right: scroll from right to left (increase scrollLeft)
     */
    calculateMaxScrollDistance() {
        const {
            refScroll,
            minRefHeight,
            refScrollParent,
            reference,
        } = this.state;

        const screenTopDist = refScrollParent.height - refScroll.top;
        const screenBottomDist = reference.bottom - refScrollParent.top;
        const screenLeftDist = refScrollParent.width - refScroll.left;
        const screenRightDist = reference.right - refScrollParent.left;

        this.state.dist = {
            left: Math.min(screenLeftDist, this.state.scrollLeft),
            top: Math.min(screenTopDist - minRefHeight, this.state.scrollTop),
            bottom: Math.min(
                screenBottomDist - minRefHeight,
                this.state.scrollHeight - this.state.scrollBottom,
            ),
            right: Math.min(
                screenRightDist,
                this.state.scrollWidth - this.state.scrollRight,
            ),
        };
    }

    calculateMaxWindowScrollDistance() {
        const {
            screen,
            fixedParent,
        } = this.state;
        const html = document.documentElement;

        const left = (fixedParent) ? this.state.scrollLeft : screen.left;
        const top = (fixedParent) ? this.state.scrollTop : screen.top;
        const width = (fixedParent)
            ? this.state.scrollWidth
            : html.scrollWidth;
        const height = (fixedParent)
            ? this.state.scrollHeight
            : html.scrollHeight;
        const right = left + screen.width;
        const bottom = top + screen.height;

        this.state.windowDist = {
            left,
            right: width - right,
            top,
            bottom: height - bottom,
        };
    }

    handleMaxSize() {
        const {
            screen,
            margin,
            offset,
            screenPadding,
            minRefHeight,
            current,
            reference,
        } = this.state;
        const { style } = this.state.elem;

        // Check element is taller than screen
        const minHeight = minRefHeight + margin + screenPadding + current.height;
        if (minHeight > screen.height && this.state.allowResize) {
            current.height = screen.height - minRefHeight - screenPadding - margin;
            style.maxHeight = px(current.height);
        }

        this.state.maxWidth = screen.width - (screenPadding * 2);
        this.state.minLeft = screenPadding - offset.left;

        // Check element is wider than screen
        if (this.state.width >= this.state.maxWidth) {
            style.width = px(this.state.maxWidth);
            current.left = this.state.minLeft;
            this.renderPosition();
        }

        if (this.state.useRefWidth) {
            style.minWidth = px(reference.width);
            style.width = '';
            current.left = getInitialLeftPosition(this.state);
            this.renderPosition();
        }
    }

    calculateOverflow() {
        this.calculateVerticalOverflow();
        this.calculateHorizontalOverflow();
    }

    calculateVerticalOverflow() {
        const { state } = this;
        const { reference, current } = state;
        const isVertCenter = isVerticalCenterPosition(state);

        const vertTop = reference.top - current.height - state.margin;
        const horTop = (isVertCenter)
            ? (reference.top - (current.height - reference.height) / 2)
            : (reference.top - current.height + reference.height);
        const vertBottom = reference.bottom + state.margin + current.height;
        const horBottom = (isVertCenter)
            ? (reference.bottom + (current.height - reference.height) / 2)
            : (reference.top + current.height);

        state.vertOverflowTop = getTopOverflow(vertTop, state);
        state.vertOverflowBottom = getBottomOverflow(vertBottom, state);

        state.horOverflowTop = getTopOverflow(horTop, state);
        state.horOverflowBottom = getBottomOverflow(horBottom, state);
    }

    calculateHorizontalOverflow() {
        const { state } = this;
        const { reference, current } = state;
        const isHorCenter = isHorizontalCenterPosition(state);

        const horLeft = reference.left - current.width - state.margin;
        const vertLeft = (isHorCenter)
            ? (reference.left - (current.width - reference.width) / 2)
            : (reference.right - current.width);
        const horRight = reference.right + state.margin + current.width;
        const vertRight = (isHorCenter)
            ? (reference.right + (current.width - reference.width) / 2)
            : (reference.left + current.width);

        state.horOverflowLeft = getLeftOverflow(horLeft, state);
        state.horOverflowRight = getRightOverflow(horRight, state);

        state.vertOverflowLeft = getLeftOverflow(vertLeft, state);
        state.vertOverflowRight = getRightOverflow(vertRight, state);
    }

    handleFlip() {
        const { state } = this;
        state.flip = isVerticalFlip(state) || isHorizontalFlip(state);
        state.crossFlip = isVerticalCrossFlip(state) || isHorizontalCrossFlip(state);

        this.state.current.left = getInitialLeftPosition(this.state);
        this.state.current.top = getInitialTopPosition(this.state);
        this.renderPosition();
    }

    handleAxisChange() {
        const { state } = this;
        if (state.flip) {
            return;
        }

        const vertToHor = isVerticalToHorizontalAxisChange(state);
        const horToVert = isHorizontalToVerticalAxisChange(state);

        if (vertToHor) {
            state.position = changeAxisToHorizontal(state);
        } else if (horToVert) {
            state.position = changeAxisToVertical(state);
        }

        if (vertToHor || horToVert) {
            this.recalculate();
        }
    }

    handleVerticalPosition() {
        const { state } = this;
        const {
            screen,
            offset,
            scrollParent,
            reference,
            current,
        } = state;
        const { style } = state.elem;

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

        const topToBottom = isVertical(state)
            ? (isTopPosition !== isRefOverflow)
            : (isVerticalEnd(state));

        const direction = (topToBottom) ? -1 : 1;
        let overflow = (isRefOverflow) ? refVertOverflow : elemVertOverflow;
        if (overflow > state.screenPadding && state.vertScrollAvailable && state.scrollOnOverflow) {
            const maxDistance = (topToBottom) ? state.dist.top : state.dist.bottom;
            const distance = Math.min(overflow, maxDistance) * direction;
            const newScrollTop = scrollParent.scrollTop + distance;

            if ((topToBottom && distance < 0) || (!topToBottom && distance > 0)) {
                overflow -= Math.abs(distance);
            }

            if (overflow <= state.screenPadding) {
                overflow = 0;
            }

            // Scroll window if overflow is not cleared yet
            let windowScrollDistance = 0;
            if (overflow > state.screenPadding) {
                const maxWindowDistance = (topToBottom)
                    ? state.windowDist.top
                    : state.windowDist.bottom;

                windowScrollDistance = Math.min(overflow, maxWindowDistance) * direction;
                overflow -= Math.abs(windowScrollDistance);
            }
            const newWindowScrollY = window.scrollY + windowScrollDistance;

            this.state.scrollRequested = true;
            scrollParent.scrollTop = newScrollTop;
            if (Math.abs(windowScrollDistance) > 0) {
                window.scrollTo(window.scrollX, newWindowScrollY);
            }
        } else if (overflow > state.screenPadding && state.isInitial && !state.scrollOnOverflow) {
            const minPos = state.screenPadding - offset.top;
            const maxPos = screen.height - offset.top - current.height - state.screenPadding;
            current.top = minmax(minPos, maxPos, current.top);
            overflow = 0;
            this.renderPosition();
        }

        this.getRefClientRect();
        this.getOffsetParentRect();
        this.getScrollParentRect();
        current.top = getInitialTopPosition(state);

        // Decrease height of element if overflow is not cleared
        if (overflow > state.screenPadding && state.isInitial && state.allowResize) {
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
            offset,
            scrollParent,
            windowDist,
            reference,
            current,
        } = state;

        const isLeftPosition = isLeft(this.state);
        const isRightPosition = isRight(this.state);
        const elemHorOverflow = getElementHorizontalOverflow(this.state);
        const refOverflowLeft = -this.state.refScroll.left;
        const refOverflowRight = reference.right - screen.width;

        let refHorOverflow = 0;
        if (isLeftPosition) {
            refHorOverflow = refOverflowRight;
        } else if (isRightPosition) {
            refHorOverflow = refOverflowLeft;
        }

        const isRefHorOverflow = elemHorOverflow < 0 && refHorOverflow > 1;
        const leftToRight = isHorizontal(state)
            ? (isLeftPosition !== isRefHorOverflow)
            : (isHorizontalEnd(state));

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
            if (hOverflow > state.screenPadding) {
                const maxWindowDistance = (leftToRight) ? windowDist.left : windowDist.right;
                windowHScrollDistance = (
                    Math.min(hOverflow, maxWindowDistance) * horDirection
                );
                hOverflow -= Math.abs(windowHScrollDistance);
            }
            const newWindowScrollX = window.scrollX + windowHScrollDistance;

            this.state.scrollRequested = true;
            scrollParent.scrollLeft = newScrollLeft;
            if (Math.abs(windowHScrollDistance) > 0) {
                window.scrollTo(newWindowScrollX, window.scrollY);
            }

            this.getRefClientRect();
            this.getOffsetParentRect();
            this.getScrollParentRect();
            current.left = getInitialLeftPosition(state);
            this.renderPosition();
        } else if (hOverflow > state.screenPadding && state.isInitial && !state.scrollOnOverflow) {
            const minPos = state.screenPadding - offset.left;
            const maxPos = screen.width - offset.left - current.width - state.screenPadding;
            current.left = minmax(minPos, maxPos, current.left);
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
