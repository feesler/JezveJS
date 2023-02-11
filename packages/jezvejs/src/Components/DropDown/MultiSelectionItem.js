import { createElement } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { CloseButton } from '../CloseButton/CloseButton.js';

/* CSS classes */
const SELECTION_ITEM_CLASS = 'dd__selection-item';
const SELECTION_ITEM_DEL_BTN_CLASS = 'dd__del-selection-item-btn';
const SELECTION_ITEM_ACTIVE_CLASS = 'dd__selection-item_active';

const defaultProps = {
    active: false,
};

export class DropDownMultiSelectionItem extends Component {
    static get className() {
        return SELECTION_ITEM_CLASS;
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
        this.deselectButton = CloseButton.create({
            className: SELECTION_ITEM_DEL_BTN_CLASS,
            tabIndex: -1,
        });

        this.titleElem = createElement('span');

        this.elem = createElement('span', {
            props: { className: SELECTION_ITEM_CLASS },
            children: [this.titleElem, this.deselectButton.elem],
        });
    }

    render(state) {
        this.titleElem.textContent = state.title;

        this.elem.classList.toggle(SELECTION_ITEM_ACTIVE_CLASS, state.active);
    }
}
