import { getClassName } from 'jezvejs';
import { MenuGroupItem } from 'jezvejs/Menu';

import { CollapsibleMenuGroupHeader } from '../GroupHeader/CollapsibleMenuGroupHeader.js';
import './CollapsibleMenuGroupItem.scss';

/* CSS classes */
const COLLAPSIBLE_GROUP_CLASS = 'menu-group_collapsible';
const EXPANDED_CLASS = 'expanded';

const defaultProps = {
    expanded: true,
    components: {
        GroupHeader: CollapsibleMenuGroupHeader,
    },
};

/**
 * Collapsible menu group component
 */
export class CollapsibleMenuGroupItem extends MenuGroupItem {
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
            title: this.props.title,
            expanded: this.props.expanded,
        });
    }

    renderHeader(state, prevState) {
        if (
            state.title === prevState?.title
            && state.expanded === prevState?.expanded
        ) {
            return;
        }

        this.header.setState((headerState) => ({
            ...headerState,
            title: state.title,
            expanded: state.expanded,
        }));
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        this.elem.classList.toggle(EXPANDED_CLASS, state.expanded);
    }
}
