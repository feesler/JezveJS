import { asArray, isFunction, isObject } from '@jezvejs/types';
import {
    createSVGElement,
    show,
    getOffset,
    createElement,
} from '@jezvejs/dom';

import { debounce, minmax } from '../../common.js';
import { setEmptyClick, removeEmptyClick } from '../../emptyClick.js';
import { Component } from '../../Component.js';

// Global utilities
import { PopupPosition } from '../PopupPosition/PopupPosition.js';
import { ChartGrid } from '../ChartGrid/ChartGrid.js';

import { defaultProps } from './defaultProps.js';
import { formatCoord } from './helpers.js';
import '../../common.scss';
import './BaseChart.scss';

export { BaseChartGrid } from './components/Grid/BaseChartGrid.js';
export { BaseChartLegend } from './components/Legend/BaseChartLegend.js';
export { BaseChartPopup } from './components/Popup/BaseChartPopup.js';
export { BaseChartXAxisLabels } from './components/xAxisLabels/BaseChartXAxisLabels.js';
export { BaseChartYAxisLabels } from './components/yAxisLabels/BaseChartYAxisLabels.js';

/* CSS classes */
const CHART_CLASS = 'chart';
const HORIZONTAL_CONTAINER_CLASS = 'chart__horizontal';
const STACKED_CLASS = 'chart_stacked';
const CONTAINER_CLASS = 'chart__container';
const SCROLLER_CLASS = 'chart__scroller';
const CONTENT_CLASS = 'chart__content';
const ACTIVE_ITEM_CLASS = 'chart__item_active';
const ANIMATE_CLASS = 'chart_animated';
const TOP_X_AXIS_CLASS = 'chart_x-axis-top';
const LEFT_Y_AXIS_CLASS = 'chart_y-axis-left';
/* Popup */
const POPUP_CLASS = 'chart__popup';
const ANIMATE_POPUP_CLASS = 'chart__popup_animated';

/* Legend */
const LEGEND_CLASS = 'chart__legend';

/**
 * Base chart class
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class BaseChart extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        this.chartContainer = null;
        this.chart = null;
        this.chartScroller = null;
        this.content = null;
        this.legend = null;
        this.activeTarget = null;
        this.currentTarget = null;
        this.popup = null;
        this.pinnedPopup = null;
        this.pinnedTarget = null;
        this.items = [];
        this.itemsGroup = null;
        this.grid = null;
        this.xAxisLabels = null;
        this.yAxisLabels = null;
        this.vertLabelsGroup = null;
        this.scrollRequested = false;
        this.contentOffset = null;

        this.cancelScaleFunc = null;
        this.cancelScrollFunc = null;

        if (!this.props.autoScale) {
            this.scaleFunc = null;
        } else if (this.props.autoScaleTimeout === false) {
            this.scaleFunc = () => this.scaleVisible();
        } else {
            const scaleHandler = debounce(
                () => this.scaleVisible(),
                this.props.autoScaleTimeout,
                { cancellable: true },
            );

            this.scaleFunc = scaleHandler.run;
            this.cancelScaleFunc = scaleHandler.cancel;
        }

        if (this.props.scrollToEnd) {
            const scrollHandler = debounce(
                () => this.scrollToRight(),
                100,
                { cancellable: true },
            );

            this.scrollFunc = scrollHandler.run;
            this.cancelScrollFunc = scrollHandler.cancel;
        } else {
            this.scrollFunc = null;
        }

        this.emptyClickHandler = () => this.hidePopup();

        this.state = {
            ...this.props,
            data: { ...defaultProps.data },
            dataSets: [],
            groupsCount: 0,
            columnsInGroup: 0,
            activeCategory: null,
            chartContentWidth: 0,
            lastHLabelOffset: 0,
            hLabelsHeight: 25,
            scrollerWidth: 0,
            containerWidth: 0,
            chartWidth: 0,
            chartHeight: 0,
            scrollLeft: 0,
            scrollWidth: 0,
            blockTouch: false,
            animateNow: false,
        };

        this.init();
        this.postInit();
        this.render(this.state);
        this.setData(this.props.data);
    }

    get activeCategory() {
        return this.state.activeCategory;
    }

    getGroupOuterWidth(state = this.state) {
        return state.columnWidth + state.groupsGap;
    }

    /** Initialization of chart */
    init() {
        this.chart = createElement('div', {
            className: CHART_CLASS,
        });

        this.chartScroller = createElement('div', {
            className: SCROLLER_CLASS,
            children: this.chart,
            events: {
                scroll: {
                    listener: (e) => this.onScroll(e),
                    options: { passive: true },
                },
            },
        });

        this.scrollerContainer = createElement('div', {
            className: CONTAINER_CLASS,
            children: this.chartScroller,
        });

        this.chartContainer = createElement('div', {
            className: HORIZONTAL_CONTAINER_CLASS,
            children: this.scrollerContainer,
        });

        this.elem = createElement('div', {
            className: CHART_CLASS,
            children: this.chartContainer,
        });

        const { height, marginTop } = this.state;
        this.state.chartHeight = height - marginTop;

        // Create main chart content
        const events = {
            click: (e) => this.onClick(e),
        };
        if (
            this.props.activateOnHover
            || this.props.showPopupOnHover
            || isFunction(this.props.onItemOver)
            || isFunction(this.props.onItemOut)
        ) {
            events.touchstart = (e) => this.onTouchStart(e);
            events.mousemove = (e) => this.onMouseMove(e);
            events.mouseleave = (e) => this.onMouseLeave(e);
        }

        this.content = createSVGElement('svg', {
            attrs: { class: CONTENT_CLASS },
            events,
        });
        this.chart.append(this.content);
    }

    postInit() {
        this.setClassNames();
        this.observeSize();
    }

    getComponent(name) {
        const res = this.props.components?.[name] ?? null;
        if (!res) {
            throw new Error(`Invalid ${name} component`);
        }

        return res;
    }

    observeSize() {
        const handler = debounce(() => this.onResize(), this.props.resizeTimeout);
        const observer = new ResizeObserver(handler);
        observer.observe(this.chartScroller);
    }

    getDataState(data, state = this.state) {
        if (state.data === data) {
            return state;
        }

        const newState = {
            ...state,
            data: {
                ...defaultProps.data,
                ...data,
            },
            lastHLabelOffset: 0,
        };

        newState.dataSets = this.getDataSets(newState);
        newState.groupsCount = this.getGroupsCount(newState);
        newState.columnsInGroup = this.getColumnsInGroupCount(newState);
        newState.grid = this.calculateGrid(data.values, newState);

        return newState;
    }

    setData(data) {
        if (!data?.values || !data?.series) {
            throw new Error('Invalid data');
        }
        if (this.state.data === data) {
            return;
        }

        if (this.cancelScaleFunc) {
            this.cancelScaleFunc();
        }
        if (this.cancelScrollFunc) {
            this.cancelScrollFunc();
        }

        const state = this.getDataState(data);

        this.contentOffset = getOffset(this.chartScroller);
        let newState = this.updateColumnWidth(state);
        newState = this.updateChartWidth(newState);
        this.setState(newState);

        if (this.scrollFunc) {
            this.scrollRequested = true;
            this.scrollFunc();
        }
    }

    scrollToRight() {
        if (!this.scrollRequested) {
            return;
        }

        if (this.state.scrollLeft + this.state.scrollerWidth >= this.state.chartWidth) {
            this.scrollRequested = false;
            return;
        }

        this.chartScroller.scrollLeft = this.chartScroller.scrollWidth;
    }

    setColumnWidth(value) {
        const width = parseFloat(value, 10);
        if (Number.isNaN(width) || width < 1 || this.state.columnWidth === width) {
            return;
        }

        const state = {
            ...this.state,
            columnWidth: Math.min(width, this.state.maxColumnWidth),
            lastHLabelOffset: 0,
        };
        const newState = this.updateChartWidth(state);
        this.setState(newState);
    }

    setGroupsGap(value) {
        const gap = parseFloat(value, 10);
        if (Number.isNaN(gap) || this.state.groupsGap === gap) {
            return;
        }

        const state = {
            ...this.state,
            groupsGap: gap,
            lastHLabelOffset: 0,
        };
        const newState = this.updateChartWidth(state);
        this.setState(newState);
    }

    setActiveCategory(activeCategory) {
        if (this.state.activeCategory === activeCategory) {
            return;
        }

        this.setState({ ...this.state, activeCategory });
    }

    /** Returns count of data categories */
    getCategoriesCount(state = this.state) {
        return state.dataSets.length;
    }

    /** Returns current count of columns in group */
    getColumnsInGroupCount() {
        return 1;
    }

    /** Returns count of data columns */
    getGroupsCount(state = this.state) {
        const valuesLength = state?.dataSets?.map((item) => item.data.length) ?? [];
        return Math.max(0, ...valuesLength);
    }

    /** Returns array of data sets */
    getDataSets(state = this.state) {
        const { values } = state.data;
        if (values.length === 0) {
            return [];
        }

        const [firstItem] = values;
        if (!isObject(firstItem)) {
            const data = values;
            return [{ data }];
        }

        return values;
    }

    /** Returns longest data set */
    getLongestDataSet(state = this.state) {
        const resIndex = state.dataSets.reduce((res, item, index) => (
            (state.dataSets[res].data.length < item.data.length) ? index : res
        ), 0);

        return state.dataSets[resIndex]?.data ?? [];
    }

    getStackedGroups(state = this.state) {
        if (!state.data.stacked) {
            return [];
        }

        return state.dataSets.reduce((res, item) => {
            const group = item.group ?? null;
            return res.includes(group) ? res : [...res, group];
        }, []);
    }

    getStackedCategories(state = this.state) {
        if (!state.data.stacked) {
            return [];
        }

        return state.dataSets.reduce((res, item) => {
            let category = item.category ?? null;
            if (res.includes(category)) {
                return res;
            }

            const categoryIndex = res.length;
            if (category === null && !res.includes(categoryIndex)) {
                category = categoryIndex;
            }

            return [...res, category];
        }, []);
    }

    formatCoord(value, asPixels = false) {
        return formatCoord(value, asPixels);
    }

    /**
     * Calculate grid for specified set of values
     * @param {number[]} values
     */
    calculateGrid(values, state = this.state) {
        if (!state?.dataSets?.length) {
            return null;
        }

        const grid = new ChartGrid({
            scaleAroundAxis: state.scaleAroundAxis,
            height: state.chartHeight,
            margin: state.marginTop,
            minStep: state.minGridStep,
            maxStep: state.maxGridStep,
            valuesMargin: state.gridValuesMargin,
            stacked: state.data.stacked,
        });
        grid.calculate(values);

        return (grid.steps === 0) ? state.grid : grid;
    }

    /** Return array of values */
    mapValues(items) {
        if (!items || !Array.isArray(items)) {
            return null;
        }

        return items.flat().map((item) => item.value + item.valueOffset);
    }

    /** Update width of chart block */
    updateChartWidth(state) {
        const groupsWidth = state.groupsCount * this.getGroupOuterWidth(state);
        const contentWidth = Math.max(groupsWidth, state.lastHLabelOffset);

        const newState = {
            ...state,
            chartContentWidth: contentWidth,
            scrollLeft: this.chartScroller.scrollLeft,
            scrollWidth: this.chartScroller.scrollWidth,
        };

        newState.containerWidth = this.elem.offsetWidth;
        newState.scrollerWidth = this.chartScroller.offsetWidth;
        newState.chartWidth = Math.max(newState.scrollerWidth, contentWidth);

        return newState;
    }

    /** Calculate width and margin of bar for fitToWidth option */
    updateColumnWidth(state) {
        if (!state.fitToWidth) {
            return state;
        }

        const groupOuterWidth = this.chartScroller.offsetWidth / state.groupsCount;
        const groupsGap = groupOuterWidth / 5;
        const groupWidth = groupOuterWidth - groupsGap;
        const columnWidth = Math.min(
            state.maxColumnWidth,
            groupWidth / state.columnsInGroup,
        );

        const newState = {
            ...state,
            columnWidth,
            groupsGap,
        };

        return newState;
    }

    getFirstVisibleGroupIndex(state = this.state) {
        const groupWidth = this.getGroupOuterWidth(state);
        const offs = state.visibilityOffset;

        const firstItem = Math.round(state.scrollLeft / groupWidth);
        return Math.max(0, firstItem - offs);
    }

    getVisibleGroupsCount(firstItemIndex, state = this.state) {
        const groupWidth = this.getGroupOuterWidth(state);
        const longestSet = this.getLongestDataSet(state);
        const offs = state.visibilityOffset;
        const first = Math.max(0, firstItemIndex);

        const itemsOnWidth = Math.round(state.containerWidth / groupWidth);
        return Math.min(longestSet.length - first, itemsOnWidth + 2 * offs);
    }

    /** Return array of currently visible items */
    getVisibleItems(state = this.state) {
        const firstItem = this.getFirstVisibleGroupIndex(state);
        const itemsOnWidth = this.getVisibleGroupsCount(firstItem, state);
        const lastItem = firstItem + itemsOnWidth - 1;

        return this.items.filter((item) => (
            item?.length > 0
            && item[0].groupIndex >= firstItem
            && item[0].groupIndex <= lastItem
        ));
    }

    /** Returns series value for specified items group */
    getSeriesByIndex(index, state = this.state) {
        if (index === -1) {
            return null;
        }

        const { series } = state.data;
        const ind = minmax(0, series.length - 1, index);
        return series[ind];
    }

    getGroupIndexByX(x) {
        const groupOuterWidth = this.getGroupOuterWidth();
        return Math.floor(x / groupOuterWidth);
    }

    /** Find item by event object */
    findItemByEvent(e) {
        if (!this.contentOffset) {
            return { item: null, index: -1 };
        }

        const firstGroupIndex = this.getFirstVisibleGroupIndex();

        const x = e.clientX - this.contentOffset.left + this.state.scrollLeft;
        const index = this.getGroupIndexByX(x);
        const relIndex = index - firstGroupIndex;
        if (relIndex < 0 || relIndex >= this.items.length) {
            return { x, item: null, index: -1 };
        }

        const item = this.items[relIndex];
        return {
            x,
            item,
            index,
            series: this.getSeriesByIndex(index),
        };
    }

    /** Chart content 'click' event handler */
    onClick(e) {
        this.state.blockTouch = false;

        const target = this.findItemByEvent(e);
        if (!target.item) {
            return;
        }

        const { showPopupOnClick, pinPopupOnClick, activateOnClick } = this.state;

        if (activateOnClick || showPopupOnClick) {
            this.activateTarget(target, e);
        }

        if (showPopupOnClick) {
            // Reuse pinned popup in case there is no hover popup
            // Popup will be pinned again, so it's possible to animate position of element
            if (!this.popup && pinPopupOnClick && this.pinnedPopup) {
                this.popup = this.pinnedPopup;
            }

            this.showPopup(target);

            if (pinPopupOnClick) {
                if (this.pinnedPopup !== this.popup) {
                    this.pinnedPopup?.remove();
                }
                this.pinnedPopup = this.popup;
                this.pinnedTarget = target.item;
                this.popup = null;
            }
        }

        this.notifyEvent('onItemClick', { ...target, event: e });
    }

    /** Activates specified target */
    activateTarget(target, e) {
        if (this.activeTarget?.item === target?.item) {
            return;
        }
        this.deactivateTarget(e);

        if (!target?.item) {
            return;
        }

        this.activeTarget = target;

        target.item.elem.classList.add(ACTIVE_ITEM_CLASS);
    }

    /** Deactivates specified target */
    deactivateTarget() {
        const target = this.activeTarget;
        this.activeTarget = null;
        if (!target?.item) {
            return;
        }

        target.item.elem.classList.remove(ACTIVE_ITEM_CLASS);
    }

    /** Chart content 'touchstart' event handler */
    onTouchStart(e) {
        if (e.touches) {
            this.state.blockTouch = true;
        }
    }

    /** Chart content 'mousemove' event handler */
    onMouseMove(e) {
        if (this.state.blockTouch) {
            return;
        }

        const target = this.findItemByEvent(e);
        if (this.currentTarget?.item === target?.item) {
            return;
        }

        if (this.currentTarget?.item) {
            this.notifyEvent('onItemOut', { ...this.currentTarget, event: e });
        }

        this.currentTarget = target;

        if (this.state.activateOnHover) {
            this.activateTarget(target, e);
        }

        if (!target?.item) {
            return;
        }

        if (this.state.showPopupOnHover) {
            this.showPopup(target);
            // Hide popup if already pinned same item
            if (
                this.state.pinPopupOnClick
                && target.item === this.pinnedTarget
            ) {
                show(this.popup, false);
            }
        }

        this.notifyEvent('onItemOver', { ...target, event: e });
    }

    /** Chart content 'mouseleave' event handler */
    onMouseLeave(e) {
        if (this.state.activateOnHover) {
            this.deactivateTarget();
        }

        if (this.currentTarget?.item) {
            this.notifyEvent('onItemOut', { ...this.currentTarget, event: e });
        }

        this.currentTarget = null;
    }

    defaultPopupContent(target, state) {
        if (!target) {
            return null;
        }

        if (!this.popupContent) {
            const ChartPopup = this.getComponent('ChartPopup');
            this.popupContent = ChartPopup.create({
                ...state,
                target,
            });
        } else {
            this.popupContent.setState((popupState) => ({
                ...popupState,
                ...state,
                target,
            }));
        }

        return this.popupContent.elem;
    }

    renderPopupContent(target, state) {
        if (isFunction(this.props.renderPopup)) {
            return this.props.renderPopup(target, state);
        }

        return this.defaultPopupContent(target, state);
    }

    hidePopup() {
        show(this.popup, false);
        this.popupPosition?.reset();
        this.popupPosition = null;

        if (this.state.pinPopupOnClick) {
            show(this.pinnedPopup, false);
        }

        removeEmptyClick(this.emptyClickHandler);
    }

    showPopup(target) {
        if (!target?.item) {
            return;
        }

        removeEmptyClick(this.emptyClickHandler);
        if (!this.popup) {
            this.popup = createElement('div', { className: POPUP_CLASS });
            this.elem.append(this.popup);
        }

        this.popup.classList.toggle(ANIMATE_POPUP_CLASS, this.state.animatePopup);
        show(this.popup, true);

        this.elem.style.position = 'relative';

        const content = this.renderPopupContent(target, this.state);
        show(this.popup, (content !== null));
        if (content === null) {
            return;
        }

        this.popup.replaceChildren(...asArray(content));

        this.popupPosition?.reset();
        this.popupPosition = PopupPosition.create({
            elem: this.popup,
            refElem: target.item.elem,
            position: this.state.popupPosition,
            margin: 5,
            screenPadding: 5,
            useRefWidth: false,
            minRefHeight: 5,
            scrollOnOverflow: false,
            allowResize: true,
            allowFlip: true,
            allowChangeAxis: true,
        });

        setEmptyClick(this.emptyClickHandler, [
            target.item.elem,
            this.popup,
            this.pinnedPopup,
        ]);
    }

    /** Scale visible items of chart */
    scaleVisible(state = this.state) {
        if (!state.autoScale) {
            return;
        }

        const vItems = this.getVisibleItems(state);
        const values = this.mapValues(vItems);

        const newState = {
            ...state,
            grid: this.calculateGrid(values, state),
            animateNow: state.animate,
        };

        this.updateItemsScale(vItems, newState);
        this.setState(newState);
    }

    onAnimationDone() {
        if (this.state.animateNow) {
            this.setState({ ...this.state, animateNow: false });
        }
    }

    /** Chart content 'scroll' event handler */
    onScroll() {
        this.setState({
            ...this.state,
            animateNow: false,
            scrollLeft: this.chartScroller.scrollLeft,
            scrollWidth: this.chartScroller.scrollWidth,
        });

        if (this.scaleFunc) {
            this.scaleFunc();
        }

        if (this.scrollFunc) {
            this.scrollFunc();
        }

        if (this.state.showPopupOnClick || this.state.showPopupOnHover) {
            this.hidePopup();
        }

        this.notifyEvent('onScroll');
    }

    /** Chart scroller resize observer handler */
    onResize(lastHLabelOffset = 0) {
        this.contentOffset = getOffset(this.chartScroller);
        let newState = this.updateColumnWidth(this.state);

        // Update width of x axis labels
        newState.lastHLabelOffset = (!newState.fitToWidth)
            ? Math.ceil(lastHLabelOffset)
            : 0;

        newState = this.updateChartWidth(newState);

        this.setState({
            ...newState,
            animateNow: false,
            scrollLeft: this.chartScroller.scrollLeft,
            scrollWidth: this.chartScroller.scrollWidth,
        });

        if (this.scaleFunc) {
            this.scaleFunc();
        }

        if (this.scrollFunc) {
            this.scrollFunc();
        }

        this.notifyEvent('onResize');
    }

    /** Create items with default scale */
    createItems() {
    }

    /** Remove all items from chart */
    resetItems() {
        this.itemsGroup?.remove();
        this.itemsGroup = createSVGElement('g');
        this.content.append(this.itemsGroup);
        this.items = [];

        this.xAxisLabels?.elem?.remove();
        this.xAxisLabels = null;
    }

    /** Update vertical scale of items */
    updateItemsScale() {
    }

    isHorizontalScaleNeeded(state, prevState = {}) {
        return (
            state.data !== prevState?.data
            || state.columnWidth !== prevState?.columnWidth
            || state.groupsGap !== prevState?.groupsGap
            || state.fitToWidth !== prevState?.fitToWidth
            || state.alignColumns !== prevState?.alignColumns
        );
    }

    /** Update horizontal scale of items */
    updateHorizontalScale() {
    }

    defaultLegendContent(categories, state) {
        if (!Array.isArray(categories) || categories.length === 0) {
            return null;
        }

        const Legend = this.getComponent('Legend');
        const legend = Legend.create({
            ...state,
            categories,
        });

        return legend.elem;
    }

    getVisibleCategories(state) {
        const vItems = this.getVisibleItems(state);
        const categories = [];

        vItems.flat().forEach((item) => {
            const category = (state.data.stacked)
                ? (item.category ?? null)
                : (item.categoryIndex ?? item.columnIndex ?? null);

            if (!categories.includes(category)) {
                categories.push(category);
            }
        });

        return categories;
    }

    getAllCategories(state) {
        const categories = [];

        state.dataSets.forEach((dataSet, index) => {
            let category = (state.data.stacked)
                ? (dataSet.category ?? null)
                : index;

            const categoryIndex = categories.length;
            if (category === null && !categories.includes(categoryIndex)) {
                category = categoryIndex;
            }

            if (!categories.includes(category)) {
                categories.push(category);
            }
        });

        return categories;
    }

    renderLegend(state) {
        if (!state.showLegend) {
            this.legend?.remove();
            this.legend = null;
            return;
        }

        const categories = (state.onlyVisibleCategoriesLegend)
            ? this.getVisibleCategories(state)
            : this.getAllCategories(state);

        const legendContent = isFunction(state.renderLegend)
            ? state.renderLegend(categories, state)
            : this.defaultLegendContent(categories, state);

        if (!this.legend) {
            this.legend = createElement('div', {
                className: LEGEND_CLASS,
                children: asArray(legendContent),
            });

            this.elem.append(this.legend);
        } else {
            this.legend.replaceChildren(...asArray(legendContent));
        }
    }

    renderItems(state, prevState) {
        if (
            !this.isHorizontalScaleNeeded(state, prevState)
            && state.chartContentWidth === prevState.chartContentWidth
            && state.containerWidth === prevState.containerWidth
            && state.scrollLeft === prevState.scrollLeft
            && state.scrollWidth === prevState.scrollWidth
            && state.animateNow === prevState.animateNow
            && state.activeCategory === prevState.activeCategory
        ) {
            return;
        }

        if (state.data !== prevState.data) {
            this.resetItems();
        }

        this.createItems(state, prevState);
    }

    renderHorizontalLabels(state, prevState) {
        if (
            !this.isHorizontalScaleNeeded(state, prevState)
            && state.grid === prevState.grid
            && state.xAxis === prevState.xAxis
            && state.chartContentWidth === prevState.chartContentWidth
            && state.containerWidth === prevState.containerWidth
            && state.scrollLeft === prevState.scrollLeft
        ) {
            return;
        }

        if (!state.grid?.steps || state.xAxis === 'none') {
            this.xAxisLabels?.elem?.remove();
            this.xAxisLabels = null;
            return;
        }

        if (!this.xAxisLabels) {
            const XAxisLabels = this.getComponent('XAxisLabels');
            this.xAxisLabels = XAxisLabels.create({
                ...state,
                isHorizontalScaleNeeded: (...args) => this.isHorizontalScaleNeeded(...args),
                getGroupOuterWidth: (...args) => this.getGroupOuterWidth(...args),
                getFirstVisibleGroupIndex: (...args) => this.getFirstVisibleGroupIndex(...args),
                getVisibleGroupsCount: (...args) => this.getVisibleGroupsCount(...args),
                onResize: (...args) => this.onResize(...args),
            });
            this.chart.append(this.xAxisLabels.elem);
        } else {
            this.xAxisLabels.setState((labelsState) => ({
                ...labelsState,
                ...state,
            }));
        }
    }

    renderVerticalLabels(state, prevState) {
        if (
            state.grid === prevState.grid
            && state.yAxis === prevState.yAxis
            && state.containerWidth === prevState.containerWidth
            && state.yAxisLabelsAlign === prevState.yAxisLabelsAlign
        ) {
            return;
        }

        if (!state.grid?.steps || state.yAxis === 'none') {
            this.yAxisLabels?.elem?.remove();
            this.yAxisLabels = null;
            return;
        }

        if (!this.yAxisLabels) {
            const YAxisLabels = this.getComponent('YAxisLabels');
            this.yAxisLabels = YAxisLabels.create({
                ...state,
            });
            this.chartContainer.append(this.yAxisLabels.elem);
        }

        this.yAxisLabels.setState((labelsState) => ({
            ...labelsState,
            ...state,
        }));
    }

    renderGrid(state, prevState) {
        if (
            !this.isHorizontalScaleNeeded(state, prevState)
            && state.chartContentWidth === prevState.chartContentWidth
            && state.containerWidth === prevState.containerWidth
            && state.scrollLeft === prevState.scrollLeft
            && state.grid === prevState.grid
            && state.xAxis === prevState.xAxis
            && state.chartWidth === prevState.chartWidth
            && state.hLabelsHeight === prevState.hLabelsHeight
            && state.xAxisGrid === prevState.xAxisGrid
        ) {
            return;
        }

        if (!state.grid?.steps) {
            this.chartGrid?.elem?.remove();
            this.chartGrid = null;
            return;
        }

        if (!this.chartGrid) {
            const Grid = this.getComponent('Grid');
            this.chartGrid = Grid.create({
                ...state,
                getGroupOuterWidth: (...args) => this.getGroupOuterWidth(...args),
                getFirstVisibleGroupIndex: (...args) => this.getFirstVisibleGroupIndex(...args),
                getVisibleGroupsCount: (...args) => this.getVisibleGroupsCount(...args),
            });
            this.content.prepend(this.chartGrid.elem);
        } else {
            this.chartGrid.setState((gridState) => ({
                ...gridState,
                ...state,
            }));
        }
    }

    renderScroll(state, prevState) {
        if (state.scrollLeft === prevState?.scrollLeft) {
            return;
        }

        const { chartContentWidth, scrollerWidth, scrollLeft } = state;
        const maxScroll = Math.max(0, chartContentWidth - scrollerWidth);

        if (
            scrollLeft >= 0
            && scrollLeft <= maxScroll
        ) {
            this.chartScroller.scrollLeft = scrollLeft;
        }
    }

    render(state, prevState = {}) {
        const animated = state.autoScale && state.animate && state.animateNow;
        this.chartContainer.classList.toggle(ANIMATE_CLASS, animated);
        this.chartContainer.classList.toggle(STACKED_CLASS, state.data.stacked);

        this.chartContainer.classList.toggle(TOP_X_AXIS_CLASS, (state.xAxis === 'top'));
        this.chartContainer.classList.toggle(LEFT_Y_AXIS_CLASS, state.yAxis === 'left');

        this.renderScroll(state, prevState);

        this.renderVerticalLabels(state, prevState);
        this.renderItems(state, prevState);
        this.renderHorizontalLabels(state, prevState);

        if (this.isHorizontalScaleNeeded(state, prevState)) {
            this.updateHorizontalScale(state);
        }

        if (state.chartWidth !== prevState?.chartWidth) {
            this.content.setAttribute('width', state.chartWidth);
        }
        if (state.height !== prevState?.height) {
            this.content.setAttribute('height', state.height);
        }

        this.renderGrid(state, prevState);

        this.renderLegend(state, prevState);
    }
}
