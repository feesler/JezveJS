import { asArray } from '@jezvejs/types';
import { createElement } from '@jezvejs/dom';
import { Component } from '../../../../Component.js';
import './BaseChartLegend.scss';

/* CSS classes */
const LEGEND_LIST_CLASS = 'chart__legend-list';
const LEGEND_LIST_ITEM_CLASS = 'chart__legend-list-item';

const defaultProps = {
    categories: [],
};

/**
 * Chart legend component
 */
export class BaseChartLegend extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('ul', {
            props: { className: LEGEND_LIST_CLASS },
        });
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        const categories = asArray(state.categories);

        const items = categories.map((category) => createElement('li', {
            props: {
                className: LEGEND_LIST_ITEM_CLASS,
                textContent: category.toString(),
            },
        }));

        this.elem.replaceChildren(...items);
    }
}
