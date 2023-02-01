import {
    ge,
    createSVGElement,
    show,
    isDate,
    isFunction,
    transform,
    isVisible,
    setEmptyClick,
    removeEmptyClick,
    re,
    px,
    createElement,
    setEvents,
    removeEvents,
} from '../../js/common.js';
import { isSameYearMonth } from '../../js/DateUtils.js';
import { Component } from '../../js/Component.js';
import { PopupPosition } from '../PopupPosition/PopupPosition.js';
import { DatePickerMonthView, MONTH_VIEW } from './DatePickerMonthView.js';
import { DatePickerYearView, YEAR_VIEW } from './DatePickerYearView.js';
import { DatePickerYearRangeView, YEARRANGE_VIEW } from './DatePickerYearRangeView.js';
import '../../css/common.scss';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'dp__container';
const WRAPPER_CLASS = 'dp__wrapper';
const STATIC_WRAPPER_CLASS = 'dp__static-wrapper';
/* Header */
const HEADER_CLASS = 'dp__header';
const HEADER_ITEM_CLASS = 'dp__header_item';
const HEADER_TITLE_CLASS = 'dp__header_title';
const HEADER_NAV_CLASS = 'dp__header_nav';
const HEADER_NEXT_NAV_CLASS = 'dp__header_nav-next';
const NAV_ICON_CLASS = 'dp__header_nav-icon';
/* View */
const VIEW_CLASS = 'dp__view';
/* Animation */
const ANIMATED_CLASS = 'dp__animated';
const ANIMATED_VIEW_CLASS = 'dp__animated-view';
const LAYER_VIEW_CLASS = 'dp__layered-view';
const TOP_FROM_CLASS = 'top_from';
const BOTTOM_FROM_CLASS = 'bottom_from';
const TOP_TO_CLASS = 'top_to';
const BOTTOM_TO_CLASS = 'bottom_to';

const NAV_ICON_PATH = 'm2 0.47-0.35-0.35-1.6 1.6 1.6 1.6 0.35-0.35-1.2-1.2z';

const toCSSValue = (val) => (+val.toFixed(4));

const defaultProps = {
    relparent: null,
    date: new Date(),
    static: false,
    range: false,
    locales: [],
    animated: false,
    onRangeSelect: null,
    onDateSelect: null,
    onShow: null,
    onHide: null,
};

/**
 * Date picker constructor
 * @param {object} props:
 * @param {string} props.relparent - identifier of relative alignment element
 * @param {Date} props.date - initial date to show
 * @param {boolean} props.static - if true, date picker will be statically placed
 * @param {boolean} props.range - if true turn on date range select mode
 * @param {String|[]} props.locales - locales to render component
 * @param {boolean} props.animated - animate transitions between views if possible
 * @param {function} props.onRangeSelect - date range select callback
 * @param {function} props.onDateSelect - single date select callback
 * @param {function} props.onShow - dynamic date picker shown callback
 * @param {function} props.onHide - dynamic date picker hidden callback
 */
export class DatePicker extends Component {
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.state = {
            viewType: MONTH_VIEW,
            date: isDate(this.props.date) ? this.props.date : new Date(),
            animation: false,
            curRange: { start: null, end: null },
            selRange: { start: null, end: null },
            actDate: null,
        };

        this.currView = null;
        this.nextView = null;
        this.nextCallbacks = null;

        this.transitionEvents = { transitionend: (e) => this.onTransitionEnd(e) };
        this.emptyClickHandler = () => this.showView(false);

        this.init();
    }

    init() {
        const { relparent } = this.props;
        if (relparent) {
            this.relativeParent = (typeof relparent === 'string')
                ? ge(relparent)
                : relparent;
        }

        const header = this.renderHead();
        this.cellsContainer = createElement('div', { props: { className: VIEW_CLASS } });

        this.wrapper = createElement('div', {
            props: { className: WRAPPER_CLASS },
            children: [header, this.cellsContainer],
            events: {
                click: (e) => this.onViewClick(e),
                wheel: (e) => this.onWheel(e),
            },
        });
        if (this.props.static) {
            this.wrapper.classList.add(STATIC_WRAPPER_CLASS);
        } else {
            show(this.wrapper, false);
        }

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: this.wrapper,
        });

        this.render(this.state);
    }

    sendShowEvents(value = true) {
        if (value && isFunction(this.props.onShow)) {
            this.props.onShow();
        }
        if (!value && isFunction(this.props.onHide)) {
            this.props.onHide();
        }
    }

    /**
     * Show/hide date picker view
     * @param {boolean} val - if true then show view, hide otherwise
     */
    showView(value = true) {
        show(this.wrapper, value);

        if (this.props.static) {
            this.sendShowEvents(value);
            return;
        }

        // check position of control in window and place it to be visible
        if (value) {
            PopupPosition.calculate({
                elem: this.wrapper,
                refElem: this.relativeParent,
            });
        } else {
            this.wrapper.style.top = '';
            this.wrapper.style.bottom = '';
            this.wrapper.style.left = '';
            this.wrapper.style.right = '';
        }

        // set automatic hide on empty click
        if (value) {
            setEmptyClick(this.emptyClickHandler, [
                this.wrapper,
                this.relativeParent,
            ]);
        } else {
            removeEmptyClick(this.emptyClickHandler);
        }

        this.sendShowEvents(value);
    }

    /**
     * Show/hide date picker
     * @param {boolean} val - if true then show view, hide otherwise
     */
    show(val) {
        this.showView(val);
    }

    /**
     * Check date picker is visible
     */
    visible() {
        return isVisible(this.wrapper);
    }

    renderNavIcon() {
        return createSVGElement('svg', {
            attrs: { class: NAV_ICON_CLASS, viewBox: '0 0 2.1 3.4' },
            children: createSVGElement('path', { attrs: { d: NAV_ICON_PATH } }),
        });
    }

    /**
     * Render header element
     */
    renderHead() {
        this.titleEl = createElement('div', {
            props: { className: `${HEADER_ITEM_CLASS} ${HEADER_TITLE_CLASS}` },
        });
        this.navPrevElem = createElement('div', {
            props: { className: `${HEADER_ITEM_CLASS} ${HEADER_NAV_CLASS}` },
            children: this.renderNavIcon(),
        });
        this.navNextElem = createElement('div', {
            props: { className: `${HEADER_ITEM_CLASS} ${HEADER_NAV_CLASS} ${HEADER_NEXT_NAV_CLASS}` },
            children: this.renderNavIcon(),
        });

        const headTbl = createElement('div', {
            props: { className: HEADER_CLASS },
            children: [
                this.navPrevElem,
                this.titleEl,
                this.navNextElem,
            ],
        });

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
        e.preventDefault();

        if (
            !this.currView?.nav
            || this.state.animation
            || e.deltaY === 0
        ) {
            return;
        }

        const dir = (e.wheelDelta > 0);
        const nav = (dir) ? this.currView.nav.prev : this.currView.nav.next;
        this.setViewDate(nav);
    }

    /** View 'click' event delegate */
    onViewClick(e) {
        e.stopPropagation();
        if (!this.currView || this.state.animation) {
            return;
        }
        // Header
        if (this.titleEl.contains(e.target)) {
            this.navigateUp();
            return;
        }
        if (this.navPrevElem.contains(e.target)) {
            this.setViewDate(this.currView.nav.prev);
            return;
        }
        if (this.navNextElem.contains(e.target)) {
            this.setViewDate(this.currView.nav.next);
            return;
        }
        // Cells
        const item = this.findViewItemByElem(e.target);
        if (!item) {
            return;
        }
        const { date } = item;
        const { viewType } = this.state;
        if (viewType === MONTH_VIEW) {
            this.onDayClick(date);
        } else if (viewType === YEAR_VIEW) {
            this.showMonth(date);
        } else if (viewType === YEARRANGE_VIEW) {
            this.showYear(date);
        }
    }

    findViewItemByElem(elem) {
        return this.currView.items.find((i) => i.elem === elem);
    }

    setViewDate(date) {
        this.setState({
            ...this.state,
            date,
        });
    }

    navigateUp() {
        const { viewType } = this.state;
        if (viewType === MONTH_VIEW) {
            this.setState({
                ...this.state,
                viewType: YEAR_VIEW,
            });
        } else if (viewType === YEAR_VIEW) {
            this.setState({
                ...this.state,
                viewType: YEARRANGE_VIEW,
            });
        }
    }

    /** Day cell click inner callback */
    onDayClick(date) {
        this.setState({
            ...this.state,
            actDate: date,
        });

        if (isFunction(this.props.onDateSelect)) {
            this.props.onDateSelect(date);
        }

        if (this.props.range) {
            this.onRangeSelect(date);
        }
    }

    /** Range select inner callback */
    onRangeSelect(date) {
        const { start } = this.state.selRange;
        if (!start) {
            this.setState({
                ...this.state,
                curRange: { start: null, end: null },
                selRange: {
                    start: date,
                    end: null,
                },
            });
        } else {
            this.setSelection(start, date, false);

            if (isFunction(this.props.onRangeSelect)) {
                this.props.onRangeSelect(this.state.curRange);
            }
        }
    }

    /**
     * Convert Date object or DD.MM.YYYY date string to timestamp
     * @param {string} date
     */
    convDate(date) {
        if (isDate(date)) {
            return date.getTime();
        }
        if (typeof date !== 'string') {
            return null;
        }

        const [day, month, year] = date.split('.');
        if (!day || !month || !year) {
            return null;
        }

        return Date.UTC(year, month - 1, day);
    }

    /**
     * Set up selected items range
     * @param {Date} startDate - date to start selection from
     * @param {Date} endDate  - date to finnish selection at
     */
    setSelection(startDate, endDate, navigateToFirst = true) {
        const date = this.convDate(startDate);
        if (!date) {
            return;
        }

        const newState = {
            ...this.state,
        };
        if (navigateToFirst) {
            newState.viewType = MONTH_VIEW;
            newState.date = new Date(date);
        }

        const dateTo = this.convDate(endDate);
        if (dateTo) {
            newState.curRange = {
                start: new Date(Math.min(date, dateTo)),
                end: new Date(Math.max(date, dateTo)),
            };
            newState.selRange = { start: null, end: null };
        } else {
            newState.actDate = date;
        }

        this.setState(newState);
    }

    /** Clears selected items range */
    clearSelection() {
        this.setState({
            ...this.state,
            curRange: { start: null, end: null },
            selRange: { start: null, end: null },
            actDate: null,
        });
    }

    /**
     * 'transitionend' event handler
     * @param {Event} e - Event object
     */
    onTransitionEnd(e) {
        if (e?.target !== this.currView.elem || e?.propertyName !== 'transform') {
            return;
        }

        this.wrapper.classList.remove(ANIMATED_CLASS);
        this.cellsContainer.classList.remove(ANIMATED_VIEW_CLASS);
        this.nextView.elem.classList.remove(
            LAYER_VIEW_CLASS,
            BOTTOM_TO_CLASS,
            TOP_TO_CLASS,
        );
        this.nextView.elem.style.left = '';
        transform(this.nextView.elem, '');
        this.cellsContainer.style.width = '';
        this.cellsContainer.style.height = '';
        re(this.currView.elem);
        this.applyView(this.nextView, this.nextCallbacks);

        this.state.animation = false;
        removeEvents(this.cellsContainer, this.transitionEvents);
    }

    /**
     * Set new view
     * @param {object} newView - view object
     */
    applyView(newView) {
        this.currView = newView;
        this.setTitle(this.currView.title);
    }

    /**
     * Set new view or replace current view with specified
     * @param {object} newView - view object
     */
    setView(newView) {
        if (this.currView === newView) {
            return;
        }

        const view = newView;
        if (!this.cellsContainer || !view) {
            return;
        }

        if (!this.currView?.elem || !this.props.animated) {
            this.cellsContainer.append(view.elem);
            if (this.currView?.elem && !this.props.animated) {
                re(this.currView.elem);
            }
            this.applyView(view);
            return;
        }

        this.state.animation = true;

        const currTblWidth = this.cellsContainer.offsetWidth;
        const currTblHeight = this.cellsContainer.offsetHeight;

        this.cellsContainer.append(view.elem);
        this.cellsContainer.style.width = px(currTblWidth);
        this.cellsContainer.style.height = px(currTblHeight);

        // If new view is the same type as current then animate slide
        if (this.currView.type === view.type) {
            const leftToRight = this.currView.date < view.date;

            this.currView.elem.classList.add(LAYER_VIEW_CLASS);
            view.elem.classList.add(LAYER_VIEW_CLASS);
            view.elem.style.width = px(currTblWidth);
            view.elem.style.left = px(leftToRight ? currTblWidth : -currTblWidth);

            this.wrapper.classList.add(ANIMATED_CLASS);
            this.cellsContainer.classList.add(ANIMATED_VIEW_CLASS);

            this.cellsContainer.style.height = px(view.elem.offsetHeight);
            const trMatrix = [1, 0, 0, 1, (leftToRight ? -currTblWidth : currTblWidth), 0];
            transform(this.currView.elem, `matrix(${trMatrix.join()})`);
            transform(view.elem, `matrix(${trMatrix.join()})`);

            this.nextView = view;

            setEvents(this.cellsContainer, this.transitionEvents);
            return;
        }

        const goUp = (this.currView.type < view.type);
        const cellView = (goUp) ? view : this.currView;
        const relView = (goUp) ? this.currView : view;
        const relYear = relView.date.getFullYear();
        const relMonth = relView.date.getMonth();

        // Search for target cell on navigate from month view to year view or
        // from year view to years range view
        const cellObj = cellView.items.find((item) => (
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

        const { elem } = cellObj;

        view.elem.classList.add(LAYER_VIEW_CLASS, (goUp) ? BOTTOM_TO_CLASS : TOP_TO_CLASS);

        const cellX = elem.offsetLeft;
        const cellY = elem.offsetTop;
        const scaleX = elem.offsetWidth / currTblWidth;
        const scaleY = elem.offsetHeight / currTblHeight;
        const cellTrans = [scaleX, 0, 0, scaleY, cellX, cellY].map(toCSSValue);
        const viewTrans = [
            1 / scaleX,
            0,
            0,
            1 / scaleY,
            -cellX / scaleX,
            -cellY / scaleY,
        ].map(toCSSValue);

        transform(view.elem, `matrix(${(goUp ? viewTrans : cellTrans).join()})`);

        this.currView.elem.classList.add(
            LAYER_VIEW_CLASS,
            (goUp) ? TOP_FROM_CLASS : BOTTOM_FROM_CLASS,
        );

        setTimeout(() => {
            this.wrapper.classList.add(ANIMATED_CLASS);
            this.cellsContainer.classList.add(ANIMATED_VIEW_CLASS);
            this.cellsContainer.style.height = px(view.elem.offsetHeight);
            view.elem.style.opacity = 1;
            this.currView.elem.style.opacity = 0;
            transform(view.elem, '');
            transform(
                this.currView.elem,
                `matrix(${(goUp ? cellTrans : viewTrans).join()})`,
            );

            this.nextView = view;

            setEvents(this.cellsContainer, this.transitionEvents);
        });
    }

    /**
     * Show month view to select day
     * @param {Date} date - date object of month to show
     */
    showMonth(date) {
        this.setState({
            ...this.state,
            viewType: MONTH_VIEW,
            date,
        });
    }

    /**
     * Show year view to select month
     * @param {Date} date - date object of year to show
     */
    showYear(date) {
        this.setState({
            ...this.state,
            viewType: YEAR_VIEW,
            date,
        });
    }

    /**
     * Show year range view to select year
     * @param {Date} date - date object of year range to show
     */
    showYearRange(date) {
        this.setState({
            ...this.state,
            viewType: YEARRANGE_VIEW,
            date,
        });
    }

    renderView(state, prevState = {}) {
        const typeChanged = (state.viewType !== prevState?.viewType);

        if (state.viewType === MONTH_VIEW) {
            if (typeChanged || !isSameYearMonth(state.date, prevState?.date)) {
                return DatePickerMonthView.create({
                    date: state.date,
                    locales: this.props.locales,
                    actDate: state.actDate,
                    range: this.props.range,
                    curRange: state.curRange,
                });
            }

            this.currView.setState((viewState) => ({
                ...viewState,
                actDate: state.actDate,
                range: this.props.range,
                curRange: state.curRange,
            }));

            return this.currView;
        }

        if (state.viewType === YEAR_VIEW) {
            return DatePickerYearView.create({
                date: state.date,
                locales: this.props.locales,
            });
        }

        if (state.viewType === YEARRANGE_VIEW) {
            return DatePickerYearRangeView.create({
                date: state.date,
                locales: this.props.locales,
            });
        }

        throw new Error('Invalid view type');
    }

    getYearDecade(date) {
        return Math.floor(date.getFullYear() / 10);
    }

    isViewUpdated(state, prevState) {
        if (state.viewType !== prevState.viewType) {
            return true;
        }
        if (state.viewType === MONTH_VIEW) {
            return (
                !isSameYearMonth(state.date, prevState.date)
                || state.actDate !== prevState.actDate
                || state.curRange?.start !== prevState.curRange?.start
                || state.curRange?.end !== prevState.curRange?.end
            );
        }
        if (state.viewType === YEAR_VIEW) {
            return state.date.getFullYear() !== prevState.date.getFullYear();
        }
        if (state.viewType === YEARRANGE_VIEW) {
            const decade = this.getYearDecade(state.date);
            const prevDecade = this.getYearDecade(prevState.date);
            return decade !== prevDecade;
        }

        throw new Error('Invalid view type');
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (!this.isViewUpdated(state, prevState)) {
            return;
        }

        const view = this.renderView(state, prevState);
        this.setView(view);
    }
}
