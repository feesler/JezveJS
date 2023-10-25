import { isFunction } from '@jezvejs/types';
import {
    enable,
    getClassName,
} from '@jezvejs/dom';

import {
    Menu,
    isNullId,
    toFlatList,
} from '../Menu/Menu.js';
import './LinkMenu.scss';

const CONTAINER_CLASS = 'link-menu';

const defaultProps = {
    defaultItemType: 'link',
    disabled: false,
    multiple: false,
    useURLParam: true,
    allowActiveLink: false,
    afterContent: false,
    preventNavigation: true,
    focusItemOnHover: false,
    renderNotSelected: true,
    itemParam: 'value',
    url: window.location.href,
    items: [],
    onChange: null,
};

/**
 * Link Menu component
 */
export class LinkMenu extends Menu {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(CONTAINER_CLASS, props.className),
        });
    }

    get enabled() {
        return !this.state.disabled;
    }

    get disabled() {
        return this.state.disabled;
    }

    /**
     * Returns render properties for specified item
     * @param {object} item
     * @param {object} state current list state object
     */
    getItemProps(item, state) {
        const res = super.getItemProps(item, state);

        if (
            res.selected
            && !state.allowActiveLink
            && (res.type === 'link' || res.type === 'checkbox-link')
        ) {
            res.type = (res.type === 'link') ? 'button' : 'checkbox';
        }

        return res;
    }

    onItemClick(id, e) {
        super.onItemClick(id, e);

        this.sendChangeEvent();
    }

    sendChangeEvent() {
        if (!isFunction(this.props.onChange)) {
            return;
        }

        const selectedItems = toFlatList(this.state.items)
            .filter((item) => !isNullId(item) && item.selected)
            .map((item) => item.id?.toString());

        const data = (this.state.multiple) ? selectedItems : selectedItems[0];
        this.props.onChange(data);
    }

    setURL(value) {
        const url = value.toString();
        if (this.state.url === url) {
            return;
        }

        this.setState({ ...this.state, url });
    }

    isLinkItem(item, state) {
        return (
            !item.disabled
            && !state.disabled
            && (!item.selected || state.allowActiveLink)
        );
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        enable(this.elem, !state.disabled);

        if (state.multiple) {
            this.elem.setAttribute('multiple', '');
        } else {
            this.elem.removeAttribute('multiple');
        }
    }
}
