import { createElement, createSVGElement, getClassName } from '../../../../js/common.js';
import { Icon } from '../../../Icon/Icon.js';
import { MenuItem } from '../ListItem/MenuItem.js';

import './CheckboxItem.scss';

/* CSS classes */
const CHECKBOX_ITEM_CLASS = 'checkbox-menu-item';
const SELECTED_ITEM_CLASS = 'menu-item_selected';
const CHECKBOX_CLASS = 'menu-item__check';
const ICON_CLASS = 'menu-item__icon';

const ICON_PATH = 'm17.5 6.31a.555.555 0 01.542.148l1.19 1.19a.555.555 0 010 .793l-9.1 9.1c-.218.218-.595.218-.793 0l-4.66-4.64a.555.555 0 010-.793l1.19-1.19a.555.555 0 01.793 0l3.05 3.07 7.53-7.53a.555.555 0 01.251-.148z';
const ICON_VIEWBOX = '0 0 24 24';

const defaultProps = {
    selected: false,
    checkboxSide: 'left', // available value: 'left', 'right'
};

/**
 * Checkbox menu list item component
 */
export class CheckboxItem extends MenuItem {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(CHECKBOX_ITEM_CLASS, props.className),
        });
    }

    init() {
        super.init();

        if (this.props.type !== 'checkbox') {
            throw new Error('Invalid type of menu item');
        }

        this.checkboxElem = createElement('div', {
            props: { className: CHECKBOX_CLASS },
            children: Icon.create({
                icon: this.createCheckIcon(),
                className: ICON_CLASS,
            }).elem,
        });
    }

    createCheckIcon() {
        return createSVGElement('svg', {
            attrs: { viewBox: ICON_VIEWBOX },
            children: createSVGElement('path', { attrs: { d: ICON_PATH } }),
        });
    }

    renderBeforeContent(state, prevState) {
        if (
            state.checkboxSide === prevState?.checkboxSide
            || !state.beforeContent
        ) {
            return;
        }

        if (state.checkboxSide !== 'left') {
            super.renderBeforeContent(state, prevState);
            return;
        }

        this.beforeElem.textContent = '';
        this.beforeElem.append(this.checkboxElem);
    }

    renderAfterContent(state, prevState) {
        if (
            state.checkboxSide === prevState?.checkboxSide
            || !state.afterContent
        ) {
            return;
        }

        if (state.checkboxSide !== 'right') {
            super.renderAfterContent(state, prevState);
            return;
        }

        this.afterElem.textContent = '';
        this.afterElem.append(this.checkboxElem);
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        this.elem.classList.toggle(SELECTED_ITEM_CLASS, !!state.selected);
    }
}
