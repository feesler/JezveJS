import { createElement, getClassName } from '@jezvejs/dom';
import { YEARRANGE_VIEW, YEAR_RANGE_LENGTH } from '../../utils.js';
import { DatePickerBaseView } from '../BaseView/BaseView.js';
import './YearRangeView.scss';

/* CSS classes */
const VIEW_CONTAINER_CLASS = 'dp__view-container dp__year-range-view';
const CELL_CLASS = 'dp__cell';
const OTHER_CELL_CLASS = 'dp__other-month-cell';
const YEARRANGE_CELL_CLASS = 'dp__year-range-view__cell';

const defaultProps = {
    renderHeader: false,
    header: null,
    focusable: false,
    components: {
        Header: null,
    },
};

/**
 * Year range view component
 */
export class DatePickerYearRangeView extends DatePickerBaseView {
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
        return YEARRANGE_VIEW;
    }

    init() {
        const { date } = this.state;
        const rYear = date.getFullYear();
        const startYear = rYear - (rYear % 10) - 1;

        this.elem = createElement('div', { props: { className: VIEW_CONTAINER_CLASS } });

        // year range header
        this.createHeader();

        // years of current range
        for (let i = 0; i < YEAR_RANGE_LENGTH + 2; i += 1) {
            const yearDate = new Date(startYear + i, 0, 1);
            const item = this.createItem(yearDate);

            if (i === 0 || i === YEAR_RANGE_LENGTH + 1) {
                item.elem.classList.add(OTHER_CELL_CLASS);
            }

            this.items.push(item);
            this.elem.append(item.elem);
        }
    }

    createItem(date) {
        const { focusable } = this.props;
        const tagName = (focusable) ? 'button' : 'div';

        return {
            date,
            elem: createElement(tagName, {
                props: {
                    type: (focusable) ? 'button' : undefined,
                    className: getClassName(CELL_CLASS, YEARRANGE_CELL_CLASS),
                    textContent: date.getFullYear(),
                },
            }),
        };
    }
}
