import { asArray } from '@jezvejs/types';
import { createElement, getClassName } from '@jezvejs/dom';
import { Component } from 'jezvejs';

import './ListPlaceholder.scss';

/* CSS classes */
const LIST_PLACEHODLER_CLASS = 'list-placeholder';

const defaultProps = {
    content: null,
    className: null,
};

export class ListPlaceholder extends Component {
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
        this.elem = createElement('div', {
            className: getClassName(LIST_PLACEHODLER_CLASS, this.props.className),
        });
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        const contentItems = asArray(state.content).filter((item) => item);
        this.elem.replaceChildren(...contentItems);
    }
}
