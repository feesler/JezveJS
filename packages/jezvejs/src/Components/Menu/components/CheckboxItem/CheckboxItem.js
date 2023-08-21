import { getClassName } from '../../../../js/common.js';

import { MenuCheckbox } from '../Checkbox/MenuCheckbox.js';
import { MenuItem } from '../ListItem/MenuItem.js';
import './CheckboxItem.scss';

/* CSS classes */
const CHECKBOX_ITEM_CLASS = 'checkbox-menu-item';

const defaultProps = {
    selected: false,
    checkboxSide: 'left', // available value: 'left', 'right'
    renderNotSelected: false,
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

    createCheck(state) {
        const { type } = state;
        if (type !== 'checkbox' && type !== 'checkbox-link') {
            throw new Error('Invalid type of menu item');
        }

        const { Check } = state.components;
        if (!Check) {
            throw new Error('Invalid check component');
        }

        return Check.create().elem;
    }

    renderBeforeContent(state, prevState) {
        if (state.checkboxSide !== 'left') {
            return super.renderBeforeContent(state, prevState);
        }

        if (
            state.selected === prevState?.selected
            && state.renderNotSelected === prevState?.renderNotSelected
            && state.type === prevState?.type
        ) {
            return this.beforeContent;
        }

        if (state.selected || state.renderNotSelected) {
            return this.createCheck(state);
        }

        return null;
    }

    renderAfterContent(state, prevState) {
        if (state.checkboxSide !== 'right') {
            return super.renderAfterContent(state, prevState);
        }
        if (
            state.selected === prevState?.selected
            && state.renderNotSelected === prevState?.renderNotSelected
            && state.type === prevState?.type
        ) {
            return this.afterContent;
        }

        if (state.selected || state.renderNotSelected) {
            return this.createCheck(state);
        }

        return null;
    }
}
