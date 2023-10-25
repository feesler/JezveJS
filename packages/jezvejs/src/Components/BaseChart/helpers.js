import { asArray } from '@jezvejs/types';

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
