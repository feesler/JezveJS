import { getClassName } from 'jezvejs';
import { Menu, mapItems } from 'jezvejs/Menu';

import { CheckboxMenuGroupItem } from './GroupItem/CheckboxMenuGroupItem.js';
import { CheckboxMenuGroupHeader } from './GroupHeader/CheckboxMenuGroupHeader.js';
import { actions, reducer } from './reducer.js';
import './CheckboxGroupsMenu.scss';

/* CSS classes */
const MENU_CLASS = 'checkbox-groups-menu';

/**
 * Checkbox groups menu component
 */
export class CheckboxGroupsMenu extends Menu {
    constructor(props = {}) {
        super({
            ...props,
            renderNotSelected: true,
            allowActiveGroupHeader: true,
            className: getClassName(MENU_CLASS, props.className),
            reducers: reducer,
            onGroupHeaderClick: (id, e) => this.onGroupHeaderClick(id, e),
            components: {
                ...props.components,
                GroupHeader: CheckboxMenuGroupHeader,
                GroupItem: CheckboxMenuGroupItem,
            },
        });
    }

    onGroupHeaderClick(id) {
        this.toggleGroup(id);
    }

    /** Toggle item selected status */
    toggleSelectItem(itemId) {
        const item = this.getItemById(itemId);
        if (item?.type === 'group') {
            this.toggleGroup(itemId);
            return;
        }

        super.toggleSelectItem(itemId);
    }

    toggleGroup(id) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        this.store.dispatch(actions.toggleGroup(strId));
    }
}
