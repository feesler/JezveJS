import { getClassName } from 'jezvejs';
import { MenuGroupItem } from 'jezvejs/Menu';

import { CheckboxMenuGroupHeader } from '../GroupHeader/CheckboxMenuGroupHeader.js';
import './CheckboxMenuGroupItem.scss';

/* CSS classes */
const CHECKBOX_GROUP_CLASS = 'checkbox-menu-group';
const SELECTED_CLASS = 'selected';

const defaultProps = {
    selected: false,
    components: {
        GroupHeader: CheckboxMenuGroupHeader,
    },
};

/**
 * Collapsible menu group component
 */
export class CheckboxMenuGroupItem extends MenuGroupItem {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(CHECKBOX_GROUP_CLASS, props.className),
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });
    }

    createHeader() {
        const { GroupHeader } = this.props.components;
        if (!GroupHeader) {
            throw new Error('Invalid group header component');
        }

        this.header = GroupHeader.create({
            id: this.props.id,
            title: this.props.title,
            selected: this.props.selected,
            disabled: this.props.disabled,
        });
    }

    renderHeader(state, prevState) {
        if (
            state.title === prevState?.title
            && state.selected === prevState?.selected
            && state.disabled === prevState?.disabled
        ) {
            return;
        }

        this.header.setState((headerState) => ({
            ...headerState,
            id: state.id,
            title: state.title,
            selected: state.selected,
            disabled: state.disabled,
        }));
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        this.elem.classList.toggle(SELECTED_CLASS, !!state.selected);
    }
}
