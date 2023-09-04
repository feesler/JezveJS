import { isFunction } from '../../js/common.js';

/**
 * Searches for first menu item for which callback function return true
 *
 * @param {Object} state
 * @param {Function} callback
 */
export const findMenuItem = (state, callback) => {
    if (!Array.isArray(state?.items)) {
        throw new Error('Invalid state parameter');
    }
    if (!isFunction(callback)) {
        throw new Error('Invalid callback parameter');
    }

    const { items, groups } = state;

    for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        if (callback(item)) {
            return item;
        }
    }

    if (!Array.isArray(groups)) {
        return null;
    }
    for (let index = 0; index < groups.length; index += 1) {
        const item = groups[index];
        if (callback(item)) {
            return item;
        }
    }

    return null;
};

/**
 * Returns menu item for specified id
 *
 * @param {String} id
 * @param {Object} state
 */
export const getItemById = (id, state) => {
    const strId = id?.toString() ?? null;
    if (strId === null) {
        return null;
    }

    return findMenuItem(state, (item) => item.id?.toString() === strId);
};

/** Returns array of selected items */
export const getSelectedItems = (state) => (
    Array.isArray(state?.items)
        ? state.items.filter((item) => item?.selected)
        : []
);

/** Returns true is item is visible */
export const isVisibleItem = (item, state) => (
    (state?.filtered)
        ? (item?.matchFilter && !item.hidden)
        : (item && !item.hidden)
);

/** Returns array of visible items */
export const getVisibleItems = (state) => (
    Array.isArray(state?.items)
        ? state.items.filter((item) => (
            (item.type === 'group' && getVisibleItems(item).length > 0)
            || (item.type !== 'group' && isVisibleItem(item, state))
        ))
        : []
);

/**
 * Returns list items of specified group
 * @param {Object} group - group object
 * @param {Object} state - state object
 */
export const getGroupItems = (group, state) => (
    state?.items?.filter((item) => (item?.group?.id === group?.id))
);

/**
 * Returns visible list items of specified group
 * @param {Object} group - group object
 * @param {Object} state - state object
 */
export const getVisibleGroupItems = (group, state) => (
    state?.items?.filter((item) => (
        item?.group?.id === group?.id
        && isVisibleItem(item, state)
    ))
);

/**
 * Converts multilevel menu list to flat array of items and returns result
 *
 * @param {Object} state
 * @returns {Array}
 */
export const getMenuItems = (state) => {
    const items = [];
    const groups = [];

    state.items.forEach((item) => {
        if (
            item.hidden
            || (state.filtered && !item.matchFilter)
        ) {
            return;
        }

        const disabled = state.disabled || item.disabled;

        if (!item.group) {
            items.push({ ...item, disabled });
            return;
        }

        if (groups.includes(item.group.id)) {
            return;
        }

        const group = getItemById(item.group.id, state);
        if (!group) {
            return;
        }

        const groupItem = {
            ...group,
            type: 'group',
            items: getVisibleGroupItems(item.group, state),
        };
        groups.push(item.group.id);
        items.push(groupItem);
    });

    return items;
};

/**
 * Converts state to flat array of items and returns result
 *
 * @param {Object} state
 * @param {Object} options
 * @returns {Array}
 */
export const toFlatList = (state, options = {}) => {
    const {
        includeGroupItems = false,
        filter = null,
    } = options;
    const items = [];
    const groups = [];
    const callback = isFunction(filter) ? filter : null;

    const pushItem = (item) => {
        if (callback === null || callback(item)) {
            items.push(item);
        }
    };

    state.items.forEach((item) => {
        if (
            item.hidden
            || (state.filtered && !item.matchFilter)
        ) {
            return;
        }

        if (!item.group) {
            pushItem(item);
            return;
        }

        if (groups.includes(item.group.id)) {
            return;
        }

        const group = getItemById(item.group.id, state);
        if (!group) {
            return;
        }

        if (includeGroupItems) {
            const groupItem = {
                ...group,
                type: 'group',
            };
            pushItem(groupItem);
        }

        groups.push(item.group.id);

        const groupItems = getVisibleGroupItems(item.group, state);
        groupItems.forEach(pushItem);
    });

    return items;
};
