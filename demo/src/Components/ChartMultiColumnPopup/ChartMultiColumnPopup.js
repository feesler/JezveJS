import { createElement } from '@jezvejs/dom';
import { BaseChartPopup } from 'jezvejs/BaseChart';

import './ChartMultiColumnPopup.scss';

/* CSS classes */
const POPUP_LIST_CLASS = 'custom-chart-popup__list';
const POPUP_LIST_ITEM_CLASS = 'list-item_category-';

/**
 * Chart legend component
 */
export class ChartMultiColumnPopup extends BaseChartPopup {
    renderContent(state) {
        const { target } = state;

        if (!target.group) {
            return createElement('span', { props: { textContent: target.item.value } });
        }

        return createElement('ul', {
            props: { className: POPUP_LIST_CLASS },
            children: target.group.map((item, index) => (
                createElement('li', {
                    props: {
                        className: `${POPUP_LIST_ITEM_CLASS}${item.categoryIndex + 1}`,
                    },
                    children: createElement(((target.index === index) ? 'b' : 'span'), {
                        props: { textContent: item.value },
                    }),
                })
            )),
        });
    }
}
