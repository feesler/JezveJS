import { Menu } from 'jezvejs/Menu';

import { CollapsibleMenuGroupItem } from './GroupItem/CollapsibleMenuGroupItem.js';
import { CollapsibleMenuGroupHeader } from './GroupHeader/CollapsibleMenuGroupHeader.js';
import { actions, reducer } from './reducer.js';

/**
 * Collapsible groups menu component
 */
export class CollapsibleGroupsMenu extends Menu {
    constructor(props = {}) {
        super({
            ...props,
            allowActiveGroupHeader: true,
            reducers: reducer,
            onGroupHeaderClick: (id, e) => this.onGroupHeaderClick(id, e),
            components: {
                ...props.components,
                GroupHeader: CollapsibleMenuGroupHeader,
                GroupItem: CollapsibleMenuGroupItem,
            },
        });
    }

    isAvailableItem(item, state = this.state) {
        if (!super.isAvailableItem(item, state)) {
            return false;
        }

        if (item.group) {
            const group = this.getItemById(item.group, state);
            return group?.expanded;
        }

        return true;
    }

    /**
     * Creates new group item
     * @param {Object} options
     */
    addGroup(options) {
        const {
            expanded = true,
            ...rest
        } = options;

        super.addGroup({ expanded, ...rest });
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

        this.dispatch(actions.toggleGroup(strId));
    }
}
