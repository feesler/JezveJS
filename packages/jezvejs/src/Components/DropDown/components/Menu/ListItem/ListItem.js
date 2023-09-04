import { getClassName } from '../../../../../js/common.js';
import { MenuItem } from '../../../../Menu/Menu.js';

/* CSS classes */
const LIST_ITEM_CLASS = 'dd__list-item';

const defaultProps = {
    selected: false,
    active: false,
    hidden: false,
    disabled: false,
    multiple: false,
    group: null,
};

export class DropDownListItem extends MenuItem {
    static get className() {
        return LIST_ITEM_CLASS;
    }

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(LIST_ITEM_CLASS, props.className),
        });
    }
}
