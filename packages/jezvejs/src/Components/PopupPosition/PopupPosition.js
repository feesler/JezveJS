import { isFunction } from '@jezvejs/types';
import { transform } from '@jezvejs/dom';
import { px } from '../../common.js';

import {
    getScreenWidth,
    getScreenHeight,
    getWindowScrollLeft,
    getWindowScrollTop,
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
} from './helpers.js';

export class PopupPosition {
    static windowScrollDistance = 0;

    static notifyScrollDone(callback) {
        if (isFunction(callback)) {
            callback();
        }
    }

    /** Calculate height, vertical and horizontal offset of popup element */
    static calculate(options) {
        const {
            elem,
            refElem,
            update = false,
            position = 'bottom',
            margin = 0,
            screenPadding = 0,
            bottomSafeArea = 70,
            useRefWidth = false,
            allowFlip = true,
            scrollOnOverflow = true,
            allowResize = true,
            minRefHeight = 20,
            onScrollDone = null,
        } = options;

        if (!elem || !refElem) {
            return;
        }

        const { style } = elem;
        const html = document.documentElement;

        const context = {
            elem,
            refElem,
            position,
            margin,
            screenPadding,
            allowFlip,
            scrollOnOverflow,
            allowResize,
            minRefHeight,
            screen: {
                left: getWindowScrollLeft(),
                top: getWindowScrollTop(),
                width: getScreenWidth(),
                height: getScreenHeight(),
            },
            reference: refElem.getBoundingClientRect(),
            fixedParent: getFixedParent(elem),
            absoluteParent: isAbsoluteParent(elem),
            fixedElement: !elem.offsetParent,
            width: elem.offsetWidth,
            height: elem.offsetHeight,
            flip: false,
        };

        const { screen } = context;
        screen.bottom = screen.top + screen.height;
        screen.right = screen.left + screen.width;

        const scrollParent = context.fixedParent || getScrollParent(elem);
        context.scrollLeft = scrollParent.scrollLeft;
        context.scrollTop = scrollParent.scrollTop;
        context.horScrollAvailable = scrollParent.scrollWidth >= scrollParent.clientWidth;
        context.vertScrollAvailable = scrollParent.scrollHeight >= scrollParent.clientHeight;
        context.scrollParent = scrollParent;

        context.scrollParentBox = (scrollParent && !context.fixedElement)
            ? context.scrollParent.getBoundingClientRect()
            : { ...screen };

        context.offset = (context.fixedElement)
            ? { ...screen }
            : elem.offsetParent.getBoundingClientRect();

        const { reference, offset } = context;

        context.bottomSafe = (screen.height - html.clientHeight > 50)
            ? bottomSafeArea
            : screenPadding;

        // Vertical offset

        // Initial set vertical position used in further calculations
        let initialTop = getInitialTopPosition(context);
        style.top = px(0);
        transform(elem, `translateY(${px(initialTop)})`);

        context.scrollHeight = (context.vertScrollAvailable)
            ? scrollParent.scrollHeight
            : screen.bottom;

        const windowScrollLeft = (context.fixedParent) ? context.scrollLeft : screen.left;
        const windowScrollTop = (context.fixedParent) ? context.scrollTop : screen.top;
        const windowScrollWidth = (context.fixedParent)
            ? context.scrollWidth
            : html.scrollWidth;
        const windowScrollHeight = (context.fixedParent)
            ? context.scrollHeight
            : html.scrollHeight;
        const windowScrollRight = windowScrollLeft + screen.width;
        const windowScrollBottom = windowScrollTop + screen.height;

        const refScrollParentHeight = Math.min(
            screen.height,
            context.scrollParentBox.height,
        );
        const refScrollParentTop = Math.max(0, context.scrollParentBox.top);
        context.scrollBottom = context.scrollTop + refScrollParentHeight;

        const refScrollTop = reference.top - refScrollParentTop;

        const screenTopDist = refScrollParentHeight - refScrollTop;
        const screenBottomDist = reference.bottom - refScrollParentTop;

        // Maximum scroll distance inside scroll parent:
        //  top: scroll from top to bottom (decrease scrollTop)
        //  bottom: scroll from bottom to top (increase scrollTop)
        context.dist = {
            top: Math.min(screenTopDist - minRefHeight, context.scrollTop),
            bottom: Math.min(
                screenBottomDist - minRefHeight,
                context.scrollHeight - context.scrollBottom,
            ),
        };
        const windowDist = {
            left: windowScrollLeft,
            right: windowScrollWidth - windowScrollRight,
            top: windowScrollTop,
            bottom: windowScrollHeight - windowScrollBottom,
        };

        context.bottom = reference.bottom + margin + context.height + context.bottomSafe;

        // Check element taller than screen
        const minHeight = minRefHeight + margin + screenPadding + context.height;
        if (minHeight > screen.height && allowResize) {
            context.height = screen.height - minRefHeight - screenPadding - margin;
            style.maxHeight = px(context.height);

            context.bottom = reference.bottom + margin + context.height + context.bottomSafe;
        }

        const refOverflowTop = -refScrollTop;
        const refOverflowBottom = reference.bottom - screen.height;

        context.top = reference.top - context.height - margin - screenPadding;
        context.overflowBottom = context.bottom - screen.height;
        context.overflowTop = -context.top;

        // Check element flip is required
        context.flip = isVecticalFlip(context);
        if (context.flip) {
            initialTop = getInitialTopPosition(context);
        }

        const isTopPosition = isTop(context);
        const isBottomPosition = isBottom(context);

        let elemOverflow = 0;
        if (isTopPosition) {
            elemOverflow = context.overflowTop;
        } else if (isBottomPosition) {
            elemOverflow = context.overflowBottom;
        }

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
        if (overflow > 1 && context.vertScrollAvailable && scrollOnOverflow) {
            const maxDistance = (topToBottom) ? context.dist.top : context.dist.bottom;
            const distance = Math.min(overflow, maxDistance) * direction;
            const newScrollTop = scrollParent.scrollTop + distance;

            if ((topToBottom && distance < 0) || (!topToBottom && distance > 0)) {
                overflow -= Math.abs(distance);
            }

            // Scroll window if overflow is not cleared yet
            let windowScrollDistance = 0;
            if (overflow > 1) {
                const maxWindowDistance = (topToBottom) ? windowDist.top : windowDist.bottom;
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
        if (overflow > 1 && allowResize) {
            context.height -= overflow;
            style.maxHeight = px(context.height);
            if (isTopPosition) {
                initialTop += overflow;
            }
        }
        if (context.flip) {
            transform(elem, `translateY(${px(initialTop)})`);
        }

        if (!update) {
            setTimeout(() => {
                this.notifyScrollDone(onScrollDone);
            });
        }

        // Horizontal offset
        context.scrollWidth = (context.horScrollAvailable)
            ? scrollParent.scrollWidth
            : screen.right;

        if (useRefWidth) {
            style.minWidth = px(reference.width);
            style.width = '';
        }

        context.maxWidth = html.clientWidth - (screenPadding * 2);
        context.minLeft = screenPadding - offset.left;

        // Check element wider than screen
        if (context.width >= context.maxWidth) {
            style.width = px(context.maxWidth);
            style.left = px(context.minLeft);
            return;
        }

        let initialLeft = getInitialLeftPosition(context);
        style.left = px(initialLeft);

        if (isHorizontal(context)) {
            const refScrollParentWidth = Math.min(
                screen.width,
                context.scrollParentBox.width,
            );

            const refScrollParentLeft = Math.max(0, context.scrollParentBox.left);
            context.scrollRight = context.scrollLeft + refScrollParentWidth;

            const refScrollLeft = reference.left - refScrollParentLeft;

            const screenLeftDist = refScrollParentWidth - refScrollLeft;
            const screenRightDist = reference.right - refScrollParentLeft;

            context.right = initialLeft - html.scrollLeft + context.width + screenPadding;

            context.dist.left = Math.min(screenLeftDist, context.scrollLeft);
            context.dist.right = Math.min(
                screenRightDist,
                context.scrollWidth - context.scrollRight,
            );

            context.overflowRight = context.right - screen.width + screenPadding * 2;
            context.overflowLeft = -(initialLeft - screenPadding);

            context.flip = isHorizontalFlip(context);
            if (context.flip) {
                initialLeft = getInitialLeftPosition(context);
                style.left = px(initialLeft);
            }

            const isLeftPosition = isLeft(context);
            const isRightPosition = isRight(context);

            const refHorOverflowLeft = -refScrollLeft;
            const refHowOverflowRight = reference.right - screen.width;

            let elemHorOverflow = 0;
            if (isLeftPosition) {
                elemHorOverflow = context.overflowLeft;
            } else if (isRightPosition) {
                elemHorOverflow = context.overflowRight;
            }

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
            if (hOverflow > 1 && context.horScrollAvailable && scrollOnOverflow) {
                const maxDistance = (leftToRight) ? context.dist.left : context.dist.right;
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

        if (isVertical(context)) {
            // Check element overflows screen to the right
            // if rendered from the left of reference
            const relLeft = reference.left - offset.left;
            const leftOffset = reference.left - html.scrollLeft;
            if (leftOffset + context.width <= html.clientWidth - screenPadding) {
                style.left = px(relLeft);
                return;
            }

            let left = relLeft + reference.width - context.width;
            const hOverflow = offset.left + left;
            if (hOverflow < 0) {
                left -= hOverflow;
            }

            style.left = px(Math.max(left, context.minLeft));
        }
    }

    /* Reset previously applied style properties of element */
    static reset(elem) {
        if (!elem) {
            return;
        }

        const { style } = elem;
        style.top = '';
        style.bottom = '';
        style.left = '';
        style.minWidth = '';
        style.width = '';
        style.maxHeight = '';
    }
}
