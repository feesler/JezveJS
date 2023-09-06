import { createSlice } from 'jezvejs/Store';
import { mapItems } from 'jezvejs/DropDown';

// Reducers
const slice = createSlice({
    toggleGroup: (state, id) => ({
        ...state,
        items: state.items.map((item) => (
            (item.type === 'group' && item.id.toString() === id)
                ? { ...item, expanded: !item.expanded }
                : item
        )),
    }),
});

export const { actions, reducer } = slice;
