import { asArray } from '@jezvejs/types';
import { createElement } from '@jezvejs/dom';
import { Component } from 'jezvejs';
import './ChartCustomLegend.scss';

/* CSS classes */
const LEGEND_LIST_CLASS = 'chart__legend-list';
const ITEM_CLASS = 'list-item_category list-item_category-';
const ACTIVE_ITEM_CLASS = 'list-item_category list-item_active-category list-item_category-';
const ITEM_SELECTOR = '.list-item_category';

const defaultProps = {
    categories: [],
    activateCategoryOnClick: false,
    onClick: null,
    setActiveCategory: null,
};

/**
 * Custom chart legend component
 */
export class ChartCustomLegend extends Component {
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
            events: { click: (e) => this.onClick(e) },
        });
    }

    onClick(e) {
        if (this.state.activateCategoryOnClick) {
            this.activateCategory(e);
        }

        this.notifyEvent('onClick', e);
    }

    activateCategory(e) {
        const listItem = e.target.closest(ITEM_SELECTOR);
        if (!listItem) {
            return;
        }

        const { category } = listItem.dataset;
        const activeCategory = this.state.activeCategory?.toString() ?? null;
        const isActive = (
            !!category
            && category.toString() === activeCategory
        );

        this.notifyEvent('setActiveCategory', (isActive) ? null : category);
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        const categories = asArray(state.categories);
        const activeCategory = state.activeCategory?.toString() ?? null;

        const items = categories.map((category) => createElement('li', {
            props: {
                className: (
                    (category?.toString() === activeCategory)
                        ? `${ACTIVE_ITEM_CLASS}${category + 1}`
                        : `${ITEM_CLASS}${category + 1}`
                ),
                dataset: {
                    category,
                },
            },
            children: createElement('span', {
                props: { textContent: `Category ${category + 1}` },
            }),
        }));

        this.elem.replaceChildren(...items);
    }
}
