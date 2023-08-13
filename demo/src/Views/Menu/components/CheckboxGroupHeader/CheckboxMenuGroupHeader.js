import { createElement } from 'jezvejs';
import { MenuGroupHeader, MenuCheckbox } from 'jezvejs/Menu';

import './CheckboxMenuGroupHeader.scss';

/* CSS classes */
const TITLE_CLASS = 'menu-group-header__title';

const defaultProps = {
    title: null,
    selected: false,
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
        super.init();

        this.titleElem = createElement('span', {
            props: { className: TITLE_CLASS },
        });

        this.checkbox = MenuCheckbox.create();

        this.elem.append(this.titleElem, this.checkbox.elem);
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.titleElem.textContent = state.title ?? '';
    }
}
