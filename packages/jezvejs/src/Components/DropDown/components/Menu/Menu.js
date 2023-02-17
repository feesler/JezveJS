import { createElement, isFunction } from '../../../../js/common.js';
import { Component } from '../../../../js/Component.js';
import { getVisibleItems } from '../../utils.js';
import { DropDownGroupItem } from '../GroupItem/GroupItem.js';
import { DropDownInput } from '../Input/Input.js';
import { DropDownListItem } from '../ListItem/ListItem.js';
import { DropDownMenuList } from '../MenuList/MenuList.js';
import './style.scss';

/* CSS classes */
const LIST_CLASS = 'dd__list';

const SCROLL_TO_ITEM_TIMEOUT = 200;

const defaultProps = {
    items: [],
    showInput: false,
    inputElem: null,
    inputString: '',
    inputPlaceholder: '',
    onInput: null,
    onItemActivate: null,
    onItemClick: null,
    multi: false,
    filtered: false,
    noItemsMessage: null,
    components: {
        Input: DropDownInput,
        MenuList: DropDownMenuList,
        ListItem: DropDownListItem,
        GroupItem: DropDownGroupItem,
    },
};

export class DropDownMenu extends Component {
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
        this.state = {
            ...this.props,
            blockScroll: false,
            listScroll: 0,
        };

        this.init();
    }

    init() {
        const {
            Input,
            MenuList,
            ListItem,
            GroupItem,
        } = this.props.components;
        const children = [];

        if (this.props.showInput) {
            this.input = Input.create({
                elem: this.props.inputElem,
                placeholder: this.props.inputPlaceholder,
                onInput: (e) => this.onInput(e),
            });
            children.push(this.input.elem);
        }

        this.list = MenuList.create({
            multi: this.props.multi,
            noItemsMessage: this.props.noItemsMessage,
            onItemClick: (id, e) => this.onItemClick(id, e),
            isEmptyList: (state) => (getVisibleItems(state).length === 0),
            components: {
                ListItem,
                GroupItem,
            },
        });
        children.push(this.list.elem);

        this.elem = createElement('div', {
            props: { className: LIST_CLASS },
            children,
            events: {
                scroll: {
                    listener: (e) => this.onScroll(e),
                    options: { capture: true, passive: true },
                },
                touchstart: (e) => this.onTouchStart(e),
                mousemove: (e) => this.onMouseMove(e),
            },
        });

        this.render(this.state);
    }

    /** List item 'click' event handler */
    onItemClick(itemId, e) {
        e.stopPropagation();

        if (isFunction(this.props.onItemClick)) {
            this.props.onItemClick(itemId);
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

    /**
     * 'touchstart' event on handler
     * Sets blockTouch flag for further 'mousemove' event
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

        const itemId = this.list.itemIdFromElem(e.target);
        this.setActive(itemId);
    }

    onInput(e) {
        if (isFunction(this.props.onInput)) {
            this.props.onInput(e);
        }
    }

    setActive(itemId) {
        if (isFunction(this.props.onItemActivate)) {
            this.props.onItemActivate(itemId);
        }
    }

    getItemElementById(id) {
        return this.list.elem.querySelector(`[data-id="${id}"]`);
    }

    resetScrollTimeout() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = 0;
        }
    }

    /** Scroll list element until specified list item be fully visible */
    scrollToItem(item) {
        if (!item || item.hidden) {
            return;
        }

        const elem = this.getItemElementById(item.id);
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

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (this.input) {
            this.input.setState((inputState) => ({
                ...inputState,
                placeholder: state.inputPlaceholder,
                value: state.inputString,
            }));
        }

        this.list.setState((listState) => ({
            ...listState,
            items: state.items,
            filtered: state.filtered,
            noItemsMessage: state.noItemsMessage,
        }));

        this.list.elem.scrollTop = state.listScroll;
    }
}