import { createElement, getClassName } from 'jezvejs';
import { MenuGroupHeader } from 'jezvejs/Menu';
import { Icon } from 'jezvejs/Icon';

import './CollapsibleMenuGroupHeader.scss';

/* CSS classes */
const TITLE_CLASS = 'menu-group-header__title';
const TOGGLE_ICON_CLASS = 'menu-item__icon menu-group-header__toggle-icon';

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
        this.titleElem = createElement('span', {
            props: { className: TITLE_CLASS },
        });
        this.toggleBtn = Icon.create({
            className: TOGGLE_ICON_CLASS,
        });

        this.elem = createElement('button', {
            props: {
                className: getClassName(MenuGroupHeader.className, 'menu-item'),
                type: 'button',
            },
            children: [this.titleElem, this.toggleBtn.elem],
        });
    }

    get id() {
        return this.state.id;
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.elem.dataset.id = state.id;

        this.titleElem.textContent = state.title ?? '';

        if (state.expanded !== prevState?.expanded) {
            this.toggleBtn.setIcon((state.expanded) ? 'minus' : 'plus');
        }
    }
}
