import {
    isFunction,
    svg,
    createElement,
    setEvents,
    re,
    removeEvents,
    asArray,
    show,
    removeChilds,
    setEmptyClick,
    removeEmptyClick,
    computedStyle,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { IconButton } from '../IconButton/IconButton.js';
import { PopupPosition } from '../PopupPosition/PopupPosition.js';
import './style.scss';

/* CSS classes */
const MENU_CLASS = 'popup-menu';
const LIST_CLASS = 'popup-menu-list';
const FIXED_LIST_CLASS = 'popup-menu-list_fixed';
const BUTTON_CLASS = 'btn icon-btn popup-menu-btn';
const ICON_CLASS = 'icon popup-menu-btn__icon';
const SEPARATOR_CLASS = 'popup-menu-list__separator';
const ICONBTN_CLASS = 'popup-menu__iconbutton';
const CHECKBOX_CLASS = 'action-checkbox';

/* List position constants */
const SCREEN_PADDING = 5;
const LIST_MARGIN = 5;

const defaultProps = {
    icon: 'ellipsis',
    attached: false,
    attachTo: null,
    hideOnScroll: true,
    fixed: true,
    content: null,
    items: [],
    id: null,
    onClose: null,
};

export class PopupMenu extends Component {
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

        this.ignoreScroll = false;
        this.items = {};

        this.emptyClickHandler = () => this.hideMenu();
        this.scrollHandler = () => this.onScroll();
        this.togglerEvents = { click: (e) => this.toggleMenu(e) };

        this.init();
    }

    init() {
        this.menuList = createElement('div', { props: { className: LIST_CLASS } });
        show(this.menuList, false);

        if (this.props.fixed) {
            this.menuList.classList.add(FIXED_LIST_CLASS);
        }

        if (this.props.items) {
            this.append(this.props.items);
        } else {
            this.setContent(this.props.content);
        }

        if (this.props.attached) {
            this.elem = this.menuList;
            if (this.props.attachTo) {
                this.attachTo(this.props.attachTo);
            }
        } else {
            this.menuBtn = createElement('button', {
                props: { className: BUTTON_CLASS, type: 'button' },
                children: this.createIcon(this.props.icon, ICON_CLASS),
                events: this.togglerEvents,
            });

            this.elem = createElement('div', {
                props: { className: MENU_CLASS },
                children: [
                    this.menuBtn,
                    this.menuList,
                ],
            });
            this.relElem = this.elem;
        }

        if (this.props.id) {
            this.elem.id = this.props.id;
        }

        this.setClassNames();
    }

    /** Create SVG icon element */
    createIcon(icon, className = null) {
        const useElem = svg('use');
        const res = svg('svg', {}, useElem);
        if (className) {
            res.setAttribute('class', className);
        }

        useElem.href.baseVal = (icon) ? `#${icon}` : '';

        return res;
    }

    setHandlers() {
        setEmptyClick(this.emptyClickHandler);

        if (this.props.hideOnScroll) {
            this.setScrollEvents();
            setTimeout(() => {
                this.ignoreScroll = false;
            }, 200);
        }
    }

    removeHandlers() {
        removeEmptyClick(this.emptyClickHandler);
        if (this.props.hideOnScroll) {
            this.removeScrollEvents();
        }
    }

    setScrollEvents() {
        window.addEventListener('scroll', this.scrollHandler, { passive: true, capture: true });
    }

    removeScrollEvents() {
        window.removeEventListener('scroll', this.scrollHandler, { passive: true, capture: true });
    }

    onScroll() {
        if (this.ignoreScroll) {
            return;
        }

        this.hideMenu();
    }

    isMenuVisible() {
        return !this.menuList.hasAttribute('hidden');
    }

    detach() {
        this.removeHandlers();
        if (this.hostElem) {
            removeEvents(this.hostElem, this.togglerEvents);
            this.hostElem = null;
            this.relElem = null;
        } else {
            removeEvents(this.menuBtn, this.togglerEvents);
        }

        show(this.menuList, false);
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
        this.relElem = this.hostElem;
        setEvents(this.hostElem, this.togglerEvents);

        this.hostElem.append(this.elem);
    }

    attachAndShow(elem) {
        this.attachTo(elem);
        if (!this.isMenuVisible()) {
            this.showMenu();
        }
    }

    setContent(content) {
        removeChilds(this.menuList);
        if (!content) {
            return;
        }
        this.menuList.append(...asArray(content));
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

    addIconItem(item) {
        if (!item) {
            return null;
        }

        const { className = [], ...rest } = item;
        const button = IconButton.create({
            className: [ICONBTN_CLASS, ...asArray(className)],
            ...rest,
        });
        this.menuList.append(button.elem);

        return button;
    }

    addCheckboxItem(item) {
        if (!item) {
            return null;
        }

        const { className = [], ...rest } = item;
        // Checkbox accept 'label' prop instead of 'title' as IconButton
        if (rest.title && typeof rest.label === 'undefined') {
            rest.label = rest.title;
        }
        const button = Checkbox.create({
            className: [CHECKBOX_CLASS, ...asArray(className)],
            ...rest,
        });
        this.menuList.append(button.elem);

        return button;
    }

    addSeparator() {
        const separator = createElement('div', { props: { className: SEPARATOR_CLASS } });
        this.menuList.append(separator);
        return separator;
    }

    /** Find parent element of list without offsetParent and check it has position: fixed */
    isInsideFixedContainer() {
        let elem = this.menuList;
        while (elem.offsetParent) {
            elem = elem.offsetParent;
        }

        const style = computedStyle(elem);
        return style.position === 'fixed';
    }

    showMenu() {
        show(this.menuList, true);
        if (!this.props.fixed && !this.menuList.offsetParent) {
            show(this.menuList, false);
            return;
        }

        this.ignoreScroll = true;
        PopupPosition.calculate({
            elem: this.menuList,
            refElem: this.relElem,
            margin: LIST_MARGIN,
            screenPadding: SCREEN_PADDING,
        });

        if (PopupMenu.activeInstance !== this) {
            PopupMenu.hideActive();
            PopupMenu.activeInstance = this;
        }

        this.setHandlers();
    }

    hideMenu() {
        show(this.menuList, false);
        this.menuList.style.top = '';
        this.menuList.style.left = '';
        this.menuList.style.width = '';
        this.menuList.style.height = '';

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
