import { DropDown, mapItems } from 'jezvejs/DropDown';

import { DropDownCollapsibleGroupsMenu } from './Menu/CollapsibleGroupsMenu.js';
import { DropDownCollapsibleMenuGroupHeader } from './GroupHeader/CollapsibleMenuGroupHeader.js';
import { DropDownCollapsibleMenuGroupItem } from './GroupItem/CollapsibleMenuGroupItem.js';

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

        const groupId = item.group?.id;
        if (groupId) {
            const group = this.getItem(groupId, state);
            return group?.expanded;
        }

        return true;
    }

    /**
     * Creates new group
     * @param {string} label
     */
    createGroup(options = {}, groups = []) {
        const {
            expanded = true,
            ...rest
        } = options;

        const group = super.createGroup({ expanded, ...rest }, groups);

        return group;
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

        const options = {
            includeGroupItems: this.state.allowActiveGroupHeader,
        };

        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => (
                (item.type === 'group' && item.id.toString() === strId)
                    ? { ...item, expanded: !item.expanded }
                    : item
            ), options),
        });
    }
}
