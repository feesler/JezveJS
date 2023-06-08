import {
    isFunction,
    createElement,
    setEvents,
    re,
    removeEvents,
    asArray,
    show,
    removeChilds,
    insertAfter,
    insertBefore,
} from '../../js/common.js';
import { setEmptyClick, removeEmptyClick } from '../../js/emptyClick.js';
import '../../css/common.scss';
import { Component } from '../../js/Component.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Button } from '../Button/Button.js';
import { PopupPosition } from '../PopupPosition/PopupPosition.js';
import './PopupMenu.scss';

/* CSS classes */
const MENU_CLASS = 'popup-menu';
const LIST_CLASS = 'popup-menu-list';
const LIST_SELECTOR = `.${LIST_CLASS}`;
const FIXED_LIST_CLASS = 'popup-menu-list_fixed';
const SEPARATOR_CLASS = 'popup-menu-list__separator';
const BTN_CLASS = 'popup-menu__btn';
const CHECKBOX_CLASS = 'action-checkbox';

/* List position constants */
const SCREEN_PADDING = 5;
const LIST_MARGIN = 5;

const defaultProps = {
    icon: 'ellipsis',
    attachTo: null,
    hideOnScroll: true,
    ignoreScrollTimeout: 500,
    fixed: true,
    content: null,
    items: [],
    id: undefined,
    onClose: null,
    onItemClick: null,
};

export class PopupMenu extends Component {
    static userProps = {
        elem: ['id'],
    };

    static activeInstance = null;

    static hideActive() {
        if (this.activeInstance) {
            this.activeInstance.hideMenu();
        }
    }

    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.hostElem = null;
        this.containerElem = null;
        this.ignoreScroll = false;
        this.items = {};

        this.emptyClickHandler = () => this.hideMenu();
        this.windowEvents = {
            scroll: {
                listener: (e) => this.onScroll(e),
                options: { passive: true, capture: true },
            },
        };

        this.togglerEvents = { click: (e) => this.toggleMenu(e) };

        this.init();
    }

    init() {
        this.elem = createElement('div', { props: { className: LIST_CLASS } });
        show(this.elem, false);

        if (this.props.fixed) {
            this.elem.classList.add(FIXED_LIST_CLASS);
        }

        if (this.props.items) {
            this.append(this.props.items);
        } else {
            this.setContent(this.props.content);
        }
        this.setClassNames();
        this.setUserProps();

        if (this.props.attachTo) {
            this.attachTo(this.props.attachTo);
        }
    }

    setHandlers() {
        setEmptyClick(this.emptyClickHandler, [this.elem, this.hostElem]);
    }

    setScrollHandlers() {
        if (!this.props.hideOnScroll) {
            return;
        }

        setEvents(window, this.windowEvents);
        setTimeout(() => {
            this.ignoreScroll = false;
        }, this.props.ignoreScrollTimeout);
    }

    removeHandlers() {
        removeEmptyClick(this.emptyClickHandler);
        if (this.props.hideOnScroll) {
            removeEvents(window, this.windowEvents);
        }
    }

    onScroll(e) {
        if (this.ignoreScroll) {
            return;
        }
        // Ignore scroll of menu itself
        const listElem = (isFunction(e.target.closest)) ? e.target.closest(LIST_SELECTOR) : null;
        if (listElem === this.elem) {
            return;
        }

        this.hideMenu();
    }

    isMenuVisible() {
        return !this.elem.hasAttribute('hidden');
    }

    detach() {
        if (!this.hostElem) {
            return;
        }

        this.removeHandlers();
        removeEvents(this.hostElem, this.togglerEvents);

        if (this.containerElem) {
            insertBefore(this.hostElem, this.containerElem);
            re(this.containerElem);
            this.containerElem = null;
        }

        this.hostElem = null;

        show(this.elem, false);
        PopupPosition.reset(this.elem);
        re(this.elem);
    }

    attachTo(elem) {
        if (!(elem instanceof Element)) {
            throw new Error('Invalid element');
        }
        if (this.hostElem === elem) {
            return;
        }

        this.detach();

        this.hostElem = elem;
        setEvents(this.hostElem, this.togglerEvents);

        if (this.props.fixed) {
            document.body.append(this.elem);
            return;
        }

        this.containerElem = createElement('div', {
            props: { className: MENU_CLASS },
        });

        insertAfter(this.containerElem, this.hostElem);
        this.containerElem.append(this.hostElem, this.elem);
    }

    attachAndShow(elem) {
        this.attachTo(elem);
        if (!this.isMenuVisible()) {
            this.showMenu();
        }
    }

    setContent(content) {
        removeChilds(this.elem);
        if (!content) {
            return;
        }
        this.elem.append(...asArray(content));
    }

    append(items) {
        if (!items) {
            return;
        }

        asArray(items).forEach((item) => this.addItem(item));
    }

    addItem(item) {
        if (!item) {
            return null;
        }

        const { type = 'button', ...rest } = item;
        const props = item.props ?? rest;

        let res = null;
        if (type === 'button' || type === 'link') {
            res = this.addIconItem({ type, ...props });
        } else if (type === 'checkbox') {
            res = this.addCheckboxItem(props);
        } else if (type === 'separator') {
            res = this.addSeparator();
        }

        if (res && typeof props.id === 'string' && props.id.length > 0) {
            this.items[props.id] = res;
        }

        return res;
    }

    onItemClick(item, itemHandler, ...args) {
        const itemArg = item.id ?? item;
        if (!itemArg) {
            return;
        }

        if (isFunction(this.props.onItemClick)) {
            this.props.onItemClick(itemArg);
        }
        if (isFunction(itemHandler)) {
            itemHandler(...args);
        }
    }

    addIconItem(item) {
        if (!item) {
            return null;
        }

        const { className = [], onClick = null, ...rest } = item;
        const button = Button.create({
            className: [BTN_CLASS, ...asArray(className)],
            ...rest,
            onClick: (...args) => this.onItemClick(button, onClick, ...args),
        });
        this.elem.append(button.elem);

        return button;
    }

    addCheckboxItem(item) {
        if (!item) {
            return null;
        }

        const { className = [], onChange = null, ...rest } = item;
        // Checkbox accept 'label' prop instead of 'title' as Button
        if (rest.title && typeof rest.label === 'undefined') {
            rest.label = rest.title;
        }
        const button = Checkbox.create({
            className: [CHECKBOX_CLASS, ...asArray(className)],
            ...rest,
            onChange: (...args) => this.onItemClick(button, onChange, ...args),
        });
        this.elem.append(button.elem);

        return button;
    }

    addSeparator() {
        const separator = createElement('div', { props: { className: SEPARATOR_CLASS } });
        this.elem.append(separator);
        return separator;
    }

    showMenu() {
        show(this.elem, true);
        if (!this.props.fixed && !this.elem.offsetParent) {
            show(this.elem, false);
            return;
        }

        this.ignoreScroll = true;
        PopupPosition.calculate({
            elem: this.elem,
            refElem: this.hostElem,
            margin: LIST_MARGIN,
            screenPadding: SCREEN_PADDING,
            allowResize: this.props.hideOnScroll,
            onScrollDone: () => this.setScrollHandlers(),
        });

        if (PopupMenu.activeInstance && PopupMenu.activeInstance !== this) {
            PopupMenu.hideActive();
        }
        PopupMenu.activeInstance = this;

        this.setHandlers();
    }

    hideMenu() {
        show(this.elem, false);
        PopupPosition.reset(this.elem);

        PopupMenu.activeInstance = null;
        this.removeHandlers();

        if (isFunction(this.props.onClose)) {
            this.props.onClose();
        }
    }

    toggleMenu(e) {
        e?.stopPropagation();

        if (this.isMenuVisible()) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }
}
