import { Component } from 'jezvejs';
import { createElement } from '@jezvejs/dom';

const ITEM_CLASS = 'list_item';

/**
 * List item component
 * @param {object} props
 */
export class ListItem extends Component {
    static get selector() {
        return `.${ITEM_CLASS}`;
    }

    static get sortSelector() {
        return this.selector;
    }

    constructor(props) {
        super(props);

        this.state = {
            ...this.props,
        };

        this.titleElem = createElement('span');
        this.elem = createElement('div', {
            props: { className: ITEM_CLASS },
            children: this.titleElem,
        });

        this.setClassNames();
        this.render(this.state);
    }

    get id() {
        return this.state.id;
    }

    render(state) {
        this.elem.dataset.id = state.id;
        this.titleElem.textContent = state.title;
        if (state.group) {
            this.elem.dataset.group = state.group;
        }
    }
}
