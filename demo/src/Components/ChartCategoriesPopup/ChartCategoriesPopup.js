import { createElement } from '@jezvejs/dom';
import { BaseChartPopup } from 'jezvejs/BaseChart';

import './ChartCategoriesPopup.scss';

/* CSS classes */
const POPUP_CLASS = 'categories-chart-popup';
const POPUP_LIST_CLASS = 'categories-chart-popup__list';
const POPUP_LIST_ITEM_CLASS = 'list-item_category-';

/**
 * Chart custom categories popup component
 */
export class ChartCategoriesPopup extends BaseChartPopup {
    renderContent(state) {
        const { target } = state;

        if (!target.group) {
            return createElement('span', { props: { textContent: target.item.value } });
        }

        const listItems = [];
        target.group.forEach((item, index) => {
            if (
                item.columnIndex !== target.item.columnIndex
                || item.value === 0
            ) {
                return;
            }

            const listItem = createElement('li', {
                props: {
                    className: `${POPUP_LIST_ITEM_CLASS}${item.categoryIndex + 1}`,
                },
                children: createElement(((target.index === index) ? 'b' : 'span'), {
                    props: { textContent: `Long data category name ${index + 1}: ${item.value}` },
                }),
            });
            listItems.push(listItem);
        });

        if (listItems.length === 0) {
            return null;
        }

        const list = createElement('ul', {
            props: { className: POPUP_LIST_CLASS },
            children: listItems,
        });

        return createElement('div', {
            props: { className: POPUP_CLASS },
            children: [
                createElement('b', { props: { textContent: target.item.groupName } }),
                createElement('div', { props: { textContent: target.series } }),
                list,
            ],
        });
    }
}
