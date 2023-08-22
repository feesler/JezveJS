import { Menu } from 'jezvejs/Menu';

import { CollapsibleMenuGroupItem } from '../GroupItem/CollapsibleMenuGroupItem.js';
import { CollapsibleMenuGroupHeader } from '../GroupHeader/CollapsibleMenuGroupHeader.js';

/**
 * Collapsible groups menu component
 */
export class CollapsibleGroupsMenu extends Menu {
    constructor(props = {}) {
        super({
            ...props,
            components: {
                ...props.components,
                GroupHeader: CollapsibleMenuGroupHeader,
                GroupItem: CollapsibleMenuGroupItem,
            },
        });
    }

    onGroupHeaderClick(id, e) {
        this.toggleGroup(id);
        super.onGroupHeaderClick(id, e);
    }

    toggleGroup(id) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => (
                (item.type === 'group' && item.id.toString() === strId)
                    ? { ...item, expanded: !item.expanded }
                    : item
            )),
        });
    }
}
