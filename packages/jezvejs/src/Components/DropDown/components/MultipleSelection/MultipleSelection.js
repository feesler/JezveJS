import { deepMeet } from '../../../../js/common.js';
import { ListContainer } from '../../../ListContainer/ListContainer.js';
import { DropDownMultiSelectionItem } from '../MultiSelectionItem/MultiSelectionItem.js';
import './style.scss';

const defaultProps = {
    ItemComponent: DropDownMultiSelectionItem,
    className: 'dd__selection',
};

export class DropDownMultipleSelection extends ListContainer {
    constructor(props = {}) {
        const listProps = {
            ...defaultProps,
            ...props,
        };
        listProps.itemSelector = listProps.ItemComponent.selector;

        super(listProps);
    }

    getItemProps(item, state) {
        return {
            ...item,
            active: item.id === state.activeItemId,
        };
    }

    isChanged(state, prevState) {
        return (
            !deepMeet(state.items, prevState?.items)
            || state.activeItemId !== prevState?.activeItemId
        );
    }
}
