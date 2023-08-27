import { getClassName, isFunction } from '../../../../js/common.js';
import { ListContainer } from '../../../ListContainer/ListContainer.js';

import './MenuList.scss';

/* CSS classes */
const MENU_LIST_CLASS = 'menu-list';
const LEFT_COLUMN_CLASS = 'menu-list_left';
const RIGHT_COLUMN_CLASS = 'menu-list_right';

const defaultProps = {
    items: [],
    disabled: false,
    defaultItemType: 'button',
    useURLParam: false,
    itemParam: 'value',
    renderTime: null,
    getItemComponent: null,
    components: {
        ListItem: null,
        GroupHeader: null,
        GroupItem: null,
        Check: null,
        Checkbox: null,
        Separator: null,
        ListPlaceholder: null,
    },
};

/**
 * Menu list container component
 */
export class MenuList extends ListContainer {
    constructor(props = {}) {
        const listProps = {
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
            className: getClassName(MENU_LIST_CLASS, props.className),
        };
        listProps.itemSelector = listProps.components.ListItem.selector;
        listProps.PlaceholderComponent = listProps.components.ListPlaceholder;

        super(listProps);
    }

    /**
     * Returns component class for specified item
     * @param {object} item
     * @param {object} state current state of list
     */
    getItemComponent(item, state) {
        if (isFunction(state.getItemComponent)) {
            return state.getItemComponent(item, state);
        }

        return super.getItemComponent(item, state);
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        this.elem.classList.toggle(LEFT_COLUMN_CLASS, !!state.beforeContent);
        this.elem.classList.toggle(RIGHT_COLUMN_CLASS, !!state.afterContent);
    }
}
