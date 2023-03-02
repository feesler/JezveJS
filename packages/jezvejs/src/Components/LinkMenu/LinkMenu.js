import {
    isFunction,
    asArray,
    createElement,
    addChilds,
    removeChilds,
    setEvents,
    enable,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Icon } from '../Icon/Icon.js';
import './style.scss';

const CONTAINER_CLASS = 'link-menu';
const ITEM_CLASS = 'link-menu-item';
const SELECTED_ITEM_CLASS = 'link-menu-item_selected';
const ITEM_CONTENT_CLASS = 'link-menu-item__content';
const ITEM_TITLE_CLASS = 'link-menu-item__title';
const ITEM_ICON_CONTAINER_CLASS = 'link-menu-item__icon';
const ITEM_ICON_CLASS = 'icon';
const CHECKBOX_CLASS = 'checkbox';

const defaultProps = {
    disabled: false,
    multiple: false,
    allowActiveLink: false,
    itemParam: 'value',
    url: window.location,
    items: [],
    onChange: null,
};

/**
 * Link Menu component
 */
export class LinkMenu extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        if (this.elem) {
            this.parse();
        } else {
            this.init();
        }
    }

    get enabled() {
        return !this.state.disabled;
    }

    init() {
        this.elem = createElement('div', { props: { className: CONTAINER_CLASS } });

        this.postInit();
    }

    parse() {
        if (!this.elem?.classList?.contains(CONTAINER_CLASS)) {
            throw new Error('Invalid element');
        }

        this.state.multiple = this.elem.hasAttribute('multiple');

        const itemElems = Array.from(this.elem.querySelectorAll(`.${ITEM_CLASS}`));
        this.state.items = itemElems.map((item) => this.parseItem(item));

        this.postInit();
    }

    postInit() {
        this.setHandlers();
        this.setClassNames();

        this.render(this.state);
    }

    parseItem(elem) {
        if (!elem) {
            return null;
        }

        const isCheckbox = elem.classList.contains(CHECKBOX_CLASS);
        if (isCheckbox) {
            return this.parseCheckbox(elem);
        }

        const res = {
            title: this.parseTitle(elem),
            value: this.getItemValue(elem),
            selected: elem.classList.contains(SELECTED_ITEM_CLASS),
            icon: this.parseIcon(elem),
        };

        return res;
    }

    getItemByValue(value) {
        return this.state.items.find((item) => item.value === value);
    }

    getItemValue(elem) {
        return elem.dataset.value;
    }

    parseTitle(elem) {
        let titleElem = elem.querySelector(`.${ITEM_TITLE_CLASS}`);
        if (!titleElem) {
            titleElem = elem;
        }

        return titleElem.textContent.trim();
    }

    parseIcon(elem) {
        const iconElem = elem.querySelector(`.${ITEM_ICON_CONTAINER_CLASS}`);
        const iconUseElem = iconElem?.querySelector('use');
        if (!iconUseElem) {
            return null;
        }

        const icon = iconUseElem.href.baseVal;
        return icon.startsWith('#') ? icon.substring(1) : icon;
    }

    parseCheckbox(elem) {
        if (!this.state.multiple) {
            throw new Error('Invalid element');
        }

        const value = this.getItemValue(elem);
        const checkbox = Checkbox.fromElement(elem, {
            onChange: () => this.onToggleItem(value),
        });

        return {
            value,
            selected: checkbox.checked,
            title: this.parseTitle(elem),
            icon: this.parseIcon(elem),
        };
    }

    setHandlers() {
        setEvents(this.elem, { click: (e) => this.onSelectItem(e) });
    }

    onSelectItem(e) {
        const link = e.target.closest('a');
        if (!link) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const itemTarget = e.target.closest(`.${ITEM_CLASS}`);
        if (!itemTarget) {
            return;
        }

        const { value } = itemTarget.dataset;
        if (value) {
            this.setActive(value);
        } else {
            this.setSelection([]);
        }

        if (isFunction(this.props.onChange)) {
            this.props.onChange(value);
        }
    }

    sendChangeEvent() {
        if (!isFunction(this.props.onChange)) {
            return;
        }

        const selectedItems = this.state.items
            .filter((item) => item.value && item.selected)
            .map((item) => item.value);

        const data = (this.state.multiple) ? selectedItems : selectedItems[0];
        this.props.onChange(data);
    }

    onToggleItem(value) {
        this.setState({
            ...this.state,
            items: this.state.items.map((item) => {
                let selected = false;
                if (item.value) {
                    selected = (item.value === value) ? !item.selected : item.selected;
                }

                if (item.selected === selected) {
                    return item;
                }

                return { ...item, selected };
            }),
        });

        this.sendChangeEvent();
    }

    enable(value = true) {
        const disabled = !value;
        if (this.state.disabled === disabled) {
            return;
        }
        this.setState({ ...this.state, disabled });
    }

    enableItem(id, value = true) {
        this.setState({
            ...this.state,
            items: this.state.items.map((item) => (
                (item.value !== id)
                    ? item
                    : { ...item, disabled: !value }
            )),
        });
    }

    disableItem(id) {
        this.enableItem(id, false);
    }

    setActive(value) {
        this.setState({
            ...this.state,
            items: this.state.items.map((item) => ({
                ...item,
                selected: item.value === value,
            })),
        });
    }

    setSelection(selectedItems) {
        const items = asArray(selectedItems);
        const showAll = (items.length === 0 || items.includes(0));

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => ({
                ...item,
                selected: (
                    (showAll && !item.value)
                    || items.includes(item.value)
                ),
            })),
        });
    }

    setURL(value) {
        const url = value.toString();
        if (this.state.url === url) {
            return;
        }

        this.setState({ ...this.state, url });
    }

    getItemURL(item, state) {
        if (!state.url) {
            return null;
        }

        const { itemParam } = state;
        const param = (state.multiple) ? `${itemParam}[]` : itemParam;

        const url = new URL(state.url);
        if (item.value) {
            url.searchParams.set(param, item.value);
        } else {
            url.searchParams.delete(param);
        }

        return url;
    }

    isLinkItem(item, state) {
        return (!item.disabled && !state.disabled && (!item.selected || state.allowActiveLink));
    }

    renderCheckboxItem(item, state) {
        const content = this.renderItemContent(item, state);
        content.classList.add(ITEM_CONTENT_CLASS);

        const checkbox = Checkbox.create({
            className: ITEM_CLASS,
            checked: item.selected,
            label: content,
            disabled: (item.disabled || state.disabled),
            onChange: () => this.onToggleItem(item.value),
        });

        checkbox.elem.setAttribute('data-value', item.value);

        return checkbox.elem;
    }

    renderItemContent(item, state) {
        const isLink = this.isLinkItem(item, state);
        const tagName = (isLink) ? 'a' : 'b';

        const children = [];

        if (item.icon) {
            const iconElem = createElement('span', {
                props: { className: ITEM_ICON_CONTAINER_CLASS },
                children: Icon.create({
                    icon: item.icon,
                    className: ITEM_ICON_CLASS,
                }).elem,
            });

            children.push(iconElem);
        }

        const titleElem = createElement('span', {
            props: { className: ITEM_TITLE_CLASS, textContent: item.title },
        });
        children.push(titleElem);

        const elem = createElement(tagName, { children });
        if (item.selected) {
            elem.classList.add(SELECTED_ITEM_CLASS);
        }
        if (isLink) {
            const url = this.getItemURL(item, state);
            elem.href = url.toString();
        }

        return elem;
    }

    renderItem(item, state) {
        if (state.multiple && item.value) {
            return this.renderCheckboxItem(item, state);
        }

        const elem = this.renderItemContent(item, state);
        elem.classList.add(ITEM_CLASS);
        if (item.value) {
            elem.setAttribute('data-value', item.value);
        }
        enable(elem, !(item.disabled || state.disabled));

        return elem;
    }

    render(state) {
        const elems = state.items.map((item) => this.renderItem(item, state));
        removeChilds(this.elem);
        addChilds(this.elem, elems);

        enable(this.elem, !state.disabled);

        if (state.multiple) {
            this.elem.setAttribute('multiple', '');
        } else {
            this.elem.removeAttribute('multiple');
        }
    }
}
