import {
    createElement,
    svg,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';

/* CSS classes */
const SELECTION_ITEM_CLASS = 'dd__selection-item';
const SELECTION_ITEM_DEL_BTN_CLASS = 'dd__del-selection-item-btn';
const SELECTION_ITEM_DEL_ICON_CLASS = 'dd__del-selection-item-icon';
const SELECTION_ITEM_ACTIVE_CLASS = 'dd__selection-item_active';

/* Close icon path */
const CLOSE_ICON = 'M 1.1415,2.4266 5.7838,7 1.1415,11.5356 2.4644,12.8585 7,8.2162 11.5734,12.8585 12.8585,11.5356 8.2162,7 12.8585,2.4266 11.5734,1.1415 7,5.7838 2.4644,1.1415 Z';

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
        this.closeIcon = this.createCloseIcon(SELECTION_ITEM_DEL_ICON_CLASS);
        this.deselectButton = createElement('span', {
            props: { className: SELECTION_ITEM_DEL_BTN_CLASS },
            children: this.closeIcon,
        });
        this.titleElem = createElement('span');

        this.elem = createElement('span', {
            props: { className: SELECTION_ITEM_CLASS },
            children: [this.titleElem, this.deselectButton],
        });
    }

    // TODO: move Close icon / close button to separate component
    /** Returns close icon SVG element */
    createCloseIcon(className) {
        return svg(
            'svg',
            { class: className, viewBox: '0 0 14 14' },
            svg('path', { d: CLOSE_ICON }),
        );
    }

    render(state) {
        this.titleElem.textContent = state.title;

        this.elem.classList.toggle(SELECTION_ITEM_ACTIVE_CLASS, state.active);
    }
}
