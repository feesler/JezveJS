import { createElement, getClassName } from '@jezvejs/dom';
import { getShortMonthName, MONTHS_COUNT } from '@jezvejs/datetime';
import { YEAR_VIEW } from '../../utils.js';
import { DatePickerBaseView } from '../BaseView/BaseView.js';
import './YearView.scss';

/* CSS classes */
const VIEW_CONTAINER_CLASS = 'dp__view-container dp__year-view';
const CELL_CLASS = 'dp__cell';
const YEAR_CELL_CLASS = 'dp__year-view__cell';

const defaultProps = {
    renderHeader: false,
    header: null,
    focusable: false,
    components: {
        Header: null,
    },
};

/**
 * Year view component
 */
export class DatePickerYearView extends DatePickerBaseView {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });
    }

    get type() {
        return YEAR_VIEW;
    }

    init() {
        const { date } = this.state;
        const rYear = date.getFullYear();

        this.elem = createElement('div', { className: VIEW_CONTAINER_CLASS });

        // year header
        this.createHeader();

        // months of current year
        for (let i = 0; i < MONTHS_COUNT; i += 1) {
            const monthDate = new Date(rYear, i, 1);
            const item = this.createItem(monthDate);

            this.items.push(item);
            this.elem.append(item.elem);
        }
    }

    createItem(date) {
        const { locales, focusable } = this.props;
        const tagName = (focusable) ? 'button' : 'div';

        return {
            date,
            elem: createElement(tagName, {
                type: (focusable) ? 'button' : undefined,
                className: getClassName(CELL_CLASS, YEAR_CELL_CLASS),
                textContent: getShortMonthName(date, locales),
            }),
        };
    }
}
