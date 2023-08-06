import { Component, createElement, isFunction } from 'jezvejs';
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
            props: { className: CONTAINER_CLASS },
            children: items.map((item) => (
                createElement('div', {
                    props: { className: ITEM_CLASS },
                    children: [
                        createElement('h3', { props: { textContent: item.title } }),
                        createElement('div', {
                            props: { id: item.id },
                            children: renderItem(item),
                        }),
                    ],
                })
            )),
        });

        this.setClassNames();
    }
}
