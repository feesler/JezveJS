import { asArray } from '../../js/common.js';
import { createSlice } from '../Store/Store.js';
import { mapItems, pushItem } from './helpers.js';

// Reducers
const slice = createSlice({
    ignoreTouch: (state) => ({ ...state, ignoreTouch: true }),

    toggleEnable: (state) => ({
        ...state,
        disabled: !state.disabled,
    }),

    showItem: (state, id) => ({
        ...state,
        items: mapItems(state.items, (item) => (
            (item.id?.toString() === id)
                ? { ...item, hidden: false }
                : item
        )),
    }),

    hideItem: (state, id) => ({
        ...state,
        items: mapItems(state.items, (item) => (
            (item.id?.toString() === id)
                ? { ...item, hidden: true }
                : item
        )),
    }),

    enableItem: (state, id) => ({
        ...state,
        items: mapItems(state.items, (item) => (
            (item.id?.toString() === id)
                ? { ...item, disabled: false }
                : item
        )),
    }),

    disableItem: (state, id) => ({
        ...state,
        items: mapItems(state.items, (item) => (
            (item.id?.toString() === id)
                ? { ...item, disabled: false }
                : item
        )),
    }),

    activateItem: (state, id) => ({
        ...state,
        items: mapItems(
            state.items,
            (item) => (
                (item.active === (item.id?.toString() === id))
                    ? item
                    : { ...item, active: !item.active }
            ),
            { includeGroupItems: state.allowActiveGroupHeader },
        ),
    }),

    toggleSelectItem: (state, id) => ({
        ...state,
        items: mapItems(
            state.items,
            (item) => {
                if (item.id?.toString() === id) {
                    if (!item.selectable || item.disabled) {
                        return item;
                    }

                    return {
                        ...item,
                        selected: (state.multiple) ? !item.selected : true,
                    };
                }

                return (state.multiple)
                    ? item
                    : { ...item, selected: false };
            },
            { includeGroupItems: state.allowActiveGroupHeader },
        ),
    }),

    setSelection: (state, items) => ({
        ...state,
        items: mapItems(
            state.items,
            (item) => (
                (item.selected === items.includes(item.id?.toString()) || !item.selectable)
                    ? item
                    : { ...item, selected: !item.selected }
            ),
            { includeGroupItems: state.allowActiveGroupHeader },
        ),
    }),

    selectAll: (state, selected) => ({
        ...state,
        items: mapItems(
            state.items,
            (item) => (
                (item.selected === selected || !item.selectable)
                    ? item
                    : { ...item, selected }
            ),
            { includeGroupItems: state.allowActiveGroupHeader },
        ),
        changed: true,
    }),

    addItem: (state, item) => ({
        ...state,
        items: (
            pushItem(
                item,
                structuredClone(state.items),
            )
        ),
    }),

    append: (state, items) => ({
        ...state,
        items: (
            asArray(items).reduce(
                (prev, item) => pushItem(item, prev),
                structuredClone(state.items),
            )
        ),
    }),

    setItems: (state, items) => ({
        ...state,
        items: (
            asArray(items).reduce(
                (prev, item) => pushItem(item, prev),
                [],
            )
        ),
    }),

    setListScroll: (state, listScroll) => ({ ...state, listScroll }),

    requestListScroll: (state, { listScroll, scrollTimeout }) => ({
        ...state,
        listScroll,
        scrollTimeout,
        blockScroll: true,
    }),

    unblockScroll: (state) => ({
        ...state,
        blockScroll: false,
        scrollTimeout: 0,
    }),
});

export const { actions, reducer } = slice;
