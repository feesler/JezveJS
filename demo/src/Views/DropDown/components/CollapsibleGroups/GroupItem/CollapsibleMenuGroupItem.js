import { getClassName } from '@jezvejs/dom';
import { MenuGroupItem } from 'jezvejs/Menu';

import { DropDownCollapsibleMenuGroupHeader } from '../GroupHeader/CollapsibleMenuGroupHeader.js';
import './CollapsibleMenuGroupItem.scss';

/* CSS classes */
const COLLAPSIBLE_GROUP_CLASS = 'menu-group_collapsible';
const EXPANDED_CLASS = 'expanded';

const defaultProps = {
    expanded: true,
    components: {
        GroupHeader: DropDownCollapsibleMenuGroupHeader,
    },
};

/**
 * Collapsible menu group component
 */
export class DropDownCollapsibleMenuGroupItem extends MenuGroupItem {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(COLLAPSIBLE_GROUP_CLASS, props.className),
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
            expanded: this.props.expanded,
        });
    }

    renderHeader(state, prevState) {
        if (
            state.id === prevState?.id
            && state.title === prevState?.title
            && state.expanded === prevState?.expanded
        ) {
            return;
        }

        this.header.setState((headerState) => ({
            ...headerState,
            id: state.id,
            title: state.title,
            expanded: state.expanded,
        }));
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        this.elem.classList.toggle(EXPANDED_CLASS, state.expanded);
    }
}
