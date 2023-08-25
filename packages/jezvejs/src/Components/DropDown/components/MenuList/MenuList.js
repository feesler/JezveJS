import { MenuList } from '../../../Menu/Menu.js';

const defaultProps = {
    items: [],
    multiple: false,
    filtered: false,
    inputString: false,
    components: {
        ListItem: null,
        Checkbox: null,
        ListPlaceholder: null,
        GroupItem: null,
    },
};

/**
 * Drop Down Menu list component
 */
export class DropDownMenuList extends MenuList {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });
    }
}
