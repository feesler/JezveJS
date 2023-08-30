import {
    asArray,
    createElement,
    enable,
    isFunction,
    setEvents,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';

import { MenuList } from './components/List/MenuList.js';
import { MenuItem } from './components/ListItem/MenuItem.js';
import { MenuGroupHeader } from './components/GroupHeader/MenuGroupHeader.js';
import { MenuGroupItem } from './components/GroupItem/MenuGroupItem.js';
import { CheckboxItem } from './components/CheckboxItem/CheckboxItem.js';
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
} from './helpers.js';

import './Menu.scss';

export {
    /* Child components */
    MenuList,
    MenuItem,
    MenuGroupHeader,
    MenuGroupItem,
    MenuSeparator,
    MenuCheckbox,
    CheckboxItem,
    /* helper functions */
    isNullId,
    findMenuItem,
    getActiveItem,
    getItemById,
    toFlatList,
    getNextItem,
    getPreviousItem,
    mapItems,
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
    components: {
        Header: null,
        MenuList,
        ListItem: MenuItem,
        Checkbox: CheckboxItem,
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

        this.state = this.onStateChange({
            ...this.props,
            blockScroll: false,
            scrollTimeout: 0,
            ignoreTouch: false,
        });

        this.init();
        this.postInit();
        this.render(this.state);
    }

    init() {
        const {
            header,
            footer,
            components,
            list,
        } = getMenuProps(this.state);
        delete list.id;
        delete list.className;

        const { Header, Footer, ...listComponents } = components;
        const children = [];

        if (Header) {
            this.header = Header.create(header);
            children.push(this.header.elem);
        }

        this.list = components.MenuList.create({
            ...list,
            ...this.callbacks,
            components: {
                ...listComponents,
            },
        });
        setEvents(this.list.elem, {
            mousemove: (e) => this.onMouseMove(e),
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

    /**
     * Enable/disable component
     * @param {boolean} val - if true component will be enabled, disabled otherwise. Default is true
     */
    enable(value = true) {
        const disabled = !value;
        if (this.state.disabled === disabled) {
            return;
        }

        this.setState({ ...this.state, disabled });
    }

    showItem(id, value = true) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => (
                (item.id?.toString() !== strId)
                    ? item
                    : { ...item, hidden: !value }
            )),
        });
    }

    hideItem(id) {
        this.showItem(id, false);
    }

    enableItem(id, value = true) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => (
                (item.id?.toString() !== strId)
                    ? item
                    : { ...item, disabled: !value }
            )),
        });
    }

    disableItem(id) {
        this.enableItem(id, false);
    }

    generateItemId(state = this.state) {
        return generateItemId(state.items, 'item');
    }

    generateGroupId(state = this.state) {
        return generateItemId(state.items, 'group');
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

        const { list } = getMenuProps(state);
        delete list.id;
        delete list.className;
        delete list.title;
        delete list.hidden;

        const res = {
            ...ListItem.defaultProps,
            ...list,
            ...item,
            disabled: item.disabled || state.disabled,
            getItemURL: (itemState) => this.getItemURL(itemState, state),
            ...this.callbacks,
            components: {
                ...state.components,
            },
        };

        if (item.type === 'group') {
            res.getItemComponent = (...args) => this.getItemComponent(...args);
            res.getItemProps = (...args) => this.getItemProps(...args);
        }

        return res;
    }

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
            'listScroll',
            'renderTime',
        ];

        return changeProps.some((prop) => (state[prop] !== prevState?.[prop]));
    }

    getItemURL(item, state) {
        const baseURL = item.url ?? window.location;
        const { itemParam } = state;
        const arrayParam = `${itemParam}[]`;
        const param = (state.multiple) ? arrayParam : itemParam;

        const url = new URL(baseURL);
        if (!isNullId(item)) {
            url.searchParams.set(param, item.id);

            const delParam = (state.multiple) ? itemParam : arrayParam;
            url.searchParams.delete(delParam);
        } else {
            url.searchParams.delete(param);
        }

        return url;
    }

    getItemById(id) {
        return isFunction(this.state.getItemById)
            ? this.state.getItemById(id)
            : getItemById(id, this.state.items);
    }

    /** Returns active item for specified state */
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
            return;
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

    onFocus(e) {
        const item = this.list.itemFromElem(e?.target);
        if (!item || item.active) {
            return;
        }

        this.setActive(item.id);
    }

    onBlur(e) {
        if (this.renderInProgress) {
            return;
        }

        if (this.isLostFocus(e)) {
            this.setActive(null);
        }
    }

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

        const focusOptions = { preventScroll: !scrollToItem };

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
     * 'touchstart' event on handler
     * Sets ignoreTouch flag for further 'mousemove' event
     * @param {TouchEvent} e - event object
     */
    onTouchStart(e) {
        if (e.touches) {
            this.setState({ ...this.state, ignoreTouch: true });
        }
    }

    /** 'mousemove' event handler */
    onMouseMove(e) {
        if (
            this.state.blockScroll
            || this.state.ignoreTouch
            || !this.state.focusItemOnHover
        ) {
            return;
        }

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

    /** 'mouseleave' event handler */
    onMouseLeave(e) {
        if (this.state.blockScroll) {
            return;
        }

        this.setActive(null);

        if (isFunction(this.props.onMouseLeave)) {
            this.props.onMouseLeave(e);
            return;
        }

        const focused = document.activeElement;
        if (this.elem.contains(focused)) {
            this.elem.focus({ preventScroll: true });
        }
    }

    setActive(id) {
        const strId = id?.toString() ?? null;

        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => (
                (item.active === (item.id?.toString() === strId))
                    ? item
                    : { ...item, active: !item.active }
            ), { includeGroupItems: this.state.allowActiveGroupHeader }),
        });
    }

    setSelection(selectedItems) {
        const items = asArray(selectedItems).map((value) => value.toString());

        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => (
                (item.selected === items.includes(item.id?.toString()) || !item.selectable)
                    ? item
                    : { ...item, selected: !item.selected }
            ), { includeGroupItems: this.state.allowActiveGroupHeader }),
        });
    }

    selectAll(value = true) {
        const selected = !!value;

        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => (
                (item.selected === selected || !item.selectable)
                    ? item
                    : { ...item, selected }
            ), { includeGroupItems: this.state.allowActiveGroupHeader }),
        });
    }

    clearSelection() {
        this.selectAll(false);
    }

    onStateChange(state, prevState = {}) {
        if (state.items === prevState?.items) {
            return state;
        }

        const { ListItem } = this.props.components;

        return {
            ...state,
            items: mapItems(state.items, (item) => {
                const newState = {
                    ...ListItem.defaultProps,
                    ...item,
                    active: item.active ?? false,
                    id: item.id ?? item.value?.toString() ?? this.generateItemId(state),
                    type: item.type ?? this.props.defaultItemType,
                };

                const { type } = newState;
                const checkboxAvail = newState.selectable && state.multiple;
                if (
                    !checkboxAvail
                    && (type === 'checkbox' || type === 'checkbox-link')
                ) {
                    newState.type = (type === 'checkbox') ? 'button' : 'link';
                }

                return newState;
            }, { includeGroupItems: state.allowActiveGroupHeader }),
        };
    }

    toggleSelectItem(id) {
        if (this.state.disabled) {
            return;
        }

        const strId = id?.toString() ?? null;

        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => {
                if (item.id?.toString() === strId) {
                    if (!item.selectable || item.disabled) {
                        return item;
                    }

                    return {
                        ...item,
                        selected: (this.state.multiple) ? !item.selected : true,
                    };
                }

                return (this.state.multiple)
                    ? item
                    : { ...item, selected: false };
            }, { includeGroupItems: this.state.allowActiveGroupHeader }),
        });
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
            this.setState({ ...this.state, listScroll });
        }
    }

    requestListScroll(listScroll) {
        if (this.state.listScroll === listScroll) {
            return;
        }

        if (this.state.scrollTimeout) {
            clearTimeout(this.state.scrollTimeout);
        }

        this.setState({
            ...this.state,
            listScroll,
            blockScroll: true,
            scrollTimeout: setTimeout(() => {
                this.setState({
                    ...this.state,
                    blockScroll: false,
                    scrollTimeout: 0,
                });
            }, SCROLL_TO_ITEM_TIMEOUT),
        });
    }

    unblockScroll() {
        if (!this.state.blockScroll && !this.state.scrollTimeout) {
            return;
        }

        if (this.state.scrollTimeout) {
            clearTimeout(this.state.scrollTimeout);
        }

        this.setState({
            ...this.state,
            blockScroll: false,
            scrollTimeout: 0,
        });
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

    renderList(state, prevState) {
        if (!this.isListChanged(state, prevState)) {
            return;
        }

        const { list } = getMenuProps(state);

        let beforeContent = false;
        let afterContent = false;

        forItems(list.items, (item) => {
            const { type } = item;
            const isCheckbox = (type === 'checkbox' || type === 'checkbox-link');

            if (!item.icon && !isCheckbox) {
                return;
            }

            if (
                (isCheckbox && list.checkboxSide === 'left')
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

        if (this.list.elem.scrollTop !== state.listScroll) {
            this.list.elem.scrollTop = state.listScroll;
        }
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.renderInProgress = true;

        enable(this.elem, !state.disabled);
        this.elem.tabIndex = (state.tabThrough) ? -1 : 0;

        this.renderHeader(state, prevState);
        this.renderList(state, prevState);
        this.renderFooter(state, prevState);

        this.renderInProgress = false;
    }
}
