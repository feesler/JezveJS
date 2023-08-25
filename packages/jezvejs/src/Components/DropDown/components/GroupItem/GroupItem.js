import { getClassName } from '../../../../js/common.js';
import { MenuGroupItem } from '../../../Menu/Menu.js';

import './GroupItem.scss';

/* CSS classes */
const GROUP_CLASS = 'dd__list-group';

/**
 * Items group component
 */
export class DropDownGroupItem extends MenuGroupItem {
    static get className() {
        return GROUP_CLASS;
    }

    constructor(props = {}) {
        super({
            ...props,
            className: getClassName(GROUP_CLASS, props.className),
        });
    }
}
