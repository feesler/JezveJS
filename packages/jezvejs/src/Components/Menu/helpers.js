import { isFunction } from '../../js/common.js';

/**
 * Searches for first menu item for which callback function return true
 *
 * @param {Array} items array of items to search in
 * @param {Function} callback function to
 */
export const findMenuItem = (items, callback) => {
    if (!Array.isArray(items)) {
        throw new Error('Invalid items parameter');
    }
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    for (let index = 0; index < items.length; index += 1) {
        let item = items[index];
        if (callback(item)) {
            return item;
        }

        if (item.type === 'group') {
            item = findMenuItem(item.items, callback);
            if (item) {
                return item;
            }
        }
    }

    return null;
};

/**
 * Returns menu item for specified id
 *
 * @param {String} id item id
 * @param {Array} items array of items to search in
 */
export const getItemById = (id, items) => {
    const strId = id?.toString() ?? null;
    if (strId === null) {
        return null;
    }

    return findMenuItem(items, (item) => item.id?.toString() === strId);
};

/**
 * Returns active menu item
 *
 * @param {Array} items array of items to search in
 */
export const getActiveItem = (items) => (
    findMenuItem(items, (item) => item.active)
);

/**
 * Returns list of menu items transformed with callback function
 * @param {Array} items menu items array
 * @param {Function} callback
 * @returns Array
 */
export const mapItems = (items, callback) => {
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const res = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];

        if (item.type === 'group') {
            res.push({
                ...item,
                items: mapItems(item.items, callback),
            });
        } else {
            res.push(callback(item, index, items));
        }
    }

    return res;
};

/**
 * Converts multilevel menu list to flat array of items and returns result
 *
 * @param {Array} items source multilevel array of menu items
 * @returns Array
 */
export const toFlatList = (items) => {
    const res = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];

        if (item.type === 'group') {
            res.push(...toFlatList(item.items));
        } else {
            res.push(item);
        }
    }

    return res;
};

/**
 * Returns closest item before specified that satisfies filter
 *
 * @param {String} id identifier of item to start from
 * @param {Array} items array of menu list items
 * @param {Function|null} filterCallback optional callback function to verify
 * @returns
 */
export const getPreviousItem = (id, items, filterCallback = null) => {
    const strId = id?.toString() ?? null;
    if (strId === null) {
        return null;
    }

    const flatList = toFlatList(items);
    let startItem = null;
    const callback = isFunction(filterCallback) ? filterCallback : null;

    for (let index = flatList.length - 1; index >= 0; index -= 1) {
        const item = flatList[index];
        if (item.id?.toString() === strId) {
            startItem = item;
            continue;
        }

        if (startItem) {
            if (callback === null || callback(item)) {
                return item;
            }
        }
    }

    return null;
};

/**
 * Returns closest item after specified that satisfies filter
 *
 * @param {String} id identifier of item to start from
 * @param {Array} items array of menu list items
 * @param {Function|null} filterCallback optional callback function to filter returned item
 * @returns
 */
export const getNextItem = (id, items, filterCallback = null) => {
    const strId = id?.toString() ?? null;
    if (strId === null) {
        return null;
    }

    const flatList = toFlatList(items);
    let startItem = null;
    const callback = isFunction(filterCallback) ? filterCallback : null;

    for (let index = 0; index < flatList.length; index += 1) {
        const item = flatList[index];
        if (item.id?.toString() === strId) {
            startItem = item;
            continue;
        }

        if (startItem) {
            if (callback === null || callback(item)) {
                return item;
            }
        }
    }

    return null;
};
