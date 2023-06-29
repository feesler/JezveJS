import { asArray, createElement } from '../../../../js/common.js';
import { Component } from '../../../../js/Component.js';
import './ListPlaceholder.scss';

/* CSS classes */
const LIST_PLACEHODLER_CLASS = 'dd__list-item dd__list-placeholder';
const LIST_ITEM_ACTIVE_CLASS = 'dd__list-item_active';

const defaultProps = {
    content: null,
    className: LIST_PLACEHODLER_CLASS,
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
        this.contentElem = createElement('div');

        this.elem = createElement('li', {
            children: this.contentElem,
        });
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.contentElem.className = state.className ?? '';
        this.contentElem.classList.toggle(LIST_ITEM_ACTIVE_CLASS, !!state.active);

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
