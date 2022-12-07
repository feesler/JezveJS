import { createElement } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { Icon } from '../Icon/Icon.js';
import './style.scss';

/* CSS classes */
const MENU_CLASS = 'popup-menu';
const BUTTON_CLASS = 'btn icon-btn popup-menu-btn';
const ICON_CLASS = 'icon popup-menu-btn__icon';

const defaultProps = {
    icon: 'ellipsis',
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
        this.button = createElement('button', {
            props: { className: BUTTON_CLASS, type: 'button' },
            children: Icon.create({
                icon: this.props.icon,
                className: ICON_CLASS,
            }).elem,
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
