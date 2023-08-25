import { getClassName, isFunction } from '../../../../js/common.js';
import { ListContainer } from '../../../ListContainer/ListContainer.js';

import { isNullId } from '../../helpers.js';
import { MenuCheckbox } from '../Checkbox/MenuCheckbox.js';
import { CheckboxItem } from '../CheckboxItem/CheckboxItem.js';
import { MenuItem } from '../ListItem/MenuItem.js';
import './MenuList.scss';

/* CSS classes */
const MENU_LIST_CLASS = 'menu-list';
const LEFT_COLUMN_CLASS = 'menu-list_left';
const RIGHT_COLUMN_CLASS = 'menu-list_right';

const defaultProps = {
    items: [],
    disabled: false,
    defaultItemType: 'button',
    onGroupHeaderClick: null,
    useURLParam: false,
    itemParam: 'value',
    renderTime: null,
    getItemComponent: null,
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
        if (isFunction(state.getItemComponent)) {
            return state.getItemComponent(item, state);
        }

        return super.getItemComponent(item, state);
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
            || state.renderNotSelected !== prevState?.renderNotSelected
            || state.renderTime !== prevState?.renderTime
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

        if (isNullId(item)) {
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

    render(state, prevState = {}) {
        super.render(state, prevState);

        this.elem.classList.toggle(LEFT_COLUMN_CLASS, !!state.beforeContent);
        this.elem.classList.toggle(RIGHT_COLUMN_CLASS, !!state.afterContent);
    }
}
