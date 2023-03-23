/**
 * Fixes string to correct number format if possible and returns result
 * @param {String|Number} str - decimal value string
 */
export const fixFloat = (str) => {
    if (typeof str === 'number') {
        return str.toString();
    }

    if (typeof str !== 'string') {
        return null;
    }

    let res = str.replace(/,/g, '.');

    // Insert '0' after minus sign if whole string is '-' or
    // there is no digits before decimal point
    // Ex.: '-' -> '-0' and '-.123' -> '-0.123'
    if (
        res.indexOf('-') === 0
        && (res.length === 1 || res.indexOf('.') === 1)
    ) {
        res = `-0${res.substring(1)}`;
    }

    // Prepend '0' to empty string or string starts with decimal point
    // Ex.: '' -> '0' and '.123' -> '0.123'
    if (res.indexOf('.') === 0 || !res.length) {
        res = `0${res}`;
    }

    return res;
};

/**
 * Returns count of decimal places for number including decimal point
 * @param {String|Number} value
 */
export const getDecimalPlaces = (value) => {
    const fixed = fixFloat(value);
    if (fixed === null) {
        return 0;
    }

    const dotPos = fixed.indexOf('.');
    return (dotPos === -1) ? 0 : (fixed.length - dotPos);
};

/**
 * Trims decimal places of value up to specified limit and returns result
 * @param {String} value
 * @param {Number} limit
 */
export const trimDecimalPlaces = (value, limit) => {
    const length = getDecimalPlaces(value);
    const lim = parseInt(limit, 10);
    if (Number.isNaN(lim) || lim < 0) {
        throw new Error('Invalid limit value');
    }

    const diff = length - limit;
    return (diff > 0)
        ? value.substring(0, value.length - diff)
        : value;
};

/**
 * Returns true if string matches to decimal value pattern
 * @param {String} value
 */
export const isNumberString = (value) => (
    /^-?\d*\.?\d*$/g.test(value)
);

/**
 * Returns true if string starts with multiple '0' and optional minus sign
 * @param {String} value
 */
export const isMultipleLeadingZeros = (value) => (
    /^-?00/g.test(value)
);
