import { createElement, getClassName } from '@jezvejs/dom';
import { Menu } from 'jezvejs/Menu';

import './TableOfContents.scss';

/* CSS classes */
const CONTAINER_CLASS = 'toc-menu';
const TOGGLER_CHECKBOX_CLASS = 'toc-menu-check';

const defaultProps = {
    title: 'Table of contents',
    togglerId: 'showTocCheck',
    items: [],
};

/**
 * Table of contents menu
 */
export class TableOfContents extends Menu {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(CONTAINER_CLASS, props.className),
            defaultItemType: 'link',
        });
    }

    init() {
        super.init();

        const {
            togglerId,
            title,
        } = this.props;

        this.labelElem = createElement('label', {
            props: { htmlFor: togglerId, textContent: title },
        });
        this.togglerCheckbox = createElement('input', {
            props: { id: togglerId, type: 'checkbox', className: TOGGLER_CHECKBOX_CLASS },
        });

        this.elem.prepend(this.labelElem, this.togglerCheckbox);
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        this.labelElem.textContent = state.title;
    }
}
