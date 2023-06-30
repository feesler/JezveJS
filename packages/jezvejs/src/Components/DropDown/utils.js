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
            (item.isGroup && getVisibleItems(item).length > 0)
            || (!item.isGroup && isVisibleItem(item, state))
        ))
        : []
);

/**
 * Returns list items of specified group
 * @param {Object} group - group object
 * @param {Object} state - state object
 */
export const getGroupItems = (group, state) => (
    state?.items?.filter((item) => item && item.group === group)
);
