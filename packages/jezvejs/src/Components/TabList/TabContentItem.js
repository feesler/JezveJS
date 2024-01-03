import { asArray } from '@jezvejs/types';
import { createElement } from '@jezvejs/dom';
import { Component } from '../../Component.js';
import './TabList.scss';

/* CSS classes */
const ITEM_CLASS = 'tab-list__content-item';

const defaultProps = {
    value: null,
    active: false,
    disabled: false,
    content: null,
};

export class TabContentItem extends Component {
    static get className() {
        return ITEM_CLASS;
    }

    static get selector() {
        return `.${this.className}`;
    }

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        if (typeof this.props.id === 'undefined' || this.props.id === null) {
            throw new Error('Invalid id');
        }

        this.state = {
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    get id() {
        return this.state.id;
    }

    init() {
        this.elem = createElement('div', { className: ITEM_CLASS });
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (state.content !== prevState?.content) {
            this.elem.replaceChildren(...asArray(state.content));
        }

        this.elem.dataset.id = state.id;
        this.show(state.active);
        this.enable(!state.disabled);
    }
}
