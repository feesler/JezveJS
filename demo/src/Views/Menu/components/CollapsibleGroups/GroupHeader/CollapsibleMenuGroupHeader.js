import { createElement } from 'jezvejs';
import { MenuGroupHeader } from 'jezvejs/Menu';
import { Icon } from 'jezvejs/Icon';

import './CollapsibleMenuGroupHeader.scss';

/* CSS classes */
const TITLE_CLASS = 'menu-group-header__title';
const TOGGLE_ICON_CLASS = 'menu-group-header__toggle-icon';

const defaultProps = {
    title: null,
    expanded: true,
};

/**
 * Collapsible menu group header component
 */
export class CollapsibleMenuGroupHeader extends MenuGroupHeader {
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
        this.toggleBtn = Icon.create({
            className: TOGGLE_ICON_CLASS,
        });

        this.elem.append(this.titleElem, this.toggleBtn.elem);
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.titleElem.textContent = state.title ?? '';

        if (state.expanded !== prevState?.expanded) {
            this.toggleBtn.setIcon((state.expanded) ? 'minus' : 'plus');
        }
    }
}
