import { computedStyle, isFunction, px } from '../../js/common.js';

export class PopupPosition {
    /** Find parent element without offsetParent and check it has position: fixed */
    static getFixedParent(elem) {
        let parent = elem;
        while (parent.offsetParent) {
            parent = parent.offsetParent;
        }

        const style = computedStyle(parent);
        const isFixed = style?.position === 'fixed';
        return (isFixed) ? parent : null;
    }

    static getScrollParent(elem) {
        let node = elem?.parentNode;
        while (node && node.nodeType !== 9) {
            const style = computedStyle(node);
            const overflow = style?.overflowY ?? 'visible';
            const isScrollable = !overflow.startsWith('visible') && !overflow.startsWith('hidden');
            if (isScrollable && node.scrollHeight >= node.clientHeight) {
                return node;
            }

            node = node.parentNode;
        }

        return document.scrollingElement || document.body;
    }

    /**
     * Returns height of visualViewport if possible
     * Otherwise returns clientHeight of document
     */
    static getScreenHeight() {
        const { clientHeight } = document.documentElement;
        if (!window.visualViewport) {
            return clientHeight;
        }

        return Math.min(clientHeight, window.visualViewport.height);
    }

    static getWindowScrollTop() {
        const { body } = document;
        const { scrollTop } = document.documentElement;
        return window.pageYOffset || scrollTop || body.scrollTop;
    }

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
            margin = 0,
            screenPadding = 0,
            useRefWidth = false,
            scrollTimeout = 200,
            onScrollDone = null,
        } = options;

        if (!elem || !refElem) {
            return;
        }

        const { style } = elem;
        const padding = screenPadding * 2;
        const html = document.documentElement;
        const screenHeight = this.getScreenHeight();
        const scrollParent = this.getScrollParent(elem);
        const scrollAvailable = scrollParent.scrollHeight >= scrollParent.clientHeight;
        const { scrollTop } = scrollParent;
        const screenTop = this.getWindowScrollTop();
        const screenBottom = screenTop + screenHeight;
        const fixedParent = this.getFixedParent(refElem);
        const fixedElement = !elem.offsetParent;

        const scrollParentBox = (scrollParent)
            ? scrollParent.getBoundingClientRect()
            : { top: 0, left: 0, height: screenHeight };

        const offset = (fixedElement)
            ? { top: 0, left: 0 }
            : elem.offsetParent.getBoundingClientRect();

        const reference = refElem.getBoundingClientRect();

        // Vertical offset

        // Initial set vertical position used in further calculations
        let initialTop = reference.bottom - offset.top + margin;
        if (fixedParent && !fixedElement) {
            initialTop += scrollTop;
        }
        style.top = px(initialTop);

        const scrollHeight = (scrollAvailable) ? scrollParent.scrollHeight : screenBottom;
        const scrollBottom = scrollTop + scrollParentBox.height;

        const windowScrollTop = (fixedParent) ? scrollTop : screenTop;
        const windowScrollHeight = (fixedParent) ? scrollHeight : html.scrollHeight;
        const windowScrollBottom = windowScrollTop + screenHeight;

        const dist = {
            top: scrollTop,
            bottom: scrollHeight - scrollBottom,
        };
        const windowDist = {
            top: windowScrollTop,
            bottom: windowScrollHeight - windowScrollBottom,
        };
        const refInScrollParent = {
            top: scrollTop + reference.top - scrollParentBox.top,
            bottom: scrollTop + reference.bottom - scrollParentBox.top,
        };

        let height = elem.offsetHeight;
        let totalHeight = reference.height + margin + padding + height;
        let bottom = reference.top + totalHeight - screenPadding;

        // Check element taller than screen
        if (totalHeight > screenHeight) {
            height = screenHeight - reference.height - (padding + margin);
            style.maxHeight = px(height);

            totalHeight = reference.height + margin + padding + height;
            bottom = reference.top + totalHeight - screenPadding;
        }

        const top = reference.top - height - margin - screenPadding;
        const topSpace = reference.top;
        const bottomSpace = screenHeight - reference.bottom;
        const topScrollSpace = (scrollAvailable) ? refInScrollParent.top : 0;
        const bottomScrollSpace = (scrollAvailable)
            ? (scrollHeight - refInScrollParent.bottom)
            : 0;

        const overflowBottom = bottom - screenHeight;
        const overflowTop = -top;
        const flip = (
            overflowBottom > 0
            && (
                (overflowBottom > overflowTop)
                && (topSpace + topScrollSpace > bottomSpace + bottomScrollSpace)
            )
        );

        if (flip) {
            initialTop = reference.top - offset.top - height - margin;
        }

        let waitForScroll = false;
        let overflow = (flip) ? overflowTop : overflowBottom;
        if (overflow > 0 && scrollAvailable) {
            const maxDistance = (flip) ? dist.top : dist.bottom;
            const distance = Math.min(overflow, maxDistance) * ((flip) ? -1 : 1);
            const newScrollTop = scrollParent.scrollTop + distance;

            if ((flip && distance < 0) || (!flip && distance > 0)) {
                overflow -= Math.abs(distance);
            }

            // Scroll window if overflow is not cleared yet
            let windowDistance = distance;
            if (overflow > 0) {
                const maxWindowDistance = (flip) ? windowDist.top : windowDist.bottom;
                windowDistance = Math.min(overflow, maxWindowDistance) * ((flip) ? -1 : 1);
                overflow -= Math.abs(windowDistance);
            }
            const newWindowScrollY = window.scrollY + windowDistance;

            waitForScroll = true;
            setTimeout(() => {
                if (!elem.offsetParent) {
                    style.top = px(initialTop - distance);
                }

                scrollParent.scrollTop = newScrollTop;
                if (fixedParent) {
                    window.scrollTo(window.scrollX, newWindowScrollY);
                }

                this.notifyScrollDone(onScrollDone);
            }, scrollTimeout);
        }
        // Decrease height of element if overflow is not cleared
        if (overflow > 0) {
            height -= overflow;
            style.maxHeight = px(height);
            if (flip) {
                initialTop += overflow;
            }
        }
        if (flip) {
            style.top = px(initialTop);
        }

        if (!waitForScroll) {
            this.notifyScrollDone(onScrollDone);
        }

        // Horizontal offset
        if (useRefWidth) {
            style.minWidth = px(reference.width);
            style.width = '';
        }

        // Check element wider than screen
        const width = elem.offsetWidth;
        if (width >= html.clientWidth) {
            style.width = px(html.clientWidth);
            style.left = px(0);
            return;
        }

        // Check element overflows screen to the right
        // if rendered from the left of reference
        const relLeft = reference.left - offset.left;
        const leftOffset = reference.left - html.scrollLeft;
        if (leftOffset + width <= html.clientWidth) {
            style.left = px(relLeft);
            return;
        }

        const left = relLeft + reference.width - width;
        overflow = offset.left + left;
        if (overflow < 0) {
            style.left = px(left - overflow);
        } else {
            style.left = px(left);
        }
    }

    /* Reset previously applied style properties of element */
    static reset(elem) {
        if (!elem) {
            return;
        }

        const { style } = elem;
        style.top = '';
        style.left = '';
        style.minWidth = '';
        style.width = '';
        style.maxHeight = '';
    }
}
