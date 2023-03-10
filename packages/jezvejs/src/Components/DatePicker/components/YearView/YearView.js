import { createElement, isDate } from '../../../../js/common.js';
import { Component } from '../../../../js/Component.js';
import { getShortMonthName, MONTHS_COUNT } from '../../../../js/DateUtils.js';
import { getNextViewDate, getPrevViewDate, YEAR_VIEW } from '../../utils.js';

/* CSS classes */
const VIEW_CONTAINER_CLASS = 'dp__view-container dp__year-view';
const CELL_CLASS = 'dp__cell';
const YEAR_CELL_CLASS = 'dp__year-view__cell';

export class DatePickerYearView extends Component {
    constructor(props) {
        super(props);

        if (!isDate(this.props.date)) {
            throw new Error('Invalid date');
        }

        this.state = {
            ...this.props,
        };
        this.type = YEAR_VIEW;
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

        this.state.title = rYear;
        this.state.nav = {
            prev: getPrevViewDate(date, this.type),
            next: getNextViewDate(date, this.type),
        };
        this.elem = createElement('div', { props: { className: VIEW_CONTAINER_CLASS } });

        // months of current year
        for (let i = 0; i < MONTHS_COUNT; i += 1) {
            const monthDate = new Date(rYear, i, 1);
            const item = {
                date: monthDate,
                elem: createElement('div', {
                    props: {
                        className: `${CELL_CLASS} ${YEAR_CELL_CLASS}`,
                        textContent: getShortMonthName(monthDate, this.props.locales),
                    },
                }),
            };

            this.items.push(item);
            this.elem.append(item.elem);
        }
    }
}
