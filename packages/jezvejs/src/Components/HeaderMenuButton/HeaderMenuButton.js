import { createSVGElement, getClassNames } from '@jezvejs/dom';
import { Button } from '../Button/Button.js';

/* CSS classes */
const BUTTON_CLASS = 'header-menu-btn';

const ICON_PATH = 'm4 5c-.554 0-1 .446-1 1s.446 1 1 1h16c.554 0 1-.446 1-1s-.446-1-1-1zm0 6c-.554 0-1 .446-1 1s.446 1 1 1h16c.554 0 1-.446 1-1s-.446-1-1-1zm0 6c-.554 0-1 .446-1 1s.446 1 1 1h16c.554 0 1-.446 1-1s-.446-1-1-1z';

/**
 * Header menu button
 */
export class HeaderMenuButton extends Button {
    constructor(props = {}) {
        const icon = createSVGElement('svg', {
            attrs: { viewBox: '0,0,24,24' },
            children: createSVGElement('path', { attrs: { d: ICON_PATH } }),
        });

        super({
            ...props,
            className: getClassNames(BUTTON_CLASS, props.className),
            icon,
        });
    }
}
