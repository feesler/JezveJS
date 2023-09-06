import { createSlice } from 'jezvejs/Store';
import { mapItems } from 'jezvejs/Menu';

// Reducers
const slice = createSlice({
    toggleGroup: (state, id) => ({
        ...state,
        items: state.items.map((item) => (
            (item.type === 'group' && item.id?.toString() === id)
                ? {
                    ...item,
                    selected: !item.selected,
                    items: mapItems(
                        item.items,
                        (child) => ({ ...child, selected: !item.selected }),
                    ),
                }
                : item
        )),
    }),
});

export const { actions, reducer } = slice;
