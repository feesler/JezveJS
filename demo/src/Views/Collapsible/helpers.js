import { createElement } from '@jezvejs/dom';
import { Icon } from 'jezvejs/Icon';

export const CUSTOM_BTN_CLASS = 'custom-header-btn';
export const CUSTOM_ICON_CLASS = 'custom-header-icon';

/** Create button for custom header */
export const createButton = (icon) => (
    createElement('button', {
        className: `btn ${CUSTOM_BTN_CLASS}`,
        type: 'button',
        children: Icon.create({ icon, className: CUSTOM_ICON_CLASS }).elem,
        events: { click: (e) => e.stopPropagation() },
    })
);

/** Returns new content */
export const createContent = (content) => (
    createElement('div', {
        className: 'collapsible-content-container',
        textContent: (typeof content === 'string') ? content : '',
        children: (typeof content !== 'string') ? content : null,
    })
);
