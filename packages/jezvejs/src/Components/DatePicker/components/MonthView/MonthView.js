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
    getDaysInMonth,
} from '@jezvejs/datetime';
import { includesDate, MONTH_VIEW } from '../../utils.js';
import { DatePickerBaseView } from '../BaseView/BaseView.js';
import './MonthView.scss';

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
    showOtherMonthDays: true,
    fixedHeight: false,
    header: null,
    focusable: false,
    components: {
        Header: null,
        WeekDaysHeader: null,
    },
};

/**
 * Month view component
 */
export class DatePickerMonthView extends DatePickerBaseView {
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
        return MONTH_VIEW;
    }

    init() {
        const { locales, firstDay, doubleView } = this.props;
        const { date } = this.state;
        const today = new Date();
        const rMonth = date.getMonth();
        const rYear = date.getFullYear();

        this.elem = createElement('div', { className: VIEW_CONTAINER_CLASS });

        // month header
        this.createHeader();

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
        const { showOtherMonthDays, fixedHeight } = this.props;
        let week = getWeekDays(firstMonthDay, weekDayParams);
        let weeks = 1;
        const disabledFilter = isFunction(this.state.disabledDateFilter);

        // Start from previous week if 'fixedHeight' option is enabled
        // and current month is exacly 4 weeks:
        // February of the leap year, starting on first day of week
        if (fixedHeight) {
            const daysInMonth = getDaysInMonth(firstMonthDay);
            if (
                (daysInMonth === DAYS_IN_WEEK * 4)
                && isSameDate(week[0], firstMonthDay)
            ) {
                const prevWeekDay = shiftDate(week[0], -DAYS_IN_WEEK);
                week = getWeekDays(prevWeekDay, weekDayParams);
            }
        }

        do {
            week.forEach((weekday) => {
                const isOtherMonth = !isSameYearMonth(date, weekday);
                const isToday = isSameDate(weekday, today) && (!doubleView || !isOtherMonth);
                const itemDate = weekday.getDate();
                const item = this.createItem(weekday, { isOtherMonth, isToday });

                if (showOtherMonthDays || !isOtherMonth) {
                    item.elem.textContent = itemDate;
                }
                if (!isOtherMonth) {
                    item.elem.dataset.date = itemDate;
                }

                item.elem.classList.toggle(OTHER_CELL_CLASS, item.isOtherMonth);
                item.elem.classList.toggle(TODAY_CELL_CLASS, item.isToday);

                const disabled = (
                    (!showOtherMonthDays && isOtherMonth)
                    || (!!disabledFilter && this.state.disabledDateFilter(item.date))
                );
                enable(item.elem, !disabled);

                this.items.push(item);
                this.elem.append(item.elem);
            });

            const nextWeekDay = shiftDate(week[0], DAYS_IN_WEEK);
            const addNextWeek = (
                isSameYearMonth(date, nextWeekDay)
                || (fixedHeight && weeks < 6)
            );

            week = (addNextWeek)
                ? getWeekDays(nextWeekDay, weekDayParams)
                : null;
            weeks += 1;
        } while (week);
    }

    createItem(date, options = {}) {
        const { isOtherMonth, isToday } = options;
        const { focusable } = this.props;
        const tagName = (focusable) ? 'button' : 'div';

        return {
            date,
            isOtherMonth,
            isToday,
            elem: createElement(tagName, {
                type: (focusable) ? 'button' : undefined,
                className: getClassName(CELL_CLASS, MONTH_CELL_CLASS, DAY_CELL_CLASS),
            }),
        };
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

        const { showOtherMonthDays } = this.props;
        const disabledFilter = isFunction(state.disabledDateFilter);

        this.items.forEach((item) => {
            const isActive = (
                includesDate(state.actDate, item.date)
                && !item.isOtherMonth
            );
            item.elem.classList.toggle(ACTIVE_CELL_CLASS, isActive);

            const highlight = (
                state.range
                && !item.isOtherMonth
                && this.inRange(item.date, state.curRange)
            );
            item.elem.classList.toggle(HIGHLIGHT_CELL_CLASS, highlight);

            const startDate = state.curRange?.start ?? null;
            const isRangeStart = (
                !!startDate
                && !item.isOtherMonth
                && isSameDate(item.date, startDate)
            );
            item.elem.classList.toggle(RANGE_START_CELL_CLASS, isRangeStart);

            const endDate = state.curRange?.end ?? null;
            const isRangeEnd = (
                !!endDate
                && !item.isOtherMonth
                && isSameDate(item.date, endDate)
            );
            item.elem.classList.toggle(RANGE_END_CELL_CLASS, isRangeEnd);

            const disabled = (
                (!showOtherMonthDays && item.isOtherMonth)
                || (!!disabledFilter && state.disabledDateFilter(item.date, state))
            );
            enable(item.elem, !disabled);
        });
    }
}
