import { getClassName } from '../../../../js/common.js';
import { ListContainer } from '../../../ListContainer/ListContainer.js';
import { CheckboxItem } from '../CheckboxItem/CheckboxItem.js';

import { MenuItem } from '../ListItem/MenuItem.js';
import './MenuList.scss';

/* CSS classes */
const MENU_LIST_CLASS = 'menu-list';

const defaultProps = {
    items: [],
    defaultItemType: 'button',
    components: {
        ListItem: MenuItem,
        GroupItem: null,
        Checkbox: CheckboxItem,
        Separator: null,
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

        super(listProps);
    }

    /**
     * Returns component class for specified item
     * @param {object} item
     * @param {object} state current state of list
     */
    getItemComponent(item, state) {
        const {
            type = state.defaultItemType,
        } = item;

        if (type === 'button' || type === 'link') {
            return state.components.ListItem;
        }

        if (type === 'checkbox') {
            return state.components.Checkbox;
        }

        if (type === 'separator') {
            return state.components.Separator;
        }

        if (type === 'group') {
            return state.components.GroupItem;
        }

        throw new Error('Unknown type of menu item');
    }

    /**
     * Returns render properties for specified item
     * @param {object} item
     * @param {object} state current list state object
     */
    getItemProps(item, state) {
        return {
            ...item,
            beforeContent: state.beforeContent,
            afterContent: state.afterContent,
            components: {
                ...state.components,
                MenuList,
            },
        };
    }

    isChanged(state, prevState) {
        return (
            state.items !== prevState?.items
        );
    }
}
