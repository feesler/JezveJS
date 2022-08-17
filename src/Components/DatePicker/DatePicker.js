import {
    ge,
    ce,
    svg,
    addChilds,
    removeChilds,
    show,
    isDate,
    isFunction,
    transform,
    isVisible,
    setEmptyClick,
    removeEmptyClick,
    getOffset,
    re,
    px,
} from '../../js/common.js';
import '../../css/common.scss';
import './style.scss';
import {
    DAYS_IN_WEEK,
    MONTHS_COUNT,
    getWeekdayShort,
    getLongMonthName,
    getShortMonthName,
    shiftDate,
    getWeekDays,
    isSameYearMonth,
    isSameDate,
} from '../../js/DateUtils.js';

/* CSS classes */
const CONTAINER_CLASS = 'dp__container';
const WRAPPER_CLASS = 'dp__wrapper';
const STATIC_WRAPPER_CLASS = 'dp__static-wrapper';
/* Header */
const HEADER_CLASS = 'dp__header';
const HEADER_ITEM_CLASS = 'dp__header_item';
const HEADER_TITLE_CLASS = 'dp__header_title';
const HEADER_NAV_CLASS = 'dp__header_nav';
const NAV_ICON_CLASS = 'dp__header_nav-icon';
/* View */
const VIEW_CLASS = 'dp__view';
const VIEW_CONTAINER_CLASS = 'dp__view-container';
const CELL_CLASS = 'dp__cell';
const OTHER_CELL_CLASS = 'dp__other-month-cell';
const YEAR_CELL_CLASS = 'dp__year-view__cell';
const YEARRANGE_CELL_CLASS = 'dp__year-range-view__cell';
const MONTH_CELL_CLASS = 'dp__month-view_cell';
const DAY_CELL_CLASS = 'dp__day-cell';
const WEEKDAY_CELL_CLASS = 'dp__weekday-cell';
const TODAY_CELL_CLASS = 'dp__today-cell';
const HIGHLIGHT_CELL_CLASS = 'dp__cell_hl';
const ACTIVE_CELL_CLASS = 'dp__cell_act';
/* Animation */
const ANIMATED_CLASS = 'dp__animated-view';
const LAYER_VIEW_CLASS = 'dp__layered-view';
const TOP_FROM_CLASS = 'top_from';
const BOTTOM_FROM_CLASS = 'bottom_from';
const TOP_TO_CLASS = 'top_to';
const BOTTOM_TO_CLASS = 'bottom_to';

/* View types */
const MONTH_VIEW = 1;
const YEAR_VIEW = 2;
const YEARRANGE_VIEW = 3;

const YEAR_RANGE_LENGTH = 10;

const toCSSValue = (val) => (+val.toFixed(4));

/**
 * Date picker constructor
 * @param {object} params:
 * @param {string|Element} params.wrapper - identifier or Element where date picker will be rendered
 * @param {boolean} params.static - if true, date picker will be statically placed
 * @param {boolean} range - if true turn on date range select mode
 * @param {function} onrangeselect - date range select callback
 * @param {function} ondateselect - single date select callback
 * @param {function} onshow - dynamic date picker shown callback
 * @param {function} onhide - dynamic date picker hidden callback
 * @param {boolean} animated - animate transitions between views if possible
 * @param {string} relparent - identifier of relative alignment element
 * @param {Date} date - initial date to show
 */
export class DatePicker {
    /** Static alias for DatePicker constructor */
    static create(params) {
        return new DatePicker(params);
    }

    constructor(params) {
        this.baseObj = null;
        this.wrapperObj = null;
        this.isStatic = false;
        this.relativeParent = null;
        this.dateCallback = null;
        this.rangeCallback = null;
        this.showCallback = null;
        this.hideCallback = null;
        this.currView = null;
        this.nextView = null;
        this.nextCallbacks = null;
        this.actDate = null;
        this.rangeMode = false;
        this.curRange = { start: null, end: null };
        this.selRange = { start: null, end: null };
        this.titleEl = null;
        this.cellsContainer = null;
        this.isAnimated = true;
        this.animation = false;
        this.locales = params.locales || [];

        if (!('wrapper' in params)) {
            throw new Error('Wrapper element not specified');
        }

        this.baseObj = (typeof params.wrapper === 'string') ? ge(params.wrapper) : params.wrapper;
        if (!this.baseObj) {
            throw new Error('Invalid wrapper element');
        }

        removeChilds(this.baseObj);
        this.baseObj.classList.add(CONTAINER_CLASS);

        this.wrapperObj = ce('div', { className: WRAPPER_CLASS });
        this.isStatic = (params.static === true);
        if (this.isStatic) {
            this.wrapperObj.classList.add(STATIC_WRAPPER_CLASS);
        } else {
            show(this.wrapperObj, false);
        }
        this.baseObj.appendChild(this.wrapperObj);

        if (params.range === true) {
            this.rangeMode = true;
        }
        if (this.rangeMode && isFunction(params.onrangeselect)) {
            this.rangeCallback = params.onrangeselect;
        }

        this.dateCallback = params.ondateselect;

        this.showCallback = params.onshow || null;
        this.hideCallback = params.onhide || null;
        this.isAnimated = (document.addEventListener && params.animated) || false;

        if (params.relparent) {
            this.relativeParent = (typeof params.relparent === 'string')
                ? ge(params.relparent)
                : params.relparent;
        }

        this.transitionHandler = (e) => this.onTransitionEnd(e);
        this.emptyClickHandler = () => this.showView(false);

        /* Prepare date */
        const date = isDate(params.date) ? params.date : new Date();

        this.createLayout();
        this.showMonth(date);
    }

    /**
     * Create year picker view
     * @param {Date} date - Date object for specified year range
     */
    createYearRangeView(date) {
        if (!isDate(date)) {
            return null;
        }

        const rYear = date.getFullYear();
        const startYear = rYear - (rYear % 10) - 1;

        const res = {
            type: YEARRANGE_VIEW,
            set: [],
            viewDate: date,
            title: `${startYear + 1}-${startYear + YEAR_RANGE_LENGTH}`,
            viewContainer: ce('div', { className: VIEW_CONTAINER_CLASS }),
            nav: {
                prev: new Date(rYear - YEAR_RANGE_LENGTH, 1, 1),
                next: new Date(rYear + YEAR_RANGE_LENGTH, 1, 1),
            },
        };

        // years of current range
        for (let i = 0; i < YEAR_RANGE_LENGTH + 2; i += 1) {
            const yearDate = new Date(startYear + i, 0, 1);
            const setObj = {
                date: yearDate,
                cell: ce('div', {
                    className: `${CELL_CLASS} ${YEARRANGE_CELL_CLASS}`,
                    textContent: yearDate.getFullYear(),
                }),
            };

            if (i === 0 || i === YEAR_RANGE_LENGTH + 1) {
                setObj.cell.classList.add(OTHER_CELL_CLASS);
            }

            res.set.push(setObj);
            res.viewContainer.appendChild(setObj.cell);
        }

        return res;
    }

    /**
     * Create month picker view
     * @param {Date} date - Date object for specified year
     */
    createYearView(date) {
        if (!isDate(date)) {
            return null;
        }

        // get real date from specified
        const rYear = date.getFullYear();

        const res = {
            type: YEAR_VIEW,
            set: [],
            viewDate: date,
            title: rYear,
            viewContainer: ce('div', { className: VIEW_CONTAINER_CLASS }),
            nav: {
                prev: new Date(rYear - 1, 1, 1),
                next: new Date(rYear + 1, 1, 1),
            },
        };

        // months of current year
        for (let i = 0; i < MONTHS_COUNT; i += 1) {
            const monthDate = new Date(rYear, i, 1);
            const setObj = {
                date: monthDate,
                cell: ce('div', {
                    className: `${CELL_CLASS} ${YEAR_CELL_CLASS}`,
                    textContent: getShortMonthName(monthDate, this.locales),
                }),
            };

            res.set.push(setObj);
            res.viewContainer.appendChild(setObj.cell);
        }

        return res;
    }

    /**
     * Create date picker view
     * @param {Date} date - Date object for specified month
     */
    createMonthView(date) {
        if (!isDate(date)) {
            return null;
        }

        const today = new Date();
        const rMonth = date.getMonth();
        const rYear = date.getFullYear();

        const res = {
            type: MONTH_VIEW,
            set: [],
            viewDate: date,
            title: `${getLongMonthName(date, this.locales)} ${rYear}`,
            viewContainer: ce('div', { className: VIEW_CONTAINER_CLASS }),
            nav: {
                prev: new Date(rYear, rMonth - 1, 1),
                next: new Date(rYear, rMonth + 1, 1),
            },
        };

        // header
        const firstMonthDay = new Date(rYear, rMonth, 1);
        let week = getWeekDays(firstMonthDay);
        const headerElems = week.map((weekday) => ce('div', {
            className: `${CELL_CLASS} ${MONTH_CELL_CLASS} ${WEEKDAY_CELL_CLASS}`,
            textContent: getWeekdayShort(weekday, this.locales),
        }));
        addChilds(res.viewContainer, headerElems);

        // days
        do {
            const dateElems = week.map((weekday) => {
                const setObj = {
                    date: weekday,
                    cell: ce('div', {
                        className: `${CELL_CLASS} ${MONTH_CELL_CLASS} ${DAY_CELL_CLASS}`,
                        textContent: weekday.getDate(),
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
            res.set.push(...dateElems);

            const nextWeekDay = shiftDate(week[0], DAYS_IN_WEEK);
            week = isSameYearMonth(date, nextWeekDay)
                ? getWeekDays(nextWeekDay)
                : null;
        } while (week);

        const viewIems = res.set.map((item) => item.cell);
        addChilds(res.viewContainer, viewIems);

        return res;
    }

    /**
     * Check specified date is in range
     * @param {Date} date - date to check
     * @param {object} range - date range object
     */
    inRange(date, range) {
        if (!isDate(date) || !range || !isDate(range.start) || !isDate(range.end)) {
            return false;
        }

        return (date - range.start >= 0 && date - range.end <= 0);
    }

    /**
     * Show/hide date picker view
     * @param {boolean} val - if true then show view, hide otherwise
     */
    showView(val) {
        const toShow = (typeof val !== 'undefined') ? val : true;

        show(this.wrapperObj, toShow);

        // check position of control in window and place it to be visible
        if (toShow && !this.isStatic) {
            const wrapperBottom = getOffset(this.wrapperObj).top + this.wrapperObj.offsetHeight;
            if (wrapperBottom > document.documentElement.clientHeight) {
                const bottomOffset = (this.relativeParent) ? this.relativeParent.offsetHeight : 0;
                this.wrapperObj.style.bottom = px(bottomOffset);
            } else {
                this.wrapperObj.style.bottom = '';
            }
        }

        // set automatic hide on empty click
        if (!this.isStatic) {
            if (toShow) {
                setEmptyClick(this.emptyClickHandler, [
                    this.wrapperObj,
                    this.relativeParent,
                ]);
            } else {
                removeEmptyClick(this.emptyClickHandler);
            }
        }

        if (toShow && isFunction(this.showCallback)) {
            this.showCallback();
        }
        if (!toShow && isFunction(this.hideCallback)) {
            this.hideCallback();
        }
    }

    /**
     * Show/hide date picker
     * @param {boolean} val - if true then show view, hide otherwise
     */
    show(val) {
        this.showView(val);
    }

    /**
     * Hide date picker
     */
    hide() {
        this.show(false);
    }

    /**
     * Check date picker is visible
     */
    visible() {
        return isVisible(this.wrapperObj);
    }

    /**
     * Render header element
     */
    renderHead() {
        this.titleEl = ce('div', { className: `${HEADER_ITEM_CLASS} ${HEADER_TITLE_CLASS}` });

        const prevIcon = svg(
            'svg',
            { class: NAV_ICON_CLASS, width: '25%', viewBox: '0 0 6 13' },
            svg('path', { d: 'm6 1-6 5.5 6 5.5z' }),
        );
        this.navPrevElem = ce(
            'div',
            { className: `${HEADER_ITEM_CLASS} ${HEADER_NAV_CLASS}` },
            prevIcon,
        );

        const nextIcon = svg(
            'svg',
            { class: NAV_ICON_CLASS, width: '25%', viewBox: '0 0 6 13' },
            svg('path', { d: 'm0 1 6 5.5-6 5.5z' }),
        );
        this.navNextElem = ce(
            'div',
            { className: `${HEADER_ITEM_CLASS} ${HEADER_NAV_CLASS}` },
            nextIcon,
        );

        const headTbl = ce('div', { className: HEADER_CLASS }, [
            this.navPrevElem,
            this.titleEl,
            this.navNextElem,
        ]);

        return headTbl;
    }

    /**
     * Set title
     * @param {string} title - title text
     */
    setTitle(title) {
        if (title && this.titleEl) {
            this.titleEl.textContent = title;
        }
    }

    /**
     * Mouse whell event handler
     * @param {Event} e - wheel event object
     */
    onWheel(e) {
        if (
            !this.currView
            || !this.currView.callback
            || this.animation
            || e.deltaY === 0
        ) {
            return;
        }

        const dir = (e.wheelDelta > 0);
        if (!isFunction(this.currView.callback.nav) || !this.currView.nav) {
            return;
        }

        const nav = (dir) ? this.currView.nav.prev : this.currView.nav.next;
        setTimeout(() => this.currView.callback.nav(nav));

        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    /** View 'click' event delegate */
    onViewClick(e) {
        if (!this.currView || !this.currView.callback || this.animation) {
            return;
        }

        if (this.titleEl.contains(e.target)) {
            if (!isFunction(this.currView.callback.hdr)) {
                return;
            }

            setTimeout(() => this.currView.callback.hdr(this.currView.viewDate));
        } else if (this.navPrevElem.contains(e.target)) {
            if (!isFunction(this.currView.callback.nav) || !this.currView.nav) {
                return;
            }

            setTimeout(() => this.currView.callback.nav(this.currView.nav.prev));
        } else if (this.navNextElem.contains(e.target)) {
            if (!isFunction(this.currView.callback.nav) || !this.currView.nav) {
                return;
            }

            setTimeout(() => this.currView.callback.nav(this.currView.nav.next));
        } else {
            // check main cells
            if (!isFunction(this.currView.callback.cell)) {
                return;
            }

            const setObj = this.currView.set.find((item) => item.cell === e.target);
            if (setObj) {
                setTimeout(() => this.currView.callback.cell(setObj.date));
            }
        }
    }

    /**
     * Create layout of component
     */
    createLayout() {
        if (!this.wrapperObj) {
            return;
        }

        this.currView = {
            callback: {
                cell: null,
                nav: null,
                hdr: null,
            },
        };

        this.wrapperObj.addEventListener('click', (e) => this.onViewClick(e));
        this.wrapperObj.addEventListener('wheel', (e) => this.onWheel(e));

        this.cellsContainer = ce('div', { className: VIEW_CLASS });
        addChilds(this.wrapperObj, [this.renderHead(), this.cellsContainer]);
    }

    /** Remove highlight from all cells */
    cleanHL() {
        if (!this.currView || !Array.isArray(this.currView.set)) {
            return;
        }

        this.currView.set.forEach((dateObj) => {
            dateObj.cell.classList.remove(HIGHLIGHT_CELL_CLASS);
        });
    }

    /** Remove all markers from all cells */
    cleanAll() {
        if (!this.currView || !Array.isArray(this.currView.set)) {
            return;
        }

        this.currView.set.forEach((dateObj) => {
            dateObj.cell.classList.remove(HIGHLIGHT_CELL_CLASS, ACTIVE_CELL_CLASS);
        });
    }

    /** Highlight specified range of cells */
    highLightRange(range) {
        if (
            !range
            || !range.start
            || !range.end
            || !this.currView
            || !Array.isArray(this.currView.set)
        ) {
            return;
        }

        this.currView.set.forEach((dateObj) => {
            if (this.inRange(dateObj.date, range)) {
                dateObj.cell.classList.add(HIGHLIGHT_CELL_CLASS);
            }
        }, this);
    }

    /** Activate cell by specified date */
    activateCell(date) {
        const cell = this.findCell(date);
        if (cell) {
            cell.classList.add(ACTIVE_CELL_CLASS);
        }
    }

    /** Activate cell by specified date */
    deactivateCell(date) {
        const cell = this.findCell(date);
        if (cell) {
            cell.classList.remove(ACTIVE_CELL_CLASS);
        }
    }

    /**
     * Find cell element by date
     * @param {Date} date - date to look for
     */
    findCell(date) {
        if (!isDate(date) || !this.currView || !Array.isArray(this.currView.set)) {
            return null;
        }

        const dateObj = this.currView.set.find((item) => (item.date - date === 0));

        return dateObj ? dateObj.cell : null;
    }

    /** Day cell click inner callback */
    onDayClick(date) {
        if (this.actDate !== null) {
            this.deactivateCell(this.actDate);
        }

        this.actDate = date;
        this.activateCell(this.actDate);

        if (isFunction(this.dateCallback)) {
            this.dateCallback(date);
        }

        if (this.rangeMode) {
            this.onRangeSelect(date);
        }
    }

    /** Range select inner callback */
    onRangeSelect(date) {
        this.cleanHL();

        this.curRange = { start: null, end: null };
        if (!this.selRange.start) {
            this.selRange.start = date;
        } else {
            this.selRange.end = date;
        }

        // Check swap in needed
        if (this.selRange.start - this.selRange.end > 0) {
            const tdate = this.selRange.end;
            this.selRange.end = this.selRange.start;
            this.selRange.start = tdate;
        }

        if (this.selRange.start && this.selRange.end) {
            this.curRange = { start: this.selRange.start, end: this.selRange.end };
            this.selRange = { start: null, end: null };

            this.cleanAll();
            this.highLightRange(this.curRange);

            if (isFunction(this.rangeCallback)) {
                this.rangeCallback(this.curRange);
            }
        }
    }

    /**
     * Convert DD.MM.YYYY date string to Date object
     * @param {string} date
     */
    convDate(date) {
        if (isDate(date)) {
            return date;
        }
        if (typeof date !== 'string') {
            return null;
        }

        const parts = date.split('.');
        if (!Array.isArray(parts) || parts.length !== 3) {
            return null;
        }

        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    /**
     * Set up selected items range
     * @param {Date} startDate - date to start selection from
     * @param {Date} endDate  - date to finnish selection at
     */
    setSelection(startDate, endDate) {
        this.cleanHL();

        const date = this.convDate(startDate);
        if (!date) {
            return;
        }

        const dateTo = this.convDate(endDate);
        if (dateTo) {
            /* Date range selection */
            this.curRange = { start: null, end: null };
            this.selRange = { start: date, end: dateTo };

            // Check swap in needed
            if (this.selRange.start - this.selRange.end > 0) {
                const tdate = this.selRange.end;
                this.selRange.end = this.selRange.start;
                this.selRange.start = tdate;
            }

            this.curRange = { start: this.selRange.start, end: this.selRange.end };
            this.selRange = { start: null, end: null };

            this.cleanAll();
            this.highLightRange(this.curRange);
        } else {
            /* Single day selection */
            if (this.actDate !== null) {
                this.deactivateCell(this.actDate);
            }

            this.actDate = date;
            this.activateCell(this.actDate);
        }

        this.showMonth(date);
    }

    /**
     * 'transitionend' event handler
     * @param {*} e - Event object
     */
    onTransitionEnd(e) {
        if (e.target !== this.currView.viewContainer
            || e.propertyName !== 'transform') {
            return;
        }

        this.cellsContainer.classList.remove(ANIMATED_CLASS);
        this.nextView.viewContainer.classList.remove(
            LAYER_VIEW_CLASS,
            BOTTOM_TO_CLASS,
            TOP_TO_CLASS,
        );
        this.nextView.viewContainer.style.left = '';
        transform(this.nextView.viewContainer, '');
        this.cellsContainer.style.width = '';
        this.cellsContainer.style.height = '';
        re(this.currView.viewContainer);
        this.applyView(this.nextView, this.nextCallbacks);

        this.animation = false;
        this.cellsContainer.removeEventListener('transitionend', this.transitionHandler);
    }

    /**
     * Set new view
     * @param {object} newView - view object
     * @param {object} callbacks - set of view callbacks
     */
    applyView(newView, callbacks) {
        this.currView = newView;
        this.setTitle(this.currView.title);
        this.currView.callback = callbacks;
    }

    /**
     * Set new view or replace current view with specified
     * @param {object} newView - view object
     * @param {object} callbacks - set of view callbacks
     */
    setView(newView, callbacks) {
        const view = newView;

        if (!this.cellsContainer || !view || !callbacks) {
            return;
        }

        if (!this.currView.viewContainer || !this.isAnimated) {
            this.cellsContainer.appendChild(view.viewContainer);
            if (this.currView.viewContainer && !this.isAnimated) {
                re(this.currView.viewContainer);
            }
            this.applyView(view, callbacks);
            return;
        }

        this.animation = true;

        const currTblWidth = this.cellsContainer.offsetWidth;
        const currTblHeight = this.cellsContainer.offsetHeight;

        this.cellsContainer.appendChild(view.viewContainer);
        this.cellsContainer.style.width = px(currTblWidth);
        this.cellsContainer.style.height = px(currTblHeight);

        if (this.currView.type === view.type) {
            const leftToRight = this.currView.viewDate < view.viewDate;

            this.currView.viewContainer.classList.add(LAYER_VIEW_CLASS);
            view.viewContainer.classList.add(LAYER_VIEW_CLASS);
            view.viewContainer.style.width = px(currTblWidth);
            view.viewContainer.style.left = px(leftToRight ? currTblWidth : -currTblWidth);

            this.cellsContainer.classList.add(ANIMATED_CLASS);

            this.cellsContainer.style.height = px(view.viewContainer.offsetHeight);
            const trMatrix = [1, 0, 0, 1, (leftToRight ? -currTblWidth : currTblWidth), 0];
            transform(this.currView.viewContainer, `matrix(${trMatrix.join()})`);
            transform(view.viewContainer, `matrix(${trMatrix.join()})`);

            this.nextView = view;
            this.nextCallbacks = callbacks;

            this.cellsContainer.addEventListener('transitionend', this.transitionHandler);
            return;
        }

        const goUp = (this.currView.type < view.type);
        const cellView = (goUp) ? view : this.currView;
        const relView = (goUp) ? this.currView : view;
        const relYear = relView.viewDate.getFullYear();
        const relMonth = relView.viewDate.getMonth();

        // Search for target cell on navigate from month view to year view or
        // from year view to years range view
        const cellObj = cellView.set.find((item) => (
            (
                relView.type === MONTH_VIEW
                && item.date.getFullYear() === relYear
                && item.date.getMonth() === relMonth
            ) || (
                relView.type === YEAR_VIEW
                && item.date.getFullYear() === relYear
            )
        ));
        if (!cellObj) {
            return;
        }

        const { cell } = cellObj;

        view.viewContainer.classList.add(LAYER_VIEW_CLASS, (goUp) ? BOTTOM_TO_CLASS : TOP_TO_CLASS);

        const cellX = cell.offsetLeft;
        const cellY = cell.offsetTop;
        const scaleX = cell.offsetWidth / currTblWidth;
        const scaleY = cell.offsetHeight / currTblHeight;
        const cellTrans = [scaleX, 0, 0, scaleY, cellX, cellY].map(toCSSValue);
        const viewTrans = [
            1 / scaleX,
            0,
            0,
            1 / scaleY,
            -cellX / scaleX,
            -cellY / scaleY,
        ].map(toCSSValue);

        transform(view.viewContainer, `matrix(${(goUp ? viewTrans : cellTrans).join()})`);

        this.currView.viewContainer.classList.add(
            LAYER_VIEW_CLASS,
            (goUp) ? TOP_FROM_CLASS : BOTTOM_FROM_CLASS,
        );

        setTimeout(() => {
            this.cellsContainer.classList.add(ANIMATED_CLASS);
            this.cellsContainer.style.height = px(view.viewContainer.offsetHeight);
            view.viewContainer.style.opacity = 1;
            this.currView.viewContainer.style.opacity = 0;
            transform(view.viewContainer, '');
            transform(
                this.currView.viewContainer,
                `matrix(${(goUp ? cellTrans : viewTrans).join()})`,
            );

            this.nextView = view;
            this.nextCallbacks = callbacks;

            this.cellsContainer.addEventListener('transitionend', this.transitionHandler);
        });
    }

    /**
     * Show month view to select day
     * @param {Date} date - date object of month to show
     */
    showMonth(date) {
        const viewObj = this.createMonthView(date);
        this.setView(viewObj, {
            cell: (d) => this.onDayClick(d),
            nav: (d) => this.showMonth(d),
            hdr: (d) => this.showYear(d),
        });

        this.activateCell(this.actDate);

        if (this.rangeMode) {
            this.highLightRange(this.curRange);
        }
    }

    /**
     * Show year view to select month
     * @param {Date} date - date object of year to show
     */
    showYear(date) {
        const viewObj = this.createYearView(date);
        this.setView(viewObj, {
            cell: (d) => this.showMonth(d),
            nav: (d) => this.showYear(d),
            hdr: (d) => this.showYearRange(d),
        });
    }

    /**
     * Show year range view to select year
     * @param {Date} date - date object of year range to show
     */
    showYearRange(date) {
        const viewObj = this.createYearRangeView(date);
        this.setView(viewObj, {
            cell: (d) => this.showYear(d),
            nav: (d) => this.showYearRange(d),
            hdr: null,
        });
    }
}
