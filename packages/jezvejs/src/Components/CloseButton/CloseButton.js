import { createSVGElement, getClassNames } from '../../js/common.js';
import { IconButton } from '../IconButton/IconButton.js';
import './style.scss';

/* CSS classes */
const CLOSE_BUTTON_CLASS = 'close-btn';

const CLOSE_ICON_PATH = 'M 1.1415,2.4266 5.7838,7 1.1415,11.5356 2.4644,12.8585 7,8.2162 11.5734,12.8585 12.8585,11.5356 8.2162,7 12.8585,2.4266 11.5734,1.1415 7,5.7838 2.4644,1.1415 Z';

export class CloseButton extends IconButton {
    constructor(props = {}) {
        const icon = createSVGElement('svg', {
            attrs: { viewBox: '0,0,14,14' },
            children: createSVGElement('path', { attrs: { d: CLOSE_ICON_PATH } }),
        });

        super({
            ...props,
            className: getClassNames(CLOSE_BUTTON_CLASS, props.className),
            icon,
        });

        this.init();
    }
}
