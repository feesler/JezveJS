import { computedStyle, isFunction, px } from '../../js/common.js';

export class PopupPosition {
    static windowScrollDistance = 0;

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

    /** Returns true is offset parent of element has position: absolute */
    static isAbsoluteParent(elem) {
        const parent = elem?.offsetParent;
        if (!parent) {
            return false;
        }

        const style = computedStyle(parent);
        return style?.position === 'absolute';
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
            allowFlip = true,
            scrollOnOverflow = true,
            allowResize = true,
            scrollTimeout = 200,
            minRefHeight = 20,
            onScrollDone = null,
        } = options;

        if (!elem || !refElem) {
            return;
        }

        const { style } = elem;
        const html = document.documentElement;
        const screenHeight = this.getScreenHeight();
        const screenTop = this.getWindowScrollTop();
        const screenBottom = screenTop + screenHeight;
        const fixedParent = this.getFixedParent(elem);
        const absoluteParent = this.isAbsoluteParent(elem);
        const fixedElement = !elem.offsetParent;

        const scrollParent = fixedParent || this.getScrollParent(elem);
        const { scrollTop } = scrollParent;
        const scrollAvailable = scrollParent.scrollHeight >= scrollParent.clientHeight;

        const scrollParentBox = (scrollParent && !fixedElement)
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

        const refScrollParentHeight = Math.min(screenHeight, scrollParentBox.height);
        const refScrollParentTop = Math.max(0, scrollParentBox.top);

        const screenTopDist = refScrollParentHeight - (reference.top - refScrollParentTop);
        const screenBottomDist = reference.bottom - refScrollParentTop;

        const dist = {
            top: Math.min(screenTopDist - minRefHeight, scrollTop),
            bottom: Math.min(screenBottomDist - minRefHeight, scrollHeight - scrollBottom),
        };
        const windowDist = {
            top: windowScrollTop,
            bottom: windowScrollHeight - windowScrollBottom,
        };

        let height = elem.offsetHeight;
        let bottom = reference.bottom + margin + height;
        const minHeight = minRefHeight + margin + screenPadding + height;

        // Check element taller than screen
        if (minHeight > screenHeight && allowResize) {
            height = screenHeight - minRefHeight - screenPadding - margin;
            style.maxHeight = px(height);

            bottom = reference.bottom + margin + height;
        }

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

            if (fixedParent && !fixedElement) {
                initialTop += scrollTop;
            }
        }
        const direction = (flip) ? -1 : 1;

        let waitForScroll = false;
        let overflow = (flip) ? overflowTop : overflowBottom;
        if (overflow > 1 && scrollAvailable && scrollOnOverflow) {
            const maxDistance = (flip) ? dist.top : dist.bottom;
            const distance = Math.min(overflow, maxDistance) * direction;
            const newScrollTop = scrollParent.scrollTop + distance;

            if ((flip && distance < 0) || (!flip && distance > 0)) {
                overflow -= Math.abs(distance);
            }

            // Scroll window if overflow is not cleared yet
            this.windowScrollDistance = 0;
            if (fixedParent && overflow > 1) {
                const maxWindowDistance = (flip) ? windowDist.top : windowDist.bottom;
                this.windowScrollDistance = Math.min(overflow, maxWindowDistance) * direction;
                overflow -= Math.abs(this.windowScrollDistance);
            }
            const newWindowScrollY = window.scrollY + this.windowScrollDistance;
            const scrollAbsolute = absoluteParent && overflow > 1;

            waitForScroll = true;
            setTimeout(() => {
                if (fixedElement || absoluteParent) {
                    style.top = px(initialTop - distance);
                }

                scrollParent.scrollTop = newScrollTop;
                if (fixedParent && Math.abs(this.windowScrollDistance) > 0) {
                    window.scrollTo(window.scrollX, newWindowScrollY);
                } else if (absoluteParent && scrollAbsolute) {
                    elem.scrollIntoView(flip);
                }

                this.notifyScrollDone(onScrollDone);
            }, scrollTimeout);
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

        if (Math.abs(this.windowScrollDistance) > 0) {
            window.scrollTo(window.scrollX, window.scrollY - this.windowScrollDistance);
            this.windowScrollDistance = 0;
        }
    }
}
