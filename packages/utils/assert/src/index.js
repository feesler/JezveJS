import {
    isObject,
    isFunction,
    isDate,
    isNumber,
    isInteger,
} from '@jezvejs/types';

const MSG_ASSERT = 'Expression is not true';
const MSG_INSTANCEOF = 'Value is not instance of expected class';
const MSG_IS_ARRAY = 'Value is not array';
const MSG_IS_OBJECT = 'Value is not Object';
const MSG_IS_FUNCTION = 'Value is not function';
const MSG_IS_DATE = 'Value is not Date';
const MSG_IS_STRING = 'Value is not string';
const MSG_IS_DEFINED = 'Value is undefined';
const MSG_IS_UNDEFINED = 'Value is not undefined';
const MSG_IS_NUMBER = 'Value is not number';
const MSG_IS_INTEGER = 'Value is not integer';

/** Throws an exception if expression is not thuthy */
export const assert = (condition, message = MSG_ASSERT) => {
    if (!condition) {
        throw new Error(message);
    }
};

/**
 * Throws an exception if object is not instance of specified class
 * @param {Object} obj - object to check
 * @param {Constructor } constructor - expected class
 * @param {String|null} message - optional error message
 */
assert.instanceOf = (obj, constructor, message = MSG_INSTANCEOF) => {
    if (!(obj instanceof constructor)) {
        throw new Error(message);
    }
};

/**
 * Throws an exception if object is not array
 * @param {*} obj - object to check
 * @param {String|null} message - optional error message
 */
assert.isArray = (obj, message = MSG_IS_ARRAY) => {
    if (!Array.isArray(obj)) {
        throw new Error(message);
    }
};

/**
 * Throws an exception if object is not object
 * @param {*} obj - object to check
 * @param {String|null} message - optional error message
 */
assert.isObject = (obj, message = MSG_IS_OBJECT) => {
    if (!isObject(obj)) {
        throw new Error(message);
    }
};

/**
 * Throws an exception if object is not function
 * @param {*} obj - object to check
 * @param {String|null} message - optional error message
 */
assert.isFunction = (obj, message = MSG_IS_FUNCTION) => {
    if (!isFunction(obj)) {
        throw new Error(message);
    }
};

/**
 * Throws an exception if object is not Date
 * @param {*} obj - object to check
 * @param {String|null} message - optional error message
 */
assert.isDate = (obj, message = MSG_IS_DATE) => {
    if (!isDate(obj)) {
        throw new Error(message);
    }
};

/**
 * Throws an exception if object is not string
 * @param {*} obj - object to check
 * @param {String|null} message - optional error message
 */
assert.isString = (obj, message = MSG_IS_STRING) => {
    if (typeof obj !== 'string') {
        throw new Error(message);
    }
};

/**
 * Throws an exception if object is undefined
 * @param {*} obj - object to check
 * @param {String|null} message - optional error message
 */
assert.isDefined = (obj, message = MSG_IS_DEFINED) => {
    if (typeof obj === 'undefined') {
        throw new Error(message);
    }
};

/**
 * Throws an exception if object is defined
 * @param {*} obj - object to check
 * @param {String|null} message - optional error message
 */
assert.isUndefined = (obj, message = MSG_IS_UNDEFINED) => {
    if (typeof obj !== 'undefined') {
        throw new Error(message);
    }
};

/**
 * Throws an exception if object is not number
 * @param {*} obj - object to check
 * @param {String|null} message - optional error message
 */
assert.isNumber = (obj, message = MSG_IS_NUMBER) => {
    if (!isNumber(obj)) {
        throw new Error(message);
    }
};

/**
 * Throws an exception if object is not integer
 * @param {*} obj - object to check
 * @param {String|null} message - optional error message
 */
assert.isInteger = (obj, message = MSG_IS_INTEGER) => {
    if (!isInteger(obj)) {
        throw new Error(message);
    }
};

/**
 * Throws an exception if index is not valid for specified array
 * @param {Array} arr
 * @param {Number} ind
 * @param {String|null} message
 */
assert.arrayIndex = (arr, ind, message = null) => {
    if (!Array.isArray(arr)) {
        throw new Error('Invalid array');
    }

    if (Number.isNaN(ind) || ind < 0 || ind >= arr.length) {
        const msg = message ?? `Invalid index: ${ind}`;
        throw new Error(msg);
    }
};

/**
 * Throws an exception if specified value is not strictly equal to expected value
 * @param {*} value
 * @param {*} expected
 * @param {String|null} message
 */
assert.equal = (value, expected, message = null) => {
    const res = Number.isNaN(expected)
        ? Number.isNaN(value)
        : (value === expected);

    if (!res) {
        const msg = message ?? `Invalid value: "${value}", "${expected}" is expected`;
        throw new Error(msg);
    }
};

/**
 * Throws an exception if specified value is equal to expected value
 * @param {*} value
 * @param {*} expected
 * @param {String|null} message
 */
assert.notEqual = (value, expected, message = null) => {
    const res = Number.isNaN(expected)
        ? !Number.isNaN(value)
        : (value !== expected);

    if (!res) {
        const msg = message ?? `"${value}" and "${expected}" is equal`;
        throw new Error(msg);
    }
};

/**
 * Throws an exception if specified value is not less than expected value
 * @param {*} value
 * @param {*} expected
 * @param {String|null} message
 */
assert.less = (value, expected, message = null) => {
    if (!(value < expected)) {
        const msg = message ?? `"${value}" is not less than "${expected}"`;
        throw new Error(msg);
    }
};

/**
 * Throws an exception if specified value is not less than or equal to expected value
 * @param {*} value
 * @param {*} expected
 * @param {String|null} message
 */
assert.lessOrEqual = (value, expected, message = null) => {
    if (!(value <= expected)) {
        const msg = message ?? `"${value}" is not less than or equal to "${expected}"`;
        throw new Error(msg);
    }
};

/**
 * Throws an exception if specified value is not greater than expected value
 * @param {*} value
 * @param {*} expected
 * @param {String|null} message
 */
assert.greater = (value, expected, message = null) => {
    if (!(value > expected)) {
        const msg = message ?? `"${value}" is not greater than "${expected}"`;
        throw new Error(msg);
    }
};

/**
 * Throws an exception if specified value is not greater than expected value
 * @param {*} value
 * @param {*} expected
 * @param {String|null} message
 */
assert.greaterOrEqual = (value, expected, message = null) => {
    if (!(value >= expected)) {
        const msg = message ?? `"${value}" is not greater than or equal to "${expected}"`;
        throw new Error(msg);
    }
};

/**
 * Throws an exception if specified object does not match with the expected object
 * @param {Object} obj
 * @param {Object} expectedObj
 * @param {boolean} ret - return or throw
 */
assert.deepMeet = (obj, expectedObj, ret = false) => {
    // undefined means no care
    if (typeof expectedObj === 'undefined') {
        return true;
    }

    let res = true;
    const failResult = {
        key: '',
        value: obj,
        expected: expectedObj,
    };

    // undefined object is invalid
    if (typeof obj === 'undefined') {
        return failResult;
    }

    if (
        (!isObject(obj) && !Array.isArray(obj))
        || (!isObject(expectedObj) && !Array.isArray(expectedObj))
    ) {
        // Check for NaN value
        if (Number.isNaN(expectedObj)) {
            if (Number.isNaN(obj)) {
                return true;
            }
            if (ret) {
                return failResult;
            }
            throw new Error(`Not expected value "${obj}", "${expectedObj}" is expected`);
        }

        // Other primitive types
        if (obj === expectedObj) {
            return true;
        }
        if (ret) {
            return failResult;
        }
        throw new Error(`Not expected value "${obj}", "${expectedObj}" is expected`);
    }

    // Check is same object
    if (obj === expectedObj) {
        return true;
    }

    const keys = Object.keys(expectedObj);
    for (let i = 0; i < keys.length; i += 1) {
        const vKey = keys[i];

        if (!(vKey in obj)) {
            res = { key: vKey };
            break;
        }

        const expected = expectedObj[vKey];
        const value = obj[vKey];
        res = assert.deepMeet(value, expected, true);
        if (res !== true) {
            res.key = `${vKey}.${res.key}`;
            break;
        }
    }

    if (res !== true && !ret) {
        if ('expected' in res) {
            throw new Error(`Not expected value "${res.value}" for (${res.key}) "${res.expected}" is expected`);
        } else {
            throw new Error(`Path (${res.key}) not found`);
        }
    }

    return res;
};

/**
 * Throws an exception if specified object does not exactly match with the expected object
 * @param {Object} obj
 * @param {Object} expectedObj
 * @param {boolean} ret - return or throw
 */
assert.exactMeet = (obj, expectedObj, ret = false) => {
    // Check is same object
    if (obj === expectedObj) {
        return true;
    }

    let res = true;
    const failResult = {
        key: '',
        value: obj,
        expected: expectedObj,
    };

    // Check for NaN value
    if (Number.isNaN(expectedObj)) {
        if (Number.isNaN(obj)) {
            return true;
        }
        if (ret) {
            return failResult;
        }
        throw new Error(`Not expected value "${obj}", "${expectedObj}" is expected`);
    }

    if (
        (!isObject(obj) && !Array.isArray(obj))
        || (!isObject(expectedObj) && !Array.isArray(expectedObj))
        || (isObject(obj) !== isObject(expectedObj))
        || (Array.isArray(obj) !== Array.isArray(expectedObj))
    ) {
        if (ret) {
            return failResult;
        }
        throw new Error(`Not expected value "${obj}", "${expectedObj}" is expected`);
    }

    if (Array.isArray(expectedObj)) {
        if (obj.length !== expectedObj.length) {
            if (ret) {
                return {
                    key: 'length',
                    value: obj.length,
                    expected: expectedObj.length,
                };
            }
            throw new Error(`Invalid length of array: ${obj.length}, ${expectedObj.length} is expected`);
        }
        // Check every item in array has same value as in expected array
        expectedObj.every((expectedValue, index) => {
            const value = obj[index];
            res = assert.exactMeet(value, expectedValue, true);
            if (res !== true) {
                res.key = `[${index}].${res.key}`;
                return false;
            }

            return true;
        });
    } else if (isObject(expectedObj)) {
        const keys = Object.keys(obj);
        const expectedKeys = Object.keys(expectedObj);
        // Check all keys from expected object has same value
        for (let i = 0; i < expectedKeys.length; i += 1) {
            const key = expectedKeys[i];
            if (!(key in obj)) {
                res = { key };
                break;
            }

            const value = obj[key];
            const expectedValue = expectedObj[key];
            res = assert.exactMeet(value, expectedValue, true);
            if (res !== true) {
                res.key = `${key}.${res.key}`;
                break;
            }
        }
        // Check no excess keys in object
        if (res === true) {
            for (let i = 0; i < keys.length; i += 1) {
                const key = keys[i];
                if (!(key in expectedObj)) {
                    res = {
                        key,
                        value: obj[key],
                        expected: expectedObj[key],
                    };
                    break;
                }
            }
        }
    }

    if (res !== true && !ret) {
        if ('expected' in res) {
            throw new Error(`Not expected value "${res.value}" for (${res.key}) "${res.expected}" is expected`);
        } else {
            throw new Error(`Path (${res.key}) not found`);
        }
    }

    return res;
};
