import { getClassNames, createSVGElement } from '../../../../../js/common.js';
import { Button } from '../../../../Button/Button.js';
import './ToggleButton.scss';

/* Toggle icon path */
const TOGGLE_ICON = 'm0.6 0.88-0.35 0.35 1.6 1.6 1.6-1.6-0.35-0.35-1.2 1.2z';

/* CSS classes */
const BUTTON_CLASS = 'dd__toggle-btn';

export class DropDownToggleButton extends Button {
    constructor(props = {}) {
        const icon = createSVGElement('svg', {
            attrs: { viewBox: '0 0 3.7 3.7' },
            children: createSVGElement('path', { attrs: { d: TOGGLE_ICON } }),
        });

        super({
            ...props,
            className: getClassNames(BUTTON_CLASS, props.className),
            icon,
            type: 'static',
        });
    }
}
