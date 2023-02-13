import {
    createElement,
    setEvents,
    isFunction,
    re,
    removeChilds,
    insertAfter,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';

const defaultProps = {
    ItemComponent: null,
    itemSelector: null, // mandatory item CSS selector
    getItemProps: null, // optional callback to map items to props
    getItemById: null, // optional callback to obtain item by id
    isListChanged: null, // optional callback to verify list content was changed
    items: [],
    noItemsMessageClass: 'nodata-message',
    noItemsMessage: null, // string, function returns string or null for no message
    listMode: 'list',
    selectModeClass: null,
    onItemClick: null,
};

/**
 * List container component
 */
export class ListContainer extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        if (!this.props.ItemComponent) {
            throw new Error('Item component not specified');
        }
        if (!this.props.itemSelector) {
            throw new Error('Item selector not specified');
        }

        this.state = {
            ...this.props,
            renderTime: Date.now(),
        };

        this.listItems = [];
        this.noDataMsg = null;

        this.init();
    }

    init() {
        this.elem = createElement('div');

        this.setClassNames();
        this.setHandlers();

        this.render(this.state);
    }

    setHandlers() {
        if (isFunction(this.props.onItemClick)) {
            setEvents(this.elem, { click: (e) => this.onItemClick(e) });
        }
    }

    /** Returns array of list items */
    getItems() {
        return this.state.items;
    }

    /** Returns array of selected items */
    getSelectedItems() {
        return this.getItems().filter((item) => item.selected);
    }

    /**
     * Search for item by specified id
     * @param {number} id - identifier of item
     */
    getItemById(id) {
        return (isFunction(this.state.getItemById))
            ? this.state.getItemById(id)
            : this.state.items.find((item) => item && item.id === id);
    }

    /**
     * Returns index of item with specified id
     * @param {number} id - identifier of item
     */
    getItemIndexById(id) {
        return this.state.items.findIndex((item) => item && item.id === id);
    }

    /**
     * Returns item id from specified item element
     * @param {Element} elem - target list item element
     */
    itemIdFromElem(elem) {
        const listItemElem = elem?.closest(this.props.itemSelector);
        if (!listItemElem?.dataset) {
            return 0;
        }

        return parseInt(listItemElem.dataset.id, 10);
    }

    /**
     * Returns item fom specified list element
     * @param {Element} elem - target list item element
     */
    itemFromElem(elem) {
        return this.getItemById(this.itemIdFromElem(elem));
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

        if (isFunction(this.props.onItemClick)) {
            this.props.onItemClick(itemId, e);
        }
    }

    toggleSelectItem(itemId) {
        if (!this.getItemById(itemId)) {
            return;
        }

        const toggleItem = (item) => (
            (item.id === itemId)
                ? { ...item, selected: !item.selected }
                : item
        );

        this.setState({
            ...this.state,
            items: this.state.items.map(toggleItem),
        });
    }

    defaultNoDataMessage(props) {
        return createElement('span', {
            props: {
                className: props?.className,
                textContent: props?.message,
            },
        });
    }

    renderNoDataMessage(state, prevState) {
        if (
            state.items === prevState.items
            && state.noItemsMessage === prevState.noItemsMessage
        ) {
            return;
        }

        if (this.noDataMsg) {
            re(this.noDataMsg);
            this.noDataMsg = null;
        }

        if (!state.noItemsMessage) {
            return;
        }

        this.noDataMsg = (isFunction(state.noItemsMessage))
            ? this.state.noItemsMessage()
            : this.defaultNoDataMessage({
                message: state.noItemsMessage,
                className: state.noItemsMessageClass,
            });

        this.elem.append(this.noDataMsg);
    }

    getListItemById(id) {
        return this.listItems.find((item) => item.id === id);
    }

    getItemProps(item, state) {
        return isFunction(state.getItemProps)
            ? state.getItemProps(item, state)
            : item;
    }

    getItemComponent(item, state) {
        if (state.ItemComponent?.prototype instanceof Component) {
            return state.ItemComponent;
        }

        const res = isFunction(state.ItemComponent) && state.ItemComponent(item, state);
        if (!res) {
            throw new Error('Invalid item component');
        }

        return res;
    }

    isChanged(state, prevState) {
        if (isFunction(state.isListChanged)) {
            return state.isListChanged(state, prevState);
        }

        return (
            state.items !== prevState.items
            || state.listMode !== prevState.listMode
        );
    }

    renderList(state, prevState) {
        if (!this.isChanged(state, prevState)) {
            return;
        }

        if (!state.items) {
            throw new Error('Invalid state');
        }

        const emptyList = state.items.length === 0;
        const emptyBefore = !prevState.items || prevState.items.length === 0;
        if ((emptyList || emptyBefore) && emptyList !== emptyBefore) {
            removeChilds(this.elem);
            this.noDataMsg = null;
            this.listItems = [];
        }

        if (emptyList) {
            this.renderNoDataMessage(state, prevState);
            return;
        }

        const listItems = [];
        const listElems = [];

        const prevItems = prevState?.items ?? [];
        let lastItem = null;
        state.items.forEach((item, index) => {
            const itemProps = this.getItemProps(item, state);
            const indexBefore = prevItems.findIndex((prev) => prev.id === item.id);

            let listItem = this.getListItemById(item.id);
            const insertNode = (index !== indexBefore) || !listItem;

            if (listItem) {
                listItem.setState(itemProps);
            } else {
                const ItemComponent = this.getItemComponent(item, state);
                listItem = ItemComponent.create(itemProps);
            }

            if (insertNode) {
                if (lastItem) {
                    insertAfter(listItem.elem, lastItem.elem);
                } else {
                    this.elem.prepend(listItem.elem);
                }
            }

            lastItem = listItem;
            listItems.push(listItem);
            listElems.push(listItem.elem);
        });

        // Remove items not included in new state
        const childElems = Array.from(this.elem.children);
        childElems.forEach((elem) => {
            if (!listElems.includes(elem)) {
                re(elem);
            }
        });

        this.listItems = listItems;
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state object');
        }

        this.renderList(state, prevState);
        if (state.selectModeClass) {
            this.elem.classList.toggle(state.selectModeClass, state.listMode === 'select');
        }

        this.elem.dataset.time = state.renderTime;
    }
}
