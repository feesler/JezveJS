import { getClassName } from '../../../../../js/common.js';
import { Tag } from '../../../../Tag/Tag.js';
import './MultiSelectionItem.scss';

/* CSS classes */
const SELECTION_ITEM_CLASS = 'dd__selection-item';

const defaultProps = {
    active: false,
};

export class DropDownMultiSelectionItem extends Tag {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(SELECTION_ITEM_CLASS, props.className),
        });
    }
}
