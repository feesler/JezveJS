import { createSVGElement, getClassNames } from '../../js/common.js';
import { Button } from '../Button/Button.js';
import './CloseButton.scss';

/* CSS classes */
const CLOSE_BUTTON_CLASS = 'close-btn';

const SM_CLOSE_ICON_PATH = 'M 1.1415,2.4266 5.7838,7 1.1415,11.5356 2.4644,12.8585 7,8.2162 11.5734,12.8585 12.8585,11.5356 8.2162,7 12.8585,2.4266 11.5734,1.1415 7,5.7838 2.4644,1.1415 Z';
const CLOSE_ICON_PATH = 'm5.49 17.3c-.313.313-.322.86 0 1.17a.849.849 0 001.17 0l5.34-5.34 5.33 5.34c.322.314.86.323 1.17 0a.85.85 0 000-1.17l-5.34-5.34 5.34-5.33c.313-.322.322-.86 0-1.17a.849.849 0 00-1.17 0l-5.33 5.34-5.34-5.34c-.314-.314-.86-.323-1.17 0-.313.322-.313.859 0 1.16l5.34 5.34-5.34 5.34z';

const SM_ICON_VIEWBOX = '0,0,14,14';
const ICON_VIEWBOX = '0,0,24,24';

const defaultProps = {
    small: true,
};

/**
 * Button with 'close' icon
 */
export class CloseButton extends Button {
    constructor(props = {}) {
        const {
            small,
        } = {
            ...defaultProps,
            ...props,
        };

        const d = (small) ? SM_CLOSE_ICON_PATH : CLOSE_ICON_PATH;
        const viewBox = (small) ? SM_ICON_VIEWBOX : ICON_VIEWBOX;
        const icon = createSVGElement('svg', {
            attrs: { viewBox },
            children: createSVGElement('path', { attrs: { d } }),
        });

        super({
            ...props,
            className: getClassNames(CLOSE_BUTTON_CLASS, props.className),
            icon,
        });
    }
}
