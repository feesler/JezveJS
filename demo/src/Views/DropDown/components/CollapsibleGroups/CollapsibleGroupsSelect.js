import { DropDown } from 'jezvejs/DropDown';

import { DropDownCollapsibleGroupsMenu } from './Menu/CollapsibleGroupsMenu.js';
import { DropDownCollapsibleMenuGroupHeader } from './GroupHeader/CollapsibleMenuGroupHeader.js';
import { DropDownCollapsibleMenuGroupItem } from './GroupItem/CollapsibleMenuGroupItem.js';
import { actions, reducer } from './reducer.js';

const defaultProps = {
    components: {
        Menu: DropDownCollapsibleGroupsMenu,
        GroupHeader: DropDownCollapsibleMenuGroupHeader,
        GroupItem: DropDownCollapsibleMenuGroupItem,
    },
};

/**
 * Drop Down with collapsible groups component
 */
export class CollapsibleGroupsSelect extends DropDown {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            allowActiveGroupHeader: true,
            reducers: reducer,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });
    }

    getMenuProps() {
        const res = super.getMenuProps();

        res.onGroupHeaderClick = (id, e) => this.onGroupHeaderClick(id, e);

        return res;
    }

    isAvailableItem(item, state = this.state) {
        if (!super.isAvailableItem(item, state)) {
            return false;
        }

        if (item.group) {
            const group = this.getItem(item.group, state);
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
    toggleItem(itemId) {
        const item = this.getItem(itemId);
        if (item?.type === 'group') {
            this.toggleGroup(itemId);
            return;
        }

        super.toggleItem(itemId);
    }

    toggleGroup(id) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        this.dispatch(actions.toggleGroup(strId));
    }
}
