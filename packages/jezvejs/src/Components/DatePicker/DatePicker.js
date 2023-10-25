import { isDate, isFunction } from '@jezvejs/types';
import '../../css/common.scss';
import {
    ge,
    re,
    show,
    transform,
    isVisible,
    createElement,
    removeChilds,
    afterTransition,
} from '@jezvejs/dom';
import { isSameYearMonth } from '@jezvejs/datetime';
import {
    px,
    minmax,
} from '../../js/common.js';
import { setEmptyClick, removeEmptyClick } from '../../js/emptyClick.js';
import { Component } from '../../js/Component.js';
import { PopupPosition } from '../PopupPosition/PopupPosition.js';
import { Slidable } from '../Slidable/Slidable.js';
import { DatePickerHeader } from './components/Header/Header.js';
import { DatePickerMonthView } from './components/MonthView/MonthView.js';
import { DatePickerYearView } from './components/YearView/YearView.js';
import { DatePickerYearRangeView } from './components/YearRangeView/YearRangeView.js';
import {
    toCSSValue,
    getNextViewDate,
    getPrevViewDate,
    MONTH_VIEW,
    YEAR_VIEW,
    YEARRANGE_VIEW,
} from './utils.js';
import './DatePicker.scss';

/* CSS classes */
const CONTAINER_CLASS = 'dp__container';
const WRAPPER_CLASS = 'dp__wrapper';
const SLIDER_CLASS = 'dp__slider';
const STATIC_WRAPPER_CLASS = 'dp__static-wrapper';
const CURRENT_CLASS = 'dp__current-view';
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

const TRANSITION_END_TIMEOUT = 500;
const SWIPE_THRESHOLD = 0.1;

const defaultProps = {
    relparent: null,
    popupMargin: 5,
    popupScreenPadding: 5,
    date: new Date(),
    static: false,
    range: false,
    rangePart: null, // possible values: 'start', 'end' or null
    locales: [],
    firstDay: null,
    animated: false,
    disabledDateFilter: null,
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
 * @param {String|null} props.rangePart - currently selecting part of date range
 * @param {String|[]} props.locales - locales to render component
 * @param {number} props.firstDay - first day of week(1 - Monday, 7 - Sunday)
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
            curRange: { start: null, end: null },
            selRange: { start: null, end: null },
            rangePart: this.props.rangePart,
            disabledDateFilter: this.props.disabledDateFilter,
            actDate: null,
            transition: null,
        };

        this.waitingForAnimation = false;
        this.position = 0;
        this.width = 0;
        this.height = 0;
        this.prevView = null;
        this.currView = null;
        this.nextView = null;
        this.newView = null;

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

        this.header = DatePickerHeader.create({
            onClickTitle: () => this.zoomOut(),
            onClickPrev: () => this.navigateToPrev(),
            onClickNext: () => this.navigateToNext(),
        });

        this.slider = createElement('div', { props: { className: SLIDER_CLASS } });
        this.cellsContainer = createElement('div', {
            props: { className: VIEW_CLASS },
            children: this.slider,
        });

        this.wrapper = createElement('div', {
            props: { className: WRAPPER_CLASS },
            children: [this.header.elem, this.cellsContainer],
            events: {
                click: (e) => this.onViewClick(e),
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

        Slidable.create({
            elem: this.cellsContainer,
            content: this.slider,
            isReady: () => !this.waitingForAnimation,
            updatePosition: (position) => this.setContentPosition(position),
            onDragEnd: (...args) => this.onDragEnd(...args),
            onWheel: (e) => this.onWheel(e),
        });

        this.observeSliderSize();

        this.setClassNames();
        this.render(this.state);
    }

    /** Creates ResizeObserver for slider element */
    observeSliderSize() {
        const observer = new ResizeObserver(() => this.onResize());
        observer.observe(this.slider);
    }

    /** Updates height of container */
    onResize() {
        const { offsetHeight } = this.currView.elem;
        if (offsetHeight === 0) {
            return;
        }

        this.cellsContainer.style.height = px(offsetHeight);

        this.width = this.cellsContainer.offsetWidth;
        this.height = offsetHeight;
        this.setContentPosition(-this.width);
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
                margin: this.props.popupMargin,
                screenPadding: this.props.popupScreenPadding,
                scrollOnOverflow: true,
                allowResize: false,
                allowFlip: false,
            });
        } else {
            PopupPosition.reset(this.wrapper);
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

    /**
     * Mouse whell event handler
     * @param {Event} e - wheel event object
     */
    onWheel(e) {
        if (this.waitingForAnimation) {
            return;
        }

        if (e.wheelDelta > 0) {
            this.navigateToPrev();
        } else {
            this.navigateToNext();
        }
    }

    findViewItemByElem(elem) {
        return this.currView.items.find((i) => i.elem === elem);
    }

    /** View 'click' event delegate */
    onViewClick(e) {
        e.stopPropagation();
        if (!this.currView || this.waitingForAnimation) {
            return;
        }

        // Cells
        const item = this.findViewItemByElem(e.target);
        if (!item) {
            return;
        }
        const { viewType } = this.state;
        if (viewType === MONTH_VIEW) {
            this.onDayClick(item.date);
        } else if (viewType === YEAR_VIEW || viewType === YEARRANGE_VIEW) {
            this.zoomIn(item.date);
        }
    }

    navigateTo(state) {
        if (!this.currView || this.waitingForAnimation) {
            return;
        }

        this.setState({ ...this.state, ...state });

        if (!this.props.animated) {
            this.onStateReady();
        }
    }

    setRangePart(rangePart) {
        if (this.state.rangePart === rangePart) {
            return;
        }

        this.setState({ ...this.state, rangePart });
    }

    onStateReady() {
        this.setState({ ...this.state, transition: null });
    }

    zoomIn(date) {
        const { viewType } = this.state;
        if (viewType !== YEAR_VIEW && viewType !== YEARRANGE_VIEW) {
            return;
        }

        this.navigateTo({
            date,
            viewType: (viewType === YEAR_VIEW) ? MONTH_VIEW : YEAR_VIEW,
            transition: 'zoomIn',
        });
    }

    zoomOut() {
        const { viewType } = this.state;
        if (viewType !== MONTH_VIEW && viewType !== YEAR_VIEW) {
            return;
        }

        this.navigateTo({
            viewType: (viewType === MONTH_VIEW) ? YEAR_VIEW : YEARRANGE_VIEW,
            transition: 'zoomOut',
        });
    }

    navigateToPrev() {
        this.navigateTo({
            date: getPrevViewDate(this.state.date, this.state.viewType),
            transition: 'slideLeft',
        });
    }

    navigateToNext() {
        this.navigateTo({
            date: getNextViewDate(this.state.date, this.state.viewType),
            transition: 'slideRight',
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
     * Set up selected items range
     * @param {Date} startDate - date to start selection from
     * @param {Date} endDate  - date to finnish selection at
     */
    setSelection(startDate, endDate, navigateToFirst = true) {
        if (!isDate(startDate)) {
            return;
        }

        const date = startDate.getTime();
        const newState = {
            ...this.state,
        };
        if (navigateToFirst) {
            newState.viewType = MONTH_VIEW;
            newState.date = new Date(date);
        }

        if (isDate(endDate)) {
            const dateTo = endDate.getTime();
            newState.curRange = {
                start: new Date(Math.min(date, dateTo)),
                end: new Date(Math.max(date, dateTo)),
            };
            newState.selRange = { start: null, end: null };
        } else {
            newState.actDate = new Date(date);
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

    setDisabledDateFilter(disabledDateFilter) {
        if (this.state.disabledDateFilter === disabledDateFilter) {
            return;
        }

        this.setState({ ...this.state, disabledDateFilter });
    }

    setContentPosition(position) {
        this.position = minmax(-this.width * 2, 0, position);
        this.slider.style.left = px(this.position);
    }

    onDragEnd(position, distance, velocity) {
        const passThreshold = Math.abs(velocity) > SWIPE_THRESHOLD;
        let slideNum = -position / this.width;
        if (passThreshold) {
            slideNum = (distance > 0) ? Math.ceil(slideNum) : Math.floor(slideNum);
        } else {
            slideNum = Math.round(slideNum);
        }

        const num = minmax(-1, 1, slideNum - 1);
        if (num === 0) {
            this.slideTo(0);
            return;
        }

        if (num > 0) {
            this.navigateToNext();
        } else {
            this.navigateToPrev();
        }
    }

    onAnimationDone() {
        if (!this.waitingForAnimation) {
            return;
        }

        this.waitingForAnimation = false;

        this.wrapper.classList.remove(ANIMATED_CLASS);
        this.cellsContainer.classList.remove(ANIMATED_VIEW_CLASS);

        if (this.newView) {
            this.newView.current.elem.classList.remove(
                LAYER_VIEW_CLASS,
                BOTTOM_TO_CLASS,
                TOP_TO_CLASS,
            );
            transform(this.newView.current.elem, '');
        }

        this.setContentPosition(-this.width);

        transform(this.slider, '');
        this.cellsContainer.style.width = '';

        if (this.newView) {
            const { prev, next } = this.newView;

            if (this.currView === prev) {
                re(this.prevView.elem);
                this.slider.append(next.elem);
            } else if (this.currView === next) {
                re(this.nextView.elem);
                this.slider.prepend(prev.elem);
            } else {
                this.renderSlider(this.newView);
                removeChilds(this.cellsContainer);
                this.cellsContainer.append(this.slider);
            }

            this.applyView(this.newView);
            this.newView = null;
        }

        this.onStateReady();
    }

    renderSlider(views) {
        const { prev, current, next } = views;
        removeChilds(this.slider);
        this.slider.append(prev.elem, current.elem, next.elem);
    }

    /**
     * Set new view
     * @param {object} newView - view object
     */
    applyView(views) {
        const { prev, current, next } = views;
        this.prevView = prev;
        this.currView = current;
        this.nextView = next;

        prev.elem.classList.toggle(CURRENT_CLASS, false);
        current.elem.classList.toggle(CURRENT_CLASS, true);
        next.elem.classList.toggle(CURRENT_CLASS, false);

        this.header.setTitle(this.currView.title);
    }

    getTargetViewByIndex(index) {
        if (index === 0) {
            return this.currView;
        }

        return (index < 0) ? this.prevView : this.nextView;
    }

    /**
     * Animates container sliding to the specified position
     * @param {Number} index - slide position, -1 for previous, 0 for current and 1 for next
     */
    slideTo(index) {
        const targetView = this.getTargetViewByIndex(index);
        const targetPos = -(index + 1) * this.width;
        const distance = targetPos - this.position;
        if (distance === 0) {
            return;
        }

        this.waitingForAnimation = true;

        this.wrapper.classList.add(ANIMATED_CLASS);
        this.cellsContainer.classList.add(ANIMATED_VIEW_CLASS);

        this.cellsContainer.style.height = px(targetView.elem.offsetHeight);

        const trMatrix = [1, 0, 0, 1, distance, 0];
        transform(this.slider, `matrix(${trMatrix.join()})`);

        afterTransition(this.cellsContainer, {
            property: 'transform',
            duration: TRANSITION_END_TIMEOUT,
            target: this.slider,
        }, () => this.onAnimationDone());
    }

    /**
     * Set new view or replace current view with specified
     * @param {object} newView - view object
     */
    setView(views, state) {
        if (this.currView === views.current || !views.current) {
            return;
        }

        const { current } = views;

        if (!this.currView?.elem || !this.props.animated) {
            this.renderSlider(views);
            if (this.width > 0) {
                this.setContentPosition(-this.width);
            }

            this.height = current.elem.offsetHeight;
            this.cellsContainer.style.height = px(this.height);

            this.applyView(views);
            return;
        }

        this.waitingForAnimation = true;

        this.cellsContainer.style.width = px(this.width);
        this.cellsContainer.style.height = px(this.height);

        // If new view is the same type as current then animate slide
        if (this.currView.type === current.type) {
            const leftToRight = this.currView.date > current.date;
            this.newView = views;
            this.slideTo((leftToRight) ? -1 : 1);
            return;
        }

        removeChilds(this.cellsContainer);
        this.cellsContainer.append(this.currView.elem, current.elem);

        const zoomingOut = state.transition === 'zoomOut';
        const cellView = (zoomingOut) ? current : this.currView;
        const relView = (zoomingOut) ? this.currView : current;
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

        current.elem.classList.add(LAYER_VIEW_CLASS, (zoomingOut) ? BOTTOM_TO_CLASS : TOP_TO_CLASS);

        const cellX = elem.offsetLeft;
        const cellY = elem.offsetTop;
        const scaleX = elem.offsetWidth / this.width;
        const scaleY = elem.offsetHeight / this.height;
        const cellTrans = [scaleX, 0, 0, scaleY, cellX, cellY].map(toCSSValue);
        const viewTrans = [
            1 / scaleX,
            0,
            0,
            1 / scaleY,
            -cellX / scaleX,
            -cellY / scaleY,
        ].map(toCSSValue);

        transform(current.elem, `matrix(${(zoomingOut ? viewTrans : cellTrans).join()})`);

        this.currView.elem.classList.add(
            LAYER_VIEW_CLASS,
            (zoomingOut) ? TOP_FROM_CLASS : BOTTOM_FROM_CLASS,
        );

        setTimeout(() => {
            this.wrapper.classList.add(ANIMATED_CLASS);
            this.cellsContainer.classList.add(ANIMATED_VIEW_CLASS);
            this.cellsContainer.style.height = px(current.elem.offsetHeight);
            current.elem.style.opacity = 1;
            this.currView.elem.style.opacity = 0;
            transform(current.elem, '');
            transform(
                this.currView.elem,
                `matrix(${(zoomingOut ? cellTrans : viewTrans).join()})`,
            );

            this.newView = views;

            afterTransition(this.cellsContainer, {
                property: 'transform',
                duration: TRANSITION_END_TIMEOUT,
                target: this.currView.elem,
            }, () => this.onAnimationDone());
        });
    }

    renderPrevView(state) {
        const date = getPrevViewDate(state.date, state.viewType);
        return this.renderDateView(date, state);
    }

    renderCurrentView(state) {
        return this.renderDateView(state.date, state);
    }

    renderNextView(state) {
        const date = getNextViewDate(state.date, state.viewType);
        return this.renderDateView(date, state);
    }

    renderDateView(date, state) {
        const { viewType } = state;

        if (viewType === MONTH_VIEW) {
            return DatePickerMonthView.create({
                date,
                locales: this.props.locales,
                firstDay: this.props.firstDay,
                actDate: state.actDate,
                range: this.props.range,
                curRange: state.curRange,
                disabledDateFilter: state.disabledDateFilter,
                rangePart: state.rangePart,
            });
        }

        if (viewType === YEAR_VIEW) {
            return DatePickerYearView.create({
                date,
                locales: this.props.locales,
            });
        }

        if (viewType === YEARRANGE_VIEW) {
            return DatePickerYearRangeView.create({
                date,
                locales: this.props.locales,
            });
        }

        throw new Error('Invalid view type');
    }

    setMonthViewState(view, state) {
        view?.setState((viewState) => ({
            ...viewState,
            actDate: state.actDate,
            range: this.props.range,
            curRange: state.curRange,
            disabledDateFilter: state.disabledDateFilter,
            rangePart: state.rangePart,
        }));
    }

    renderView(state, prevState = {}) {
        const typeChanged = (state.viewType !== prevState?.viewType);

        if (state.transition === 'slideRight') {
            return {
                prev: this.currView,
                current: this.nextView,
                next: this.renderNextView(state),
            };
        }

        if (state.transition === 'slideLeft') {
            return {
                prev: this.renderPrevView(state),
                current: this.prevView,
                next: this.currView,
            };
        }

        if (
            state.viewType === MONTH_VIEW
            && !typeChanged
            && isSameYearMonth(state.date, prevState?.date)
        ) {
            this.setMonthViewState(this.prevView, state);
            this.setMonthViewState(this.currView, state);
            this.setMonthViewState(this.nextView, state);

            return {
                prev: this.prevView,
                current: this.currView,
                next: this.nextView,
            };
        }

        return {
            prev: this.renderPrevView(state),
            current: this.renderCurrentView(state),
            next: this.renderNextView(state),
        };
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
                || state.disabledDateFilter !== prevState.disabledDateFilter
                || state.rangePart !== prevState.rangePart
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
        this.setView(view, state);
    }
}
