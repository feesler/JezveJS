import { isFunction, isObject } from '@jezvejs/types';

/* eslint no-restricted-globals: "off" */
/* eslint no-bitwise: "off" */

/** Returns parameter if it is array, else wrap value to array */
export const asArray = (value) => {
    if (value === null || value === undefined) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
};

/** Returns value normalized to specified range */
export const minmax = (min, max, value) => (
    Math.max(
        Math.min(min, max),
        Math.min(Math.max(min, max), value),
    )
);

/** Returns capitalized string */
export const firstUpperCase = (str, locales = []) => {
    const first = str.substring(0, 1);
    const rest = str.substring(1);

    return first.toLocaleUpperCase(locales)
        .concat(rest.toLocaleLowerCase(locales));
};

/** Return DOM element by id */
export const ge = (id) => document.getElementById(id);

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
    const children = asArray(childs).filter((item) => !!item);
    if (!elem || children.length === 0) {
        return;
    }

    elem.append(...children);
};

/**
 * Set up event handlers for specified element
 * @param {Element} elem - element to set event handlers
 * @param {Object} events - event handlers object
 * @param {boolean|Object} options - useCapture flag or options object
 */
export const setEvents = (elem, events, options = undefined) => {
    if (!elem || !events) {
        return;
    }

    Object.keys(events).forEach((eventName) => {
        const handler = events[eventName];

        if (isFunction(handler)) {
            elem.addEventListener(eventName, handler, options);
        } else if (isObject(handler) && isFunction(handler.listener)) {
            elem.addEventListener(eventName, handler.listener, handler.options);
        }
    });
};

/**
 * Remove event handlers from specified element
 * @param {Element} elem - element to remove event handlers from
 * @param {Object} events - event handlers object
 * @param {boolean|Object} options - useCapture flag or options object
 */
export const removeEvents = (elem, events, options = undefined) => {
    if (!elem || !events) {
        return;
    }

    Object.keys(events).forEach((eventName) => {
        const handler = events[eventName];

        if (isFunction(handler)) {
            elem.removeEventListener(eventName, handler, options);
        } else if (isObject(handler) && isFunction(handler.listener)) {
            elem.removeEventListener(eventName, handler.listener, handler.options);
        }
    });
};

/**
 * Applies options to element
 * @param {Element} elem - element to apply options
 * @param {Object} options
 * @param {Object} options.attrs - attributes to set for created element
 * @param {Object} options.props - properties to set for created element
 * @param {Element[]} options.children - element or array of elements to append to created element
 * @param {Object} options.events - event handlers object
 */
export const applyElementOptions = (elem, options = {}) => {
    if (!elem || !options) {
        return;
    }

    if (options.props) {
        setProps(elem, options.props);
    }
    if (options.attrs) {
        setAttributes(elem, options.attrs);
    }
    if (options.children) {
        addChilds(elem, options.children);
    }
    if (options.events) {
        setEvents(elem, options.events);
    }
};

/**
 * Creates specified DOM element and sets parameters if specified
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

    applyElementOptions(elem, options);

    return elem;
};

/**
 * Creates specified SVG element and sets parameters if specified
 * @param {string} tagName - tag name of element to create
 * @param {Object} options
 * @param {Object} options.attrs - attributes to set for created element
 * @param {Object} options.props - properties to set for created element
 * @param {Element[]} options.children - element or array of elements to append to created element
 * @param {Object} options.events - event handlers object
 */
export const createSVGElement = (tagName, options = {}) => {
    if (typeof tagName !== 'string') {
        return null;
    }

    const elem = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    if (!elem) {
        return null;
    }

    applyElementOptions(elem, options);

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

/** Returns splitted and filtered array of class names */
export const getClassNames = (...args) => (
    args.flat(256)
        .flatMap((item) => typeof item === 'string' && item.split(' '))
        .filter((item) => typeof item === 'string' && item.length > 0)
);

/** Returns arguments converted to className string */
export const getClassName = (...args) => getClassNames(...args).join(' ');

/**
 * Obtain request data of specified form element
 * @param {HTMLFormElement} form - form element to obtain data from
 */
export const getFormData = (form) => {
    if (!form || !form.elements) {
        return null;
    }

    const res = {};
    for (let i = 0; i < form.elements.length; i += 1) {
        const inputEl = form.elements[i];
        if (inputEl.disabled || inputEl.name === '') {
            continue;
        }

        if ((inputEl.type === 'checkbox' || inputEl.type === 'radio')
            && !inputEl.checked) {
            continue;
        }

        res[inputEl.name] = inputEl.value;
    }

    return res;
};

/** Check bit flag is set */
export const hasFlag = (x, flag) => ((x & flag) === flag);

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
        elem.setAttribute('disabled', '');
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

    const elems = asArray(elem);
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

/**
 * Runs specified callback after transition end or timeout
 * @param {Element} elem
 * @param {Object} options
 * @param {Function} callback
 */
export const afterTransition = (elem, options, callback) => {
    if (!elem) {
        throw new Error('Invalid element');
    }
    if (!isFunction(callback)) {
        throw new Error('Invalid callback function');
    }

    const {
        property = null,
        target = null,
        duration = 500,
    } = options;

    let timeout = 0;
    let waiting = true;

    const handler = (e) => {
        if (!waiting) {
            return;
        }

        if (
            (e && property && e.propertyName !== property)
            || (e && target && e.target !== target)
        ) {
            return;
        }

        waiting = false;
        if (timeout) {
            clearTimeout(timeout);
        }
        removeEvents(elem, { transitionend: handler });

        callback();
    };

    setEvents(elem, { transitionend: handler });
    timeout = setTimeout(handler, duration);
};

/**
 * Restarts animation of element
 * @param {Element} elem
 */
export const reflow = (elem) => (elem.offsetHeight);

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
 * @returns {Function}
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

/**
 * Runs only last call of function after timeout
 * @param {Function} func - function to debounce
 * @param {Number} ms - timeout
 * @param {object} options - options object
 * @param {Boolean} options.immediate - run function on start of timeout
 * @param {Boolean} options.cancellable - return object with 'cancel' method last function call
 * @returns {Function}
 */
export function debounce(func, ms, options = {}) {
    const {
        immediate = false,
        cancellable = false,
    } = options;

    let timeout = null;

    const run = function (...args) {
        const savedThis = this;
        const savedArgs = args;

        const later = () => {
            timeout = null;
            if (!immediate) {
                func.apply(savedThis, savedArgs);
            }
        };

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, ms);
        if (callNow) {
            func.apply(savedThis, savedArgs);
        }
    };

    if (cancellable) {
        return {
            run,
            cancel: () => {
                clearTimeout(timeout);
                timeout = null;
            },
        };
    }

    return run;
}
