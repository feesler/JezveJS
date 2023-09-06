import { createSlice } from 'jezvejs/Store';
import { mapItems } from 'jezvejs/DropDown';

// Reducers
const slice = createSlice({
    toggleGroup: (state, id) => ({
        ...state,
        items: mapItems(state.items, (item) => (
            (item.type === 'group' && item.id.toString() === id)
                ? { ...item, expanded: !item.expanded }
                : item
        ), { includeGroupItems: true }),
    }),
});

export const { actions, reducer } = slice;
