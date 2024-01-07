import { asArray } from '@jezvejs/types';

const SVG_VALUE_PRECISION = 3;

/**
 * Returns array of items filtered by specified query object
 *
 * @param {Array} items
 * @param {object} query
 * @returns {Array}
 */
export const findItem = (items, query) => {
    const condition = Object.keys(query);
    return asArray(items).filter((item) => (
        !!item
        && condition.every((prop) => item[prop] === query[prop])
    ));
};

/**
 * Returns true if objects target to the same data items
 *
 * @param {object} a
 * @param {object} b
 * @returns {boolean}
 */
export const isSameTarget = (a, b) => (
    (a === b) || (
        !!a
        && !!b
        && a.groupIndex === b.groupIndex
        && a.categoryIndex === b.categoryIndex
        && a.columnIndex === b.columnIndex
    )
);

/**
 * Returns specified value rounded to default precision for SVG
 *
 * @param {number|string} value
 * @param {boolean} asPixels
 * @returns {string}
 */
export const formatCoord = (value, asPixels = false) => {
    const fmt = parseFloat(parseFloat(value).toFixed(SVG_VALUE_PRECISION)).toString();
    return (asPixels) ? `${fmt}px` : fmt;
};
