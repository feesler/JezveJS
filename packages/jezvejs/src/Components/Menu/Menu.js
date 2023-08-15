import {
    asArray,
    createElement,
    enable,
    isFunction,
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
    findMenuItem,
    generateItemId,
    getActiveItem,
    getItemById,
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
    findMenuItem,
    getActiveItem,
    getItemById,
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
    multiple: false,
    beforeContent: false,
    afterContent: false,
    checkboxSide: 'left', // available value: 'left', 'right'
    defaultItemType: 'button',
    useURLParam: false,
    itemParam: 'value',
    preventNavigation: false,
    components: {
        Header: null,
        List: MenuList,
        ListItem: MenuItem,
        GroupHeader: MenuGroupHeader,
        GroupItem: MenuGroupItem,
        Separator: MenuSeparator,
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

        this.ignoreTouch = false;
        this.scrollTimeout = 0;
        this.state = this.onStateChange(this.props);

        this.init();
        this.postInit();
        this.render(this.state);
    }

    init() {
        const {
            Header,
            Footer,
            List,
            ListItem,
            GroupHeader,
            GroupItem,
            Separator,
        } = this.props.components;
        const children = [];

        if (Header) {
            this.header = Header.create(this.props.header);
            children.push(this.header.elem);
        }

        this.list = List.create({
            multiple: this.props.multiple,
            beforeContent: this.props.beforeContent,
            afterContent: this.props.afterContent,
            checkboxSide: this.props.checkboxSide,
            useURLParam: this.props.useURLParam,
            itemParam: this.props.itemParam,
            disabled: this.props.disabled,
            getItemById: (id) => this.getItemById(id),
            onItemClick: (id, e) => this.onItemClick(id, e),
            onPlaceholderClick: (e) => this.onPlaceholderClick(e),
            getPlaceholderProps: this.props.getPlaceholderProps,
            onGroupHeaderClick: (id, e) => this.onGroupHeaderClick(id, e),
            components: {
                ListItem,
                GroupHeader,
                GroupItem,
                Separator,
            },
        });
        children.push(this.list.elem);

        if (Footer) {
            this.footer = Footer.create(this.props.footer);
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
                focus: (e) => this.onFocus(e),
                blur: (e) => this.onBlur(e),
                keydown: (e) => this.onKeyDown(e),
                touchstart: (e) => this.onTouchStart(e),
                mousemove: (e) => this.onMouseMove(e),
                mouseleave: (e) => this.onMouseLeave(e),
            },
        });
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
        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => (
                (item.value !== id)
                    ? item
                    : { ...item, hidden: !value }
            )),
        });
    }

    hideItem(id) {
        this.showItem(id, false);
    }

    enableItem(id, value = true) {
        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => (
                (item.value !== id)
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
        return getItemById(id, this.state.items);
    }

    onItemClick(id, e) {
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

    onPlaceholderClick() {
    }

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
        this.state.listScroll = this.list.elem.scrollTop;
        if (!this.state.blockScroll) {
            this.setActive(null);
        }

        this.state.blockScroll = false;
        this.resetScrollTimeout();
    }

    onFocus() {
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
                this.setActive(nextItem.id);
                this.scrollToItem(nextItem);
                e.preventDefault();
            }
        }

        if (e.code === 'ArrowUp') {
            const activeItem = getActiveItem(this.state.items);
            const nextItem = (activeItem)
                ? getPreviousItem(activeItem.id, this.state.items, availCallback)
                : findMenuItem(this.state.items, availCallback);

            if (nextItem && (!activeItem || nextItem.id !== activeItem.id)) {
                this.setActive(nextItem.id);
                this.scrollToItem(nextItem);
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

    /**
     * 'touchstart' event on handler
     * Sets ignoreTouch flag for further 'mousemove' event
     * @param {TouchEvent} e - event object
     */
    onTouchStart(e) {
        if (e.touches) {
            this.ignoreTouch = true;
        }
    }

    /** 'mousemove' event handler */
    onMouseMove(e) {
        if (this.state.blockScroll || this.ignoreTouch) {
            return;
        }

        const item = this.list.itemFromElem(e?.target);

        const itemToActivate = (this.isAvailableItem(item) && item.id) ?? null;
        this.setActive(itemToActivate);
    }

    onMouseLeave() {
        this.setActive(null);
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

        const listItem = this.list.getListItemById(item.id);
        const elem = listItem?.elem;
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

        if (itemTop < listTop) {
            /* scroll up : decrease scroll top */
            this.state.listScroll = Math.min(this.list.elem.scrollHeight, itemTop);
        } else if (itemBottom > listBottom) {
            /* scroll down : increase scroll top */
            this.state.listScroll = Math.min(
                this.list.elem.scrollHeight,
                listTop + itemBottom - listBottom,
            );
        }
        this.state.blockScroll = true;
        this.list.elem.scrollTop = this.state.listScroll;

        this.resetScrollTimeout();
        this.scrollTimeout = setTimeout(() => {
            this.state.blockScroll = false;
            this.scrollTimeout = 0;
        }, SCROLL_TO_ITEM_TIMEOUT);
    }

    resetScrollTimeout() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = 0;
        }
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
            && state.beforeContent === prevState?.beforeContent
            && state.afterContent === prevState?.afterContent
            && state.checkboxSide === prevState?.checkboxSide
            && state.useURLParam === prevState?.useURLParam
            && state.itemParam === prevState?.itemParam
            && state.disabled === prevState?.disabled
        ) {
            return;
        }

        this.list.setState((listState) => ({
            ...listState,
            items: state.items,
            beforeContent: state.beforeContent,
            afterContent: state.afterContent,
            checkboxSide: state.checkboxSide,
            useURLParam: state.useURLParam,
            itemParam: state.itemParam,
            disabled: state.disabled,
        }));
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        enable(this.elem, !state.disabled);

        this.renderHeader(state, prevState);
        this.renderList(state, prevState);
        this.renderFooter(state, prevState);
    }
}