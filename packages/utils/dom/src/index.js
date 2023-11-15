import { isFunction, isObject, asArray } from '@jezvejs/types';

/* eslint no-restricted-globals: "off" */

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

    return elem.selectionStart ?? 0;
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

    return null;
};

/**
 * Set curson position for specified input element
 * @param {Element} input
 * @param {number} startPos
 * @param {number} endPos
 */
export const selectText = (input, startPos, endPos) => {
    if (!input?.setSelectionRange) {
        return;
    }

    input.setSelectionRange(startPos, endPos);
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
    const transitionEvents = {};

    let timeout = 0;
    let waiting = true;

    const removeHandler = () => {
        waiting = false;
        if (timeout === 0) {
            return;
        }

        clearTimeout(timeout);
        timeout = 0;
        removeEvents(elem, transitionEvents);
    };

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

        removeHandler();
        callback();
    };

    transitionEvents.transitionend = handler;
    transitionEvents.transitioncancel = removeHandler;
    setEvents(elem, transitionEvents);
    timeout = setTimeout(handler, duration);

    return removeHandler;
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
