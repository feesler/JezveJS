import { isObject } from '@jezvejs/types';

/* eslint no-bitwise: "off" */

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

/** Check bit flag is set */
export const hasFlag = (x, flag) => ((x & flag) === flag);

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
