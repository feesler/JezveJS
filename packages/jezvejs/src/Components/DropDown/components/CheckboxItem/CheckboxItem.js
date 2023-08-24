import { getClassName } from '../../../../js/common.js';
import { CheckboxItem } from '../../../Menu/Menu.js';

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

export class DropDownCheckboxItem extends CheckboxItem {
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
