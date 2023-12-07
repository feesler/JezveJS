import { computedStyle } from '@jezvejs/dom';

export const topPositions = ['top', 'top-start', 'top-end'];
export const bottomPositions = ['bottom', 'bottom-start', 'bottom-end'];
export const leftPositions = ['left', 'left-start', 'left-end'];
export const rightPositions = ['right', 'right-start', 'right-end'];

/** Find parent element without offsetParent and check it has position: fixed */
export const getFixedParent = (elem) => {
    let parent = elem?.parentNode;
    while (parent?.offsetParent) {
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
 * Returns true if the element is positioned to the top of reference
 * @param {object} state
 * @returns {boolean}
 */
export const isTopPosition = (state) => (
    topPositions.includes(state.position)
);

/**
 * Returns true if the element is positioned to the bottom of reference
 * @param {object} state
 * @returns {boolean}
 */
export const isBottomPosition = (state) => (
    bottomPositions.includes(state.position)
);

/**
 * Returns true if the element is positioned to the left of reference
 * @param {object} state
 * @returns {boolean}
 */
export const isLeftPosition = (state) => (
    leftPositions.includes(state.position)
);

/**
 * Returns true if the element is positioned to the right of reference
 * @param {object} state
 * @returns {boolean}
 */
export const isRightPosition = (state) => (
    rightPositions.includes(state.position)
);

/**
 * Returns true if the element is positioned vertically
 * @param {object} state
 * @returns {boolean}
 */
export const isVertical = (state) => (
    isTopPosition(state) || isBottomPosition(state)
);

/**
 * Returns true if the element is positioned horizontally
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontal = (state) => (
    isLeftPosition(state) || isRightPosition(state)
);

/**
 * Returns true if the element is positioned above the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isTop = (state) => (
    (isTopPosition(state) && !state.flip)
    || (isBottomPosition(state) && state.flip)
);

/**
 * Returns true if the element is positioned below the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isBottom = (state) => (
    (isBottomPosition(state) && !state.flip)
    || (isTopPosition(state) && state.flip)
);

/**
 * Returns true if the element is positioned to the left of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isLeft = (state) => (
    (isLeftPosition(state) && !state.flip)
    || (isRightPosition(state) && state.flip)
);

/**
 * Returns true if the element is positioned to the right of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isRight = (state) => (
    (isRightPosition(state) && !state.flip)
    || (isLeftPosition(state) && state.flip)
);

/**
 * Returns true if the element is vertically positioned to the start of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isVerticalStartPosition = (state) => (
    (state.position === 'left-start' || state.position === 'right-start')
);

/**
 * Returns true if the element is vertically positioned to the center of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isVerticalCenterPosition = (state) => (
    (state.position === 'left' || state.position === 'right')
);

/**
 * Returns true if the element is vertically positioned to the end of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isVerticalEndPosition = (state) => (
    (state.position === 'left-end' || state.position === 'right-end')
);

/**
 * Returns true if the element is vertically positioned to the start of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isVerticalStart = (state) => (
    (isVerticalStartPosition(state) && !state.crossFlip)
    || (isVerticalEndPosition(state) && state.crossFlip)
);

/**
 * Returns true if the element is vertically positioned to the end of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isVerticalEnd = (state) => (
    (isVerticalEndPosition(state) && !state.crossFlip)
    || (isVerticalStartPosition(state) && state.crossFlip)
);

/**
 * Returns true if the element is horizontally positioned to the start of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontalStartPosition = (state) => (
    (state.position === 'top-start' || state.position === 'bottom-start')
);

/**
 * Returns true if the element is horizontally positioned to the center of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontalCenterPosition = (state) => (
    (state.position === 'top' || state.position === 'bottom')
);

/**
 * Returns true if the element is horizontally positioned to the end of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontalEndPosition = (state) => (
    (state.position === 'top-end' || state.position === 'bottom-end')
);

/**
 * Returns true if the element is horizontally positioned to the start of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontalStart = (state) => (
    (isHorizontalStartPosition(state) && !state.crossFlip)
    || (isHorizontalEndPosition(state) && state.crossFlip)
);

/**
 * Returns true if the element is horizontally positioned to the end of the reference
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontalEnd = (state) => (
    (isHorizontalEndPosition(state) && !state.crossFlip)
    || (isHorizontalStartPosition(state) && state.crossFlip)
);

/**
 * Returns true if element should be flipped vertically
 * @param {object} state
 * @returns {boolean}
 */
export const isVerticalFlip = (state) => (
    state.allowFlip && (
        (
            isBottomPosition(state)
            && (state.overflowBottom > 0)
            && (state.overflowBottom > state.overflowTop)
            && (state.dist.top > state.overflowTop)
        ) || (
            isTopPosition(state)
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
            isRightPosition(state)
            && (state.overflowRight > 0)
            && (state.overflowRight > state.overflowLeft)
            && (state.dist.left > state.overflowLeft)
        ) || (
            isLeftPosition(state)
            && (state.overflowLeft > 0)
            && (state.overflowLeft > state.overflowRight)
            && (state.dist.right > state.overflowRight)
        )
    )
);

/**
 * Returns true if element should be flipped vertically around cross axis
 * @param {object} state
 * @returns {boolean}
 */
export const isVerticalCrossFlip = (state) => (
    state.allowFlip && (
        (
            isVerticalStartPosition(state)
            && (state.overflowBottom > 0)
            && (state.overflowBottom > state.overflowTop)
            && (state.dist.top > state.overflowTop)
        ) || (
            isVerticalEndPosition(state)
            && (state.overflowTop > 0)
            && (state.overflowTop > state.overflowBottom)
            && (state.dist.bottom > state.overflowBottom)
        )
    )
);

/**
 * Returns true if element should be flipped horizontally around cross axis
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontalCrossFlip = (state) => (
    state.allowFlip && (
        (
            isHorizontalStartPosition(state)
            && (state.overflowRight > 0)
            && (state.overflowRight > state.overflowLeft)
            && (state.dist.left > state.overflowLeft)
        ) || (
            isHorizontalEndPosition(state)
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
        current,
    } = state;

    let res = 0;

    if (isTop(state)) {
        res = reference.top - offset.top - current.height - state.margin;
    } else if (isBottom(state)) {
        res = reference.bottom - offset.top + state.margin;
    } else if (isLeft(state) || isRight(state)) {
        if (isVerticalCenterPosition(state)) {
            res = reference.top - offset.top + (reference.height - current.height) / 2;
        }
        if (isVerticalStart(state)) {
            res = reference.top - offset.top;
        }
        if (isVerticalEnd(state)) {
            res = reference.top - offset.top - current.height + reference.height;
        }
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
        current,
    } = state;

    let res = 0;

    if (isLeft(state)) {
        res = reference.left - offset.left - current.width - state.margin;
    } else if (isRight(state)) {
        res = reference.right - offset.left + state.margin;
    } else if (isTop(state) || isBottom(state)) {
        if (isHorizontalCenterPosition(state)) {
            res = reference.left - offset.left + (reference.width - current.width) / 2;
        }
        if (isHorizontalStart(state)) {
            res = reference.left - offset.left;
        }
        if (isHorizontalEnd(state)) {
            res = reference.left - offset.left - current.width + reference.width;
        }
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
