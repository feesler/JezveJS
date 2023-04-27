import { createElement, getClassName, isDate } from '../../../../js/common.js';
import { Component } from '../../../../js/Component.js';
import {
    getNextViewDate,
    getPrevViewDate,
    YEARRANGE_VIEW,
    YEAR_RANGE_LENGTH,
} from '../../utils.js';

/* CSS classes */
const VIEW_CONTAINER_CLASS = 'dp__view-container dp__year-range-view';
const CELL_CLASS = 'dp__cell';
const OTHER_CELL_CLASS = 'dp__other-month-cell';
const YEARRANGE_CELL_CLASS = 'dp__year-range-view__cell';

export class DatePickerYearRangeView extends Component {
    constructor(props) {
        super(props);

        if (!isDate(this.props.date)) {
            throw new Error('Invalid date');
        }

        this.state = {
            ...this.props,
        };
        this.type = YEARRANGE_VIEW;
        this.items = [];

        this.init();
    }

    get date() {
        return this.state.date;
    }

    get title() {
        return this.state.title;
    }

    get nav() {
        return this.state.nav;
    }

    init() {
        const { date } = this.state;
        const rYear = date.getFullYear();
        const startYear = rYear - (rYear % 10) - 1;

        this.state.title = `${startYear + 1}-${startYear + YEAR_RANGE_LENGTH}`;
        this.state.nav = {
            prev: getPrevViewDate(date, this.type),
            next: getNextViewDate(date, this.type),
        };
        this.elem = createElement('div', { props: { className: VIEW_CONTAINER_CLASS } });

        // years of current range
        for (let i = 0; i < YEAR_RANGE_LENGTH + 2; i += 1) {
            const yearDate = new Date(startYear + i, 0, 1);
            const item = {
                date: yearDate,
                elem: createElement('div', {
                    props: {
                        className: getClassName(CELL_CLASS, YEARRANGE_CELL_CLASS),
                        textContent: yearDate.getFullYear(),
                    },
                }),
            };

            if (i === 0 || i === YEAR_RANGE_LENGTH + 1) {
                item.elem.classList.add(OTHER_CELL_CLASS);
            }

            this.items.push(item);
            this.elem.append(item.elem);
        }
    }
}
