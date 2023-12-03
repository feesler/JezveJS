import { computedStyle } from '@jezvejs/dom';

/** Find parent element without offsetParent and check it has position: fixed */
export const getFixedParent = (elem) => {
    let parent = elem?.parentNode;
    while (parent.offsetParent) {
        parent = parent.offsetParent;
    }

    const style = computedStyle(parent);
    const isFixed = style?.position === 'fixed';
    return (isFixed) ? parent : null;
};

/** Returns true is offset parent of element has position: absolute */
export const isAbsoluteParent = (elem) => {
    const parent = elem?.offsetParent;
    if (!parent) {
        return false;
    }

    const style = computedStyle(parent);
    return style?.position === 'absolute';
};

/** Returns scrolling container of element */
export const getScrollParent = (elem) => {
    let node = elem?.parentNode;
    while (node && node.nodeType !== 9) {
        const style = computedStyle(node);
        const overflow = style?.overflowY ?? 'visible';
        const isScrollable = !overflow.startsWith('visible') && !overflow.startsWith('hidden');
        if (isScrollable && node.scrollHeight > node.clientHeight) {
            return node;
        }

        node = node.parentNode;
    }

    return document.scrollingElement || document.body;
};

/**
 * Returns height of visualViewport if possible
 * Otherwise returns clientHeight of document
 */
export const getScreenHeight = () => {
    const { clientHeight } = document.documentElement;
    if (!window.visualViewport) {
        return clientHeight;
    }

    return window.visualViewport.height;
};

/**
 * Returns current vertical scroll of document
 */
export const getWindowScrollTop = () => {
    const { body } = document;
    const { scrollTop } = document.documentElement;
    return window.pageYOffset || scrollTop || body.scrollTop;
};
