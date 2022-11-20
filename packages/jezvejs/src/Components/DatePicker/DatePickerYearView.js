import { createElement, isDate } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { getShortMonthName, MONTHS_COUNT } from '../../js/DateUtils.js';

/* CSS classes */
const VIEW_CONTAINER_CLASS = 'dp__view-container';
const CELL_CLASS = 'dp__cell';
const YEAR_CELL_CLASS = 'dp__year-view__cell';

export const YEAR_VIEW = 'year';

export class DatePickerYearView extends Component {
    constructor(props) {
        super(props);

        if (!isDate(this.props.date)) {
            throw new Error('Invalid date');
        }

        this.state = {
            ...this.props,
            set: [],
        };
        this.type = YEAR_VIEW;

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

    get set() {
        return this.state.set;
    }

    init() {
        const { date } = this.state;
        const rYear = date.getFullYear();

        this.state.title = rYear;
        this.state.nav = {
            prev: new Date(rYear - 1, 1, 1),
            next: new Date(rYear + 1, 1, 1),
        };
        this.elem = createElement('div', { props: { className: VIEW_CONTAINER_CLASS } });

        // months of current year
        for (let i = 0; i < MONTHS_COUNT; i += 1) {
            const monthDate = new Date(rYear, i, 1);
            const setObj = {
                date: monthDate,
                cell: createElement('div', {
                    props: {
                        className: `${CELL_CLASS} ${YEAR_CELL_CLASS}`,
                        textContent: getShortMonthName(monthDate, this.props.locales),
                    },
                }),
            };

            this.state.set.push(setObj);
            this.elem.append(setObj.cell);
        }
    }
}
