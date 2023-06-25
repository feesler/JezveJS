import {
    deepMeet,
    enable,
    getClassNames,
    isFunction,
} from '../../js/common.js';
import { SortableListContainer } from '../SortableListContainer/SortableListContainer.js';
import { Tag } from '../Tag/Tag.js';
import './Tags.scss';

const TAGS_CLASS = 'tags';
const SOME_MODE_CLASS = 'tags_sort';

const defaultProps = {
    ItemComponent: Tag,
    closeable: false,
    disabled: false,
    removeItemOnClose: true,
    sortModeClass: SOME_MODE_CLASS,
    onCloseItem: null,
};

/**
 * Tags list components
 */
export class Tags extends SortableListContainer {
    constructor(props = {}) {
        const listProps = {
            ...defaultProps,
            ...props,
            className: getClassNames(TAGS_CLASS, props.className),
        };

        const { ItemComponent } = listProps;
        listProps.itemSelector = ItemComponent.selector;
        listProps.itemSortSelector = ItemComponent.sortSelector ?? ItemComponent.selector;
        listProps.placeholderClass = ItemComponent.placeholderClass;

        super(listProps);
    }

    get closeable() {
        return this.state.closeable;
    }

    get disabled() {
        return this.state.disabled;
    }

    /**
     * Item click event handler
     * @param {Event} e - click event object
     */
    onItemClick(e) {
        const itemId = this.itemIdFromElem(e?.target);
        if (!itemId) {
            return;
        }

        const { ItemComponent } = this.state;
        if (ItemComponent.buttonClass) {
            if (e.target.closest(`.${ItemComponent.buttonClass}`)) {
                e.stopPropagation();

                if (isFunction(this.state.onCloseItem)) {
                    this.state.onCloseItem(itemId, e);
                }

                if (this.state.removeItemOnClose) {
                    this.removeItemsById(itemId);
                }

                return;
            }
        }

        if (isFunction(this.state.onItemClick)) {
            this.state.onItemClick(itemId, e);
        }
    }

    getItemProps(item, state) {
        return {
            ...item,
            listMode: state.listMode,
            active: item.id === state.activeItemId,
            closeable: (
                ('closeable' in item && item.closeable)
                || (!('closeable' in item) && state.closeable)),
        };
    }

    isChanged(state, prevState) {
        return (
            !deepMeet(prevState?.items, state.items)
            || state.listMode !== prevState?.listMode
            || state.activeItemId !== prevState?.activeItemId
        );
    }

    activateItem(activeItemId) {
        if (this.state.activeItemId === activeItemId) {
            return;
        }

        this.setState({
            ...this.state,
            activeItemId,
        });
    }

    enableItem(id, value = true) {
        const strId = id?.toString();

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => (
                (item.id?.toString() !== strId)
                    ? item
                    : { ...item, disabled: !value }
            )),
        });
    }

    enable(value = true) {
        if (this.state.disabled === !value) {
            return;
        }

        this.setState({
            ...this.state,
            disabled: !value,
        });
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        enable(this.elem, !state.disabled);
    }
}
