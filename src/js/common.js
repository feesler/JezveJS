/* eslint no-restricted-globals: "off" */
/* eslint no-bitwise: "off" */

/** Return DOM element by id */
export const ge = (id) => document.getElementById(id);

/** Check parameter is date */
export const isDate = (obj) => (
    obj instanceof Date && !Number.isNaN(obj.valueOf())
);

/** Check parameter is function */
export const isFunction = (obj) => (
    obj
    && (
        Object.prototype.toString.call(obj) === '[object Function]'
        || typeof obj === 'function'
    )
);

/** Check parameter is instance of Object */
export const isObject = (obj) => (
    obj !== null
    && typeof obj === 'object'
    && Object.prototype.toString.call(obj) === '[object Object]'
);

/** Return deep copy of object */
export const copyObject = (item) => {
    if (Array.isArray(item)) {
        return item.map(copyObject);
    }

    if (isObject(item)) {
        const res = {};

        Object.keys(item).forEach((key) => {
            res[key] = copyObject(item[key]);
        });

        return res;
    }

    return item;
};

/** Returns parameter if it is array, else wrap value to array */
export const asArray = (value) => {
    if (value === null || value === undefined) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
};

/* eslint-disable no-param-reassign */
/**
 * Assign properties from second object to first
 * @param {*} obj - object to assign properties to
 * @param {*} params - object to obtain properties from
 */
export const setParam = (obj, params) => {
    if (!obj || !params || typeof params !== 'object') {
        return;
    }

    Object.keys(params).forEach((key) => {
        const val = params[key];
        if (Array.isArray(val)) {
            obj[key] = val.map((item) => item);
        } else if (isObject(val)) {
            if (obj[key] === null || typeof obj[key] === 'undefined') {
                obj[key] = {};
            }

            setParam(obj[key], val);
        } else {
            try {
                obj[key] = val;
            } catch (e) {
                if (obj.setAttribute) {
                    obj.setAttribute(key, val);
                }
            }
        }
    });
};
/* eslint-enable no-param-reassign */

/**
 * Assign properties from second object to first
 * @param {Object} obj - object to assign properties to
 * @param {Object} props - object to obtain properties from
 */
export const setProps = (obj, props) => {
    if (!obj || !props || typeof props !== 'object') {
        return;
    }

    const res = obj;
    Object.keys(props).forEach((key) => {
        const val = props[key];
        if (Array.isArray(val)) {
            res[key] = val.map((item) => item);
        } else if (isObject(val)) {
            if (res[key] === null || typeof res[key] === 'undefined') {
                res[key] = {};
            }

            setProps(res[key], val);
        } else {
            res[key] = val;
        }
    });
};

/** Set attributes to specified element */
export const setAttributes = (element, attrs) => {
    if (!element || !isObject(attrs)) {
        return;
    }

    Object.keys(attrs).forEach((key) => {
        element.setAttribute(key, attrs[key]);
    });
};

/**
 * Append child to specified element
 * @param {Element} elem - element to append child to
 * @param {Element[]} childs - element or array of elements to append
 */
export const addChilds = (elem, childs) => {
    if (!elem || !childs) {
        return;
    }

    const children = asArray(childs);
    elem.append(...children);
};

/**
 * Set up event handlers for specified element
 * @param {Element} elem - element to set event handlers
 * @param {Object} events - event handlers object
 */
export const setEvents = (elem, events) => {
    if (!elem || !events) {
        return;
    }

    Object.keys(events).forEach((eventName) => {
        elem.addEventListener(eventName, events[eventName]);
    });
};

/**
 * Remove event handlers from specified element
 * @param {Element} elem - element to remove event handlers from
 * @param {Object} events - event handlers object
 */
export const removeEvents = (elem, events) => {
    if (!elem || !events) {
        return;
    }

    Object.keys(events).forEach((eventName) => {
        elem.removeEventListener(eventName, events[eventName]);
    });
};

/**
 * Create specified DOM element and set parameters if specified
 * @param {string} tagName - tag name of element to create
 * @param {Object} params - properties to set for created element
 * @param {Element[]} children - element or array of elements to append to created element
 * @param {Object} events - event handlers object
 */
export const ce = (tagName, params, children, events) => {
    if (typeof tagName !== 'string') {
        return null;
    }

    const elem = document.createElement(tagName);
    if (!elem) {
        return null;
    }

    if (params) {
        setParam(elem, params);
    }
    if (children) {
        addChilds(elem, children);
    }
    if (events) {
        setEvents(elem, events);
    }

    return elem;
};

/**
 * Create specified DOM element and set parameters if specified
 * @param {string} tagName - tag name of element to create
 * @param {Object} options
 * @param {Object} options.attrs - attributes to set for created element
 * @param {Object} options.props - properties to set for created element
 * @param {Element[]} options.children - element or array of elements to append to created element
 * @param {Object} options.events - event handlers object
 */
export const createElement = (tagName, options = {}) => {
    if (typeof tagName !== 'string') {
        return null;
    }

    const elem = document.createElement(tagName);
    if (!elem) {
        return null;
    }

    if (options?.props) {
        setProps(elem, options?.props);
    }
    if (options?.attrs) {
        setAttributes(elem, options.attrs);
    }
    if (options?.children) {
        addChilds(elem, options?.children);
    }
    if (options?.events) {
        setEvents(elem, options.events);
    }

    return elem;
};

/**
 * Create new SVG namespace element, set attributes
 * @param {string} tagName
 * @param {Object} attributes
 * @param {Element[]} children
 * @param {Object} events - event handlers object
 */
export const svg = (tagName, attributes, children, events) => {
    if (typeof tagName !== 'string') {
        return null;
    }

    const elem = document.createElementNS('http://www.w3.org/2000/svg', tagName);

    if (attributes) {
        setAttributes(elem, attributes);
    }
    if (children) {
        addChilds(elem, children);
    }
    if (events) {
        setEvents(elem, events);
    }

    return elem;
};

/** Remove specified element from DOM and return it */
export const re = (target) => {
    const elem = (typeof target === 'string') ? ge(target) : target;
    if (elem?.parentNode) {
        return elem.parentNode.removeChild(elem);
    }

    return null;
};

/** Check is specified string is number */
export const isNum = (val) => {
    const fval = parseFloat(val);
    if (fval === 0) {
        return true;
    }

    return !!(val / val);
};

/** Check parameter is integer */
export const isInt = (x) => {
    const y = parseInt(x, 10);
    if (Number.isNaN(y)) {
        return false;
    }

    return x === y && x.toString() === y.toString();
};

/** Check bit flag is set */
/* eslint-disable no-bitwise */
export const hasFlag = (x, flag) => ((x & flag) === flag);
/* eslint-enable no-bitwise */

/** Return current computed style of element */
export const computedStyle = (elem) => {
    if (!elem) {
        return null;
    }

    if (window.getComputedStyle) {
        return getComputedStyle(elem, '');
    }

    return elem.currentStyle;
};

/**
 * Return visibility of specified element
 * @param {Element|string} target - element to check visibility of
 * @param {boolean} recursive - if set to true will check visibility of all parent nodes
 */
export const isVisible = (target, recursive) => {
    let elem = (typeof target === 'string') ? ge(target) : target;

    while (elem && elem.nodeType && elem.nodeType !== 9) {
        const cstyle = computedStyle(elem);
        if (!cstyle || cstyle.display === 'none' || cstyle.visibility === 'hidden') {
            return false;
        }

        if (recursive !== true) {
            break;
        }

        elem = elem.parentNode;
    }

    return !!elem;
};

/**
 * Show/hide specified element
 * @param {Element|string} target - element or id to show/hide
 * @param {*} val - if set to true then element will be shown, hidden otherwise
 */
export const show = (target, val = true) => {
    const elem = (typeof target === 'string') ? ge(target) : target;
    if (!elem) {
        return;
    }

    if (val) {
        elem.removeAttribute('hidden');
    } else {
        elem.setAttribute('hidden', '');
    }
};

/**
 * Enable or disable specified element
 * @param {Element|string} target - element or id to show/hide
 * @param {boolean} val - if set to true then element will be enabled, disable otherwise
 */
export const enable = (target, val = true) => {
    const elem = (typeof target === 'string') ? ge(target) : target;
    if (!elem) {
        return;
    }

    if (val) {
        elem.removeAttribute('disabled');
    } else {
        elem.setAttribute('disabled', true);
    }
};

/** Return caret position in specified input control */
export const getCaretPos = (elem) => {
    if (!elem) {
        return 0;
    }

    elem.focus();

    if (elem.selectionStart) {
        return elem.selectionStart;
    }
    /* IE */
    if (document.selection) {
        const sel = document.selection.createRange();
        const clone = sel.duplicate();
        sel.collapse(true);
        clone.moveToElementText(elem);
        clone.setEndPoint('EndToEnd', sel);
        return clone.text.length;
    }

    return 0;
};

/**
 * Return curson/selection position for specified input element
 * @param {Element} input
 */
export const getCursorPos = (input) => {
    if (!input) {
        return null;
    }

    if ('selectionStart' in input && document.activeElement === input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd,
        };
    }

    if (input.createTextRange) {
        const sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            const rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            let len;
            for (
                len = 0;
                rng.compareEndPoints('EndToStart', rng) > 0;
                rng.moveEnd('character', -1)
            ) {
                len += 1;
            }
            rng.setEndPoint('StartToStart', input.createTextRange());
            let pos;
            for (
                pos = { start: 0, end: len };
                rng.compareEndPoints('EndToStart', rng) > 0;
                rng.moveEnd('character', -1)
            ) {
                pos.start += 1;
                pos.end += 1;
            }
            return pos;
        }
    }

    return null;
};

/**
 * Set curson position for specified input element
 * @param {Element} input
 * @param {number} startPos
 * @param {number} endPos
 */
export const selectText = (input, startPos, endPos) => {
    if (!input) {
        return;
    }

    if (input.createTextRange) {
        const range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', endPos);
        range.moveStart('character', startPos);
        range.select();
    } else if (input.setSelectionRange) {
        input.setSelectionRange(startPos, endPos);
    }
};

/**
 * Set curson position for specified input element
 * @param {Element} input
 * @param {number} pos
 */
export const setCursorPos = (input, pos) => selectText(input, pos, pos);

/** Check string is correct date in dd.mm.yyyy format */
export const checkDate = (str) => {
    if (typeof str !== 'string' || !str.length) {
        return false;
    }

    const sparr = str.split('.');
    if (sparr.length !== 3) {
        return false;
    }

    if (!isNum(sparr[0]) || !isNum(sparr[1]) || !isNum(sparr[2])) {
        return false;
    }

    if (sparr[0] < 1 || sparr[0] > 31 || sparr[1] < 1 || sparr[1] > 12 || sparr[2] < 1970) {
        return false;
    }

    return true;
};

/** Return text of selected option of select object */
export const selectedText = (selectObj) => {
    if (!selectObj?.options || selectObj.selectedIndex === -1) {
        return -1;
    }

    const option = selectObj.options[selectObj.selectedIndex];

    return (option.textContent) ? option.textContent : option.innerText;
};

/** Return value of selected option of select object */
export const selectedValue = (selectObj) => {
    if (!selectObj?.options || selectObj.selectedIndex === -1) {
        return -1;
    }

    return selectObj.options[selectObj.selectedIndex].value;
};

/**
 * Select item with specified value if exist
 * @param {Element} selectObj - select element
 * @param {*} selValue - option value to select
 * @param {boolean} selBool - if set to false then deselect option, select otherwise
 */
/* eslint-disable no-param-reassign */
export const selectByValue = (selectObj, selValue, selBool) => {
    if (!selectObj?.options || typeof selValue === 'undefined') {
        return false;
    }

    const toSel = selValue.toString();
    for (let i = 0, l = selectObj.options.length; i < l; i += 1) {
        const option = selectObj.options[i];
        if (option && option.value === toSel) {
            if (selectObj.multiple) {
                option.selected = (typeof selBool !== 'undefined') ? selBool : true;
            } else {
                selectObj.selectedIndex = i;
            }
            return true;
        }
    }

    return false;
};
/* eslint-enable no-param-reassign */

/** Insert element before specified */
export const insertBefore = (elem, refElem) => {
    if (!refElem || !refElem.parentNode) {
        return null;
    }

    return refElem.parentNode.insertBefore(elem, refElem);
};

/** Insert one DOM element after specified */
export const insertAfter = (elem, refElem) => {
    const parent = refElem.parentNode;
    const next = refElem.nextSibling;

    if (next) {
        return parent.insertBefore(elem, next);
    }

    return parent.appendChild(elem);
};

/** Insert element as first child */
export const prependChild = (parent, elem) => {
    if (!elem || !parent) {
        return;
    }

    const elems = Array.isArray(elem) ? elem : [elem];
    const fe = parent.firstChild;
    if (fe) {
        elems.reduce((prev, el) => {
            insertBefore(el, prev);
            return el;
        }, fe);
    } else {
        elems.forEach((el) => parent.appendChild(el));
    }
};

/** Remove all child nodes of specified element */
export const removeChilds = (elem) => {
    if (!elem) {
        return;
    }

    while (elem.childNodes.length > 0) {
        elem.removeChild(elem.childNodes[0]);
    }
};

const clickHandlersMap = [];

/**
 * Handler for click on empty space event
 * @param {Event} e - click event object
 * @param {Function} callback - event handler
 * @param {Element[]} elem - elements to skip handler if click occurs on it
 */
const onEmptyClick = (e, callback, elem) => {
    let notExcluded = true;
    const elems = Array.isArray(elem) ? elem : [elem];

    if (!isFunction(callback)) {
        return;
    }

    if (e) {
        notExcluded = elems.every((el) => {
            const currentElem = ((typeof el === 'string') ? ge(el) : el) || null;

            return ((
                currentElem
                && !currentElem.contains(e.target)
                && currentElem !== e.target
            ) || !currentElem);
        });
    }

    if (notExcluded) {
        callback();
    }
};

/** Set event handler for click by empty place */
export const setEmptyClick = (callback, elem) => {
    if (!document.documentElement || !isFunction(callback)) {
        return;
    }

    setTimeout(() => {
        const handler = (e) => onEmptyClick(e, callback, elem);
        clickHandlersMap.push({ callback, handler });

        document.documentElement.addEventListener(
            'click',
            handler,
        );
    });
};

/** Remove previously set event handler for click by empty place */
export const removeEmptyClick = (callback) => {
    const ind = clickHandlersMap.findIndex((item) => item.callback === callback);
    if (ind === -1) {
        return;
    }

    const handlerItem = clickHandlersMap[ind];
    document.documentElement.removeEventListener(
        'click',
        handlerItem.handler,
    );

    clickHandlersMap.splice(ind, 1);
};

/** Calculate offset of element by sum of offsets of parents */
export const getOffsetSum = (elem) => {
    let el = elem;
    let top = 0;
    let left = 0;

    while (el) {
        top += parseInt(el.offsetTop, 10);
        left += parseInt(el.offsetLeft, 10);
        el = el.offsetParent;
    }

    return { top, left };
};

/** Calculate offset of element using getBoundingClientRect() method */
export const getOffsetRect = (elem) => {
    const box = elem.getBoundingClientRect();
    const { body } = document;
    const docElem = document.documentElement;

    const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    const clientTop = docElem.clientTop || body.clientTop || 0;
    const clientLeft = docElem.clientLeft || body.clientLeft || 0;
    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;

    return {
        top: Math.round(top),
        left: Math.round(left),
    };
};

/** Calculate offset of element */
export const getOffset = (elem) => {
    if (elem.getBoundingClientRect) {
        return getOffsetRect(elem);
    }

    return getOffsetSum(elem);
};

/** Compare position of two node in the document */
export const comparePosition = (a, b) => {
    if (a.compareDocumentPosition) {
        return a.compareDocumentPosition(b);
    }

    return (a !== b && a.contains(b) && 16) + (a !== b && b.contains(a) && 8)
        + ((a.sourceIndex >= 0 && b.sourceIndex >= 0)
            ? (a.sourceIndex < b.sourceIndex && 4) + (a.sourceIndex > b.sourceIndex && 2)
            : 1);
};

/** Return page scroll */
export const getPageScroll = () => {
    if (typeof window.pageXOffset !== 'undefined') {
        return {
            left: pageXOffset,
            top: pageYOffset,
        };
    }

    const html = document.documentElement;
    const { body } = document;

    let top = html.scrollTop || (body && body.scrollTop) || 0;
    top -= html.clientTop;

    let left = html.scrollLeft || (body && body.scrollLeft) || 0;
    left -= html.clientLeft;

    return { top, left };
};

/** Check object is empty */
export const isEmpty = (obj) => {
    if (typeof obj === 'object') {
        return Object.keys(obj).length === 0;
    }

    return true;
};

/** Return count of children of object */
export const childCount = (obj) => {
    if (typeof obj === 'object') {
        return Object.keys(obj).length;
    }

    return 0;
};

/** Return string for value in pixels */
export const px = (val) => `${parseInt(val, 10)}px`;

/** Join parameters and values of object to URL */
export const urlJoin = (obj) => {
    const arr = [];

    if (!isObject(obj)) {
        return '';
    }

    Object.keys(obj).forEach((key) => {
        const val = obj[key];
        if (Array.isArray(val)) {
            val.forEach((arrItem) => {
                if (!isObject(arrItem)) {
                    const eKey = encodeURIComponent(key);
                    const eValue = encodeURIComponent(arrItem.toString());
                    arr.push(`${eKey}[]=${eValue}`);
                }
            });
        } else if (!isObject(val)) {
            const eKey = encodeURIComponent(key);
            const eValue = encodeURIComponent(val.toString());
            arr.push(`${eKey}=${eValue}`);
        }
    });

    return arr.join('&');
};

/** Cross-browser find head element */
export const head = () => {
    if (document) {
        if (document.head) {
            return document.head;
        }
        if (document.documentElement && document.documentElement.firstChild) {
            return document.documentElement.firstChild;
        }
    }

    return null;
};

/* eslint-disable no-param-reassign */
/** Set cross-browser transform value */
export const transform = (elem, value) => {
    if (!elem || !elem.style) {
        return;
    }

    if (typeof elem.style.webkitTransform !== 'undefined') {
        elem.style.webkitTransform = value;
    } else if (typeof elem.style.MozTransform !== 'undefined') {
        elem.style.MozTransform = value;
    } else if (typeof elem.style.msTransform !== 'undefined') {
        elem.style.msTransform = value;
    } else if (typeof elem.style.transform !== 'undefined') {
        elem.style.transform = value;
    }
};
/* eslint-enable no-param-reassign */

/** Return fixed DPI value */
export const getRealDPI = () => {
    if (window.devicePixelRatio) {
        return window.devicePixelRatio;
    }

    if (screen.deviceXDPI && screen.logicalXDPI) {
        return screen.deviceXDPI / screen.logicalXDPI;
    }

    return screen.availWidth / document.documentElement.clientWidth;
};

/** Add new DOM ready event handler to the queue */
export const onReady = (handler) => {
    document.addEventListener('DOMContentLoaded', handler, false);
};

/* eslint-disable no-param-reassign */
/** Extends Error with specified class constructor */
export function extendError(Class) {
    Class.prototype = Object.create(Error.prototype, {
        constructor: {
            value: Error,
            enumerable: false,
            writable: true,
            configurable: true,
        },
    });

    Object.setPrototypeOf(Class, Error);
}
/* eslint-enable no-param-reassign */

/**
 * Compare object with expected
 * @param {Object} obj
 * @param {Object} expectedObj
 */
export const deepMeet = (obj, expectedObj) => {
    // undefined expected means not care
    if (typeof expectedObj === 'undefined') {
        return true;
    }

    // undefined object is invalid
    if (typeof obj === 'undefined') {
        return false;
    }

    // compare as primitive types
    if (
        (!isObject(obj) && !Array.isArray(obj))
        || (!isObject(expectedObj) && !Array.isArray(expectedObj))
    ) {
        if (Number.isNaN(expectedObj)) {
            return Number.isNaN(obj);
        }

        return (obj === expectedObj);
    }

    if (obj === expectedObj) {
        return true;
    }

    const expectedKeys = Object.getOwnPropertyNames(expectedObj);
    return expectedKeys.every((key) => {
        if (!(key in obj)) {
            return false;
        }

        const expected = expectedObj[key];
        const value = obj[key];
        return deepMeet(value, expected);
    });
};

/**
 * Call function no more than once every ms seconds
 * @param {Function} func - function to throttle
 * @param {Number} ms - timeout
 * @returns
 */
export function throttle(func, ms) {
    let isThrottled = false;
    let savedArgs;
    let savedThis;

    function wrapper(...args) {
        if (isThrottled) {
            savedArgs = args;
            savedThis = this;
            return;
        }

        func.apply(this, args);

        isThrottled = true;

        setTimeout(() => {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = null;
                savedThis = null;
            }
        }, ms);
    }

    return wrapper;
}
