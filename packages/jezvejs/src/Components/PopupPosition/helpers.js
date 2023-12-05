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
 * Returns width of visualViewport if possible
 * Otherwise returns clientHeight of document
 */
export const getScreenWidth = () => {
    const { clientWidth } = document.documentElement;
    if (!window.visualViewport) {
        return clientWidth;
    }

    return window.visualViewport.width;
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
 * Returns current horizontal scroll of document
 */
export const getWindowScrollLeft = () => {
    const { body } = document;
    const { scrollLeft } = document.documentElement;
    return window.pageXOffset || scrollLeft || body.scrollLeft;
};

/**
 * Returns current vertical scroll of document
 */
export const getWindowScrollTop = () => {
    const { body } = document;
    const { scrollTop } = document.documentElement;
    return window.pageYOffset || scrollTop || body.scrollTop;
};

/**
 * Returns true if the element is positioned vertically
 * @param {object} context
 * @returns {boolean}
 */
export const isVertical = (context) => (
    context.position === 'top' || context.position === 'bottom'
);

/**
 * Returns true if the element is positioned horizontally
 * @param {object} context
 * @returns {boolean}
 */
export const isHorizontal = (context) => (
    context.position === 'left' || context.position === 'right'
);

/**
 * Returns true if the element is positioned above the reference
 * @param {object} context
 * @returns {boolean}
 */
export const isTop = (context) => (
    (context.position === 'top' && !context.flip)
    || (context.position === 'bottom' && context.flip)
);

/**
 * Returns true if the element is positioned below the reference
 * @param {object} context
 * @returns {boolean}
 */
export const isBottom = (context) => (
    (context.position === 'bottom' && !context.flip)
    || (context.position === 'top' && context.flip)
);

/**
 * Returns true if the element is positioned to the left of the reference
 * @param {object} context
 * @returns {boolean}
 */
export const isLeft = (context) => (
    (context.position === 'left' && !context.flip)
    || (context.position === 'right' && context.flip)
);

/**
 * Returns true if the element is positioned to the right of the reference
 * @param {object} context
 * @returns {boolean}
 */
export const isRight = (context) => (
    (context.position === 'right' && !context.flip)
    || (context.position === 'left' && context.flip)
);

/**
 * Returns true if element should be flipped vertically
 * @param {object} context
 * @returns {boolean}
 */
export const isVecticalFlip = (context) => (
    context.allowFlip && (
        (
            context.position === 'bottom'
            && context.overflowBottom > 0
            && (context.overflowBottom > context.overflowTop)
            && (context.dist.top > context.overflowTop)
        ) || (
            context.position === 'top'
            && (context.overflowTop > 0)
            && (context.overflowTop > context.overflowBottom)
            && (context.dist.bottom > context.overflowBottom)
        )
    )
);

/**
 * Returns true if element should be flipped horizontally
 * @param {object} context
 * @returns {boolean}
 */
export const isHorizontalFlip = (context) => (
    context.allowFlip && (
        (
            context.position === 'right'
            && (context.overflowRight > 0)
            && (context.overflowRight > context.overflowLeft)
            && (context.dist.left > context.overflowLeft)
        ) || (
            context.position === 'left'
            && (context.overflowLeft > 0)
            && (context.overflowLeft > context.overflowRight)
            && (context.dist.right > context.overflowRight)
        )
    )
);

/**
 * Returns initial vertical position of the element
 * @param {object} context
 * @returns {number}
 */
export const getInitialTopPosition = (context) => {
    const {
        offset,
        reference,
        elem,
    } = context;

    let res = 0;

    if (isTop(context)) {
        res = reference.top - offset.top - context.height - context.margin;
    } else if (isBottom(context)) {
        res = reference.bottom - offset.top + context.margin;
    } else if (isLeft(context) || isRight(context)) {
        res = reference.top - offset.top + (reference.height - context.height) / 2;
    }

    if (
        context.fixedParent
        && context.fixedParent === elem.offsetParent
        && !context.fixedElement
    ) {
        res += context.scrollTop;
    }

    return res;
};

/**
 * Returns initial horizontal position of the element
 * @param {object} context
 * @returns {number}
 */
export const getInitialLeftPosition = (context) => {
    const {
        offset,
        reference,
    } = context;

    let res = 0;

    if (isLeft(context)) {
        res = reference.left - offset.left - context.width - context.margin;
    } else if (isRight(context)) {
        res = reference.right - offset.left + context.margin;
    } else if (isTop(context) || isBottom(context)) {
        res = reference.left - offset.left;
    }

    return res;
};
