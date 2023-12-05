import { isFunction } from '@jezvejs/types';
import { transform } from '@jezvejs/dom';
import { px } from '../../common.js';

import {
    getFixedParent,
    isAbsoluteParent,
    getScrollParent,
    isTop,
    isVecticalFlip,
    getInitialTopPosition,
    getInitialLeftPosition,
    isVertical,
    isHorizontal,
    isHorizontalFlip,
    isLeft,
    isBottom,
    isRight,
    getScreenRect,
    getElementVerticalOverflow,
    getElementHorizontalOverflow,
} from './helpers.js';

const defaultProps = {
    elem: null,
    refElem: null,
    position: 'bottom',
    margin: 0,
    screenPadding: 0,
    bottomSafeArea: 70,
    useRefWidth: false,
    allowFlip: true,
    scrollOnOverflow: true,
    allowResize: true,
    minRefHeight: 20,
    onScrollDone: null,
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

        this.state = {
            isInitial: true,
        };

        this.update(this.props);
    }

    /** Calls 'onScrollDone' callback function */
    notifyScrollDone() {
        if (isFunction(this.props.onScrollDone)) {
            this.props.onScrollDone();
        }
    }

    /** Calculate height, vertical and horizontal offset of popup element */
    update(options = {}) {
        const { elem, refElem } = this.props;

        const html = document.documentElement;
        const screen = getScreenRect();
        const { isInitial } = this.state;

        this.state = {
            ...this.state,
            ...options,
            screen,
            reference: refElem.getBoundingClientRect(),
            fixedParent: getFixedParent(elem),
            absoluteParent: isAbsoluteParent(elem),
            fixedElement: !elem.offsetParent,
            width: elem.offsetWidth,
            height: elem.offsetHeight,
            flip: false,
            isInitial: false,
        };
        const { state } = this;

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
            : state.screenPadding;

        this.handleVerticalPosition();
        this.handleHorizontalPosition();

        if (isInitial) {
            setTimeout(() => {
                this.notifyScrollDone();
            });
        }
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
        } = state;
        const { style } = state.elem;
        const html = document.documentElement;

        // Initial set vertical position used in further calculations
        let initialTop = getInitialTopPosition(state);
        style.top = px(0);
        transform(state.elem, `translateY(${px(initialTop)})`);

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

        const refScrollParentHeight = Math.min(
            screen.height,
            state.scrollParentBox.height,
        );
        const refScrollParentTop = Math.max(0, state.scrollParentBox.top);
        state.scrollBottom = state.scrollTop + refScrollParentHeight;

        const refScrollTop = reference.top - refScrollParentTop;

        const screenTopDist = refScrollParentHeight - refScrollTop;
        const screenBottomDist = reference.bottom - refScrollParentTop;

        // Maximum scroll distance inside scroll parent:
        //  top: scroll from top to bottom (decrease scrollTop)
        //  bottom: scroll from bottom to top (increase scrollTop)
        state.dist = {
            top: Math.min(screenTopDist - minRefHeight, state.scrollTop),
            bottom: Math.min(
                screenBottomDist - minRefHeight,
                state.scrollHeight - state.scrollBottom,
            ),
        };
        state.windowDist = {
            left: windowScrollLeft,
            right: windowScrollWidth - windowScrollRight,
            top: windowScrollTop,
            bottom: windowScrollHeight - windowScrollBottom,
        };

        state.bottom = reference.bottom + margin + state.height + state.bottomSafe;

        // Check element taller than screen
        const minHeight = minRefHeight + margin + screenPadding + state.height;
        if (minHeight > screen.height && state.allowResize) {
            state.height = screen.height - minRefHeight - screenPadding - margin;
            style.maxHeight = px(state.height);

            state.bottom = reference.bottom + margin + state.height + state.bottomSafe;
        }

        const refOverflowTop = -refScrollTop;
        const refOverflowBottom = reference.bottom - screen.height;

        state.top = reference.top - state.height - margin - screenPadding;
        state.overflowBottom = state.bottom - screen.height;
        state.overflowTop = -state.top;

        // Check element flip is required
        state.flip = isVecticalFlip(state);
        if (state.flip) {
            initialTop = getInitialTopPosition(state);
        }

        const isTopPosition = isTop(state);
        const isBottomPosition = isBottom(state);

        const elemOverflow = getElementVerticalOverflow(state);

        let refOverflow = 0;
        if (isTopPosition) {
            refOverflow = refOverflowBottom;
        } else if (isBottomPosition) {
            refOverflow = refOverflowTop;
        }

        const isRefOverflow = elemOverflow < 0 && refOverflow > 1;
        const topToBottom = isTopPosition !== isRefOverflow;
        const direction = (topToBottom) ? -1 : 1;

        let overflow = (isRefOverflow) ? refOverflow : elemOverflow;
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
        // Decrease height of element if overflow is not cleared
        if (overflow > 1 && state.allowResize) {
            state.height -= overflow;
            style.maxHeight = px(state.height);
            if (isTopPosition) {
                initialTop += overflow;
            }
        }
        if (state.flip) {
            transform(state.elem, `translateY(${px(initialTop)})`);
        }
    }

    handleHorizontalPosition() {
        const { state } = this;
        const {
            screen,
            scrollParent,
            offset,
            screenPadding,
            windowDist,
            reference,
        } = state;
        const { style } = state.elem;
        const html = document.documentElement;

        state.scrollWidth = (state.horScrollAvailable)
            ? scrollParent.scrollWidth
            : screen.right;

        if (state.useRefWidth) {
            style.minWidth = px(reference.width);
            style.width = '';
        }

        state.maxWidth = html.clientWidth - (screenPadding * 2);
        state.minLeft = screenPadding - offset.left;

        // Check element wider than screen
        if (state.width >= state.maxWidth) {
            style.width = px(state.maxWidth);
            style.left = px(state.minLeft);
            return;
        }

        let initialLeft = getInitialLeftPosition(state);
        style.left = px(initialLeft);

        if (isHorizontal(state)) {
            const refScrollParentWidth = Math.min(
                screen.width,
                state.scrollParentBox.width,
            );

            const refScrollParentLeft = Math.max(0, state.scrollParentBox.left);
            state.scrollRight = state.scrollLeft + refScrollParentWidth;

            const refScrollLeft = reference.left - refScrollParentLeft;

            const screenLeftDist = refScrollParentWidth - refScrollLeft;
            const screenRightDist = reference.right - refScrollParentLeft;

            state.right = initialLeft - html.scrollLeft + state.width + screenPadding;

            state.dist.left = Math.min(screenLeftDist, state.scrollLeft);
            state.dist.right = Math.min(
                screenRightDist,
                state.scrollWidth - state.scrollRight,
            );

            state.overflowRight = state.right - screen.width + screenPadding * 2;
            state.overflowLeft = -(initialLeft - screenPadding);

            state.flip = isHorizontalFlip(state);
            if (state.flip) {
                initialLeft = getInitialLeftPosition(state);
                style.left = px(initialLeft);
            }

            const isLeftPosition = isLeft(state);
            const isRightPosition = isRight(state);

            const refHorOverflowLeft = -refScrollLeft;
            const refHowOverflowRight = reference.right - screen.width;

            const elemHorOverflow = getElementHorizontalOverflow(state);

            let refHorOverflow = 0;
            if (isLeftPosition) {
                refHorOverflow = refHowOverflowRight;
            } else if (isRightPosition) {
                refHorOverflow = refHorOverflowLeft;
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
            }
        }

        if (!isVertical(state)) {
            return;
        }

        // Check element overflows screen to the right
        // if rendered from the left of reference
        const relLeft = reference.left - offset.left;
        const leftOffset = reference.left - html.scrollLeft;
        if (leftOffset + state.width <= html.clientWidth - screenPadding) {
            style.left = px(relLeft);
            return;
        }

        let left = relLeft + reference.width - state.width;
        const hOverflow = offset.left + left;
        if (hOverflow < 0) {
            left -= hOverflow;
        }

        style.left = px(Math.max(left, state.minLeft));
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
    }
}
