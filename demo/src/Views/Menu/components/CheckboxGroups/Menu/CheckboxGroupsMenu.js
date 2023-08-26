import { Menu, mapItems } from 'jezvejs/Menu';

import { CheckboxMenuGroupItem } from '../GroupItem/CheckboxMenuGroupItem.js';
import { CheckboxMenuGroupHeader } from '../GroupHeader/CheckboxMenuGroupHeader.js';

/**
 * Checkbox groups menu component
 */
export class CheckboxGroupsMenu extends Menu {
    constructor(props = {}) {
        super({
            ...props,
            renderNotSelected: true,
            allowActiveGroupHeader: true,
            components: {
                ...props.components,
                GroupHeader: CheckboxMenuGroupHeader,
                GroupItem: CheckboxMenuGroupItem,
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
        });
    }
}
