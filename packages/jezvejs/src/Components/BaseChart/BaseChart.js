import { isFunction, isObject } from '@jezvejs/types';
import {
    createSVGElement,
    show,
    getOffset,
    re,
    removeChilds,
    createElement,
    setAttributes,
} from '@jezvejs/dom';
import {
    debounce,
    minmax,
} from '../../js/common.js';
import { setEmptyClick, removeEmptyClick } from '../../js/emptyClick.js';
import { Component } from '../../js/Component.js';

import { PopupPosition } from '../PopupPosition/PopupPosition.js';
import { ChartGrid } from '../ChartGrid/ChartGrid.js';

import { defaultProps } from './defaultProps.js';
import '../../css/common.scss';
import './BaseChart.scss';

/* CSS classes */
const CHART_CLASS = 'chart';
const HORIZONTAL_CONTAINER_CLASS = 'chart__horizontal';
const STACKED_CLASS = 'chart_stacked';
const CONTAINER_CLASS = 'chart__container';
const SCROLLER_CLASS = 'chart__scroller';
const CONTENT_CLASS = 'chart__content';
/* x asix / horizontal labels */
const XAXIS_LABEL_CLASS = 'chart__text chart-xaxis__label';
/* y asix / vertical labels */
const VLABELS_CLASS = 'chart__vert-labels';
const VLABELS_CONTAINER_CLASS = 'vertical-legend';
const VLABELS_LEFT_CLASS = 'vertical-legend_left';
const ACTIVE_ITEM_CLASS = 'chart__item_active';
const ANIMATE_CLASS = 'chart_animated';
/* Popup */
const POPUP_CLASS = 'chart__popup';
const ANIMATE_POPUP_CLASS = 'chart__popup_animated';
const POPUP_LIST_CLASS = 'chart__popup-list';
/* Legend */
const LEGEND_CLASS = 'chart__legend';
const LEGEND_LIST_CLASS = 'chart__legend-list';
const LEGEND_LIST_ITEM_CLASS = 'chart__legend-list-item';

/**
 * Base chart class
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class BaseChart extends Component {
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.chartContainer = null;
        this.chart = null;
        this.chartScroller = null;
        this.verticalLabels = null;
        this.content = null;
        this.labelsContainer = null;
        this.legend = null;
        this.activeTarget = null;
        this.currentTarget = null;
        this.popup = null;
        this.pinnedPopup = null;
        this.pinnedTarget = null;
        this.items = [];
        this.itemsGroup = null;
        this.grid = null;
        this.gridGroup = null;
        this.vertLabelsGroup = null;
        this.labels = [];
        this.xAxisLabelsGroup = null;
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
            chartContentWidth: 0,
            lastHLabelOffset: 0,
            hLabelsHeight: 25,
            scrollerWidth: 0,
            containerWidth: 0,
            chartWidth: 0,
            chartHeight: 0,
            scrollLeft: 0,
            blockTouch: false,
            animateNow: false,
        };

        this.init();
        this.postInit();
        this.render(this.state);
        this.setData(this.props.data);
    }

    getGroupOuterWidth(state = this.state) {
        return state.columnWidth + state.groupsGap;
    }

    /** Initialization of chart */
    init() {
        this.verticalLabels = createElement('div');
        this.chart = createElement('div');
        this.chartScroller = createElement('div', {
            props: { className: SCROLLER_CLASS },
            children: this.chart,
            events: {
                scroll: {
                    listener: (e) => this.onScroll(e),
                    options: { passive: true },
                },
            },
        });

        this.chartContainer = createElement('div', {
            props: { className: HORIZONTAL_CONTAINER_CLASS },
            children: [
                createElement('div', {
                    props: { className: CONTAINER_CLASS },
                    children: this.chartScroller,
                }),
            ],
        });

        const { yAxis } = this.state;
        if (yAxis === 'left' || yAxis === 'right') {
            const yAxisLabelsContainer = createElement('div', {
                props: { className: VLABELS_CONTAINER_CLASS },
                children: this.verticalLabels,
            });

            yAxisLabelsContainer.classList.toggle(VLABELS_LEFT_CLASS, yAxis === 'left');

            this.chartContainer.append(yAxisLabelsContainer);
        } else if (yAxis !== 'none') {
            throw new Error('Invalid value of \'yAxis\' property');
        }

        this.elem = createElement('div', {
            props: { className: CHART_CLASS },
            children: this.chartContainer,
        });

        const { height, marginTop, xAxis } = this.state;
        this.state.chartHeight = height - marginTop;
        if (xAxis === 'top' || xAxis === 'bottom') {
            this.state.chartHeight -= this.state.hLabelsHeight;
        }

        this.labelsContainer = createSVGElement('svg', {
            attrs: {
                class: VLABELS_CLASS,
                width: 10,
                height: height + 20,
            },
        });
        this.verticalLabels.append(this.labelsContainer);

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
        const width = parseInt(value, 10);
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
        const gap = parseInt(value, 10);
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
            const category = item.category ?? null;
            return res.includes(category) ? res : [...res, category];
        }, []);
    }

    formatCoord(value, asPixels = false) {
        const fmt = parseFloat(parseFloat(value).toFixed(3)).toString();
        return (asPixels) ? `${fmt}px` : fmt;
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

    /** Draw grid and return array of grid lines */
    drawGrid(state) {
        const { grid, xAxis } = state;

        this.gridGroup?.remove();
        this.gridGroup = null;
        if (!grid?.steps) {
            return;
        }

        const width = state.chartWidth;

        const gridGroup = createSVGElement('g');
        let step = 0;
        let curY = grid.yFirst;
        if (xAxis === 'top') {
            curY += state.hLabelsHeight;
        }

        while (step <= grid.steps) {
            let rY = Math.round(curY);
            if (rY > curY) {
                rY -= 0.5;
            } else {
                rY += 0.5;
            }

            const linePath = `M0,${rY}L${width},${rY}`;
            const el = createSVGElement('path', {
                attrs: {
                    class: 'chart__grid-line',
                    d: linePath,
                },
            });

            gridGroup.append(el);

            curY += grid.yStep;
            step += 1;
        }

        this.content.prepend(gridGroup);
        this.gridGroup = gridGroup;
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

        const valuesExtended = state.groupsCount + 2;
        const newState = {
            ...state,
            columnWidth: Math.min(
                state.maxColumnWidth,
                this.chartScroller.offsetWidth / valuesExtended,
            ),
        };
        if (newState.columnWidth > 10) {
            newState.groupsGap = newState.columnWidth / 5;
            newState.columnWidth -= newState.groupsGap;
        } else {
            newState.groupsGap = 0;
        }

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

    /** Draw vertical labels */
    drawVLabels(state) {
        const { grid, xAxis, yAxis } = state;
        if (yAxis === 'none') {
            return;
        }

        this.vertLabelsGroup?.remove();
        this.vertLabelsGroup = null;
        if (!grid?.steps) {
            return;
        }

        const formatFunction = isFunction(state.renderYAxisLabel)
            ? state.renderYAxisLabel
            : (value) => value?.toString();
        const xOffset = 5;
        const dyOffset = 5.5;
        let curY = grid.yFirst;
        if (xAxis === 'top') {
            curY += state.hLabelsHeight;
        }

        let val = grid.valueFirst;
        let step = 0;

        this.vertLabelsGroup = createSVGElement('g');

        while (step <= grid.steps) {
            const isZero = Math.abs(grid.toPrec(val)) === 0;
            const tVal = (isZero) ? 0 : grid.toPrecString(val);

            const el = createSVGElement('text', {
                attrs: {
                    class: 'chart__text chart-yaxis__label',
                    x: xOffset,
                    y: Math.round(curY) + dyOffset,
                },
            });
            el.textContent = formatFunction(tVal);

            this.vertLabelsGroup.append(el);

            val -= grid.valueStep;
            curY += grid.yStep;
            step += 1;
        }

        this.labelsContainer.append(this.vertLabelsGroup);

        const labelRect = this.vertLabelsGroup.getBBox();
        const labelsWidth = Math.ceil(labelRect.width) + 10;

        this.labelsContainer.setAttribute('width', labelsWidth);
        this.labelsContainer.setAttribute('height', state.height + 20);
    }

    getXAxisLabelRenderer(state = this.state) {
        return isFunction(state.renderXAxisLabel)
            ? state.renderXAxisLabel
            : (value) => value?.toString();
    }

    /** Create horizontal labels */
    createHLabels(state, prevState) {
        const { xAxis } = state;
        if (xAxis === 'none') {
            return;
        }

        const dyOffset = 5.5;
        const lblY = (xAxis === 'top')
            ? (state.hLabelsHeight / 2)
            : (state.height - (state.hLabelsHeight / 2));

        const groupOuterWidth = this.getGroupOuterWidth(state);
        const firstGroupIndex = this.getFirstVisibleGroupIndex(state);
        const visibleGroups = this.getVisibleGroupsCount(firstGroupIndex, state);
        const formatFunction = this.getXAxisLabelRenderer(state);

        let prevValue = null;
        const labels = [];
        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;
            const value = state.data.series[groupIndex];
            if (typeof value === 'undefined') {
                break;
            }
            if (value === prevValue) {
                continue;
            }

            let label = this.labels.find((item) => item?.groupIndex === groupIndex);
            if (label) {
                label.reused = true;
            } else {
                label = {
                    reused: false,
                    groupIndex,
                    value,
                    formattedValue: formatFunction(value),
                    elem: createSVGElement('text', {
                        attrs: { class: XAXIS_LABEL_CLASS },
                    }),
                };

                label.elem.textContent = label.formattedValue;
                this.xAxisLabelsGroup.append(label.elem);
            }

            setAttributes(label.elem, {
                x: groupIndex * groupOuterWidth,
                y: lblY + dyOffset,
            });

            labels.push(label);

            prevValue = value;
        }

        requestAnimationFrame(() => {
            let lastOffset = 0;
            const lblMarginLeft = 10;
            const labelsToRemove = [];
            let prevLabel = null;
            const toLeft = (
                !this.isHorizontalScaleNeeded(state, prevState)
                && prevState.scrollLeft > 0
                && state.scrollLeft < prevState.scrollLeft
            );

            for (let ind = 0; ind < labels.length; ind += 1) {
                const index = (toLeft) ? (labels.length - ind - 1) : ind;
                const label = labels[index];
                const labelRect = label.elem.getBBox();
                const currentOffset = Math.ceil(labelRect.x + labelRect.width);

                const overflow = (toLeft)
                    ? (currentOffset + lblMarginLeft > lastOffset)
                    : (labelRect.x < lastOffset + lblMarginLeft);

                // Check current label not intersects previous one
                if (lastOffset > 0 && overflow) {
                    labelsToRemove.push((!prevLabel.reused && label.reused) ? prevLabel : label);
                    if (prevLabel?.reused || !label.reused) {
                        continue;
                    }
                }

                // Check last label not overflow chart to prevent
                // horizontal scroll in fitToWidth mode
                if (state.fitToWidth && currentOffset > state.chartContentWidth) {
                    labelsToRemove.push(label);
                    continue;
                }

                lastOffset = (toLeft) ? labelRect.x : currentOffset;
                prevLabel = label;
            }

            // Remove overflow labels
            for (let ind = 0; ind < labelsToRemove.length; ind += 1) {
                const label = labelsToRemove[ind];
                label.elem.remove();

                const labelsIndex = labels.indexOf(label);
                if (labelsIndex !== -1) {
                    labels.splice(labelsIndex, 1);
                }
            }

            // Remove labels not included to new state
            for (let ind = 0; ind < this.labels.length; ind += 1) {
                const label = this.labels[ind];
                if (!labels.includes(label)) {
                    label.elem.remove();
                }
            }

            this.labels = labels;
        });
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

    /** Find item by event object */
    findItemByEvent(e) {
        if (!this.contentOffset) {
            return { item: null, index: -1 };
        }

        const firstGroupIndex = this.getFirstVisibleGroupIndex();
        const groupOuterWidth = this.getGroupOuterWidth();

        const x = e.clientX - this.contentOffset.left + this.state.scrollLeft;
        const index = Math.floor(x / groupOuterWidth) - firstGroupIndex;
        if (index < 0 || index >= this.items.length) {
            return { x, item: null, index: -1 };
        }

        const item = this.items[index];
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

        const { showPopupOnClick, pinPopupOnClick } = this.state;
        if (showPopupOnClick) {
            // Reuse pinned popup in case there is no hover popup
            // Popup will be pinned again, so it's possible to animate position of element
            if (!this.popup && pinPopupOnClick && this.pinnedPopup) {
                this.popup = this.pinnedPopup;
            }

            this.showPopup(target);

            if (pinPopupOnClick) {
                if (this.pinnedPopup !== this.popup) {
                    re(this.pinnedPopup);
                }
                this.pinnedPopup = this.popup;
                this.pinnedTarget = target.item;
                this.popup = null;
            }
        }

        if (this.state.activateOnClick) {
            this.activateTarget(target, e);
        }

        if (isFunction(this.props.onItemClick)) {
            this.props.onItemClick({ ...target, event: e });
        }
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

        if (this.currentTarget?.item && isFunction(this.props.onItemOut)) {
            this.props.onItemOut({ ...this.currentTarget, event: e });
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

        if (isFunction(this.props.onItemOver)) {
            this.props.onItemOver({ ...target, event: e });
        }
    }

    /** Chart content 'mouseleave' event handler */
    onMouseLeave(e) {
        if (this.state.activateOnHover) {
            this.deactivateTarget();
        }

        if (this.currentTarget?.item && isFunction(this.props.onItemOut)) {
            this.props.onItemOut({ ...this.currentTarget, event: e });
        }

        this.currentTarget = null;
    }

    defaultPopupContent(target) {
        if (!target.group) {
            return createElement('span', { props: { textContent: target.item.value } });
        }

        return createElement('ul', {
            props: { className: POPUP_LIST_CLASS },
            children: target.group.map((item) => createElement('li', {
                props: { textContent: item.value },
            })),
        });
    }

    renderPopupContent(target) {
        if (isFunction(this.props.renderPopup)) {
            return this.props.renderPopup(target);
        }

        return this.defaultPopupContent(target);
    }

    hidePopup() {
        show(this.popup, false);
        PopupPosition.reset(this.popup);

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
            this.popup = createElement('div', { props: { className: POPUP_CLASS } });
            this.chartContainer.append(this.popup);
        }

        this.popup.classList.toggle(ANIMATE_POPUP_CLASS, this.state.animatePopup);
        show(this.popup, true);

        this.chartContainer.style.position = 'relative';

        const content = this.renderPopupContent(target);
        show(this.popup, (content !== null));
        if (content === null) {
            return;
        }

        if (typeof content === 'string') {
            this.popup.textContent = content;
        } else {
            removeChilds(this.popup);
            this.popup.append(content);
        }

        PopupPosition.calculate({
            elem: this.popup,
            refElem: target.item.elem,
            margin: 5,
            screenPadding: 5,
            useRefWidth: false,
            minRefHeight: 5,
            scrollOnOverflow: true,
            allowResize: true,
            allowFlip: true,
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

        if (isFunction(this.props.onScroll)) {
            this.props.onScroll();
        }
    }

    /** Chart scroller resize observer handler */
    onResize() {
        this.contentOffset = getOffset(this.chartScroller);
        let newState = this.updateColumnWidth(this.state);

        // Update width of x axis labels
        const labelsBox = this.xAxisLabelsGroup?.getBBox();
        newState.lastHLabelOffset = (labelsBox && !newState.fitToWidth)
            ? Math.round(labelsBox.x + labelsBox.width)
            : 0;

        newState = this.updateChartWidth(newState);

        this.setState({
            ...newState,
            animateNow: false,
            scrollLeft: this.chartScroller.scrollLeft,
        });

        if (this.scaleFunc) {
            this.scaleFunc();
        }

        if (this.scrollFunc) {
            this.scrollFunc();
        }
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

        this.xAxisLabelsGroup?.remove();
        this.xAxisLabelsGroup = createSVGElement('g');
        this.content.append(this.xAxisLabelsGroup);
        this.labels = [];
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
        );
    }

    /** Update horizontal scale of items */
    updateHorizontalScale() {
    }

    defaultLegendContent(categories) {
        if (!Array.isArray(categories) || categories.length === 0) {
            return null;
        }

        return createElement('ul', {
            props: { className: LEGEND_LIST_CLASS },
            children: categories.map((category) => createElement('li', {
                props: {
                    className: LEGEND_LIST_ITEM_CLASS,
                    textContent: category.toString(),
                },
            })),
        });
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
            const category = (state.data.stacked)
                ? (dataSet.category ?? null)
                : index;
            if (!categories.includes(category)) {
                categories.push(category);
            }
        });

        return categories;
    }

    renderLegend(state) {
        re(this.legend);
        if (!state.showLegend) {
            this.legend = null;
            return;
        }

        const categories = (state.onlyVisibleCategoriesLegend)
            ? this.getVisibleCategories(state)
            : this.getAllCategories(state);

        const legendContent = isFunction(state.renderLegend)
            ? state.renderLegend(categories)
            : this.defaultLegendContent(categories);

        this.legend = createElement('div', {
            props: { className: LEGEND_CLASS },
            children: legendContent,
        });

        this.elem.append(this.legend);
    }

    renderItems(state, prevState) {
        if (
            !this.isHorizontalScaleNeeded(state, prevState)
            && state.chartContentWidth === prevState.chartContentWidth
            && state.containerWidth === prevState.containerWidth
            && state.scrollLeft === prevState.scrollLeft
            && state.animateNow === prevState.animateNow
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
            && state.chartContentWidth === prevState.chartContentWidth
            && state.containerWidth === prevState.containerWidth
            && state.scrollLeft === prevState.scrollLeft
        ) {
            return;
        }

        this.createHLabels(state, prevState);
    }

    render(state, prevState = {}) {
        const animated = state.autoScale && state.animate && state.animateNow;
        this.chartContainer.classList.toggle(ANIMATE_CLASS, animated);
        this.chartContainer.classList.toggle(STACKED_CLASS, state.data.stacked);

        this.drawVLabels(state);
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

        this.drawGrid(state);

        this.renderLegend(state);
    }
}
