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

    /** Calculate height, vertical and horizontal offset of popup element */
    static calculate(options) {
        const {
            elem,
            refElem,
            update = false,
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
        const screenHeight = getScreenHeight();
        const screenTop = getWindowScrollTop();
        const screenBottom = screenTop + screenHeight;
        const fixedParent = getFixedParent(elem);
        const absoluteParent = isAbsoluteParent(elem);
        const fixedElement = !elem.offsetParent;

        const scrollParent = fixedParent || getScrollParent(elem);
        const { scrollTop } = scrollParent;
        const scrollAvailable = scrollParent.scrollHeight >= scrollParent.clientHeight;

        const scrollParentBox = (scrollParent && !fixedElement)
            ? scrollParent.getBoundingClientRect()
            : { top: 0, left: 0, height: screenHeight };

        const offset = (fixedElement)
            ? { top: 0, left: 0, height: screenHeight }
            : elem.offsetParent.getBoundingClientRect();

        const reference = refElem.getBoundingClientRect();

        const bottomSafe = (screenHeight - html.clientHeight > 50)
            ? bottomSafeArea
            : 0;

        // Vertical offset

        // Initial set vertical position used in further calculations
        let initialTop = reference.bottom - offset.top + margin;
        if (fixedParent && fixedParent === elem.offsetParent && !fixedElement) {
            initialTop += scrollTop;
        }
        style.top = px(0);
        transform(elem, `translateY(${px(initialTop)})`);

        const scrollHeight = (scrollAvailable) ? scrollParent.scrollHeight : screenBottom;

        const windowScrollTop = (fixedParent) ? scrollTop : screenTop;
        const windowScrollHeight = (fixedParent) ? scrollHeight : html.scrollHeight;
        const windowScrollBottom = windowScrollTop + screenHeight;

        const refScrollParentHeight = Math.min(screenHeight, scrollParentBox.height);
        const refScrollParentTop = Math.max(0, scrollParentBox.top);
        const scrollBottom = scrollTop + refScrollParentHeight;

        const refScrollTop = reference.top - refScrollParentTop;

        const screenTopDist = refScrollParentHeight - refScrollTop;
        const screenBottomDist = reference.bottom - refScrollParentTop;

        // Maximum scroll distance inside scroll parent:
        //  top: scroll from top to bottom
        //  bottom: scroll from bottom to top
        const dist = {
            top: Math.min(screenTopDist - minRefHeight, scrollTop),
            bottom: Math.min(screenBottomDist - minRefHeight, scrollHeight - scrollBottom),
        };
        const windowDist = {
            top: windowScrollTop,
            bottom: windowScrollHeight - windowScrollBottom,
        };

        let height = elem.offsetHeight;
        let bottom = reference.bottom + margin + height + bottomSafe;
        const minHeight = minRefHeight + margin + screenPadding + height;

        // Check element taller than screen
        if (minHeight > screenHeight && allowResize) {
            height = screenHeight - minRefHeight - screenPadding - margin;
            style.maxHeight = px(height);

            bottom = reference.bottom + margin + height + bottomSafe;
        }

        const refOverflowTop = -refScrollTop;
        const refOverflowBottom = reference.bottom - screenHeight;

        const top = reference.top - height - margin - screenPadding;
        const overflowBottom = bottom - screenHeight;
        const overflowTop = -top;

        const flip = (
            allowFlip
            && overflowBottom > 0
            && (
                (overflowBottom > overflowTop)
                && (dist.top > overflowTop)
            )
        );

        if (flip) {
            initialTop = reference.top - offset.top - height - margin;

            if (fixedParent && fixedParent === elem.offsetParent && !fixedElement) {
                initialTop += scrollTop;
            }
        }

        const elemOverflow = (flip) ? overflowTop : overflowBottom;
        const refOverflow = (flip) ? refOverflowBottom : refOverflowTop;
        const isRefOverflow = elemOverflow < 0 && refOverflow > 1;
        const topToBottom = flip !== isRefOverflow;
        const direction = (topToBottom) ? -1 : 1;

        let overflow = (isRefOverflow) ? refOverflow : elemOverflow;
        if (overflow > 1 && scrollAvailable && scrollOnOverflow) {
            const maxDistance = (topToBottom) ? dist.top : dist.bottom;
            const distance = Math.min(overflow, maxDistance) * direction;
            const newScrollTop = scrollParent.scrollTop + distance;

            if ((topToBottom && distance < 0) || (!topToBottom && distance > 0)) {
                overflow -= Math.abs(distance);
            }

            // Scroll window if overflow is not cleared yet
            this.windowScrollDistance = 0;
            if (fixedParent && overflow > 1) {
                const maxWindowDistance = (topToBottom) ? windowDist.top : windowDist.bottom;
                this.windowScrollDistance = Math.min(overflow, maxWindowDistance) * direction;
                overflow -= Math.abs(this.windowScrollDistance);
            }
            const newWindowScrollY = window.scrollY + this.windowScrollDistance;
            const scrollAbsolute = absoluteParent && overflow > 1;

            scrollParent.scrollTop = newScrollTop;
            if (fixedParent && Math.abs(this.windowScrollDistance) > 0) {
                window.scrollTo(window.scrollX, newWindowScrollY);
            } else if (absoluteParent && scrollAbsolute) {
                elem.scrollIntoView(flip);
            }
        }
        // Decrease height of element if overflow is not cleared
        if (overflow > 1 && allowResize) {
            height -= overflow;
            style.maxHeight = px(height);
            if (flip) {
                initialTop += overflow;
            }
        }
        if (flip) {
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
        const maxWidth = html.clientWidth - (screenPadding * 2);
        const minLeft = screenPadding - offset.left;

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
        if (leftOffset + width <= html.clientWidth - screenPadding) {
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
