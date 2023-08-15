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
        selectable: true,
        selected: false,
        disabled: false,
        hidden: false,
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

        this.state = { ...this.props };

        this.init();
        this.postInit();
        this.render(this.state);
    }

    get id() {
        return this.state.id;
    }

    init() {
        const { type } = this.props;
        const isButton = type === 'button' || type === 'checkbox';
        const isLink = type === 'link' || type === 'checkbox-link';
        const tagName = (isLink) ? 'a' : 'button';

        const props = {
            className: ITEM_CLASS,
            tabIndex: -1,
        };

        if (isButton) {
            props.type = 'button';
            props.className = getClassName(props.className, BUTTON_ITEM_CLASS);
        } else if (isLink) {
            props.className = getClassName(props.className, LINK_ITEM_CLASS);
        }

        this.contentElem = createElement('div', {
            props: { className: CONTENT_CLASS },
        });

        this.elem = createElement(tagName, {
            props,
            children: this.contentElem,
        });
    }

    postInit() {
        this.setClassNames();
    }

    createBeforeElement() {
        return createElement('div', { props: { className: BEFORE_CLASS } });
    }

    createAfterElement() {
        return createElement('div', { props: { className: AFTER_CLASS } });
    }

    renderBeforeContainer(state, prevState) {
        if (state.beforeContent === prevState?.beforeContent) {
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
            state.icon === prevState?.icon
            || !state.beforeContent
        ) {
            return;
        }

        this.beforeElem.textContent = '';
        if (state.icon) {
            const icon = Icon.create({
                icon: state.icon,
                className: ICON_CLASS,
            });
            this.beforeElem.append(icon.elem);
        }
    }

    renderAfterContainer(state, prevState) {
        if (state.afterContent === prevState?.afterContent) {
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
            state.iconAfter === prevState?.iconAfter
            || !state.afterContent
        ) {
            return;
        }

        this.afterElem.textContent = '';
        if (state.iconAfter) {
            const icon = Icon.create({
                icon: state.iconAfter,
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

    render(state, prevState = {}) {
        this.contentElem.textContent = state.title ?? '';

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
