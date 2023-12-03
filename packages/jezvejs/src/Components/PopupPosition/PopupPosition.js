import { isFunction } from '@jezvejs/types';
import { transform } from '@jezvejs/dom';
import { px } from '../../common.js';

import {
    getScreenHeight,
    getWindowScrollTop,
    getFixedParent,
    isAbsoluteParent,
    getScrollParent,
} from './helpers.js';

export class PopupPosition {
    static windowScrollDistance = 0;

    static notifyScrollDone(callback) {
        if (isFunction(callback)) {
            callback();
        }
    }

    static isTop(context) {
        return (
            (context.position === 'top' && !context.flip)
            || (context.position === 'bottom' && context.flip)
        );
    }

    static getInitialTopPosition(context) {
        const {
            offset,
            reference,
            elem,
        } = context;

        const isTop = this.isTop(context);
        let res = (isTop)
            ? (reference.top - offset.top - context.height - context.margin)
            : (reference.bottom - offset.top + context.margin);

        if (
            context.fixedParent
            && context.fixedParent === elem.offsetParent
            && !context.fixedElement
        ) {
            res += context.scrollTop;
        }

        return res;
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
            screen: {
                height: getScreenHeight(),
                top: getWindowScrollTop(),
            },
            reference: refElem.getBoundingClientRect(),
            fixedParent: getFixedParent(elem),
            absoluteParent: isAbsoluteParent(elem),
            fixedElement: !elem.offsetParent,
            height: elem.offsetHeight,
            flip: false,
        };

        const { screen } = context;
        screen.bottom = screen.top + screen.height;

        const scrollParent = context.fixedParent || getScrollParent(elem);
        context.scrollTop = scrollParent.scrollTop;
        context.scrollAvailable = scrollParent.scrollHeight >= scrollParent.clientHeight;
        context.scrollParent = scrollParent;

        context.scrollParentBox = (scrollParent && !context.fixedElement)
            ? context.scrollParent.getBoundingClientRect()
            : { top: 0, left: 0, height: screen.height };

        context.offset = (context.fixedElement)
            ? { top: 0, left: 0, height: screen.height }
            : elem.offsetParent.getBoundingClientRect();

        const { reference, offset } = context;

        context.bottomSafe = (screen.height - html.clientHeight > 50)
            ? bottomSafeArea
            : 0;

        // Vertical offset

        // Initial set vertical position used in further calculations
        let initialTop = this.getInitialTopPosition(context);
        style.top = px(0);
        transform(elem, `translateY(${px(initialTop)})`);

        context.scrollHeight = (context.scrollAvailable)
            ? scrollParent.scrollHeight
            : screen.bottom;

        const windowScrollTop = (context.fixedParent) ? context.scrollTop : screen.top;
        const windowScrollHeight = (context.fixedParent)
            ? context.scrollHeight
            : html.scrollHeight;
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
        //  top: scroll from top to bottom
        //  bottom: scroll from bottom to top
        const dist = {
            top: Math.min(screenTopDist - minRefHeight, context.scrollTop),
            bottom: Math.min(
                screenBottomDist - minRefHeight,
                context.scrollHeight - context.scrollBottom,
            ),
        };
        const windowDist = {
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
        context.flip = (
            allowFlip
            && (
                (
                    position === 'bottom'
                    && context.overflowBottom > 0
                    && (
                        (context.overflowBottom > context.overflowTop)
                        && (dist.top > context.overflowTop)
                    )
                ) || (
                    position === 'top'
                    && context.overflowTop > 0
                    && (
                        (context.overflowTop > context.overflowBottom)
                        && (dist.bottom > context.overflowBottom)
                    )
                )
            )
        );

        if (context.flip) {
            initialTop = this.getInitialTopPosition(context);
        }

        const isTop = this.isTop(context);

        const elemOverflow = (isTop) ? context.overflowTop : context.overflowBottom;
        const refOverflow = (isTop) ? refOverflowBottom : refOverflowTop;
        const isRefOverflow = elemOverflow < 0 && refOverflow > 1;
        const topToBottom = isTop !== isRefOverflow;
        const direction = (topToBottom) ? -1 : 1;

        let overflow = (isRefOverflow) ? refOverflow : elemOverflow;
        if (overflow > 1 && context.scrollAvailable && scrollOnOverflow) {
            const maxDistance = (topToBottom) ? dist.top : dist.bottom;
            const distance = Math.min(overflow, maxDistance) * direction;
            const newScrollTop = scrollParent.scrollTop + distance;

            if ((topToBottom && distance < 0) || (!topToBottom && distance > 0)) {
                overflow -= Math.abs(distance);
            }

            // Scroll window if overflow is not cleared yet
            this.windowScrollDistance = 0;
            if (context.fixedParent && overflow > 1) {
                const maxWindowDistance = (topToBottom) ? windowDist.top : windowDist.bottom;
                this.windowScrollDistance = Math.min(overflow, maxWindowDistance) * direction;
                overflow -= Math.abs(this.windowScrollDistance);
            }
            const newWindowScrollY = window.scrollY + this.windowScrollDistance;
            const scrollAbsolute = context.absoluteParent && overflow > 1;

            scrollParent.scrollTop = newScrollTop;
            if (context.fixedParent && Math.abs(this.windowScrollDistance) > 0) {
                window.scrollTo(window.scrollX, newWindowScrollY);
            } else if (context.absoluteParent && scrollAbsolute) {
                elem.scrollIntoView(isTop);
            }
        }
        // Decrease height of element if overflow is not cleared
        if (overflow > 1 && allowResize) {
            context.height -= overflow;
            style.maxHeight = px(context.height);
            if (isTop) {
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
        if (useRefWidth) {
            style.minWidth = px(reference.width);
            style.width = '';
        }

        const width = elem.offsetWidth;
        const maxWidth = html.clientWidth - (context.screenPadding * 2);
        const minLeft = context.screenPadding - offset.left;

        // Check element wider than screen
        if (width >= maxWidth) {
            style.width = px(maxWidth);
            style.left = px(minLeft);
            return;
        }

        // Check element overflows screen to the right
        // if rendered from the left of reference
        const relLeft = reference.left - offset.left;
        const leftOffset = reference.left - html.scrollLeft;
        if (leftOffset + width <= html.clientWidth - context.screenPadding) {
            style.left = px(relLeft);
            return;
        }

        let left = relLeft + reference.width - width;
        overflow = offset.left + left;
        if (overflow < 0) {
            left -= overflow;
        }

        style.left = px(Math.max(left, minLeft));
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

        if (Math.abs(this.windowScrollDistance) > 0) {
            window.scrollTo(window.scrollX, window.scrollY - this.windowScrollDistance);
            this.windowScrollDistance = 0;
        }
    }
}
