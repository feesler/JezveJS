import { deepMeet } from '../../../../js/common.js';
import { ListContainer } from '../../../ListContainer/ListContainer.js';
import { DropDownGroupItem } from '../GroupItem/GroupItem.js';
import { DropDownListItem } from '../ListItem/ListItem.js';

const defaultProps = {
    items: [],
    multi: false,
    filtered: false,
    noItemsMessage: null,
    components: {
        ListItem: DropDownListItem,
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
        };
        listProps.itemSelector = listProps.components.ListItem.selector;

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
            || state.noItemsMessage !== prevState?.noItemsMessage
        );
    }
}
