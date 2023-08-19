import { getClassName, isFunction } from '../../../../js/common.js';
import { ListContainer } from '../../../ListContainer/ListContainer.js';

import { MenuCheckbox } from '../Checkbox/MenuCheckbox.js';
import { CheckboxItem } from '../CheckboxItem/CheckboxItem.js';
import { MenuItem } from '../ListItem/MenuItem.js';
import './MenuList.scss';

/* CSS classes */
const MENU_LIST_CLASS = 'menu-list';

const defaultProps = {
    items: [],
    disabled: false,
    defaultItemType: 'button',
    onGroupHeaderClick: null,
    useURLParam: false,
    itemParam: 'value',
    components: {
        ListItem: MenuItem,
        GroupHeader: null,
        GroupItem: null,
        Check: MenuCheckbox,
        Checkbox: CheckboxItem,
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
        const {
            type = state.defaultItemType,
        } = item;

        if (type === 'button' || type === 'link') {
            return state.components.ListItem;
        }

        if (
            item.selectable
            && (type === 'checkbox' || type === 'checkbox-link')
        ) {
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
        const { ListItem } = this.props.components;

        return {
            ...ListItem.defaultProps,
            ...item,
            beforeContent: item.beforeContent ?? state.beforeContent,
            afterContent: item.afterContent ?? state.afterContent,
            iconAlign: item.iconAlign ?? state.iconAlign,
            tabThrough: item.tabThrough ?? state.tabThrough,
            checkboxSide: item.checkboxSide ?? state.checkboxSide,
            useURLParam: item.useURLParam ?? state.useURLParam,
            itemParam: item.itemParam ?? state.itemParam,
            disabled: item.disabled || state.disabled,
            getItemURL: (itemState) => this.getItemURL(itemState, state),
            components: {
                ...state.components,
            },
        };
    }

    isNullValue(item) {
        return (item?.id ?? null) === null;
    }

    getItemURL(item, state) {
        const baseURL = item.url ?? window.location;
        const { itemParam } = state;
        const arrayParam = `${itemParam}[]`;
        const param = (state.multiple) ? arrayParam : itemParam;

        const url = new URL(baseURL);
        if (!this.isNullValue(item)) {
            url.searchParams.set(param, item.id);

            const delParam = (state.multiple) ? itemParam : arrayParam;
            url.searchParams.delete(delParam);
        } else {
            url.searchParams.delete(param);
        }

        return url;
    }

    isChanged(state, prevState) {
        return (
            state.items !== prevState?.items
            || state.disabled !== prevState?.disabled
            || state.itemParam !== prevState?.itemParam
            || state.useURLParam !== prevState?.useURLParam
            || state.beforeContent !== prevState?.beforeContent
            || state.afterContent !== prevState?.afterContent
            || state.iconAlign !== prevState?.iconAlign
            || state.checkboxSide !== prevState?.checkboxSide
        );
    }

    /**
     * Item click event handler
     * @param {Event} e - click event object
     */
    onItemClick(e) {
        const item = this.itemFromElem(e?.target);
        if (!item) {
            return;
        }

        if (item.type === 'placeholder') {
            if (isFunction(this.props.onPlaceholderClick)) {
                this.props.onPlaceholderClick(e);
            }
            return;
        }

        if (!item.id) {
            return;
        }

        const { GroupHeader } = this.state.components;

        if (item.type === 'group') {
            if (!e?.target.closest(GroupHeader?.selector)) {
                return;
            }

            if (isFunction(this.props.onGroupHeaderClick)) {
                this.props.onGroupHeaderClick(item.id, e);
            }
            return;
        }

        if (isFunction(this.props.onItemClick)) {
            this.props.onItemClick(item.id, e);
        }
    }
}
