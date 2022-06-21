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
export function copyObject(item) {
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
}

/* eslint-disable no-param-reassign */
/**
 * Assign properties from second object to first
 * @param {*} obj - object to assign properties to
 * @param {*} params - object to obtain properties from
 */
export function setParam(obj, params) {
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
}
/* eslint-enable no-param-reassign */

/** Set attributes to specified element */
export function setAttributes(element, attrs) {
    if (!element || !isObject(attrs)) {
        return;
    }

    Object.keys(attrs).forEach((key) => {
        element.setAttribute(key, attrs[key]);
    });
}

/**
 * Append child to specified element
 * @param {Element} elem - element to append child to
 * @param {Element[]} childs - element or array of elements to append
 */
export function addChilds(elem, childs) {
    if (!elem || !childs) {
        return;
    }

    const ch = Array.isArray(childs) ? childs : [childs];
    ch.forEach((child) => {
        if (child) {
            elem.appendChild(child);
        }
    });
}

/**
 * Set up event handlers for specified element
 * @param {Element} elem - element to set event handlers
 * @param {Object} events - event handlers object
 */
export function setEvents(elem, events) {
    if (!elem || !events) {
        return;
    }

    Object.keys(events).forEach((eventName) => {
        elem.addEventListener(eventName, events[eventName]);
    });
}

/**
 * Remove event handlers from specified element
 * @param {Element} elem - element to remove event handlers from
 * @param {Object} events - event handlers object
 */
export function removeEvents(elem, events) {
    if (!elem || !events) {
        return;
    }

    Object.keys(events).forEach((eventName) => {
        elem.removeEventListener(eventName, events[eventName]);
    });
}

/**
 * Create specified DOM element and set parameters if specified
 * @param {string} tagName - tag name of element to create
 * @param {Object} params - properties to set for created element
 * @param {Element[]} children - element or array of elements to append to created element
 * @param {Object} events - event handlers object
 */
export function ce(tagName, params, children, events) {
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
}

/**
 * Create new SVG namespace element, set attributes
 * @param {string} tagName
 * @param {Object} attributes
 * @param {Element[]} children
 * @param {Object} events - event handlers object
 */
export function svg(tagName, attributes, children, events) {
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
}

/** Remove specified element from DOM and return it */
export function re(elem) {
    const removedElem = (typeof elem === 'string') ? ge(elem) : elem;

    if (removedElem && removedElem.parentNode) {
        return removedElem.parentNode.removeChild(removedElem);
    }

    return null;
}

/** Check is specified string is number */
export function isNum(val) {
    const fval = parseFloat(val);
    if (fval === 0) {
        return true;
    }

    return !!(val / val);
}

/** Check parameter is integer */
export function isInt(x) {
    const y = parseInt(x, 10);

    if (Number.isNaN(y)) {
        return false;
    }

    return x === y && x.toString() === y.toString();
}

/** Check bit flag is set */
/* eslint-disable no-bitwise */
export const hasFlag = (x, flag) => ((x & flag) === flag);
/* eslint-enable no-bitwise */

/** Return current computed style of element */
export function computedStyle(elem) {
    if (!elem) {
        return null;
    }

    if (window.getComputedStyle) {
        return getComputedStyle(elem, '');
    }

    return elem.currentStyle;
}

/**
 * Return visibility of specified element
 * @param {Element|string} elem - element to check visibility of
 * @param {boolean} recursive - if set to true will check visibility of all parent nodes
 */
export function isVisible(elem, recursive) {
    let robj = (typeof elem === 'string') ? ge(elem) : elem;

    while (robj && robj.nodeType && robj.nodeType !== 9) {
        const cstyle = computedStyle(robj);
        if (!cstyle || cstyle.display === 'none' || cstyle.visibility === 'hidden') {
            return false;
        }

        if (recursive !== true) {
            break;
        }

        robj = robj.parentNode;
    }

    return !!robj;
}

/**
 * Show/hide specified element
 * @param {Element|string} elem - element or id to show/hide
 * @param {*} val - if set to true then element will be shown, hidden otherwise
 */
export function show(elem, val) {
    const domElem = (typeof elem === 'string') ? ge(elem) : elem;
    if (!domElem || !domElem.classList) {
        return;
    }

    if (val) {
        domElem.classList.remove('hidden');
    } else {
        domElem.classList.add('hidden');
    }
}

/**
 * Enable or disable specified element
 * @param {Element|string} elem - element or id to show/hide
 * @param {boolean} val - if set to true then element will be enabled, disable otherwise
 */
export function enable(elem, val) {
    const robj = (typeof elem === 'string') ? ge(elem) : elem;

    if (robj) {
        robj.disabled = (!val);
    }
}

/** Return caret position in specified input control */
export function getCaretPos(elem) {
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
}

/**
 * Return curson/selection position for specified input element
 * @param {Element} input
 */
export function getCursorPos(input) {
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
}

/**
 * Set curson position for specified input element
 * @param {Element} input
 * @param {number} pos
 */
export function setCursorPos(input, pos) {
    if (!input) {
        return;
    }

    if (input.createTextRange) {
        const range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    } else if (input.setSelectionRange) {
        input.setSelectionRange(pos, pos);
    }
}

/** Check string is correct date in dd.mm.yyyy format */
export function checkDate(str) {
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
}

/** Return text of selected option of select object */
export function selectedText(selectObj) {
    if (!selectObj || !selectObj.options || selectObj.selectedIndex === -1) {
        return -1;
    }

    const option = selectObj.options[selectObj.selectedIndex];

    return (option.textContent) ? option.textContent : option.innerText;
}

/** Return value of selected option of select object */
export function selectedValue(selectObj) {
    if (!selectObj || !selectObj.options || selectObj.selectedIndex === -1) {
        return -1;
    }

    return selectObj.options[selectObj.selectedIndex].value;
}

/**
 * Select item with specified value if exist
 * @param {Element} selectObj - select element
 * @param {*} selValue - option value to select
 * @param {boolean} selBool - if set to false then deselect option, select otherwise
 */
/* eslint-disable no-param-reassign */
export function selectByValue(selectObj, selValue, selBool) {
    if (!selectObj || !selectObj.options || typeof selValue === 'undefined') {
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
}
/* eslint-enable no-param-reassign */

/** Insert element before specified */
export function insertBefore(elem, refElem) {
    if (!refElem || !refElem.parentNode) {
        return null;
    }

    return refElem.parentNode.insertBefore(elem, refElem);
}

/** Insert one DOM element after specified */
export function insertAfter(elem, refElem) {
    const parent = refElem.parentNode;
    const next = refElem.nextSibling;

    if (next) {
        return parent.insertBefore(elem, next);
    }

    return parent.appendChild(elem);
}

/** Insert element as first child */
export function prependChild(parent, elem) {
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
}

/** Remove all child nodes of specified element */
export function removeChilds(elem) {
    if (!elem) {
        return;
    }

    while (elem.childNodes.length > 0) {
        elem.removeChild(elem.childNodes[0]);
    }
}

/* eslint-disable no-param-reassign */
/** Fix IE event object */
export function fixEvent(e, _this) {
    e = e || window.event;

    if (!e.currentTarget) {
        e.currentTarget = _this;
    }
    if (!e.target) {
        e.target = e.srcElement;
    }

    if (!e.relatedTarget) {
        if (e.type === 'mouseover') {
            e.relatedTarget = e.fromElement;
        }
        if (e.type === 'mouseout') {
            e.relatedTarget = e.toElement;
        }
    }

    if (e.pageX === null && e.clientX !== null) {
        const html = document.documentElement;
        const { body } = document;

        e.pageX = e.clientX + (html.scrollLeft || (body && body.scrollLeft) || 0);
        e.pageX -= html.clientLeft || 0;

        e.pageY = e.clientY + (html.scrollTop || (body && body.scrollTop) || 0);
        e.pageY -= html.clientTop || 0;
    }

    if (!e.which && e.button) {
        if (e.button & 1) {
            e.which = 1;
        } else if (e.button & 2) {
            e.which = 3;
        } else {
            e.which = (e.button & 4) ? 2 : 0;
        }
    }

    return e;
}
/* eslint-enable no-param-reassign */

/**
 * Handler for click on empty space event
 * @param {Event} e - click event object
 * @param {Function} callback - event handler
 * @param {Element[]} elem - elements to skip handler if click occurs on it
 */
export function onEmptyClick(e, callback, elem) {
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
    } else {
        document.documentElement.addEventListener(
            'click',
            (ev) => onEmptyClick(ev, callback, elem),
            { once: true },
        );
    }
}

/** Set or unset event handler for */
export function setEmptyClick(callback, elem) {
    if (!document.documentElement || !isFunction(callback)) {
        return;
    }

    document.documentElement.addEventListener(
        'click',
        (e) => onEmptyClick(e, callback, elem),
        { once: true },
    );
}

/** Calculate offset of element by sum of offsets of parents */
export function getOffsetSum(elem) {
    let el = elem;
    let top = 0;
    let left = 0;

    while (el) {
        top += parseInt(el.offsetTop, 10);
        left += parseInt(el.offsetLeft, 10);
        el = el.offsetParent;
    }

    return { top, left };
}

/** Calculate offset of element using getBoundingClientRect() method */
export function getOffsetRect(elem) {
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
}

/** Calculate offset of element */
export function getOffset(elem) {
    if (elem.getBoundingClientRect) {
        return getOffsetRect(elem);
    }

    return getOffsetSum(elem);
}

/** Compare position of two node in the document */
export function comparePosition(a, b) {
    if (a.compareDocumentPosition) {
        return a.compareDocumentPosition(b);
    }

    return (a !== b && a.contains(b) && 16) + (a !== b && b.contains(a) && 8)
        + ((a.sourceIndex >= 0 && b.sourceIndex >= 0)
            ? (a.sourceIndex < b.sourceIndex && 4) + (a.sourceIndex > b.sourceIndex && 2)
            : 1);
}

/** Return page scroll */
export function getPageScroll() {
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
}

/** Check object is empty */
export function isEmpty(obj) {
    if (typeof obj === 'object') {
        return Object.keys(obj).length === 0;
    }

    return true;
}

/** Return count of children of object */
export function childCount(obj) {
    if (typeof obj === 'object') {
        return Object.keys(obj).length;
    }

    return 0;
}

/** Return string for value in pixels */
export function px(val) {
    return `${parseInt(val, 10)}px`;
}

/** Join parameters and values of object to URL */
export function urlJoin(obj) {
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
}

/** Cross-browser find head element */
export function head() {
    if (document) {
        if (document.head) {
            return document.head;
        }
        if (document.documentElement && document.documentElement.firstChild) {
            return document.documentElement.firstChild;
        }
    }

    return null;
}

/* eslint-disable no-param-reassign */
/** Set cross-browser transform value */
export function transform(elem, value) {
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
}
/* eslint-enable no-param-reassign */

/** Return fixed DPI value */
export function getRealDPI() {
    if (window.devicePixelRatio) {
        return window.devicePixelRatio;
    }

    if (screen.deviceXDPI && screen.logicalXDPI) {
        return screen.deviceXDPI / screen.logicalXDPI;
    }

    return screen.availWidth / document.documentElement.clientWidth;
}

/** Bind DOM ready event handler */
function bindReady(handler) {
    let called = false;

    function ready() {
        if (called) {
            return;
        }
        called = true;
        handler();
    }

    function tryScroll() {
        if (called) {
            return;
        }
        if (!document.body) {
            return;
        }
        try {
            document.documentElement.doScroll('left');
            ready();
        } catch (e) {
            setTimeout(tryScroll, 0);
        }
    }

    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', () => {
            ready();
        }, false);
    } else if (document.attachEvent) {
        if (document.documentElement.doScroll && window === window.top) {
            tryScroll();
        }

        document.attachEvent('onreadystatechange', () => {
            if (document.readyState === 'complete') {
                ready();
            }
        });
    }

    if (window.addEventListener) {
        window.addEventListener('load', ready, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', ready);
    }
}

/** Add new DOM ready event handler to the queue */
export function onReady(handler) {
    if (!onReady.readyList.length) {
        bindReady(() => {
            for (let i = 0; i < onReady.readyList.length; i += 1) {
                onReady.readyList[i]();
            }
        });
    }

    onReady.readyList.push(handler);
}

/** List of DOM ready handlers */
onReady.readyList = [];

/* eslint-disable no-param-reassign */
/** Extend child prototype by parent */
export function extend(Child, Parent) {
    function F() { }

    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.parent = Parent.prototype;
}

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

    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(Class, Error);
    } else {
        /* eslint-disable-next-line no-proto */
        Class.__proto__ = Error;
    }
}
/* eslint-enable no-param-reassign */
