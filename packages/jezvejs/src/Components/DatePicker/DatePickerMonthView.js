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

export const MONTH_VIEW = 'month';

export class DatePickerMonthView extends Component {
    constructor(props) {
        super(props);

        if (!isDate(this.props.date)) {
            throw new Error('Invalid date');
        }

        this.state = {
            ...this.props,
            set: [],
        };
        this.type = MONTH_VIEW;

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

    get set() {
        return this.state.set;
    }

    init() {
        const { date } = this.state;
        const today = new Date();
        const rMonth = date.getMonth();
        const rYear = date.getFullYear();
        const monthLong = getLongMonthName(date, this.props.locales);

        this.state.title = `${monthLong} ${rYear}`;
        this.state.nav = {
            prev: new Date(rYear, rMonth - 1, 1),
            next: new Date(rYear, rMonth + 1, 1),
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
            const dateElems = week.map((weekday) => {
                const setObj = {
                    date: weekday,
                    cell: createElement('div', {
                        props: {
                            className: `${CELL_CLASS} ${MONTH_CELL_CLASS} ${DAY_CELL_CLASS}`,
                            textContent: weekday.getDate(),
                        },
                    }),
                };

                if (!isSameYearMonth(date, weekday)) {
                    setObj.cell.classList.add(OTHER_CELL_CLASS);
                }
                if (isSameDate(weekday, today)) {
                    setObj.cell.classList.add(TODAY_CELL_CLASS);
                }

                return setObj;
            });
            this.state.set.push(...dateElems);

            const nextWeekDay = shiftDate(week[0], DAYS_IN_WEEK);
            week = isSameYearMonth(date, nextWeekDay)
                ? getWeekDays(nextWeekDay)
                : null;
        } while (week);

        const viewItems = this.state.set.map((item) => item.cell);
        this.elem.append(...viewItems);
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

        state.set.forEach((dateObj) => {
            const isActive = state.actDate && isSameDate(dateObj.date, state.actDate);
            dateObj.cell.classList.toggle(ACTIVE_CELL_CLASS, isActive);

            const highlight = state.range && this.inRange(dateObj.date, state.curRange);
            dateObj.cell.classList.toggle(HIGHLIGHT_CELL_CLASS, highlight);
        });
    }
}
