import { getClassNames } from '../../../../js/common.js';
import { CloseButton } from '../../../CloseButton/CloseButton.js';
import './ClearButton.scss';

/* CSS classes */
const BUTTON_CLASS = 'dd__clear-btn';

export class DropDownClearButton extends CloseButton {
    constructor(props = {}) {
        super({
            ...props,
            className: getClassNames(BUTTON_CLASS, props.className),
            type: 'static',
        });
    }
}
