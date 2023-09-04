import { getClassName } from '../../../../../js/common.js';
import { Tags } from '../../../../Tags/Tags.js';
import { DropDownMultiSelectionItem } from '../MultiSelectionItem/MultiSelectionItem.js';
import './MultipleSelection.scss';

const SELECTION_CLASS = 'dd__selection';

const defaultProps = {
    ItemComponent: DropDownMultiSelectionItem,
};

export class DropDownMultipleSelection extends Tags {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(SELECTION_CLASS, props.className),
            removeItemOnClose: false,
        });
    }
}
