import { isFunction, asArray } from '@jezvejs/types';
import {
    createElement,
    enable,
    setEvents,
} from '@jezvejs/dom';
import { Component } from '../../Component.js';

import { MenuList } from './components/List/MenuList.js';
import { MenuItem } from './components/ListItem/MenuItem.js';
import { MenuGroupHeader } from './components/GroupHeader/MenuGroupHeader.js';
import { MenuGroupItem } from './components/GroupItem/MenuGroupItem.js';
import { MenuCheckbox } from './components/Checkbox/MenuCheckbox.js';
import { MenuSeparator } from './components/Separator/MenuSeparator.js';
import {
    isNullId,
    findMenuItem,
    forItems,
    generateItemId,
    getActiveItem,
    getItemById,
    toFlatList,
    getNextItem,
    getPreviousItem,
    mapItems,
    getMenuProps,
    findLastMenuItem,
    getGroupById,
    pushItem,
    isCheckbox,
    filterItems,
    createMenuItem,
} from './helpers.js';

import './Menu.scss';
import { combineReducers, createStore } from '../Store/Store.js';
import { reducer, actions } from './reducer.js';

export {
    /* Child components */
    MenuList,
    MenuItem,
    MenuGroupHeader,
    MenuGroupItem,
    MenuSeparator,
    MenuCheckbox,
    /* helper functions */
    generateItemId,
    isNullId,
    findMenuItem,
    getActiveItem,
    getItemById,
    getGroupById,
    toFlatList,
    getNextItem,
    getPreviousItem,
    mapItems,
    pushItem,
    filterItems,
    forItems,
    findLastMenuItem,
    createMenuItem,
};

/* CSS classes */
const MENU_CLASS = 'menu';

const SCROLL_TO_ITEM_TIMEOUT = 200;

const defaultProps = {
    header: {},
    footer: {},
    items: [],
    disabled: false,
    isLostFocus: null,
    onItemClick: null,
    onGroupHeaderClick: null,
    tabThrough: true,
    tabIndex: 0,
    loopNavigation: true,
    multiple: false,
    iconAlign: 'left', // available value: 'left', 'right'
    checkboxSide: 'left', // available value: 'left', 'right'
    renderNotSelected: false,
    defaultItemType: 'button',
    useURLParam: false,
    itemParam: 'value',
    preventNavigation: false,
    focusItemOnHover: true,
    allowActiveGroupHeader: false,
    reducers: null,
    components: {
        Header: null,
        MenuList,
        ListItem: MenuItem,
        Checkbox: MenuItem,
        Check: MenuCheckbox,
        GroupHeader: MenuGroupHeader,
        GroupItem: MenuGroupItem,
        Separator: MenuSeparator,
        ListPlaceholder: null,
        Footer: null,
    },
};

/**
 * Menu component
 */
export class Menu extends Component {
    static userProps = {
        elem: ['id'],
    };

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        this.capturedEvents = {
            focus: (e) => this.onFocus(e),
            blur: (e) => this.onBlur(e),
            keydown: (e) => this.onKeyDown(e),
            touchstart: (e) => this.onTouchStart(e),
        };

        this.callbacks = {
            getItemComponent: (item, state) => this.getItemComponent(item, state),
            getItemProps: (item, state) => this.getItemProps(item, state),
            isListChanged: (state, prevState) => this.isListChanged(state, prevState),
            getItemById: (id) => this.getItemById(id),
            onItemClick: (id, e) => this.onItemClick(id, e),
            onPlaceholderClick: (e) => this.onPlaceholderClick(e),
        };

        this.renderInProgress = false;
        this.activeElem = null;

        // Setup store
        const extraReducers = asArray(this.props.reducers);
        const storeReducer = (extraReducers.length > 0)
            ? combineReducers(reducer, ...extraReducers)
            : reducer;
        this.store = createStore(storeReducer, {
            initialState: this.getInitialState(),
        });

        this.init();
        this.postInit();
        this.subscribeToStore(this.store);
    }

    getInitialState() {
        return {
            ...this.props,
            items: this.createItems(this.props.items, this.props),
            blockScroll: false,
            scrollTimeout: 0,
            ignoreTouch: false,
        };
    }

    init() {
        const {
            header,
            footer,
            components,
            list,
        } = getMenuProps(this.props);
        delete list.id;
        delete list.className;

        const { Header, Footer, ...listComponents } = components;
        const children = [];

        if (Header) {
            this.header = Header.create(header);
            children.push(this.header.elem);
        }

        this.cacheItemProps(list);

        this.list = components.MenuList.create({
            ...list,
            ...this.callbacks,
            components: {
                ...listComponents,
            },
        });
        setEvents(this.list.elem, {
            mouseover: (e) => this.onMouseOver(e),
            mouseout: (e) => this.onMouseOut(e),
            mouseleave: (e) => this.onMouseLeave(e),
        });

        children.push(this.list.elem);

        if (Footer) {
            this.footer = Footer.create(footer);
            children.push(this.footer.elem);
        }

        this.elem = createElement('div', {
            props: { className: MENU_CLASS, tabIndex: 0 },
            children,
            events: {
                scroll: {
                    listener: (e) => this.onScroll(e),
                    options: { capture: true, passive: true },
                },
            },
        });

        setEvents(this.elem, this.capturedEvents, { capture: true });
    }

    postInit() {
        this.setClassNames();
        this.setUserProps();
    }

    /** Returns current state object */
    get state() {
        return this.store.getState();
    }

    /** Return array of all list items */
    get items() {
        return structuredClone(this.state.items);
    }

    /**
     * Enable/disable component
     * @param {boolean} val - if true component will be enabled, disabled otherwise. Default is true
     */
    enable(value = true) {
        if (this.state.disabled === !value) {
            return;
        }

        this.store.dispatch(actions.toggleEnable());
    }

    showItem(id, value = true) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        const action = (value)
            ? actions.showItem(strId)
            : actions.hideItem(strId);
        this.store.dispatch(action);
    }

    hideItem(id) {
        this.showItem(id, false);
    }

    enableItem(id, value = true) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        const action = (value)
            ? actions.enableItem(strId)
            : actions.disableItem(strId);
        this.store.dispatch(action);
    }

    /**
     * Disables item by id
     * Shortcut for .enableItem(id, false) call
     * @param {string} id item id
     */
    disableItem(id) {
        this.enableItem(id, false);
    }

    /**
     * Returns new unique id for item
     * @param {object} state
     * @returns {string} state of component
     */
    generateItemId(state = this.state) {
        return generateItemId(state?.items ?? [], 'item');
    }

    /**
     * Returns new unique id for group
     * @param {object} state
     * @returns {string} state of component
     */
    generateGroupId(state = this.state) {
        return generateItemId(state?.items ?? [], 'group');
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

        if (
            (type === 'button' || type === 'link')
            || (type === 'checkbox' || type === 'checkbox-link')
        ) {
            return state.components.ListItem;
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
        const res = {
            ...this.itemPropsCache,
            ...item,
            disabled: item.disabled || state.disabled,
            getItemURL: (itemState) => this.getItemURL(itemState, state),
            ...this.callbacks,
            components: {
                ...state.components,
            },
        };

        const checkboxAvail = res.selectable && state.multiple;
        if (isCheckbox(res) && !checkboxAvail) {
            res.type = (res.type === 'checkbox') ? 'button' : 'link';
        }

        if (item.type === 'group') {
            res.getItemComponent = (...args) => this.getItemComponent(...args);
            res.getItemProps = (...args) => this.getItemProps(...args);
        }

        return res;
    }

    /**
     * Returns true if list was changed and should be rendered
     * @param {object} state new state of component
     * @param {object} prevState previous state of component
     * @returns {boolean}
     */
    isListChanged(state, prevState) {
        const changeProps = [
            'items',
            'disabled',
            'itemParam',
            'useURLParam',
            'beforeContent',
            'afterContent',
            'iconAlign',
            'checkboxSide',
            'renderNotSelected',
            'renderTime',
        ];

        return changeProps.some((prop) => (state[prop] !== prevState?.[prop]));
    }

    getItemURL(item, state) {
        const useURLParam = item.useURLParam ?? state.useURLParam;
        const itemURL = item.url ?? '';
        const baseURL = window.location;
        const { itemParam } = state;
        const arrayParam = `${itemParam}[]`;
        const param = (state.multiple) ? arrayParam : itemParam;

        const url = new URL(itemURL, baseURL);
        if (!useURLParam) {
            return url;
        }

        if (!isNullId(item)) {
            url.searchParams.set(param, item.id);

            const delParam = (state.multiple) ? itemParam : arrayParam;
            url.searchParams.delete(delParam);
        } else {
            url.searchParams.delete(param);
        }

        return url;
    }

    /**
     * Returns item by specified id
     * @param {string} id item id
     * @returns {object|null}
     */
    getItemById(id) {
        return isFunction(this.state.getItemById)
            ? this.state.getItemById(id)
            : getItemById(id, this.state.items);
    }

    /**
     * Returns active item for specified state
     * @param {object} state
     * @returns
     */
    getActiveItem(state = this.state) {
        return getActiveItem(state?.items);
    }

    /** List item 'click' event handler */
    onItemClick(id, e) {
        e?.stopPropagation();

        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        const item = this.getItemById(id);
        const activeItem = this.getActiveItem();
        const { type } = item;

        // Prevent navigation by link if needed
        if (
            this.state.preventNavigation
            && (type === 'link' || type === 'checkbox-link')
        ) {
            e?.preventDefault();
        }

        // Prevent selection item if active item is exist and not equal to current item
        if (activeItem && activeItem.id !== item.id) {
            this.activateItem(item.id, false);
        }

        // Handle clicks by group header
        if (type === 'group') {
            const { GroupHeader } = this.state.components;
            if (!e?.target.closest(GroupHeader?.selector)) {
                return;
            }

            this.onGroupHeaderClick(item.id, e);
            return;
        }

        this.toggleSelectItem(id);

        if (isFunction(this.props.onItemClick)) {
            this.props.onItemClick(strId, e);
        }

        if (isFunction(item.onClick)) {
            item.onClick(id, e);
        }

        this.activeElem = null;
        if (this.state.ignoreTouch) {
            this.handleLeaveItem(e);
        }
    }

    /** List placeholder 'click' event handler */
    onPlaceholderClick(e) {
        e.stopPropagation();

        if (isFunction(this.props.onPlaceholderClick)) {
            this.props.onPlaceholderClick();
        }
    }

    /** Group header 'click' event handler */
    onGroupHeaderClick(id, e) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        if (isFunction(this.props.onGroupHeaderClick)) {
            this.props.onGroupHeaderClick(id, e);
        }
    }

    /** 'scroll' event handler */
    onScroll() {
        this.setListScroll(this.list.elem.scrollTop);
        if (!this.state.blockScroll) {
            this.setActive(null);
        }

        this.unblockScroll();
    }

    /** 'focus' event handler */
    onFocus(e) {
        const item = this.list.itemFromElem(e?.target);
        if (!item || item.active) {
            return;
        }

        this.setActive(item.id);
    }

    /** 'blur' event handler */
    onBlur(e) {
        if (this.renderInProgress) {
            return;
        }

        if (this.isLostFocus(e)) {
            this.setActive(null);
        }
    }

    /**
     * Returns true if component lost focus
     * @param {Event} e event object
     * @returns {boolean}
     */
    isLostFocus(e) {
        if (isFunction(this.props.isLostFocus)) {
            return this.props.isLostFocus(e);
        }

        return !this.isChildElem(e.relatedTarget);
    }

    /** Returns true if element is child of component */
    isChildElem(elem) {
        return !!elem && this.elem.contains(elem);
    }

    isAvailableItem(item) {
        return (
            item
            && !item.hidden
            && !item.disabled
            && item.type !== 'separator'
            && (
                item.type !== 'group'
                || this.state.allowActiveGroupHeader
            )
        );
    }

    /**
     * 'keydown' event on handler
     * @param {KeyboardEvent} e - event object
     */
    onKeyDown(e) {
        const availCallback = (item) => this.isAvailableItem(item);
        const options = {
            includeGroupItems: this.state.allowActiveGroupHeader,
        };

        if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
            const activeItem = this.getActiveItem();
            let nextItem = (activeItem)
                ? getNextItem(activeItem.id, this.state.items, availCallback, options)
                : findMenuItem(this.state.items, availCallback);

            if (this.state.loopNavigation && activeItem && !nextItem) {
                nextItem = findMenuItem(this.state.items, availCallback);
            }

            if (nextItem && (!activeItem || nextItem.id !== activeItem.id)) {
                this.activateItem(nextItem.id);

                e.preventDefault();
            }

            return;
        }

        if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
            const activeItem = this.getActiveItem();
            let nextItem = (activeItem)
                ? getPreviousItem(activeItem.id, this.state.items, availCallback, options)
                : findLastMenuItem(this.state.items, availCallback);

            if (this.state.loopNavigation && activeItem && !nextItem) {
                nextItem = findLastMenuItem(this.state.items, availCallback);
            }

            if (nextItem && (!activeItem || nextItem.id !== activeItem.id)) {
                this.activateItem(nextItem.id);

                e.preventDefault();
            }
        }

        if (e.key === 'Enter') {
            const activeItem = this.getActiveItem();
            if (activeItem) {
                this.toggleSelectItem(activeItem.id);
            }

            e.preventDefault();
        }
    }

    activateItem(id, scrollToItem = true) {
        const item = getItemById(id, this.state.items);
        if (!this.isAvailableItem(item)) {
            return;
        }

        const activeItem = this.getActiveItem();
        if (item.id === activeItem?.id) {
            return;
        }

        const focusOptions = { preventScroll: true };

        const elem = this.list.itemElemById(id);
        if (item.type === 'group' && this.state.allowActiveGroupHeader) {
            const { GroupHeader } = this.state.components;
            const groupHeader = elem?.querySelector(GroupHeader?.selector);
            groupHeader?.focus(focusOptions);
        } else {
            elem?.focus(focusOptions);
        }

        if (scrollToItem) {
            this.scrollToItem(item);
        }
    }

    /**
     * 'touchstart' event handler
     * Sets ignoreTouch flag for further mouse events
     * @param {TouchEvent} e event object
     */
    onTouchStart(e) {
        if (e.touches) {
            this.store.dispatch(actions.ignoreTouch());
        }
    }

    /**
     * 'mouseover' event handler
     * @param {MouseEvent} e event object
     */
    onMouseOver(e) {
        if (
            this.state.blockScroll
            || this.state.ignoreTouch
            || !this.state.focusItemOnHover
            || this.activeElem
        ) {
            return;
        }

        const itemElem = this.list.getClosestItemElement(e?.target);
        if (!itemElem || !this.isChildElem(itemElem)) {
            return;
        }

        this.activeElem = itemElem;
        this.handleMouseEnter(e);
    }

    /**
     * 'mouseout' event handler
     * @param {MouseEvent} e event object
     */
    onMouseOut(e) {
        if (
            this.state.blockScroll
            || !this.activeElem
        ) {
            return;
        }

        const itemElem = this.list.getClosestItemElement(e.relatedTarget);
        if (itemElem === this.activeElem) {
            return;
        }

        this.activeElem = null;
        if (!this.isChildElem(itemElem)) {
            this.handleLeaveItem(e);
        }
    }

    /**
     * 'mouseleave' event handler
     * @param {MouseEvent} e event object
     */
    onMouseLeave(e) {
        if (this.state.blockScroll) {
            return;
        }

        this.handleLeaveItem(e);
    }

    /**
     * Handles mouse entering to list item element
     * @param {MouseEvent} e event object
     */
    handleMouseEnter(e) {
        const item = this.list.itemFromElem(e?.target);
        if (!item) {
            return;
        }

        if (item.type === 'group') {
            if (!this.state.allowActiveGroupHeader) {
                return;
            }

            const { GroupHeader } = this.state.components;
            if (!e?.target.closest(GroupHeader?.selector)) {
                return;
            }
        }

        this.activateItem(item.id, false);
    }

    /**
     * Handles mouse/pointer leaving list element
     * @param {MouseEvent} e event object
     */
    handleLeaveItem(e) {
        this.activeElem = null;
        this.setActive(null);

        if (
            (e.type === 'mouseleave' || e.type === 'mouseout')
            && isFunction(this.props.onMouseLeave)
        ) {
            this.props.onMouseLeave(e);
            return;
        }

        const focused = document.activeElement;
        if (this.elem.contains(focused)) {
            this.elem.focus({ preventScroll: true });
        }
    }

    /**
     * Activates item by id
     * @param {string} id item id
     */
    setActive(id) {
        const strId = id?.toString() ?? null;
        this.store.dispatch(actions.activateItem(strId));
    }

    /**
     * Selects only specified items by ids
     * @param {string|string[]} selectedItems
     */
    setSelection(selectedItems) {
        const items = asArray(selectedItems).map((value) => value.toString());
        this.store.dispatch(actions.setSelection(items));
    }

    /**
     * Selects/deselect all items
     * @param {boolean} value
     */
    selectAll(value = true) {
        this.store.dispatch(actions.selectAll(!!value));
    }

    /**
     * Deselects all items
     * Shortcut for .selectAll(false) call
     */
    clearSelection() {
        this.selectAll(false);
    }

    /**
     * Create items from specified array
     * @param {Object|Object[]} items
     * @param {Object} state
     */
    createItems(items, state = this.state) {
        return mapItems(
            asArray(items),
            (item) => this.createItem(item, state),
            { includeGroupItems: state.allowActiveGroupHeader },
        );
    }

    /** Returns item object for specified props after applying default values */
    createItem(props = {}, state = this.state) {
        return createMenuItem(props, state);
    }

    /**
     * Create new list item
     * @param {Object} props
     */
    addItem(props) {
        const item = this.createItem(props);
        this.store.dispatch(actions.addItem(item));
    }

    /**
     * Creates new item(s) from specified and appends to the list
     * @param {Object|Object[]} items
     */
    append(items) {
        const newItems = this.createItems(items);
        this.store.dispatch(actions.append(newItems));
    }

    /**
     * Creates new item(s) from specified and replaces contents of the list
     * @param {Object|Object[]} items
     */
    setItems(items) {
        const newItems = this.createItems(items);
        this.store.dispatch(actions.setItems(newItems));
    }

    toggleSelectItem(id) {
        if (this.state.disabled) {
            return;
        }

        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        this.store.dispatch(actions.toggleSelectItem(strId));
    }

    /** Scroll list element until specified list item be fully visible */
    scrollToItem(item) {
        if (!item || item.hidden) {
            return;
        }

        const elem = this.list.itemElemById(item.id);
        if (!elem) {
            return;
        }

        const itemTop = elem.offsetTop - this.list.elem.offsetTop;
        const itemBottom = itemTop + elem.offsetHeight;
        const listTop = this.list.elem.scrollTop;
        const listHeight = this.list.elem.clientHeight;
        const listBottom = listTop + listHeight;

        if (itemTop >= listTop && itemBottom <= listBottom) {
            return;
        }

        const { scrollHeight } = this.list.elem;
        const scrollTop = (itemTop < listTop)
            ? itemTop /* scroll up : decrease scroll top */
            : listTop + itemBottom - listBottom; /* scroll down : increase scroll top */

        this.requestListScroll(Math.min(scrollHeight, scrollTop));
    }

    setListScroll(listScroll) {
        if (this.state.listScroll !== listScroll) {
            this.store.dispatch(actions.setListScroll(listScroll));
        }
    }

    requestListScroll(listScroll) {
        if (this.state.listScroll === listScroll) {
            return;
        }

        if (this.state.scrollTimeout) {
            clearTimeout(this.state.scrollTimeout);
        }

        this.store.dispatch(actions.requestListScroll({
            listScroll,
            scrollTimeout: setTimeout(() => {
                this.store.dispatch(actions.unblockScroll());
            }, SCROLL_TO_ITEM_TIMEOUT),
        }));
    }

    unblockScroll() {
        if (!this.state.blockScroll && !this.state.scrollTimeout) {
            return;
        }

        if (this.state.scrollTimeout) {
            clearTimeout(this.state.scrollTimeout);
        }

        this.store.dispatch(actions.unblockScroll());
    }

    renderHeader(state, prevState) {
        if (
            !this.header
            || state.header === prevState?.header
        ) {
            return;
        }

        this.header.setState((headerState) => ({
            ...headerState,
            ...state.header,
        }));
    }

    renderFooter(state, prevState) {
        if (
            !this.footer
            || state.footer === prevState?.footer
        ) {
            return;
        }

        this.footer.setState((footerState) => ({
            ...footerState,
            ...state.footer,
        }));
    }

    /** Prepares cache for common item properties */
    cacheItemProps(listProps) {
        const skipProps = ['id', 'className', 'title', 'hidden', 'items'];
        const { ListItem } = this.props.components;
        this.itemPropsCache = {
            ...ListItem.defaultProps,
        };

        const keys = Object.keys(listProps);
        for (let ind = 0; ind < keys.length; ind += 1) {
            const key = keys[ind];
            if (!skipProps.includes(key)) {
                this.itemPropsCache[key] = listProps[key];
            }
        }
    }

    renderListContent(state, prevState) {
        if (!this.isListChanged(state, prevState)) {
            return;
        }

        const { list } = getMenuProps(state);

        this.cacheItemProps(list);

        // Prepare alignment before and after item content
        let beforeContent = false;
        let afterContent = false;

        forItems(list.items, (item) => {
            const checkbox = isCheckbox(item);
            if (!item.icon && !checkbox) {
                return;
            }

            if (
                (checkbox && list.checkboxSide === 'left')
                || (item.icon && list.iconAlign === 'left')
            ) {
                beforeContent = true;
            } else {
                afterContent = true;
            }
        });

        this.list.setState((listState) => ({
            ...listState,
            ...list,
            beforeContent,
            afterContent,
        }));
    }

    renderListScroll(state, prevState) {
        if (state.listScroll === prevState?.listScroll) {
            return;
        }

        const { scrollHeight, clientHeight } = this.list.elem;
        const maxScroll = Math.max(0, scrollHeight - clientHeight);
        if (
            state.listScroll >= 0
            && state.listScroll <= maxScroll
        ) {
            this.list.elem.scrollTop = state.listScroll;
        }
    }

    renderList(state, prevState) {
        this.renderListContent(state, prevState);
        this.renderListScroll(state, prevState);
    }

    setState(state) {
        this.store.setState(state);
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.renderInProgress = true;

        enable(this.elem, !state.disabled);

        const tabIndex = (state.tabThrough) ? -1 : (state.tabIndex ?? null);
        if (state.disabled || tabIndex === null) {
            this.elem.removeAttribute('tabindex');
        } else {
            this.elem.setAttribute('tabindex', tabIndex);
        }

        this.renderHeader(state, prevState);
        this.renderList(state, prevState);
        this.renderFooter(state, prevState);

        this.renderInProgress = false;
    }
}
