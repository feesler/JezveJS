import { DropDownMenu } from 'jezvejs/DropDown';

import { DropDownCollapsibleMenuGroupItem } from '../GroupItem/CollapsibleMenuGroupItem.js';
import { DropDownCollapsibleMenuGroupHeader } from '../GroupHeader/CollapsibleMenuGroupHeader.js';

/**
 * Collapsible groups menu component
 */
export class DropDownCollapsibleGroupsMenu extends DropDownMenu {
    constructor(props = {}) {
        super({
            ...props,
            allowActiveGroupHeader: true,
            renderTime: props.renderTime,
            components: {
                ...props.components,
                GroupHeader: DropDownCollapsibleMenuGroupHeader,
                GroupItem: DropDownCollapsibleMenuGroupItem,
            },
        });
    }
}
