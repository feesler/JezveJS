import { asArray, isDate, isFunction } from '@jezvejs/types';
import '../../css/common.scss';
import {
    ge,
    re,
    show,
    transform,
    createElement,
    removeChilds,
    afterTransition,
    getClassName,
} from '@jezvejs/dom';
import {
    isSameDate,
    isSameYearMonth,
} from '@jezvejs/datetime';
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
    includesDate,
} from './utils.js';
import './DatePicker.scss';

/* CSS classes */
const CONTAINER_CLASS = 'dp__container';
const WRAPPER_CLASS = 'dp__wrapper';
const DOUBLE_VIEW_CLASS = 'dp__double-view';
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
    mode: 'date', // possible values: 'date', 'month', 'year'
    date: new Date(),
    static: false,
    multiple: false,
    range: false,
    doubleView: false,
    rangePart: null, // possible values: 'start', 'end' or null
    locales: [],
    firstDay: null,
    animated: false,
    disabledDateFilter: null,
    onRangeSelect: null,
    onDateSelect: null,
    onShow: null,
    onHide: null,
    footer: {},
    components: {
        Footer: null,
    },
};

/**
 * Date picker component
 */
export class DatePicker extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        const viewTypesMap = {
            date: MONTH_VIEW,
            month: YEAR_VIEW,
            year: YEARRANGE_VIEW,
        };

        const { mode } = this.props;
        if (!(mode in viewTypesMap)) {
            throw new Error('Invalid mode');
        }

        this.state = {
            mode,
            visible: this.props.static,
            viewType: viewTypesMap[mode],
            date: isDate(this.props.date) ? this.props.date : new Date(),
            curRange: { start: null, end: null },
            selRange: { start: null, end: null },
            rangePart: this.props.rangePart,
            disabledDateFilter: this.props.disabledDateFilter,
            actDate: null,
            transition: null,
            secondViewTransition: false,
        };

        this.waitingForAnimation = false;
        this.position = 0;
        this.width = 0;
        this.height = 0;
        this.prevView = null;
        this.currView = null;
        this.secondView = null;
        this.nextView = null;
        this.newView = null;

        this.emptyClickHandler = () => this.hide();

        this.init();
    }

    init() {
        const { relparent, doubleView } = this.props;
        if (relparent) {
            this.relativeParent = (typeof relparent === 'string')
                ? ge(relparent)
                : relparent;
        }

        this.header = DatePickerHeader.create({
            doubleView,
            onClickTitle: (options) => this.zoomOut(options),
            onClickPrev: () => this.navigateToPrev(),
            onClickNext: () => this.navigateToNext(),
        });

        this.slider = createElement('div', { props: { className: SLIDER_CLASS } });
        this.cellsContainer = createElement('div', {
            props: { className: VIEW_CLASS },
            children: this.slider,
        });

        const children = [this.header.elem, this.cellsContainer];

        const { Footer } = this.props.components;
        if (Footer) {
            this.footer = Footer.create(this.props.footer);
            children.push(this.footer.elem);
        }

        this.wrapper = createElement('div', {
            props: { className: WRAPPER_CLASS },
            children,
            events: {
                click: (e) => this.onViewClick(e),
            },
        });
        this.wrapper.classList.toggle(DOUBLE_VIEW_CLASS, !!doubleView);
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

    get columnGap() {
        return (this.props.doubleView && this.width > 0)
            ? (this.width - this.currView.elem.offsetWidth * 2)
            : 0;
    }

    /** Creates ResizeObserver for slider element */
    observeSliderSize() {
        const observer = new ResizeObserver(() => (
            requestAnimationFrame(() => this.onResize())
        ));
        observer.observe(this.slider);
    }

    /** Updates height of container */
    onResize() {
        const containerHeight = this.getContainerHeight(this.newView);
        if (containerHeight === 0) {
            return;
        }

        this.width = this.cellsContainer.offsetWidth;
        this.height = containerHeight;

        this.cellsContainer.style.height = px(containerHeight);

        this.setDefaultContentPosition();
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
            return;
        }

        if (this.width === 0 || this.height === 0) {
            this.onResize();
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
    }

    /**
     * Show/hide date picker
     * @param {boolean} visible - if true then show view, hide otherwise
     */
    show(visible = true) {
        if (this.state.visible === visible) {
            return;
        }

        this.setState({ ...this.state, visible });
        this.sendShowEvents(visible);
    }

    /**
     * Check date picker is visible
     */
    visible() {
        return this.state.visible;
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

    /** View 'click' event delegate */
    onViewClick(e) {
        e.stopPropagation();
        if (!this.currView || this.waitingForAnimation) {
            return;
        }

        // Cells
        let usingSecondView = false;
        let item = this.currView.items.find((i) => i.elem === e.target);
        if (!item && this.props.doubleView) {
            item = this.secondView.items.find((i) => i.elem === e.target);
            usingSecondView = !!item;
        }

        if (!item) {
            return;
        }

        const { viewType, mode } = this.state;
        if (viewType === MONTH_VIEW && mode === 'date') {
            this.onDayClick(item.date);
        } else if (viewType === YEAR_VIEW || viewType === YEARRANGE_VIEW) {
            if (
                (viewType === YEAR_VIEW && mode === 'month')
                || (viewType === YEARRANGE_VIEW && mode === 'year')
            ) {
                this.onDayClick(item.date);
            } else {
                this.zoomIn(item.date, usingSecondView);
            }
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

    zoomIn(date, secondViewTransition = false) {
        const { viewType } = this.state;
        if (viewType !== YEAR_VIEW && viewType !== YEARRANGE_VIEW) {
            return;
        }

        this.navigateTo({
            date,
            viewType: (viewType === YEAR_VIEW) ? MONTH_VIEW : YEAR_VIEW,
            transition: 'zoomIn',
            secondViewTransition,
        });
    }

    zoomOut(options = {}) {
        const { viewType } = this.state;
        if (viewType !== MONTH_VIEW && viewType !== YEAR_VIEW) {
            return;
        }

        this.navigateTo({
            viewType: (viewType === MONTH_VIEW) ? YEAR_VIEW : YEARRANGE_VIEW,
            transition: 'zoomOut',
            secondViewTransition: !!options?.isSecondTitle,
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
        if (this.props.multiple) {
            const selectedDates = asArray(this.state.actDate);
            const selected = includesDate(selectedDates, date);

            this.setState({
                ...this.state,
                actDate: (selected)
                    ? selectedDates.filter((item) => !isSameDate(item, date))
                    : [...selectedDates, date],
            });
        } else {
            this.setState({
                ...this.state,
                actDate: date,
            });
        }

        if (isFunction(this.props.onDateSelect)) {
            this.props.onDateSelect(this.state.actDate);
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

    getSlideWidth() {
        return (this.props.doubleView)
            ? ((this.width - this.columnGap) / 2)
            : this.width;
    }

    getSlidePosition(index) {
        const columnGap = (this.props.doubleView) ? this.columnGap : 0;
        const slideWidth = this.getSlideWidth();
        return -(index + 1) * (slideWidth + columnGap);
    }

    setDefaultContentPosition() {
        const contentPos = this.getSlidePosition(0);
        this.setContentPosition(contentPos);
    }

    onDragEnd(position, distance, velocity) {
        const passThreshold = Math.abs(velocity) > SWIPE_THRESHOLD;
        const slideWidth = this.getSlideWidth();
        const columnGap = (this.props.doubleView) ? this.columnGap : 0;

        let slideNum = -position / (slideWidth + columnGap);
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

    resetViewAnimation(view) {
        if (!view?.elem) {
            return;
        }

        view.elem.classList.remove(
            LAYER_VIEW_CLASS,
            BOTTOM_TO_CLASS,
            TOP_TO_CLASS,
        );
        transform(view.elem, '');
    }

    onAnimationDone() {
        if (!this.waitingForAnimation) {
            return;
        }

        this.waitingForAnimation = false;

        this.wrapper.classList.remove(ANIMATED_CLASS);
        this.cellsContainer.classList.remove(ANIMATED_VIEW_CLASS);

        if (this.newView) {
            this.resetViewAnimation(this.newView.current);
            if (this.props.doubleView) {
                this.resetViewAnimation(this.newView.second);
            }
        }

        this.setDefaultContentPosition();

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
        this.slider.textContent = '';

        if (this.props.doubleView) {
            const { second } = views;
            this.slider.append(prev.elem, current.elem, second.elem, next.elem);
        } else {
            this.slider.append(prev.elem, current.elem, next.elem);
        }
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

        if (this.props.doubleView) {
            const { second } = views;
            this.secondView = second;
            second.elem.classList.toggle(CURRENT_CLASS, true);
            this.header.setDoubleTitle(this.currView.title, this.secondView.title);
        } else {
            this.header.setTitle(this.currView.title);
        }
    }

    /**
     * Animates container sliding to the specified position
     * @param {Number} index - slide position, -1 for previous, 0 for current and 1 for next
     */
    slideTo(index) {
        const targetPos = this.getSlidePosition(index);
        const distance = targetPos - this.position;
        if (distance === 0) {
            return;
        }

        const leftToRight = index < 0;

        this.waitingForAnimation = true;

        this.wrapper.classList.add(ANIMATED_CLASS);
        this.cellsContainer.classList.add(ANIMATED_VIEW_CLASS);

        const containerHeight = this.getContainerHeight({
            current: (leftToRight) ? this.currView : this.secondView,
            second: (leftToRight) ? this.prevView : this.nextView,
        });

        this.height = containerHeight;
        this.cellsContainer.style.height = px(containerHeight);

        const trMatrix = [1, 0, 0, 1, distance, 0];
        transform(this.slider, `matrix(${trMatrix.join()})`);

        afterTransition(this.cellsContainer, {
            property: 'transform',
            duration: TRANSITION_END_TIMEOUT,
            target: this.slider,
        }, () => this.onAnimationDone());
    }

    /** Returns height of container required to fit all views */
    getContainerHeight(views = {}) {
        const current = views?.current ?? this.currView;
        const contentViews = [current];
        if (this.props.doubleView) {
            const second = views?.second ?? this.secondView;
            if (second) {
                contentViews.push(second);
            }
        }

        return Math.max(...contentViews.map((item) => (item?.elem?.offsetHeight ?? 0)));
    }

    /**
     * Set new view or replace current view with specified
     * @param {object} newView - view object
     */
    setView(views, state) {
        if (this.currView === views.current || !views.current) {
            return;
        }

        const { current, second } = views;

        if (!this.currView?.elem || !this.props.animated) {
            this.renderSlider(views);
            if (this.width > 0) {
                this.setDefaultContentPosition();
            }

            this.height = this.getContainerHeight(views);
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

        const { doubleView } = this.props;
        const contentViews = [
            this.currView.elem,
            ...((doubleView) ? [this.secondView.elem] : []),
            current.elem,
            ...((doubleView) ? [second.elem] : []),
        ];
        this.cellsContainer.textContent = '';
        this.cellsContainer.append(...contentViews);

        const { secondViewTransition } = state;
        const zoomingOut = state.transition === 'zoomOut';
        const cellView = (zoomingOut) ? current : this.currView;
        const secondCellView = (zoomingOut) ? second : this.secondView;

        let relView;
        if (secondViewTransition) {
            relView = (zoomingOut) ? this.secondView : second;
        } else {
            relView = (zoomingOut) ? this.currView : current;
        }

        const relYear = relView.date.getFullYear();
        const relMonth = relView.date.getMonth();

        // Search for target cell on navigate from month view to year view or
        // from year view to years range view
        const isRelativeItem = (item) => (
            (
                relView.type === MONTH_VIEW
                && item.date.getFullYear() === relYear
                && item.date.getMonth() === relMonth
            ) || (
                relView.type === YEAR_VIEW
                && item.date.getFullYear() === relYear
            )
        );

        let cellObj = cellView.items.find(isRelativeItem);
        if (!cellObj && doubleView) {
            cellObj = secondCellView.items.find(isRelativeItem);
        }
        if (!cellObj) {
            return;
        }

        const animationTarget = createElement('div', {
            props: {
                className: getClassName(
                    LAYER_VIEW_CLASS,
                    (zoomingOut) ? BOTTOM_TO_CLASS : TOP_TO_CLASS,
                ),
            },
            children: [current.elem, second?.elem],
        });
        this.cellsContainer.append(animationTarget);

        const { elem } = cellObj;
        const cellX = (secondViewTransition)
            ? (elem.offsetLeft - elem.offsetWidth)
            : elem.offsetLeft;
        const cellY = elem.offsetTop;
        const cellWidth = (secondViewTransition)
            ? (elem.offsetWidth * 2)
            : elem.offsetWidth;
        const scaleX = cellWidth / this.width;
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

        transform(animationTarget, `matrix(${(zoomingOut ? viewTrans : cellTrans).join()})`);

        const animationSource = createElement('div', {
            props: {
                className: getClassName(
                    LAYER_VIEW_CLASS,
                    (zoomingOut) ? TOP_FROM_CLASS : BOTTOM_FROM_CLASS,
                ),
            },
            children: [this.currView.elem, this.secondView?.elem],
        });
        this.cellsContainer.append(animationSource);

        requestAnimationFrame(() => {
            this.wrapper.classList.add(ANIMATED_CLASS);
            this.cellsContainer.classList.add(ANIMATED_VIEW_CLASS);

            const containerHeight = this.getContainerHeight(views);
            this.cellsContainer.style.height = px(containerHeight);
            animationTarget.style.opacity = 1;
            animationSource.style.opacity = 0;
            transform(animationTarget, '');
            transform(
                animationSource,
                `matrix(${(zoomingOut ? cellTrans : viewTrans).join()})`,
            );

            this.newView = views;

            afterTransition(this.cellsContainer, {
                property: 'transform',
                duration: TRANSITION_END_TIMEOUT,
                target: animationSource,
            }, () => this.onAnimationDone());
        });
    }

    renderPrevView(state) {
        let date = getPrevViewDate(state.date, state.viewType);
        if (this.props.doubleView && state.secondViewTransition) {
            date = getPrevViewDate(date, state.viewType);
        }
        return this.renderDateView(date, state);
    }

    renderCurrentView(state) {
        const date = (this.props.doubleView && state.secondViewTransition)
            ? getPrevViewDate(state.date, state.viewType)
            : state.date;

        return this.renderDateView(date, state);
    }

    renderSecondView(state) {
        if (!this.props.doubleView) {
            return null;
        }

        const date = (state.secondViewTransition)
            ? state.date
            : getNextViewDate(state.date, state.viewType);
        return this.renderDateView(date, state);
    }

    renderNextView(state) {
        let date = getNextViewDate(state.date, state.viewType);
        if (this.props.doubleView && !state.secondViewTransition) {
            date = getNextViewDate(date, state.viewType);
        }

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
                multiple: this.props.multiple,
                range: this.props.range,
                curRange: state.curRange,
                disabledDateFilter: state.disabledDateFilter,
                rangePart: state.rangePart,
                doubleView: this.props.doubleView,
            });
        }

        if (viewType === YEAR_VIEW) {
            return DatePickerYearView.create({
                date,
                locales: this.props.locales,
                doubleView: this.props.doubleView,
            });
        }

        if (viewType === YEARRANGE_VIEW) {
            return DatePickerYearRangeView.create({
                date,
                locales: this.props.locales,
                doubleView: this.props.doubleView,
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
        const visibilityChanged = (state.visible !== prevState?.visible);

        if (state.transition === 'slideRight') {
            const res = {
                prev: this.currView,
                next: this.renderNextView(state),
            };

            return (this.props.doubleView)
                ? {
                    ...res,
                    current: this.secondView,
                    second: this.nextView,
                }
                : {
                    ...res,
                    current: this.nextView,
                };
        }

        if (state.transition === 'slideLeft') {
            const res = {
                prev: this.renderPrevView(state),
                current: this.prevView,
            };

            return (this.props.doubleView)
                ? {
                    ...res,
                    second: this.currView,
                    next: this.secondView,
                }
                : {
                    ...res,
                    next: this.currView,
                };
        }

        if (
            state.viewType === MONTH_VIEW
            && !typeChanged
            && !visibilityChanged
            && isSameYearMonth(state.date, prevState?.date)
        ) {
            this.setMonthViewState(this.prevView, state);
            this.setMonthViewState(this.currView, state);
            if (this.props.doubleView) {
                this.setMonthViewState(this.secondView, state);
            }
            this.setMonthViewState(this.nextView, state);

            const res = {
                prev: this.prevView,
                current: this.currView,
                next: this.nextView,
            };

            if (this.props.doubleView) {
                res.second = this.secondView;
            }

            return res;
        }

        const res = {
            prev: this.renderPrevView(state),
            current: this.renderCurrentView(state),
            next: this.renderNextView(state),
        };

        if (this.props.doubleView) {
            res.second = this.renderSecondView(state);
        }

        return res;
    }

    getYearDecade(date) {
        return Math.floor(date.getFullYear() / 10);
    }

    isViewUpdated(state, prevState) {
        if (
            state.viewType !== prevState.viewType
            || state.visible !== prevState.visible
        ) {
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

    renderContent(state, prevState) {
        if (state.visible !== prevState?.visible) {
            this.showView(state.visible);
        }

        if (!state.visible) {
            return;
        }

        if (!this.isViewUpdated(state, prevState)) {
            return;
        }

        const view = this.renderView(state, prevState);
        this.setView(view, state);
    }

    renderFooter(state, prevState) {
        if (
            !this.footer
            || state.footer === prevState?.footer
        ) {
            return;
        }

        this.footer.setState((footerState) => ({
            ...footerState,
            ...state.footer,
        }));
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.renderContent(state, prevState);
        this.renderFooter(state, prevState);
    }
}
