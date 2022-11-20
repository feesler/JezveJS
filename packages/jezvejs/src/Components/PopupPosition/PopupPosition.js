import { computedStyle, getOffset, px } from '../../js/common.js';

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

    /** Calculate height, vertical and horizontal offset of popup element */
    static calculate({
        elem,
        refElem,
        margin = 0,
        screenPadding = 0,
        useRefWidth = false,
    }) {
        if (!elem || !refElem) {
            return;
        }

        const { style } = elem;
        const html = document.documentElement;
        const screenTop = html.scrollTop;
        const screenBottom = screenTop + html.clientHeight;
        const scrollAvailable = !this.isInsideFixedContainer(elem);

        const offset = (elem.offsetParent)
            ? getOffset(elem.offsetParent)
            : { top: screenTop, left: html.scrollLeft };

        const container = getOffset(refElem);
        container.width = refElem.offsetWidth;
        container.height = refElem.offsetHeight;

        // Vertical offset

        // Initial set vertical position used in further calculations
        style.top = px(
            container.top - offset.top + container.height + margin,
        );

        const scrollHeight = (scrollAvailable) ? html.scrollHeight : screenBottom;
        let height = elem.offsetHeight;
        let totalHeight = container.height + margin + screenPadding + height;
        let bottom = container.top + totalHeight;

        // Check element taller than screen
        if (totalHeight > html.clientHeight) {
            height = html.clientHeight - container.height - (screenPadding + margin);
            style.height = px(height);

            totalHeight = container.height + margin + screenPadding + height;
            bottom = container.top + totalHeight;
        }

        const top = container.top - height - margin - screenPadding;
        const topSpace = container.top - screenTop;
        const bottomSpace = screenBottom - container.top + container.height;
        const topScrollSpace = container.top;
        const bottomScrollSpace = scrollHeight - container.top + container.height;

        const flip = (
            bottom > scrollHeight
            && (
                (scrollAvailable && topScrollSpace > bottomScrollSpace)
                || (!scrollAvailable && topSpace > bottomSpace)
            )
        );

        let overflow = (flip) ? (screenTop - top) : (bottom - screenBottom);
        if (overflow > 0 && scrollAvailable) {
            const maxDistance = (flip) ? screenTop : (scrollHeight - screenBottom);
            const distance = Math.min(overflow, maxDistance);
            html.scrollTop += distance;
            overflow -= distance;
        }
        if (overflow > 0) {
            height -= overflow;
            style.height = px(height);
        }
        if (flip) {
            style.top = px(container.top - offset.top - height - margin);
        }

        // Horizontal offset
        if (useRefWidth) {
            style.minWidth = px(container.width);
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
        // if rendered from the left of container
        const relLeft = container.left - offset.left;
        const leftOffset = container.left - html.scrollLeft;
        if (leftOffset + width <= html.clientWidth) {
            style.left = px(relLeft);
            return;
        }

        const left = relLeft + container.width - width;
        overflow = offset.left + left;
        if (overflow < 0) {
            style.left = px(left - overflow);
        } else {
            style.left = px(left);
        }
    }
}
