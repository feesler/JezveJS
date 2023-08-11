import { createElement, isFunction } from '../../js/common.js';
import { Component } from '../../js/Component.js';

import { MenuList } from './components/List/MenuList.js';
import { MenuItem } from './components/ListItem/MenuItem.js';
import { MenuGroupItem } from './components/GroupItem/MenuGroupItem.js';
import { MenuSeparator } from './components/Separator/MenuSeparator.js';
import {
    findMenuItem,
    getActiveItem,
    getItemById,
    getNextItem,
    getPreviousItem,
    mapItems,
} from './helpers.js';

import './Menu.scss';

export {
    MenuList,
    MenuItem,
    MenuGroupItem,
    MenuSeparator,
};

/* CSS classes */
const MENU_CLASS = 'menu';

const defaultProps = {
    items: [],
    header: {},
    footer: {},
    onItemClick: null,
    beforeContent: true,
    afterContent: true,
    components: {
        Header: null,
        List: MenuList,
        ListItem: MenuItem,
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
        });

        this.ignoreTouch = false;
        this.state = {
            ...this.props,
        };

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
            GroupItem,
            Separator,
        } = this.props.components;
        const children = [];

        if (Header) {
            this.header = Header.create(this.props.header);
            children.push(this.header.elem);
        }

        this.list = List.create({
            beforeContent: this.props.beforeContent,
            afterContent: this.props.afterContent,
            getItemById: (id) => this.getItemById(id),
            onItemClick: (id, e) => this.onItemClick(id, e),
            onPlaceholderClick: (e) => this.onPlaceholderClick(e),
            getPlaceholderProps: this.props.getPlaceholderProps,
            components: {
                ListItem,
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
            },
        });
    }

    postInit() {
        this.setClassNames();
        this.setUserProps();
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
        if (item.type === 'checkbox') {
            this.toggleSelectItem(id);
        }

        if (isFunction(this.props.onItemClick)) {
            this.props.onItemClick(strId, e);
        }
    }

    onPlaceholderClick() {
    }

    onScroll() {
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
                e.preventDefault();
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

    setActive(id) {
        const strId = id?.toString() ?? null;

        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => ({
                ...item,
                active: item.id?.toString() === strId,
            })),
        });
    }

    toggleSelectItem(id) {
        const strId = id?.toString() ?? null;

        this.setState({
            ...this.state,
            items: mapItems(this.state.items, (item) => (
                (item.id?.toString() === strId)
                    ? { ...item, selected: !item.selected }
                    : item
            )),
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
        ) {
            return;
        }

        this.list.setState((listState) => ({
            ...listState,
            items: state.items,
            beforeContent: state.beforeContent,
            afterContent: state.afterContent,
        }));
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.renderHeader(state, prevState);
        this.renderList(state, prevState);
        this.renderFooter(state, prevState);
    }
}
