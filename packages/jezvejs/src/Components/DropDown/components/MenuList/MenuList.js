import { deepMeet, isFunction } from '../../../../js/common.js';
import { ListContainer } from '../../../ListContainer/ListContainer.js';
import { DropDownGroupItem } from '../GroupItem/GroupItem.js';
import { DropDownListItem } from '../ListItem/ListItem.js';
import { DropDownListPlaceholder } from '../ListPlaceholder/ListPlaceholder.js';

const defaultProps = {
    items: [],
    multi: false,
    filtered: false,
    inputString: false,
    allowCreate: false,
    getPlaceholderProps: null,
    components: {
        ListItem: DropDownListItem,
        ListPlaceholder: DropDownListPlaceholder,
        GroupItem: DropDownGroupItem,
    },
};

export class DropDownMenuList extends ListContainer {
    constructor(props = {}) {
        const listProps = {
            ...defaultProps,
            ...props,
            tagName: 'ul',
            ItemComponent: (item, state) => (
                (item.isGroup)
                    ? state.components.GroupItem
                    : state.components.ListItem
            ),
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
            getPlaceholderProps: (state) => (
                isFunction(props.getPlaceholderProps)
                    ? props.getPlaceholderProps(state)
                    : props.getPlaceholderProps
            ),
        };
        listProps.itemSelector = listProps.components.ListItem.selector;
        listProps.PlaceholderComponent = listProps.components.ListPlaceholder;

        super(listProps);
    }

    getItemProps(item, state) {
        return {
            ...item,
            multi: state.multi,
            filtered: state.filtered,
            hidden: item.hidden || (state.filtered && !item.matchFilter),
            components: {
                MenuList: DropDownMenuList,
                ListItem: DropDownListItem,
                GroupItem: DropDownGroupItem,
            },
        };
    }

    isChanged(state, prevState) {
        return (
            !deepMeet(state.items, prevState?.items)
            || state.multi !== prevState?.multi
            || state.filtered !== prevState?.filtered
            || state.inputString !== prevState?.inputString
            || state.allowCreate !== prevState?.allowCreate
            || state.placeholderActive !== prevState?.placeholderActive
            || state.PlaceholderComponent !== prevState?.PlaceholderComponent
        );
    }
}
