import { Component } from 'jezvejs';
import {
    createElement,
    getClassName,
} from '@jezvejs/dom';

/* CSS classes */
const SELECTION_ITEM_CLASS = 'dd__selection-item';
const SELECTION_ITEM_DEL_BTN_CLASS = 'dd__del-selection-item-btn';
const SELECTION_ITEM_ACTIVE_CLASS = 'dd__selection-item_active';

const defaultProps = {
    active: false,
};

export class CustomSelectionItem extends Component {
    static get className() {
        return SELECTION_ITEM_CLASS;
    }

    static get selector() {
        return `.${this.className}`;
    }

    static get buttonClass() {
        return SELECTION_ITEM_DEL_BTN_CLASS;
    }

    constructor(props = {}) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        if (typeof this.props.id === 'undefined' || this.props.id === null) {
            throw new Error('Invalid id');
        }

        this.state = {
            ...this.props,
            id: this.props.id.toString(),
        };

        this.init();
        this.render(this.state);
    }

    get id() {
        return this.state.id;
    }

    init() {
        this.deselectButton = createElement('span', {
            className: getClassName(SELECTION_ITEM_DEL_BTN_CLASS, 'close-btn'),
        });
        this.titleElem = createElement('span');

        this.elem = createElement('span', {
            className: getClassName(SELECTION_ITEM_CLASS, 'dd__custom-selection-item', 'tag'),
            children: [this.deselectButton, this.titleElem],
        });
    }

    render(state) {
        this.titleElem.textContent = state.title.toLowerCase();

        this.elem.classList.toggle(SELECTION_ITEM_ACTIVE_CLASS, state.active);
    }
}
