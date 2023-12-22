import { isFunction, asArray } from '@jezvejs/types';
import '../../common.scss';
import {
    createElement,
    setEvents,
    removeEvents,
    show,
    getClassName,
} from '@jezvejs/dom';
import { setEmptyClick, removeEmptyClick } from '../../emptyClick.js';

import { Menu } from '../Menu/Menu.js';
import { PopupPosition } from '../PopupPosition/PopupPosition.js';

import './PopupMenu.scss';

/* CSS classes */
const MENU_CLASS = 'popup-menu';
const LIST_CLASS = 'popup-menu-list';
const LIST_SELECTOR = `.${LIST_CLASS}`;
const FIXED_LIST_CLASS = 'popup-menu-list_fixed';

/* List position constants */
const SCREEN_PADDING = 5;
const LIST_MARGIN = 5;

const defaultProps = {
    attachTo: null,
    toggleOnClick: true,
    hideOnScroll: true,
    hideOnSelect: true,
    position: 'bottom-start',
    allowChangeAxis: true,
    ignoreScrollTimeout: 500,
    fixed: true,
    content: null,
    items: [],
    id: undefined,
    onClose: null,
    onItemClick: null,
};

export class PopupMenu extends Menu {
    static activeInstance = null;

    static hideActive() {
        if (this.activeInstance) {
            this.activeInstance.hideMenu();
        }
    }

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(LIST_CLASS, props.className),
        });
    }

    init() {
        this.hostElem = null;
        this.containerElem = null;
        this.ignoreScroll = false;
        this.childMenu = null;

        this.emptyClickHandler = () => this.hideMenu();
        this.windowEvents = {
            scroll: {
                listener: (e) => this.onScroll(e),
                options: { passive: true, capture: true },
            },
        };

        this.togglerEvents = { click: (e) => this.toggleMenu(e) };

        super.init();

        show(this.elem, false);
        if (this.props.fixed) {
            this.elem.classList.add(FIXED_LIST_CLASS);
        }
    }

    postInit() {
        super.postInit();

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

    createChildMenu(id, menu) {
        const item = this.getItemById(id);
        if (item.type === 'group') {
            return;
        }

        const listItem = this.list.getListItemById(id);
        if (!listItem?.elem) {
            return;
        }

        this.detachChild();

        this.childMenu = (menu?.elem)
            ? menu
            : PopupMenu.create(menu);
        this.childMenu.parent = this;
        this.childMenu.attachAndShow(listItem.elem);
    }

    /**
     * 'keydown' event on handler
     * @param {KeyboardEvent} e - event object
     */
    onKeyDown(e) {
        super.onKeyDown(e);

        if (e.code === 'Escape') {
            this.hideMenu();
            this.elem.blur();
        }
    }

    /** List item 'click' event handler */
    onItemClick(id, e) {
        super.onItemClick(id, e);

        this.handleHideOnSelect(id);
    }

    handleHideOnSelect(id = null) {
        if (!this.props.hideOnSelect) {
            return;
        }

        if (id !== null) {
            const item = this.getItemById(id);
            if (item.type === 'group' || item.submenuParent) {
                return;
            }
        }

        this.hideMenu();

        if (this.parent) {
            this.parent.handleHideOnSelect();
        }
    }

    onScroll(e) {
        if (
            this.ignoreScroll
            || !this.props.hideOnScroll
        ) {
            return;
        }

        if (!e.target.contains(this.elem)) {
            return;
        }

        // Ignore scroll of menu itself
        const listElem = (isFunction(e.target.closest)) ? e.target.closest(LIST_SELECTOR) : null;
        if (listElem === this.elem) {
            return;
        }

        this.hideMenu();
    }

    onScrollDone() {
        this.setScrollHandlers();
        this.elem.focus();
    }

    isMenuVisible() {
        return !this.elem.hasAttribute('hidden');
    }

    detachChild() {
        if (this.childMenu) {
            this.childMenu.detach();
            this.childMenu = null;
        }
    }

    detach() {
        if (!this.hostElem) {
            return;
        }

        this.detachChild();
        this.setActive(null);

        this.removeHandlers();
        if (this.props.toggleOnClick) {
            removeEvents(this.hostElem, this.togglerEvents);
        }

        if (this.containerElem) {
            this.containerElem.before(this.hostElem);
            this.containerElem.remove();
            this.containerElem = null;
        }

        this.hostElem = null;

        show(this.elem, false);
        this.popupPosition?.reset();
        this.popupPosition = null;

        this.elem.remove();
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
        if (this.props.toggleOnClick) {
            setEvents(this.hostElem, this.togglerEvents);
        }

        if (this.props.fixed) {
            document.body.append(this.elem);
            return;
        }

        this.containerElem = createElement('div', {
            props: { className: MENU_CLASS },
        });

        this.hostElem.after(this.containerElem);
        this.containerElem.append(this.hostElem, this.elem);
    }

    attachAndShow(elem) {
        this.attachTo(elem);
        if (!this.isMenuVisible()) {
            this.showMenu();
        }
    }

    setContent(content) {
        this.elem.replaceChildren(...asArray(content));
    }

    showMenu() {
        show(this.elem, true);
        if (!this.props.fixed && !this.elem.offsetParent) {
            show(this.elem, false);
            return;
        }

        this.ignoreScroll = true;
        this.popupPosition = PopupPosition.create({
            elem: this.elem,
            refElem: this.hostElem,
            margin: LIST_MARGIN,
            screenPadding: SCREEN_PADDING,
            allowResize: this.props.hideOnScroll,
            position: this.props.position,
            allowChangeAxis: this.props.allowChangeAxis,
            updateProps: {
                scrollOnOverflow: false,
            },
            onScrollDone: () => this.onScrollDone(),
        });

        if (
            PopupMenu.activeInstance
            && PopupMenu.activeInstance !== this
            && !PopupMenu.activeInstance.elem.contains(this.hostElem)
        ) {
            PopupMenu.hideActive();
        }
        PopupMenu.activeInstance = this;

        this.setHandlers();
    }

    hideMenu() {
        if (!this.isMenuVisible()) {
            return;
        }

        this.detachChild();

        this.setActive(null);

        show(this.elem, false);
        this.popupPosition?.reset();
        this.popupPosition = null;

        PopupMenu.activeInstance = null;
        this.removeHandlers();

        this.notifyEvent('onClose');
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
