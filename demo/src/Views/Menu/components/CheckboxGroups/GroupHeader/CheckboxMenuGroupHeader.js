import { createElement, enable, getClassName } from 'jezvejs';
import { MenuGroupHeader, MenuCheckbox } from 'jezvejs/Menu';

import './CheckboxMenuGroupHeader.scss';

/* CSS classes */
const TITLE_CLASS = 'menu-group-header__title';

const ACTIVE_ITEM_CLASS = 'menu-item_active';
const SELECTED_ITEM_CLASS = 'menu-item_selected';

const defaultProps = {
    title: null,
    selected: false,
    active: false,
};

/**
 * Checkbox menu group header component
 */
export class CheckboxMenuGroupHeader extends MenuGroupHeader {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });
    }

    init() {
        this.titleElem = createElement('span', {
            props: { className: TITLE_CLASS },
        });

        this.checkbox = MenuCheckbox.create();

        this.elem = createElement('button', {
            props: {
                className: getClassName(MenuGroupHeader.className, 'menu-item'),
                type: 'button',
            },
            children: [this.titleElem, this.checkbox.elem],
        });
    }

    get id() {
        return this.state.id;
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.elem.dataset.id = state.id;

        this.titleElem.textContent = state.title ?? '';

        enable(this.elem, !state.disabled);

        this.elem.classList.toggle(ACTIVE_ITEM_CLASS, !!state.active);
        this.elem.classList.toggle(SELECTED_ITEM_CLASS, !!state.selected);
    }
}
