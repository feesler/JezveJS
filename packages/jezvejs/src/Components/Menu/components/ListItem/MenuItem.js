import { Component } from '../../../../js/Component.js';
import { createElement, enable } from '../../../../js/common.js';
import { Icon } from '../../../Icon/Icon.js';

import './MenuItem.scss';

/* CSS classes */
const ITEM_CLASS = 'menu-item';
const ACTIVE_ITEM_CLASS = 'menu-item_active';
const ICON_CLASS = 'menu-item__icon';
const CONTENT_CLASS = 'menu-item__content';
const BEFORE_CLASS = 'menu-item__before';
const AFTER_CLASS = 'menu-item__after';

const defaultProps = {
    id: null,
    title: null,
    icon: null,
    beforeContent: true,
    afterContent: true,
    selected: false,
    disabled: false,
    url: window.location,
};

/**
 * Menu list item component
 */
export class MenuItem extends Component {
    static get selector() {
        return `.${ITEM_CLASS}`;
    }

    constructor(props = {}) {
        super({
            ...defaultProps,
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
        const isButton = this.props.type === 'button';
        const isLink = this.props.type === 'link';
        const tagName = (isLink) ? 'a' : 'button';

        const props = { className: ITEM_CLASS };
        const children = [];

        if (isButton) {
            props.type = 'button';
        } else if (isLink) {
            const { url } = this.props;
            props.href = url.toString();
        }

        if (this.props.beforeContent) {
            this.beforeElem = createElement('div', {
                props: { className: BEFORE_CLASS },
            });
            children.push(this.beforeElem);
        }

        this.contentElem = createElement('div', {
            props: { className: CONTENT_CLASS },
        });
        children.push(this.contentElem);

        if (this.props.afterContent) {
            this.afterElem = createElement('div', {
                props: { className: AFTER_CLASS, tabIndex: -1 },
            });
            children.push(this.afterElem);
        }

        this.elem = createElement(tagName, {
            props,
            children,
        });
    }

    postInit() {
        this.setClassNames();
    }

    render(state, prevState = {}) {
        this.contentElem.textContent = state.title ?? '';

        if (state.type === 'link') {
            this.elem.href = state.url ?? '';
        }

        enable(this.elem, !state.disabled);

        this.elem.classList.toggle(ACTIVE_ITEM_CLASS, !!state.active);

        if (state.beforeContent && state.icon !== prevState?.icon) {
            this.beforeElem.textContent = '';
            if (state.icon) {
                const icon = Icon.create({
                    icon: state.icon,
                    className: ICON_CLASS,
                });
                this.beforeElem.append(icon.elem);
            }
        }

        if (state.afterContent && state.iconAfter !== prevState?.iconAfter) {
            this.afterElem.textContent = '';
            if (state.iconAfter) {
                const icon = Icon.create({
                    icon: state.iconAfter,
                    className: ICON_CLASS,
                });
                this.afterElem.append(icon.elem);
            }
        }
    }
}
