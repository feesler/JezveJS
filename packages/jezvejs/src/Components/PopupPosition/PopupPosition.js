import { computedStyle, isFunction, px } from '../../js/common.js';

export class PopupPosition {
    /** Find parent element without offsetParent and check it has position: fixed */
    static isInsideFixedContainer(elem) {
        let parent = elem;
        while (parent.offsetParent) {
            parent = parent.offsetParent;
        }

        const style = computedStyle(parent);
        return style?.position === 'fixed';
    }

    static getScrollParent(elem) {
        let node = elem;
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
        const screenTop = scrollParent.scrollTop;
        const screenBottom = screenTop + screenHeight;
        const fixedParent = this.isInsideFixedContainer(refElem);

        const scrollParentBox = (scrollParent)
            ? scrollParent.getBoundingClientRect()
            : { top: 0, left: 0, height: screenHeight };

        const offset = (elem.offsetParent)
            ? elem.offsetParent.getBoundingClientRect()
            : { top: 0, left: 0 };

        const reference = refElem.getBoundingClientRect();

        // Vertical offset

        // Initial set vertical position used in further calculations
        let initialTop = reference.bottom - offset.top + margin;
        style.top = px(initialTop);

        const scrollHeight = (scrollAvailable) ? scrollParent.scrollHeight : screenBottom;
        const { scrollTop } = scrollParent;
        const scrollBottom = scrollTop + scrollParentBox.height;

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
        const topScrollSpace = refInScrollParent.top;
        const bottomScrollSpace = scrollHeight - refInScrollParent.bottom;

        const flip = (
            bottom > screenHeight
            && (
                (topSpace > bottomSpace)
                || (scrollAvailable && topScrollSpace > bottomScrollSpace)
            )
        );

        if (flip) {
            initialTop = reference.top - offset.top - height - margin;
        }

        let overflow = (flip) ? (-top) : (bottom - screenHeight);
        if (overflow > 0 && scrollAvailable) {
            const maxDistance = (flip) ? scrollTop : (scrollHeight - scrollBottom);
            const distance = Math.min(overflow, maxDistance) * ((flip) ? -1 : 1);
            const newScrollTop = scrollParent.scrollTop + distance;
            setTimeout(() => {
                if (!elem.offsetParent) {
                    style.top = px(initialTop - distance);
                }

                scrollParent.scrollTop = newScrollTop;
                if (fixedParent) {
                    window.scrollTo(window.scrollX, window.scrollY + distance);
                }

                if (isFunction(onScrollDone)) {
                    onScrollDone();
                }
            }, scrollTimeout);
            overflow -= distance;
        } else if (isFunction(onScrollDone)) {
            onScrollDone();
        }
        if (overflow > 0) {
            height -= overflow;
            style.maxHeight = px(height);
        }
        if (flip) {
            style.top = px(initialTop);
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
}
