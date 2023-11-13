import { isDate, isFunction } from '@jezvejs/types';
import {
    createElement,
    enable,
    getClassName,
} from '@jezvejs/dom';
import {
    DAYS_IN_WEEK,
    shiftDate,
    getWeekDays,
    isSameYearMonth,
    isSameDate,
} from '@jezvejs/datetime';
import { Component } from '../../../../js/Component.js';
import {
    getHeaderTitle,
    getNextViewDate,
    getPrevViewDate,
    includesDate,
    MONTH_VIEW,
} from '../../utils.js';

/* CSS classes */
const VIEW_CONTAINER_CLASS = 'dp__view-container dp__month-view';
const CELL_CLASS = 'dp__cell';
const OTHER_CELL_CLASS = 'dp__other-month-cell';
const MONTH_CELL_CLASS = 'dp__month-view_cell';
const DAY_CELL_CLASS = 'dp__day-cell';
const TODAY_CELL_CLASS = 'dp__today-cell';
const HIGHLIGHT_CELL_CLASS = 'dp__cell_hl';
const RANGE_START_CELL_CLASS = 'dp__cell_hl-range-start';
const RANGE_END_CELL_CLASS = 'dp__cell_hl-range-end';
const ACTIVE_CELL_CLASS = 'dp__cell_act';

const defaultProps = {
    date: null,
    title: null,
    nav: null,
    locales: [],
    firstDay: null,
    doubleView: false,
    renderWeekdays: true,
    renderHeader: false,
    header: null,
    components: {
        Header: null,
        WeekDaysHeader: null,
    },
};

export class DatePickerMonthView extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        const { date, locales } = this.props;
        if (!isDate(date)) {
            throw new Error('Invalid date');
        }

        this.type = MONTH_VIEW;
        this.items = [];

        this.state = {
            ...this.props,
            title: getHeaderTitle({
                viewType: this.type,
                date,
                locales,
            }),
            nav: {
                prev: getPrevViewDate(date, this.type),
                next: getNextViewDate(date, this.type),
            },
        };

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
        const { locales, firstDay, doubleView } = this.props;
        const { date } = this.state;
        const today = new Date();
        const rMonth = date.getMonth();
        const rYear = date.getFullYear();

        this.elem = createElement('div', { props: { className: VIEW_CONTAINER_CLASS } });

        // month header
        const { Header } = this.props.components;
        if (this.props.renderHeader && Header) {
            this.header = Header.create({
                ...(this.props.header ?? {}),
                title: this.state.title,
            });
            this.elem.append(this.header.elem);
        }

        // week days header
        const firstMonthDay = new Date(rYear, rMonth, 1);
        const weekDayParams = {
            locales,
        };
        if (typeof firstDay === 'number') {
            weekDayParams.options = {
                firstDay,
            };
        }

        const { WeekDaysHeader } = this.props.components;
        if (this.props.renderWeekdays && WeekDaysHeader) {
            this.weekdays = WeekDaysHeader.create({
                locales,
                firstDay,
            });
            this.elem.append(this.weekdays.elem);
        }

        // days
        let week = getWeekDays(firstMonthDay, weekDayParams);
        const disabledFilter = isFunction(this.state.disabledDateFilter);

        do {
            week.forEach((weekday) => {
                const isOtherMonth = !isSameYearMonth(date, weekday);
                const isToday = isSameDate(weekday, today) && (!doubleView || !isOtherMonth);
                const itemDate = weekday.getDate();
                const item = {
                    date: weekday,
                    isOtherMonth,
                    isToday,
                    elem: createElement('div', {
                        props: {
                            className: getClassName(CELL_CLASS, MONTH_CELL_CLASS, DAY_CELL_CLASS),
                            textContent: itemDate,
                            dataset: {
                                date: itemDate,
                            },
                        },
                    }),
                };

                item.elem.classList.toggle(OTHER_CELL_CLASS, item.isOtherMonth);
                item.elem.classList.toggle(TODAY_CELL_CLASS, item.isToday);

                const disabled = disabledFilter && this.state.disabledDateFilter(item.date);
                enable(item.elem, !disabled);

                this.items.push(item);
                this.elem.append(item.elem);
            });

            const nextWeekDay = shiftDate(week[0], DAYS_IN_WEEK);
            week = isSameYearMonth(date, nextWeekDay)
                ? getWeekDays(nextWeekDay, weekDayParams)
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
            && state.disabledDateFilter === prevState.disabledDateFilter
            && state.rangePart === prevState.rangePart
        ) {
            return;
        }

        const { doubleView } = this.props;
        const disabledFilter = isFunction(state.disabledDateFilter);

        this.items.forEach((item) => {
            const isActive = includesDate(state.actDate, item.date);
            item.elem.classList.toggle(ACTIVE_CELL_CLASS, isActive);

            const highlight = (
                state.range
                && (!doubleView || !item.isOtherMonth)
                && this.inRange(item.date, state.curRange)
            );
            item.elem.classList.toggle(HIGHLIGHT_CELL_CLASS, highlight);

            const startDate = state.curRange?.start ?? null;
            const isRangeStart = !!startDate && isSameDate(item.date, startDate);
            item.elem.classList.toggle(RANGE_START_CELL_CLASS, isRangeStart);

            const endDate = state.curRange?.end ?? null;
            const isRangeEnd = !!endDate && isSameDate(item.date, endDate);
            item.elem.classList.toggle(RANGE_END_CELL_CLASS, isRangeEnd);

            const disabled = disabledFilter && state.disabledDateFilter(item.date, state);
            enable(item.elem, !disabled);
        });
    }
}
