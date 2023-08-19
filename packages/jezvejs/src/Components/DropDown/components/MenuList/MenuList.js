import { deepMeet, isFunction } from '../../../../js/common.js';
import { MenuList } from '../../../Menu/Menu.js';
import { DropDownGroupItem } from '../GroupItem/GroupItem.js';
import { DropDownListItem } from '../ListItem/ListItem.js';
import { DropDownListPlaceholder } from '../ListPlaceholder/ListPlaceholder.js';

const defaultProps = {
    items: [],
    multiple: false,
    filtered: false,
    inputString: false,
    getPlaceholderProps: null,
    components: {
        ListItem: DropDownListItem,
        ListPlaceholder: DropDownListPlaceholder,
        GroupItem: DropDownGroupItem,
    },
};

export class DropDownMenuList extends MenuList {
    constructor(props = {}) {
        const listProps = {
            ...defaultProps,
            ...props,
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

        super(listProps);
    }

    getItemProps(item, state) {
        const props = super.getItemProps(item, state);

        return {
            ...props,
            multiple: state.multiple,
            filtered: state.filtered,
            hidden: item.hidden || (state.filtered && !item.matchFilter),
            components: {
                ...props.components,
                MenuList: DropDownMenuList,
            },
        };
    }

    isChanged(state, prevState) {
        return (
            super.isChanged(state, prevState)
            || !deepMeet(state.items, prevState?.items)
            || state.multiple !== prevState?.multiple
            || state.filtered !== prevState?.filtered
            || state.inputString !== prevState?.inputString
            || state.PlaceholderComponent !== prevState?.PlaceholderComponent
        );
    }
}
