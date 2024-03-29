import { createElement } from '@jezvejs/dom';
import { Component } from '../../../../../Component.js';
import './SingleSelection.scss';

/* CSS classes */
const SINGLE_SELECTION_CLASS = 'dd__single-selection';

const defaultProps = {
    item: null,
};

export class DropDownSingleSelection extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = { ...this.props };

        this.init();
    }

    init() {
        this.elem = createElement('span', { className: SINGLE_SELECTION_CLASS });
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        const itemTitle = state.item?.title ?? '';

        this.elem.textContent = itemTitle;
        this.elem.title = itemTitle;
    }
}
