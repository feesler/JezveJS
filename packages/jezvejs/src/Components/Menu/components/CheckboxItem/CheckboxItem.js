import { getClassName } from '../../../../js/common.js';

import { MenuCheckbox } from '../Checkbox/MenuCheckbox.js';
import { MenuItem } from '../ListItem/MenuItem.js';
import './CheckboxItem.scss';

/* CSS classes */
const CHECKBOX_ITEM_CLASS = 'checkbox-menu-item';

const defaultProps = {
    selected: false,
    checkboxSide: 'left', // available value: 'left', 'right'
    components: {
        Check: MenuCheckbox,
    },
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
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });
    }

    init() {
        super.init();

        if (
            this.props.type !== 'checkbox'
            && this.props.type !== 'checkbox-link'
        ) {
            throw new Error('Invalid type of menu item');
        }

        const { Check } = this.props.components;
        if (!Check) {
            throw new Error('Invalid check component');
        }

        this.checkbox = Check.create();
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
        this.beforeElem.append(this.checkbox.elem);
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
        this.afterElem.append(this.checkbox.elem);
    }
}
