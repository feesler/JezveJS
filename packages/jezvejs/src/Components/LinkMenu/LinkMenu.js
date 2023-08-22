import {
    isFunction,
    enable,
    getClassName,
} from '../../js/common.js';
import { Menu, mapItems } from '../Menu/Menu.js';
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
    itemParam: 'value',
    url: window.location,
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

    getItemByValue(value) {
        return this.state.items.find((item) => item.id === value);
    }

    getItemValue(elem) {
        return elem.dataset.value;
    }

    onItemClick(id, e) {
        super.onItemClick(id, e);

        const item = this.getItemById(id);
        if (this.isNullValue(item)) {
            this.clearSelection();
        }

        this.sendChangeEvent();
    }

    sendChangeEvent() {
        if (!isFunction(this.props.onChange)) {
            return;
        }

        const selectedItems = this.state.items
            .filter((item) => !this.isNullValue(item) && item.selected)
            .map((item) => item.value);

        const data = (this.state.multiple) ? selectedItems : selectedItems[0];
        this.props.onChange(data);
    }

    isNullValue(item) {
        return (item?.value ?? null) === null;
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

    onStateChange(state, prevState = {}) {
        if (state.items === prevState?.items) {
            return state;
        }

        const newState = super.onStateChange(state, prevState);

        return {
            ...state,
            items: mapItems(newState.items, (item) => (
                (
                    item.selected
                    && !state.allowActiveLink
                    && (item.type === 'link' || item.type === 'checkbox-link')
                )
                    ? {
                        ...item,
                        type: (item.type === 'link') ? 'button' : 'checkbox',
                    }
                    : item
            )),
        };
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
