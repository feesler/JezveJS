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
    tagName: 'div',
    ItemComponent: null,
    itemSelector: null, // mandatory item CSS selector
    getItemProps: null, // optional callback to map items to props
    getItemById: null, // optional callback to obtain item by id
    isListChanged: null, // optional callback to verify list content was changed
    isEmptyList: null, // optional callback to verify list is empty
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
        this.elem = createElement(this.props.tagName);

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
        if (isFunction(this.state.getItemById)) {
            return this.state.getItemById(id);
        }

        const strId = id.toString();
        return this.state.items.find((item) => item && item.id.toString() === strId);
    }

    /**
     * Returns index of item with specified id
     * @param {number} id - identifier of item
     */
    getItemIndexById(id) {
        const strId = id.toString();
        return this.state.items.findIndex((item) => item && item.id.toString() === strId);
    }

    /**
     * Returns item id from specified item element
     * @param {Element} elem - target list item element
     */
    itemIdFromElem(elem) {
        const listItemElem = elem?.closest(this.props.itemSelector);
        return listItemElem?.dataset?.id ?? null;
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

    /**
     * Toggle selects/deselects item by id
     * @param {string} id identifier of item to toggle select
     */
    toggleSelectItem(itemId) {
        if (!this.getItemById(itemId)) {
            return;
        }

        const strId = itemId.toString();
        const toggleItem = (item) => (
            (item.id.toString() === strId)
                ? { ...item, selected: !item.selected }
                : item
        );

        this.setState({
            ...this.state,
            items: this.state.items.map(toggleItem),
        });
    }

    /**
     * Returns default element for 'no data' message
     * @param {object} props message properties object
     */
    defaultNoDataMessage(props) {
        return createElement('span', {
            props: {
                className: props?.className,
                textContent: props?.message,
            },
        });
    }

    /**
     * Renders 'no data' message
     * @param {object} state current state object
     * @param {object} prevState previous state object
     */
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
            ? state.noItemsMessage()
            : this.defaultNoDataMessage({
                message: state.noItemsMessage,
                className: state.noItemsMessageClass,
            });

        this.elem.append(this.noDataMsg);
    }

    /**
     * Returns instance of list item component for specified id
     * @param {string} id identifier of item
     */
    getListItemById(id) {
        const strId = id.toString();
        return this.listItems.find((item) => item.id.toString() === strId);
    }

    /**
     * Returns render properties for specified item
     * @param {object} item
     * @param {object} state current list state object
     */
    getItemProps(item, state) {
        return isFunction(state.getItemProps)
            ? state.getItemProps(item, state)
            : item;
    }

    /**
     * Returns component class for specified item
     * @param {object} item
     * @param {object} state current state of list
     */
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

    /**
     * Performs common preparations for element of list item before to insert to DOM
     * @param {Component} listItem instance of list item component
     */
    prepareListItemElement(listItem, item) {
        const { elem } = listItem;
        elem.dataset.id = item.id;
    }

    /**
     * Compares current and previous states and returns true if list updates must be rendered
     * @param {object} state current state object
     * @param {object} prevState previous state object
     */
    isChanged(state, prevState) {
        if (isFunction(state.isListChanged)) {
            return state.isListChanged(state, prevState);
        }

        return (
            state.items !== prevState.items
            || state.listMode !== prevState.listMode
            || state.noItemsMessage !== prevState.noItemsMessage
        );
    }

    /**
     * Returns true if list is empty or all items are hidden
     * @param {object} state current state object
     */
    isEmptyList(state) {
        if (isFunction(state?.isEmptyList)) {
            return state.isEmptyList(state);
        }

        return (
            !Array.isArray(state?.items)
            || state.items.length === 0
            || state.items.every((item) => item.hidden)
        );
    }

    /**
     * Renders list items
     * @param {object} state current state object
     * @param {object} prevState previous state object
     */
    renderList(state, prevState) {
        if (!this.isChanged(state, prevState)) {
            return;
        }

        if (!state.items) {
            throw new Error('Invalid state');
        }

        const emptyList = this.isEmptyList(state);
        const emptyBefore = this.isEmptyList(prevState);
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
        for (let index = 0; index < state.items.length; index += 1) {
            const item = state.items[index];
            const itemProps = this.getItemProps(item, state);
            const indexBefore = prevItems.findIndex((prev) => (
                prev.id.toString() === item.id.toString()
            ));

            let listItem = this.getListItemById(item.id);
            const insertNode = (index !== indexBefore) || !listItem;

            if (listItem) {
                listItem.setState(itemProps);
            } else {
                const ItemComponent = this.getItemComponent(item, state);
                listItem = ItemComponent.create(itemProps);
                this.prepareListItemElement(listItem, item);
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
        }

        // Remove items not included in new state
        const childElems = Array.from(this.elem.children);
        childElems.forEach((elem) => {
            if (!listElems.includes(elem)) {
                re(elem);
            }
        });

        this.listItems = listItems;
    }

    /**
     * Renders current state of component
     * @param {object} state current state object
     * @param {object} prevState previous state object
     */
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