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
    getOffset,
    re,
    px,
} from '../../js/common.js';
import '../../css/common.css';
import './datepicker.css';

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
    /** Static properties */
    static months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    static weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    static MONTH_VIEW = 1;

    static YEAR_VIEW = 2;

    static YEARRANGE_VIEW = 3;

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

        if (!('wrapper' in params)) {
            throw new Error('Wrapper element not specified');
        }

        this.baseObj = (typeof params.wrapper === 'string') ? ge(params.wrapper) : params.wrapper;
        if (!this.baseObj) {
            throw new Error('Invalid wrapper element');
        }

        removeChilds(this.baseObj);
        this.baseObj.classList.add('dp__container');

        this.wrapperObj = ce('div', { className: 'dp__wrapper' });
        this.isStatic = (params.static === true);
        if (this.isStatic) {
            this.wrapperObj.classList.add('dp__static-wrapper');
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

        this.transitionHandler = this.onTransitionEnd.bind(this);

        /* Prepare date */
        const date = isDate(params.date) ? params.date : new Date();

        this.createLayout();
        this.showMonth(date);
    }

    /**
     * Return count of days in specified month
     * @param {Date} date - Date object for specified month
     */
    getDaysInMonth(date) {
        const monthDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return monthDate.getDate();
    }

    /**
     * Return fixed(0 - monday, 6 - sunday) day of week of specified date
     * @param {*} date - Date object for specified day
     */
    getDayOfWeek(date) {
        if (!isDate(date)) {
            return null;
        }

        const res = date.getDay();

        return (res) ? (res - 1) : 6;
    }

    /**
     * Create year picker view
     * @param {Date} date - Date object for specified year range
     */
    createYearRangeView(date) {
        const rangeLength = 10;

        if (!isDate(date)) {
            return null;
        }

        /* get real date from specified */
        const rYear = date.getFullYear();
        const startYear = rYear - (rYear % 10) - 1;

        const res = {
            type: DatePicker.YEARRANGE_VIEW,
            set: [],
            viewDate: date,
            title: `${startYear + 1}-${startYear + rangeLength}`,
            viewContainer: ce('div', { className: 'dp__view-container' }),
            nav: {
                prev: new Date(rYear - rangeLength, 1, 1),
                next: new Date(rYear + rangeLength, 1, 1),
            },
        };

        // years of current range
        for (let i = 0; i < rangeLength + 2; i += 1) {
            const setObj = {
                date: new Date(startYear + i, 0, 1),
            };

            setObj.cell = ce('div', {
                className: 'dp__cell dp__year-range-view__cell',
                textContent: setObj.date.getFullYear(),
            });

            if (i === 0 || i === rangeLength + 1) {
                setObj.cell.classList.add('dp__other-month-cell');
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
            type: DatePicker.YEAR_VIEW,
            set: [],
            viewDate: date,
            title: rYear,
            viewContainer: ce('div', { className: 'dp__view-container' }),
            nav: {
                prev: new Date(rYear - 1, 1, 1),
                next: new Date(rYear + 1, 1, 1),
            },
        };

        // months of current year
        for (let i = 0; i < DatePicker.months.length; i += 1) {
            const setObj = {
                date: new Date(rYear, i, 1),
            };
            setObj.cell = ce('div', {
                className: 'dp__cell dp__year-view__cell',
                textContent: DatePicker.months[setObj.date.getMonth()].substr(0, 3),
            });

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
        const daysInWeek = 7;

        if (!isDate(date)) {
            return null;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        /* get real date from specified */
        const rMonth = date.getMonth();
        const rYear = date.getFullYear();
        const daysInMonth = this.getDaysInMonth(date);

        const res = {
            type: DatePicker.MONTH_VIEW,
            set: [],
            viewDate: date,
            title: `${DatePicker.months[rMonth]} ${rYear}`,
            viewContainer: ce('div', { className: 'dp__view-container' }),
            nav: {
                prev: new Date(rYear, rMonth - 1, 1),
                next: new Date(rYear, rMonth + 1, 1),
            },
        };

        // week days
        const weekDaysHeader = DatePicker.weekdays.map((item) => (
            ce('div', {
                className: 'dp__cell dp__month-view_cell dp__weekday-cell',
                textContent: item,
            })
        ));
        addChilds(res.viewContainer, weekDaysHeader);

        /* days of previous month */
        const pMonthDays = this.getDaysInMonth(res.nav.prev);
        // week day of first day in month
        const dayOfWeek = this.getDayOfWeek(new Date(rYear, rMonth, 1));
        let daysInRow = dayOfWeek;
        for (let i = 1; i <= dayOfWeek; i += 1) {
            const setObj = {
                date: new Date(
                    res.nav.prev.getFullYear(),
                    res.nav.prev.getMonth(),
                    pMonthDays - (dayOfWeek - i),
                ),
            };

            setObj.cell = ce('div', {
                className: 'dp__cell dp__month-view_cell dp__other-month-cell dp__day-cell',
                textContent: setObj.date.getDate(),
            });

            res.set.push(setObj);
        }

        /* days of current month */
        for (let i = 1; i < daysInMonth + 1; i += 1) {
            const setObj = {
                date: new Date(rYear, rMonth, i),
            };

            setObj.cell = ce('div', {
                className: 'dp__cell dp__month-view_cell dp__day-cell',
                textContent: setObj.date.getDate(),
            });
            if (setObj.date - today === 0) {
                setObj.cell.classList.add('dp__today-cell');
            }

            res.set.push(setObj);
        }

        daysInRow = res.set.length % 7;
        /* append days of next month */
        for (let i = daysInRow; i < daysInWeek; i += 1) {
            const setObj = {
                date: new Date(
                    res.nav.next.getFullYear(),
                    res.nav.next.getMonth(),
                    i - daysInRow + 1,
                ),
            };

            setObj.cell = ce('div', {
                className: 'dp__cell dp__month-view_cell dp__other-month-cell dp__day-cell',
                textContent: setObj.date.getDate(),
            });

            res.set.push(setObj);
        }

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
                setEmptyClick(
                    this.showView.bind(this, false),
                    [
                        this.wrapperObj,
                        this.relativeParent,
                    ],
                );
            } else {
                setEmptyClick();
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
        this.titleEl = ce('div', { className: 'dp__header_item dp__header_title' });

        const prevIcon = svg(
            'svg',
            { width: '25%', viewBox: '0 0 6 13' },
            svg('path', { d: 'm6 1-6 5.5 6 5.5z' }),
        );
        this.navPrevElem = ce('div', { className: 'dp__header_item dp__header_nav' }, prevIcon);

        const nextIcon = svg(
            'svg',
            { width: '25%', viewBox: '0 0 6 13' },
            svg('path', { d: 'm0 1 6 5.5-6 5.5z' }),
        );
        this.navNextElem = ce('div', { className: 'dp__header_item dp__header_nav' }, nextIcon);

        const headTbl = ce('div', { className: 'dp__header' }, [
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
        setTimeout(this.currView.callback.nav.bind(null, nav));

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

            setTimeout(this.currView.callback.hdr.bind(null, this.currView.viewDate));
        } else if (this.navPrevElem.contains(e.target)) {
            if (!isFunction(this.currView.callback.nav) || !this.currView.nav) {
                return;
            }

            setTimeout(this.currView.callback.nav.bind(null, this.currView.nav.prev));
        } else if (this.navNextElem.contains(e.target)) {
            if (!isFunction(this.currView.callback.nav) || !this.currView.nav) {
                return;
            }

            setTimeout(this.currView.callback.nav.bind(null, this.currView.nav.next));
        } else {
            // check main cells
            if (!isFunction(this.currView.callback.cell)) {
                return;
            }

            const setObj = this.currView.set.find((item) => item.cell === e.target);

            if (setObj) {
                setTimeout(this.currView.callback.cell.bind(null, setObj.date));
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

        this.wrapperObj.addEventListener('click', this.onViewClick.bind(this));
        this.wrapperObj.addEventListener('wheel', this.onWheel.bind(this));

        this.cellsContainer = ce('div', { className: 'dp__view' });
        addChilds(this.wrapperObj, [this.renderHead(), this.cellsContainer]);
    }

    /** Remove highlight from all cells */
    cleanHL() {
        if (!this.currView || !Array.isArray(this.currView.set)) {
            return;
        }

        this.currView.set.forEach((dateObj) => {
            dateObj.cell.classList.remove('dp__cell_hl');
        });
    }

    /** Remove all markers from all cells */
    cleanAll() {
        if (!this.currView || !Array.isArray(this.currView.set)) {
            return;
        }

        this.currView.set.forEach((dateObj) => {
            dateObj.cell.classList.remove('dp__cell_hl', 'dp__cell_act');
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
                dateObj.cell.classList.add('dp__cell_hl');
            }
        }, this);
    }

    /** Activate cell by specified date */
    activateCell(date) {
        const cell = this.findCell(date);
        if (cell) {
            cell.classList.add('dp__cell_act');
        }
    }

    /** Activate cell by specified date */
    deactivateCell(date) {
        const cell = this.findCell(date);
        if (cell) {
            cell.classList.remove('dp__cell_act');
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

        this.cellsContainer.classList.remove('dp__animated-view');
        this.nextView.viewContainer.classList.remove('dp__layered-view', 'bottom_to', 'top_to');
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

        let cellElement = null;
        let goUp;
        if (this.currView.type === view.type) {
            const leftToRight = this.currView.viewDate < view.viewDate;

            this.currView.viewContainer.classList.add('dp__layered-view');
            view.viewContainer.classList.add('dp__layered-view');
            view.viewContainer.style.width = px(currTblWidth);
            view.viewContainer.style.left = px(leftToRight ? currTblWidth : -currTblWidth);

            this.cellsContainer.classList.add('dp__animated-view');

            this.cellsContainer.style.height = px(view.viewContainer.offsetHeight);
            const trMatrix = [1, 0, 0, 1, (leftToRight ? -currTblWidth : currTblWidth), 0];
            transform(this.currView.viewContainer, `matrix(${trMatrix.join()})`);
            transform(view.viewContainer, `matrix(${trMatrix.join()})`);

            this.nextView = view;
            this.nextCallbacks = callbacks;

            this.cellsContainer.addEventListener('transitionend', this.transitionHandler);
        } else {
            goUp = (this.currView.type < view.type);
            const cellView = (goUp) ? view : this.currView;
            const relView = (goUp) ? this.currView : view;
            const relYear = relView.viewDate.getFullYear();
            const relMonth = relView.viewDate.getMonth();

            cellElement = cellView.set.find((cellObj) => (
                /* navigate from month view to year view */
                (
                    relView.type === DatePicker.MONTH_VIEW
                    && cellObj.date.getFullYear() === relYear
                    && cellObj.date.getMonth() === relMonth
                ) || (
                    /* navigate from year view to years range */
                    relView.type === DatePicker.YEAR_VIEW
                    && cellObj.date.getFullYear() === relYear
                )
            ));
        }

        if (!cellElement) {
            return;
        }
        cellElement = cellElement.cell;

        view.viewContainer.classList.add('dp__layered-view', (goUp) ? 'bottom_to' : 'top_to');

        const cellX = cellElement.offsetLeft;
        const cellY = cellElement.offsetTop;
        const scaleX = cellElement.offsetWidth / currTblWidth;
        const scaleY = cellElement.offsetHeight / currTblHeight;

        const toFix = (val) => (+val.toFixed(4));
        const cellTrans = [scaleX, 0, 0, scaleY, cellX, cellY].map(toFix);
        const viewTrans = [
            1 / scaleX,
            0,
            0,
            1 / scaleY,
            -cellX / scaleX,
            -cellY / scaleY,
        ].map(toFix);

        transform(view.viewContainer, `matrix(${(goUp ? viewTrans : cellTrans).join()})`);

        this.currView.viewContainer.classList.add(
            'dp__layered-view',
            (goUp) ? 'top_from' : 'bottom_from',
        );

        setTimeout(() => {
            this.cellsContainer.classList.add('dp__animated-view');
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
        }, 100);
    }

    /**
     * Show month view to select day
     * @param {Date} date - date object of month to show
     */
    showMonth(date) {
        const viewObj = this.createMonthView(date);
        this.setView(viewObj, {
            cell: this.onDayClick.bind(this),
            nav: this.showMonth.bind(this),
            hdr: this.showYear.bind(this),
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
            cell: this.showMonth.bind(this),
            nav: this.showYear.bind(this),
            hdr: this.showYearRange.bind(this),
        });
    }

    /**
     * Show year range view to select year
     * @param {Date} date - date object of year range to show
     */
    showYearRange(date) {
        const viewObj = this.createYearRangeView(date);
        this.setView(viewObj, {
            cell: this.showYear.bind(this),
            nav: this.showYearRange.bind(this),
            hdr: null,
        });
    }

    /** Static alias for DatePicker constructor */
    static create(params) {
        return new DatePicker(params);
    }

    /**
     * Format date as DD.MM.YYYY
     * @param {number|Date} date - day or Date object to
     * @param {number} month - month of Date to format
     * @param {number} year - year of Date to format
     */
    static format(date, month, year) {
        let rDay = date;
        let rMonth = month;
        let rYear = year;

        if (isDate(date) && !month && !year) {
            rMonth = date.getMonth();
            rYear = date.getFullYear();
            rDay = date.getDate();
        }

        return `${(rDay > 9) ? '' : '0'}${rDay}.${(rMonth + 1 > 9) ? '' : '0'}${rMonth + 1}.${rYear}`;
    }
}
