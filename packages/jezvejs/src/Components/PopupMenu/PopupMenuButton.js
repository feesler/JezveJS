import { createElement, isFunction } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { Icon } from '../Icon/Icon.js';
import './style.scss';

/* CSS classes */
const MENU_CLASS = 'popup-menu';
const BUTTON_CLASS = 'popup-menu-btn';
const ICON_CLASS = 'popup-menu-btn__icon';

const defaultProps = {
    icon: 'ellipsis',
    onClick: null,
};

export class PopupMenuButton extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        const events = {};
        if (isFunction(this.props.onClick)) {
            events.click = (e) => this.props.onClick(e);
        }

        this.button = createElement('button', {
            props: { className: BUTTON_CLASS, type: 'button' },
            children: Icon.create({
                icon: this.props.icon,
                className: ICON_CLASS,
            }).elem,
            events,
        });

        this.elem = createElement('div', {
            props: { className: MENU_CLASS },
            children: [
                this.button,
            ],
        });

        this.setClassNames();
    }
}
