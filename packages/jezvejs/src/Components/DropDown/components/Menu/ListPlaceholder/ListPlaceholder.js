import { asArray } from '@jezvejs/types';
import { createElement, getClassName } from '@jezvejs/dom';
import { Component } from '../../../../../Component.js';
import './ListPlaceholder.scss';

/* CSS classes */
const LIST_PLACEHODLER_CLASS = 'dd__list-item dd__list-placeholder';
const SELECTABLE_CLASS = 'dd__list-placeholder_selectable';
const LIST_ITEM_ACTIVE_CLASS = 'dd__list-item_active';

const defaultProps = {
    content: null,
    active: false,
    selectable: false,
    className: null,
};

export class DropDownListPlaceholder extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = { ...this.props };

        this.init();
        this.render(this.state);
    }

    init() {
        this.contentElem = createElement('div', {
            props: {
                className: getClassName(LIST_PLACEHODLER_CLASS, this.props.className),
            },
        });

        this.elem = createElement('li', {
            children: this.contentElem,
        });
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.contentElem.classList.toggle(LIST_ITEM_ACTIVE_CLASS, !!state.active);
        this.contentElem.classList.toggle(SELECTABLE_CLASS, !!state.selectable);

        this.contentElem.textContent = '';
        if (typeof state.content === 'string') {
            this.contentElem.textContent = state.content;
            this.contentElem.title = state.content;
            return;
        }

        const contentItems = asArray(state.content).filter((item) => item);
        this.contentElem.append(...contentItems);
    }
}
