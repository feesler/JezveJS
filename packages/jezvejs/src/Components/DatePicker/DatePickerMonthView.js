import { createElement, isDate } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import {
    DAYS_IN_WEEK,
    getWeekdayShort,
    getLongMonthName,
    shiftDate,
    getWeekDays,
    isSameYearMonth,
    isSameDate,
} from '../../js/DateUtils.js';
import { getNextViewDate, getPrevViewDate, MONTH_VIEW } from './utils.js';

/* CSS classes */
const VIEW_CONTAINER_CLASS = 'dp__view-container';
const CELL_CLASS = 'dp__cell';
const OTHER_CELL_CLASS = 'dp__other-month-cell';
const MONTH_CELL_CLASS = 'dp__month-view_cell';
const DAY_CELL_CLASS = 'dp__day-cell';
const WEEKDAY_CELL_CLASS = 'dp__weekday-cell';
const TODAY_CELL_CLASS = 'dp__today-cell';
const HIGHLIGHT_CELL_CLASS = 'dp__cell_hl';
const ACTIVE_CELL_CLASS = 'dp__cell_act';

export class DatePickerMonthView extends Component {
    constructor(props) {
        super(props);

        if (!isDate(this.props.date)) {
            throw new Error('Invalid date');
        }

        this.state = {
            ...this.props,
        };
        this.type = MONTH_VIEW;
        this.items = [];

        this.init();
        this.render(this.state);
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
        const today = new Date();
        const rMonth = date.getMonth();
        const rYear = date.getFullYear();
        const monthLong = getLongMonthName(date, this.props.locales);

        this.state.title = `${monthLong} ${rYear}`;
        this.state.nav = {
            prev: getPrevViewDate(date, this.type),
            next: getNextViewDate(date, this.type),
        };
        this.elem = createElement('div', { props: { className: VIEW_CONTAINER_CLASS } });

        // header
        const firstMonthDay = new Date(rYear, rMonth, 1);
        let week = getWeekDays(firstMonthDay);
        const headerElems = week.map((weekday) => createElement('div', {
            props: {
                className: `${CELL_CLASS} ${MONTH_CELL_CLASS} ${WEEKDAY_CELL_CLASS}`,
                textContent: getWeekdayShort(weekday, this.props.locales),
            },
        }));
        this.elem.append(...headerElems);

        // days
        do {
            week.forEach((weekday) => {
                const item = {
                    date: weekday,
                    elem: createElement('div', {
                        props: {
                            className: `${CELL_CLASS} ${MONTH_CELL_CLASS} ${DAY_CELL_CLASS}`,
                            textContent: weekday.getDate(),
                        },
                    }),
                };

                if (!isSameYearMonth(date, weekday)) {
                    item.elem.classList.add(OTHER_CELL_CLASS);
                }
                if (isSameDate(weekday, today)) {
                    item.elem.classList.add(TODAY_CELL_CLASS);
                }

                this.items.push(item);
                this.elem.append(item.elem);
            });

            const nextWeekDay = shiftDate(week[0], DAYS_IN_WEEK);
            week = isSameYearMonth(date, nextWeekDay)
                ? getWeekDays(nextWeekDay)
                : null;
        } while (week);
    }

    /**
     * Check specified date is in range
     * @param {Date} date - date to check
     * @param {object} range - date range object
     */
    inRange(date, range) {
        if (!isDate(date) || !isDate(range?.start) || !isDate(range?.end)) {
            return false;
        }

        return (date - range.start >= 0 && date - range.end <= 0);
    }

    render(state, prevState = {}) {
        if (
            state.actDate === prevState?.actDate
            && state.curRange?.start === prevState.curRange?.start
            && state.curRange?.end === prevState.curRange?.end
        ) {
            return;
        }

        this.items.forEach((item) => {
            const isActive = state.actDate && isSameDate(item.date, state.actDate);
            item.elem.classList.toggle(ACTIVE_CELL_CLASS, isActive);

            const highlight = state.range && this.inRange(item.date, state.curRange);
            item.elem.classList.toggle(HIGHLIGHT_CELL_CLASS, highlight);
        });
    }
}
