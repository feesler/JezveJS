import { isFunction } from '@jezvejs/types';
import { Component } from 'jezvejs';
import { createElement } from '@jezvejs/dom';
import './LocalesContainer.scss';

/* CSS classes */
const CONTAINER_CLASS = 'locales-container';
const ITEM_CLASS = 'locales-item';

const defaultProps = {
    items: null,
    renderItem: null,
};

/**
 * List of locales component
 */
export class LocalesContainer extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        if (!isFunction(this.props.renderItem)) {
            throw new Error('Invalid type of \'renderItem\' property. Function is expected.');
        }

        this.init();
    }

    init() {
        const { items, renderItem } = this.props;

        this.elem = createElement('div', {
            className: CONTAINER_CLASS,
            children: items.map((item) => (
                createElement('div', {
                    className: ITEM_CLASS,
                    children: [
                        createElement('h3', { textContent: item.title }),
                        createElement('div', {
                            id: item.id,
                            children: renderItem(item),
                        }),
                    ],
                })
            )),
        });

        this.setClassNames();
    }
}
