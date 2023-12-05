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
 * Returns position and size object for available viewport
 */
export const getScreenRect = () => {
    const res = {
        left: getWindowScrollLeft(),
        top: getWindowScrollTop(),
        width: getScreenWidth(),
        height: getScreenHeight(),
    };
    res.bottom = res.top + res.height;
    res.right = res.left + res.width;

    return res;
};

/**
 * Returns true if the element is positioned vertically
 * @param {object} state
 * @returns {boolean}
 */
export const isVertical = (state) => (
    state.position === 'top' || state.position === 'bottom'
);

/**
 * Returns true if the element is positioned horizontally
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontal = (state) => (
    state.position === 'left' || state.position === 'right'
);

/**
 * Returns true if the element is positioned above the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isTop = (state) => (
    (state.position === 'top' && !state.flip)
    || (state.position === 'bottom' && state.flip)
);

/**
 * Returns true if the element is positioned below the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isBottom = (state) => (
    (state.position === 'bottom' && !state.flip)
    || (state.position === 'top' && state.flip)
);

/**
 * Returns true if the element is positioned to the left of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isLeft = (state) => (
    (state.position === 'left' && !state.flip)
    || (state.position === 'right' && state.flip)
);

/**
 * Returns true if the element is positioned to the right of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isRight = (state) => (
    (state.position === 'right' && !state.flip)
    || (state.position === 'left' && state.flip)
);

/**
 * Returns true if element should be flipped vertically
 * @param {object} state
 * @returns {boolean}
 */
export const isVecticalFlip = (state) => (
    state.allowFlip && (
        (
            state.position === 'bottom'
            && state.overflowBottom > 0
            && (state.overflowBottom > state.overflowTop)
            && (state.dist.top > state.overflowTop)
        ) || (
            state.position === 'top'
            && (state.overflowTop > 0)
            && (state.overflowTop > state.overflowBottom)
            && (state.dist.bottom > state.overflowBottom)
        )
    )
);

/**
 * Returns true if element should be flipped horizontally
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontalFlip = (state) => (
    state.allowFlip && (
        (
            state.position === 'right'
            && (state.overflowRight > 0)
            && (state.overflowRight > state.overflowLeft)
            && (state.dist.left > state.overflowLeft)
        ) || (
            state.position === 'left'
            && (state.overflowLeft > 0)
            && (state.overflowLeft > state.overflowRight)
            && (state.dist.right > state.overflowRight)
        )
    )
);

/**
 * Returns initial vertical position of the element
 * @param {object} state
 * @returns {number}
 */
export const getInitialTopPosition = (state) => {
    const {
        offset,
        reference,
        elem,
    } = state;

    let res = 0;

    if (isTop(state)) {
        res = reference.top - offset.top - state.height - state.margin;
    } else if (isBottom(state)) {
        res = reference.bottom - offset.top + state.margin;
    } else if (isLeft(state) || isRight(state)) {
        res = reference.top - offset.top + (reference.height - state.height) / 2;
    }

    if (
        state.fixedParent
        && state.fixedParent === elem.offsetParent
        && !state.fixedElement
    ) {
        res += state.scrollTop;
    }

    return res;
};

/**
 * Returns initial horizontal position of the element
 * @param {object} state
 * @returns {number}
 */
export const getInitialLeftPosition = (state) => {
    const {
        offset,
        reference,
    } = state;

    let res = 0;

    if (isLeft(state)) {
        res = reference.left - offset.left - state.width - state.margin;
    } else if (isRight(state)) {
        res = reference.right - offset.left + state.margin;
    } else if (isTop(state) || isBottom(state)) {
        res = reference.left - offset.left;
    }

    return res;
};

/**
 * Returns vertical overflow of element
 * @param {object} state
 * @returns {number}
 */
export const getElementVerticalOverflow = (state) => {
    if (isTop(state)) {
        return state.overflowTop;
    }
    if (isBottom(state)) {
        return state.overflowBottom;
    }

    return 0;
};

/**
 * Returns horozontal overflow of element
 * @param {object} state
 * @returns {number}
 */
export const getElementHorizontalOverflow = (state) => {
    if (isLeft(state)) {
        return state.overflowLeft;
    }
    if (isRight(state)) {
        return state.overflowRight;
    }

    return 0;
};
