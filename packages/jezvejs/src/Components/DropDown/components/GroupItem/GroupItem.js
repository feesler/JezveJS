import { getClassName } from '../../../../js/common.js';
import { MenuGroupItem } from '../../../Menu/Menu.js';

import './GroupItem.scss';

/* CSS classes */
const GROUP_CLASS = 'dd__list-group';

const defaultProps = {
    id: null,
    title: null,
    components: {
        GroupHeader: null,
        MenuList: null,
        ListItem: null,
    },
};

/**
 * Items group component
 */
export class DropDownGroupItem extends MenuGroupItem {
    static get className() {
        return GROUP_CLASS;
    }

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(GROUP_CLASS, props.className),
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });
    }
}
