import { isFunction, asArray } from '@jezvejs/types';
import { createSlice } from '../Store/Store.js';
import {
    filterItems,
    findLastMenuItem,
    forItems,
    generateItemId,
    getItemById,
    mapItems,
    pushItem,
    toFlatList,
} from './utils.js';

const CREATE_ITEM_CLASS = 'dd__create-item';

export const generateGroupId = (state) => {
    while (true) {
        const id = `group${Date.now()}${Math.random() * 10000}`;
        const found = getItemById(id, state.items);
        if (!found) {
            return id;
        }
    }
};

/** Returns new item object */
export const createItem = (props = {}, state) => {
    const defaultItemProps = {
        selectable: true,
        selected: false,
        hidden: false,
        disabled: false,
        group: null,
    };

    const res = {
        ...defaultItemProps,
        ...props,
        id: props.id.toString(),
        active: false,
    };

    return isFunction(state?.createItem)
        ? state.createItem(res, state)
        : res;
};

/**
 * Create new group
 * @param {string} label
 */
export const createGroup = (options = {}, state) => {
    const {
        title,
        disabled = false,
        items = [],
        ...rest
    } = options;

    const group = {
        id: options.id?.toString() ?? generateGroupId(state),
        type: 'group',
        title,
        disabled,
        items,
        ...rest,
    };

    return group;
};

/**
 * Create items from specified array
 * @param {Object|Object[]} items
 * @param {Object} state
 */
export const createItems = (items, state) => (
    mapItems(
        asArray(items),
        (item) => createItem(item, state),
        { includeGroupItems: state.allowActiveGroupHeader },
    )
);

const deactivateAllItems = (items) => (
    mapItems(items, (item) => ({ ...item, active: false }))
);

export const isAvailableItem = (item, state) => (
    !!item
    && !item.hidden
    && !item.disabled
    && ((state.filtered) ? item.matchFilter : true)
    && (
        item.type !== 'group'
        || state.allowActiveGroupHeader
    )
);

/** Return array of visible and enabled list items */
export const getAvailableItems = (state) => {
    const options = {
        includeGroupItems: state.allowActiveGroupHeader,
    };

    const filterCallback = isFunction(state.isAvailableItem)
        ? (item) => state.isAvailableItem(item, state)
        : (item) => isAvailableItem(item, state);

    return toFlatList(state.items, options).filter(filterCallback);
};

/**
 * Search for last selected item to leave selection only on it
 * If not found select first item
 * @param {Object} state
 * @returns
 */
export const processSingleSelection = (state) => {
    if (state.multiple) {
        return state;
    }

    let selectedItem = findLastMenuItem(state.items, (item) => item.selected);
    if (!selectedItem) {
        const availItems = getAvailableItems(state);
        [selectedItem] = availItems;
    }

    const selId = selectedItem?.id?.toString() ?? null;
    return {
        ...state,
        items: mapItems(state.items, (item) => ({
            ...item,
            selected: item.id === selId,
        })),
    };
};

const renderAddMessage = (state) => {
    const title = state?.inputString;
    const message = isFunction(state.addItemMessage)
        ? state.addItemMessage(title)
        : state.addItemMessage;

    if (typeof message !== 'string') {
        throw new Error('Invalid message');
    }

    return {
        title: message,
        selectable: true,
        type: 'button',
        className: CREATE_ITEM_CLASS,
    };
};

// Reducers
const slice = createSlice({
    startScrollWaiting: (state) => (
        (!state.waitForScroll) ? { ...state, waitForScroll: true } : state
    ),

    stopScrollWaiting: (state) => (
        (state.waitForScroll) ? { ...state, waitForScroll: false } : state
    ),

    startWindowListening: (state) => (
        (!state.listeningWindow) ? { ...state, listeningWindow: true } : state
    ),

    stopWindowListening: (state) => (
        (state.listeningWindow) ? { ...state, listeningWindow: false } : state
    ),

    confirmTouch: (state) => ({ ...state, isTouch: true }),

    setRenderTime: (state) => ({ ...state, renderTime: Date.now() }),

    deselectAll: (state) => ({
        ...state,
        items: mapItems(state.items, (item) => ({
            ...item,
            selected: false,
        })),
        changed: true,
    }),

    removeCreatableMenuItem: (state) => (
        (state.createFromInputItemId)
            ? {
                ...state,
                createFromInputItemId: null,
                items: filterItems(
                    state.items,
                    (item) => item.id !== state.createFromInputItemId,
                ),
            }
            : state
    ),

    toggleShowMenu: (state) => ({
        ...state,
        visible: !state.visible,
        inputString: (!state.visible) ? state.inputString : null,
        active: (!state.visible) ? true : state.active,
        items: (
            (!state.visible)
                ? state.items
                : deactivateAllItems(state.items)
        ),
    }),

    toggleEnable: (state) => ({
        ...state,
        disabled: !state.disabled,
        active: false,
    }),

    toggleActivate: (state) => ({
        ...state,
        active: !state.active,
        actSelItemIndex: -1,
        filtered: false,
        inputString: null,
        items: deactivateAllItems(state.items),
    }),

    activateInput: (state) => ({
        ...state,
        actSelItemIndex: -1,
        inputString: (
            (state.inputString === null) ? '' : state.inputString
        ),
        filtered: (
            (state.inputString === null) ? false : state.filtered
        ),
        items: deactivateAllItems(state.items),
    }),

    setChanged: (state) => (
        (!state.changed) ? { ...state, changed: true } : state
    ),

    changeEventSent: (state) => (
        (state.changed) ? { ...state, changed: false } : state
    ),

    selectItem: (state, id) => ({
        ...state,
        items: mapItems(state.items, (item) => ({
            ...item,
            selected: (state.multiple)
                ? (item.selected || item.id === id)
                : (item.id === id),
        })),
    }),

    deselectItem: (state, id) => ({
        ...state,
        items: mapItems(state.items, (item) => ({
            ...item,
            selected: item.selected && item.id !== id,
        })),
    }),

    setSelection: (state, ids) => ({
        ...state,
        items: mapItems(state.items, (item) => ({
            ...item,
            selected: ids.includes(item.id),
        })),
    }),

    activateSelectionItem: (state, index) => ({
        ...state,
        actSelItemIndex: index,
        items: (
            (index === -1)
                ? state.items
                : deactivateAllItems(state.items)
        ),
    }),

    showAllItems: (state, resetInput = true) => ({
        ...state,
        filtered: false,
        inputString: (resetInput) ? null : '',
        createFromInputItemId: null,
        items: deactivateAllItems(
            filterItems(
                state.items,
                (item) => item.id !== state.createFromInputItemId,
            ),
        ),
    }),

    filter: (state, inputString) => {
        const lfstr = inputString.toLowerCase();
        let exactMatch = false;
        let items = [];
        const { createFromInputItemId } = state;
        const options = {
            includeGroupItems: true,
        };
        let createFromInputItem = null;

        forItems(state.items, (item) => {
            if (createFromInputItemId && item.id === createFromInputItemId) {
                createFromInputItem = { ...item };
                return;
            }

            exactMatch = exactMatch || item.title.toLowerCase() === lfstr;

            const newItem = {
                ...item,
                matchFilter: item.title.toLowerCase().includes(lfstr),
                active: false,
            };
            if (newItem.type === 'group') {
                newItem.items = [];
            }

            items = pushItem(newItem, items);
        }, options);

        const newState = {
            ...state,
            inputString,
            filtered: true,
            visible: true,
            items,
        };

        if (!state.allowCreate) {
            return newState;
        }

        if (exactMatch && newState.createFromInputItemId) {
            newState.createFromInputItemId = null;
        } else if (!exactMatch && !newState.createFromInputItemId) {
            newState.createFromInputItemId = generateItemId(state?.items ?? [], 'item');

            const newItem = createItem({
                id: newState.createFromInputItemId,
                ...renderAddMessage(newState),
                matchFilter: true,
            }, newState);

            newState.items.push(newItem);
        } else if (!exactMatch && newState.createFromInputItemId) {
            const newItem = {
                ...createFromInputItem,
                ...renderAddMessage(newState),
            };

            newState.items.push(newItem);
        }

        return newState;
    },

    setActive: (state, id) => ({
        ...state,
        actSelItemIndex: -1,
        items: mapItems(
            state.items,
            (item) => (
                (item.active !== (item.id === id))
                    ? { ...item, active: !item.active }
                    : item
            ),
            { includeGroupItems: state.allowActiveGroupHeader },
        ),
    }),

    addItem: (state, item) => processSingleSelection({
        ...state,
        items: (
            pushItem(
                createItem(item, state),
                structuredClone(state.items),
            )
        ),
    }),

    addGroup: (state, group) => ({
        ...state,
        items: pushItem(
            createGroup(group, state),
            structuredClone(state.items),
        ),
    }),

    append: (state, items) => processSingleSelection({
        ...state,
        items: (
            createItems(items, state).reduce(
                (prev, item) => pushItem(item, prev),
                structuredClone(state.items),
            )
        ),
    }),

    toggleEnableItem: (state, id) => ({
        ...state,
        items: mapItems(state.items, (item) => ({
            ...item,
            disabled: (
                (item.id === id)
                    ? (!item.disabled)
                    : item.disabled
            ),
            active: (
                (item.id === id && !item.disabled)
                    ? false
                    : item.active
            ),
        })),
    }),

    removeItem: (state, id) => ({
        ...state,
        items: filterItems(state.items, (item) => item.id !== id),
    }),

    removeAllItems: (state) => ({ ...state, items: [] }),
});

export const { actions, reducer } = slice;
