import { Component } from '../../../../js/Component.js';
import {
    createElement,
    enable,
    getClassName,
    isFunction,
    re,
} from '../../../../js/common.js';
import { Icon } from '../../../Icon/Icon.js';

import './MenuItem.scss';

/* CSS classes */
const ITEM_CLASS = 'menu-item';
const BUTTON_ITEM_CLASS = 'button-menu-item';
const LINK_ITEM_CLASS = 'link-menu-item';
const ICON_CLASS = 'menu-item__icon';
const CONTENT_CLASS = 'menu-item__content';
const BEFORE_CLASS = 'menu-item__side-content menu-item__before';
const AFTER_CLASS = 'menu-item__side-content menu-item__after';
/* State classes */
const ACTIVE_ITEM_CLASS = 'menu-item_active';
const SELECTED_ITEM_CLASS = 'menu-item_selected';

/**
 * Menu list item component
 */
export class MenuItem extends Component {
    static defaultProps = {
        id: null,
        title: null,
        icon: null,
        beforeContent: undefined,
        afterContent: undefined,
        iconAlign: undefined,
        selectable: true,
        selected: false,
        disabled: false,
        hidden: false,
        tabThrough: undefined,
        url: window.location,
        useURLParam: undefined,
        itemParam: undefined,
        getItemURL: null,
    };

    static get selector() {
        return `.${ITEM_CLASS}`;
    }

    constructor(props = {}) {
        super({
            ...MenuItem.defaultProps,
            ...props,
        });

        const id = this.props.id?.toString() ?? null;
        if (id === null) {
            throw new Error('Invalid id');
        }

        this.state = {
            ...this.props,
            id,
        };

        this.render(this.state);
    }

    get id() {
        return this.state.id;
    }

    postInit() {
        this.setClassNames();
    }

    createContainer(state) {
        const { type } = state;
        const isButton = type === 'button' || type === 'checkbox';
        const isLink = type === 'link' || type === 'checkbox-link';
        const tagName = (isLink) ? 'a' : 'button';

        const props = {
            className: ITEM_CLASS,
        };

        if (!state.tabThrough) {
            props.tabIndex = -1;
        }

        if (isButton) {
            props.type = 'button';
            props.className = getClassName(props.className, BUTTON_ITEM_CLASS);
        } else if (isLink) {
            props.className = getClassName(props.className, LINK_ITEM_CLASS);
        }

        this.contentElem = createElement('div', {
            props: { className: CONTENT_CLASS },
        });

        const elem = createElement(tagName, {
            props,
            children: this.contentElem,
        });

        this.setElement(elem);

        this.beforeElem = null;
        this.afterElem = null;

        this.postInit();
    }

    createBeforeElement() {
        return createElement('div', { props: { className: BEFORE_CLASS } });
    }

    createAfterElement() {
        return createElement('div', { props: { className: AFTER_CLASS } });
    }

    renderBeforeContainer(state, prevState) {
        if (
            state.beforeContent === prevState?.beforeContent
            && state.type === prevState?.type
        ) {
            return;
        }

        if (!state.beforeContent) {
            re(this.beforeElem);
            this.beforeElem = null;
            return;
        }

        if (!this.beforeElem) {
            this.beforeElem = this.createBeforeElement();
            this.elem.prepend(this.beforeElem);
        }
    }

    renderBeforeContent(state, prevState) {
        if (
            (
                state.icon === prevState?.icon
                && state.iconAlign === prevState?.iconAlign
                && state.type === prevState?.type
            )
            || !state.beforeContent
        ) {
            return;
        }

        this.beforeElem.textContent = '';
        if (state.icon && state.iconAlign === 'left') {
            const icon = Icon.create({
                icon: state.icon,
                className: ICON_CLASS,
            });
            this.beforeElem.append(icon.elem);
        }
    }

    renderAfterContainer(state, prevState) {
        if (
            state.afterContent === prevState?.afterContent
            && state.type === prevState?.type
        ) {
            return;
        }

        if (!state.afterContent) {
            re(this.afterElem);
            this.afterElem = null;
            return;
        }

        if (!this.afterElem) {
            this.afterElem = this.createAfterElement();
            this.elem.append(this.afterElem);
        }
    }

    renderAfterContent(state, prevState) {
        if (
            (
                state.icon === prevState?.icon
                && state.iconAlign === prevState?.iconAlign
                && state.type === prevState?.type
            )
            || !state.afterContent
        ) {
            return;
        }

        this.afterElem.textContent = '';
        if (state.icon && state.iconAlign === 'right') {
            const icon = Icon.create({
                icon: state.icon,
                className: ICON_CLASS,
            });
            this.afterElem.append(icon.elem);
        }
    }

    getItemURL(state) {
        if (state.useURLParam && isFunction(this.props.getItemURL)) {
            return this.props.getItemURL(state);
        }

        return state.url ?? '';
    }

    renderContainer(state, prevState) {
        if (state.type === prevState?.type) {
            return;
        }

        this.createContainer(state);
    }

    renderContent(state, prevState) {
        if (
            state.title === prevState?.title
            && state.type === prevState?.type
        ) {
            return;
        }

        this.contentElem.textContent = state.title ?? '';
        this.contentElem.title = state.title ?? '';
    }

    render(state, prevState = {}) {
        this.renderContainer(state, prevState);
        this.renderContent(state, prevState);

        if (state.type === 'link' || state.type === 'checkbox-link') {
            this.elem.href = this.getItemURL(state);
        }

        this.show(!state.hidden);
        enable(this.elem, !state.disabled);

        this.elem.classList.toggle(ACTIVE_ITEM_CLASS, !!state.active);
        this.elem.classList.toggle(SELECTED_ITEM_CLASS, !!state.selected);

        this.renderBeforeContainer(state, prevState);
        this.renderBeforeContent(state, prevState);

        this.renderAfterContainer(state, prevState);
        this.renderAfterContent(state, prevState);
    }
}
