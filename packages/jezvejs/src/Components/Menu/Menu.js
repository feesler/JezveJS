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
    items: [],
    header: {},
    footer: {},
    disabled: false,
    onItemClick: null,
    onGroupHeaderClick: null,
    tabThrough: true,
    multiple: false,
    iconAlign: 'left', // available value: 'left', 'right'
    checkboxSide: 'left', // available value: 'left', 'right'
    renderNotSelected: false,
    defaultItemType: 'button',
    useURLParam: false,
    itemParam: 'value',
    preventNavigation: false,
    focusItemOnHover: true,
    components: {
        Header: null,
        MenuList,
        ListItem: MenuItem,
        Checkbox: CheckboxItem,
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
            Header,
            Footer,
            ListItem,
            Checkbox,
            ListPlaceholder,
            GroupHeader,
            GroupItem,
            Separator,
        } = this.props.components;
        const List = this.props.components.MenuList;
        const children = [];

        if (Header) {
            this.header = Header.create(this.props.header);
            children.push(this.header.elem);
        }

        this.list = List.create({
            multiple: this.props.multiple,
            iconAlign: this.props.iconAlign,
            checkboxSide: this.props.checkboxSide,
            renderNotSelected: this.props.renderNotSelected,
            useURLParam: this.props.useURLParam,
            itemParam: this.props.itemParam,
            tabThrough: this.props.tabThrough,
            disabled: this.props.disabled,
            getItemById: (id) => this.getItemById(id),
            onItemClick: (id, e) => this.onItemClick(id, e),
            onPlaceholderClick: (e) => this.onPlaceholderClick(e),
            getPlaceholderProps: this.props.getPlaceholderProps,
            onGroupHeaderClick: (id, e) => this.onGroupHeaderClick(id, e),
            components: {
                MenuList: List,
                ListItem,
                Checkbox,
                GroupHeader,
                GroupItem,
                Separator,
                ListPlaceholder,
            },
        });
        children.push(this.list.elem);

        if (Footer) {
            this.footer = Footer.create(this.props.footer);
            children.push(this.footer.elem);
        }

        this.capturedEvents = {
            focus: (e) => this.onFocus(e),
            blur: (e) => this.onBlur(e),
            keydown: (e) => this.onKeyDown(e),
            touchstart: (e) => this.onTouchStart(e),
        };

        this.elem = createElement('div', {
            props: { className: MENU_CLASS, tabIndex: 0 },
            children,
            events: {
                scroll: {
                    listener: (e) => this.onScroll(e),
                    options: { capture: true, passive: true },
                },
                mousemove: (e) => this.onMouseMove(e),
                mouseleave: (e) => this.onMouseLeave(e),
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

    getItemById(id) {
        return isFunction(this.state.getItemById)
            ? this.state.getItemById(id)
            : getItemById(id, this.state.items);
    }

    /** List item 'click' event handler */
    onItemClick(id, e) {
        e?.stopPropagation();

        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        const item = this.getItemById(id);
        const { type } = item;

        if (
            this.state.preventNavigation
            && (type === 'link' || type === 'checkbox-link')
        ) {
            e?.preventDefault();
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
        if (!item) {
            return;
        }

        this.setActive(item.id);
        this.scrollToItem(item);
    }

    onBlur() {
        this.setActive(null);
    }

    isAvailableItem(item) {
        return (
            item
            && !item.hidden
            && !item.disabled
            && item.type !== 'separator'
            && item.type !== 'group'
        );
    }

    /**
     * 'keydown' event on handler
     * @param {KeyboardEvent} e - event object
     */
    onKeyDown(e) {
        const availCallback = (item) => this.isAvailableItem(item);

        if (e.code === 'ArrowDown') {
            const activeItem = getActiveItem(this.state.items);
            const nextItem = (activeItem)
                ? getNextItem(activeItem.id, this.state.items, availCallback)
                : findMenuItem(this.state.items, availCallback);

            if (nextItem && (!activeItem || nextItem.id !== activeItem.id)) {
                this.activateItem(nextItem.id);

                e.preventDefault();
            }

            return;
        }

        if (e.code === 'ArrowUp') {
            const activeItem = getActiveItem(this.state.items);
            const nextItem = (activeItem)
                ? getPreviousItem(activeItem.id, this.state.items, availCallback)
                : findMenuItem(this.state.items, availCallback);

            if (nextItem && (!activeItem || nextItem.id !== activeItem.id)) {
                this.activateItem(nextItem.id);

                e.preventDefault();
            }
        }

        if (e.key === 'Enter') {
            const activeItem = getActiveItem(this.state.items);
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

        const activeItem = getActiveItem(this.state.items);
        if (item.id === activeItem?.id) {
            return;
        }

        if (this.state.tabThrough) {
            const elem = this.list.itemElemById(id);
            elem?.focus();
        } else {
            this.setActive(id);
            if (scrollToItem) {
                this.scrollToItem(item);
            }
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
        if (item) {
            e.preventDefault();
            this.activateItem(item.id, false);
        }
    }

    /** 'mouseleave' event handler */
    onMouseLeave() {
        if (!this.state.focusItemOnHover) {
            return;
        }

        this.setActive(null);

        const focused = document.activeElement;
        if (this.elem.contains(focused)) {
            this.elem.focus();
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
            )),
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
            )),
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
            )),
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
            }),
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
            }),
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

        const itemTop = elem.offsetTop;
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
        if (
            state.items === prevState?.items
            && state.listScroll === prevState?.listScroll
            && state.iconAlign === prevState?.iconAlign
            && state.checkboxSide === prevState?.checkboxSide
            && state.renderNotSelected === prevState?.renderNotSelected
            && state.useURLParam === prevState?.useURLParam
            && state.itemParam === prevState?.itemParam
            && state.disabled === prevState?.disabled
            && state.renderTime === prevState?.renderTime
        ) {
            return;
        }

        let beforeContent = false;
        let afterContent = false;

        forItems(state.items, (item) => {
            const { type } = item;
            const isCheckbox = (type === 'checkbox' || type === 'checkbox-link');

            if (!item.icon && !isCheckbox) {
                return;
            }

            if (
                (isCheckbox && state.checkboxSide === 'left')
                || (item.icon && state.iconAlign === 'left')
            ) {
                beforeContent = true;
            } else {
                afterContent = true;
            }
        });

        this.list.setState((listState) => ({
            ...listState,
            items: state.items,
            beforeContent,
            afterContent,
            iconAlign: state.iconAlign,
            checkboxSide: state.checkboxSide,
            renderNotSelected: state.renderNotSelected,
            useURLParam: state.useURLParam,
            itemParam: state.itemParam,
            disabled: state.disabled,
            renderTime: state.renderTime,
        }));

        this.list.elem.scrollTop = state.listScroll;
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        enable(this.elem, !state.disabled);
        this.elem.tabIndex = (state.tabThrough) ? -1 : 0;

        this.renderHeader(state, prevState);
        this.renderList(state, prevState);
        this.renderFooter(state, prevState);
    }
}
