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
 * Otherwise returns clientWidth of document
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
            && (state.vertOverflowBottom > 0)
            && (state.vertOverflowBottom > state.vertOverflowTop)
            && (state.dist.top > state.vertOverflowTop)
        ) || (
            isTopPosition(state)
            && (state.vertOverflowTop > 0)
            && (state.vertOverflowTop > state.vertOverflowBottom)
            && (state.dist.bottom > state.vertOverflowBottom)
        )
    )
);

/**
 * Returns true if element should be flipped horizontally
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontalFlip = (state) => (
    state.allowHorizontalFlip && (
        (
            isRightPosition(state)
            && (state.horOverflowRight > 0)
            && (state.horOverflowRight > state.horOverflowLeft)
            && (state.dist.left > state.horOverflowLeft)
        ) || (
            isLeftPosition(state)
            && (state.horOverflowLeft > 0)
            && (state.horOverflowLeft > state.horOverflowRight)
            && (state.dist.right > state.horOverflowRight)
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
            && (state.horOverflowBottom > 0)
            && (state.horOverflowBottom > state.horOverflowTop)
            && (state.dist.top > state.horOverflowTop)
        ) || (
            isVerticalEndPosition(state)
            && (state.horOverflowTop > 0)
            && (state.horOverflowTop > state.horOverflowBottom)
            && (state.dist.bottom > state.horOverflowBottom)
        )
    )
);

/**
 * Returns true if element should be flipped horizontally around cross axis
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontalCrossFlip = (state) => (
    state.allowHorizontalFlip && (
        (
            isHorizontalStartPosition(state)
            && (state.vertOverflowRight > 0)
            && (state.vertOverflowRight > state.vertOverflowLeft)
            && (state.dist.left > state.vertOverflowLeft)
        ) || (
            isHorizontalEndPosition(state)
            && (state.vertOverflowLeft > 0)
            && (state.vertOverflowLeft > state.vertOverflowRight)
            && (state.dist.right > state.vertOverflowRight)
        )
    )
);

/**
 * Returns minimal horizontal overflow
 * @param {object} state
 * @returns {number}
 */
export const minHorOverflow = (state) => (
    Math.min(state.horOverflowLeft, state.horOverflowRight)
);

/**
 * Returns minimal vertical overflow
 * @param {object} state
 * @returns {number}
 */
export const minVertOverflow = (state) => (
    Math.min(state.vertOverflowTop, state.vertOverflowBottom)
);

/**
 * Returns true if main axis should be changed from vertical to horizontal
 * @param {object} state
 * @returns {boolean}
 */
export const isVerticalToHorizontalAxisChange = (state) => (
    state.allowChangeAxis
    && isVertical(state)
    && (state.vertOverflowTop > 0)
    && (state.vertOverflowBottom > 0)
    && (minHorOverflow(state) < minVertOverflow(state))
);

/**
 * Returns true if main axis should be changed from horizontal to vertical
 * @param {object} state
 * @returns {boolean}
 */
export const isHorizontalToVerticalAxisChange = (state) => (
    state.allowChangeAxis
    && isHorizontal(state)
    && (state.horOverflowLeft > 0)
    && (state.horOverflowRight > 0)
    && (minVertOverflow(state) < minHorOverflow(state))
);

/**
 * Changes main axis from vertical to horizontal and returns new position
 * @param {object} state
 * @returns {string}
 */
export const changeAxisToHorizontal = (state) => {
    const toRight = (state.horOverflowLeft > state.horOverflowRight);

    if (isHorizontalCenterPosition(state)) {
        return (toRight) ? 'right' : 'left';
    }
    if (isHorizontalStartPosition(state)) {
        return (toRight) ? 'right-start' : 'left-start';
    }
    if (isHorizontalEndPosition(state)) {
        return (toRight) ? 'right-end' : 'left-end';
    }

    return state.position;
};

/**
 * Changes main axis from horizontal to vertical and returns new position
 * @param {object} state
 * @returns {string}
 */
export const changeAxisToVertical = (state) => {
    const toBottom = (state.vertOverflowTop > state.vertOverflowBottom);

    if (isVerticalCenterPosition(state)) {
        return (toBottom) ? 'bottom' : 'top';
    }
    if (isVerticalStartPosition(state)) {
        return (toBottom) ? 'bottom-start' : 'top-start';
    }
    if (isVerticalEndPosition(state)) {
        return (toBottom) ? 'bottom-end' : 'top-end';
    }

    return state.position;
};

/**
 * Returns initial vertical position of the element
 * @param {object} state
 * @returns {number}
 */
export const getInitialTopPosition = (state) => {
    const {
        offset,
        reference,
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
        && state.fixedParent === state.elem.offsetParent
        && !state.fixedElement
    ) {
        res += state.fixedParent.scrollTop;
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

    if (
        state.fixedParent
        && state.fixedParent === state.elem.offsetParent
        && !state.fixedElement
    ) {
        res += state.fixedParent.scrollLeft;
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
        return state.vertOverflowTop;
    }
    if (isBottom(state)) {
        return state.vertOverflowBottom;
    }
    if (isVerticalEnd(state)) {
        return state.horOverflowTop;
    }
    if (isVerticalStart(state)) {
        return state.horOverflowBottom;
    }

    return Math.max(0, state.horOverflowTop, state.horOverflowBottom);
};

/**
 * Returns horozontal overflow of element
 * @param {object} state
 * @returns {number}
 */
export const getElementHorizontalOverflow = (state) => {
    if (isLeft(state)) {
        return state.horOverflowLeft;
    }
    if (isRight(state)) {
        return state.horOverflowRight;
    }
    if (isHorizontalEnd(state)) {
        return state.vertOverflowLeft;
    }
    if (isHorizontalStart(state)) {
        return state.vertOverflowRight;
    }

    return Math.max(0, state.vertOverflowLeft, state.vertOverflowRight);
};

/**
 * Returns left overflow for specified position and state
 * @param {number} left
 * @param {object} state
 * @returns {number}
 */
export const getLeftOverflow = (left, state) => (
    -(left - state.screenPadding)
);

/**
 * Returns right overflow for specified position and state
 * @param {number} right
 * @param {object} state
 * @returns {number}
 */
export const getRightOverflow = (right, state) => (
    right - state.screen.width + state.screenPadding
);

/**
 * Returns top overflow for specified position and state
 * @param {number} top
 * @param {object} state
 * @returns {number}
 */
export const getTopOverflow = (top, state) => (
    -(top - state.screenPadding)
);

/**
 * Returns bottom overflow for specified position and state
 * @param {number} bottom
 * @param {object} state
 * @returns {number}
 */
export const getBottomOverflow = (bottom, state) => (
    bottom - state.screen.height + state.bottomSafe
);
