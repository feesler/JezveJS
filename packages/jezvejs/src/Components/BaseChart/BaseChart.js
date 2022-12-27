import {
    svg,
    isFunction,
    isObject,
    show,
    setEmptyClick,
    removeEmptyClick,
    getOffset,
    re,
    removeChilds,
    px,
    createElement,
    debounce,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { ChartGrid } from '../ChartGrid/ChartGrid.js';
import '../../css/common.scss';
import './style.scss';

/* CSS classes */
const CHART_CLASS = 'chart';
const HORIZONTAL_CONTAINER_CLASS = 'chart__horizontal';
const STACKED_CLASS = 'chart_stacked';
const CONTAINER_CLASS = 'chart__container';
const SCROLLER_CLASS = 'chart__scroller';
const CONTENT_CLASS = 'chart__content';
const VLABELS_CLASS = 'chart__vert-labels';
const VLABELS_CONTAINER_CLASS = 'vertical-legend';
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

/** Default properties */
const defaultProps = {
    // Layout
    height: 300,
    columnWidth: 38,
    groupsGap: 10,
    marginTop: 10,
    // Grid behavior
    visibilityOffset: 1,
    scaleAroundAxis: true,
    gridValuesMargin: 0.1,
    minGridStep: 30,
    maxGridStep: 60,
    // Render properties
    fitToWidth: false,
    scrollToEnd: false,
    autoScale: false,
    animate: false,
    autoScaleTimeout: 200,
    resizeTimeout: 200,
    activateOnHover: false,
    renderYAxisLabel: null,
    showLegend: false,
    renderLegend: null,
    // Popup
    showPopup: false,
    pinPopupOnClick: false,
    showPopupOnHover: false,
    animatePopup: false,
    renderPopup: null,
    // Callbacks
    onscroll: null,
    onitemclick: null,
    onitemover: null,
    onitemout: null,
    // Data
    data: {
        values: [],
        series: [],
        stacked: false,
    },
};

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
        this.popup = null;
        this.pinnedPopup = null;
        this.pinnedTarget = null;
        this.items = [];
        this.itemsGroup = null;
        this.grid = null;
        this.gridGroup = null;
        this.vertLabelsGroup = null;
        this.xAxisLabelsGroup = null;
        this.scrollRequested = false;

        if (!this.props.autoScale) {
            this.scaleFunc = null;
        } else if (this.props.autoScaleTimeout === false) {
            this.scaleFunc = () => this.scaleVisible();
        } else {
            this.scaleFunc = debounce(() => this.scaleVisible(), this.props.autoScaleTimeout);
        }

        this.emptyClickHandler = () => this.hidePopup();

        this.state = {
            ...this.props,
            data: null,
            chartContentWidth: 0,
            hLabelsHeight: 25,
            scrollerWidth: 0,
            chartWidth: 0,
            chartHeight: 0,
            scrollLeft: 0,
            blockTouch: false,
        };
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
        });
        this.chartScroller.addEventListener('scroll', (e) => this.onScroll(e), { passive: true });

        this.chartContainer = createElement('div', {
            props: { className: HORIZONTAL_CONTAINER_CLASS },
            children: [
                createElement('div', {
                    props: { className: CONTAINER_CLASS },
                    children: this.chartScroller,
                }),
                createElement('div', {
                    props: { className: VLABELS_CONTAINER_CLASS },
                    children: this.verticalLabels,
                }),
            ],
        });

        this.elem = createElement('div', {
            props: { className: CHART_CLASS },
            children: this.chartContainer,
        });

        const { height, marginTop } = this.state;
        this.state.chartHeight = height - this.state.hLabelsHeight - marginTop;

        this.labelsContainer = svg('svg', {
            class: VLABELS_CLASS,
            width: 10,
            height: height + 20,
        });
        this.verticalLabels.append(this.labelsContainer);

        // Create main chart content
        const events = {
            click: (e) => this.onClick(e),
        };
        if (
            this.props.activateOnHover
            || this.props.showPopupOnHover
            || isFunction(this.props.onitemover)
            || isFunction(this.props.onitemout)
        ) {
            events.touchstart = (e) => this.onTouchStart(e);
            events.mousemove = (e) => this.onMouseMove(e);
            events.mouseleave = (e) => this.onMouseLeave(e);
        }

        this.content = svg('svg', { class: CONTENT_CLASS }, null, events);
        this.chart.append(this.content);

        this.contentOffset = getOffset(this.content);

        this.setClassNames();
        this.observeSize();
        this.setData(this.props.data);
    }

    observeSize() {
        const handler = debounce(() => {
            let newState = this.updateColumnWidth(this.state);
            newState = this.updateChartWidth(newState);
            this.setState(newState);
        }, this.props.resizeTimeout);

        const observer = new ResizeObserver(handler);
        observer.observe(this.chartScroller);
    }

    setData(data) {
        if (!data?.values || !data?.series) {
            throw new Error('Invalid data');
        }
        if (this.state.data === data) {
            return;
        }

        const state = {
            ...this.state,
            data: {
                ...defaultProps.data,
                ...data,
            },
        };

        state.dataSets = this.getDataSets(state);
        state.seriesMap = this.getSeriesMap(state);
        state.groupsCount = this.getGroupsCount(state);
        state.columnsInGroup = this.getColumnsInGroupCount(state);
        state.grid = this.calculateGrid(data.values, state);

        let newState = this.updateColumnWidth(state);
        newState = this.updateChartWidth(newState);
        this.setState(newState);

        if (this.props.scrollToEnd) {
            this.scrollRequested = true;
            this.scrollToRight();
        }
    }

    scrollToRight() {
        this.chartScroller.scrollLeft = this.chartScroller.scrollWidth;
    }

    setColumnWidth(value) {
        const width = parseInt(value, 10);
        if (Number.isNaN(width) || width < 1 || this.state.columnWidth === width) {
            return;
        }

        const state = {
            ...this.state,
            columnWidth: width,
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
        const valuesLength = state.dataSets.map((item) => item.data.length);
        return Math.max(...valuesLength);
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

    /** Return array to map group index to series index */
    getSeriesMap(state = this.state) {
        if (!Array.isArray(state?.data?.series)) {
            return [];
        }

        return state.data.series.flatMap(([, count], index) => (
            Array(count).fill(index)
        ));
    }

    /** Returns longest data set */
    getLongestDataSet(state = this.state) {
        const resIndex = state.dataSets.reduce((res, item, index) => (
            (state.dataSets[res].data.length < item.data.length) ? index : res
        ), 0);

        return state.dataSets[resIndex].data;
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
        const fmt = value.toFixed(3);
        return (asPixels) ? `${fmt}px` : fmt;
    }

    /**
     * Calculate grid for specified set of values
     * @param {number[]} values
     */
    calculateGrid(values, state = this.state) {
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

        return grid;
    }

    /** Draw grid and return array of grid lines */
    drawGrid(state) {
        const { grid } = state;

        this.gridGroup?.remove();
        this.gridGroup = null;
        if (!grid.steps) {
            return;
        }

        const width = state.chartWidth;

        const gridGroup = svg('g');
        let step = 0;
        let curY = grid.yFirst;
        while (step <= grid.steps) {
            let rY = Math.round(curY);
            if (rY > curY) {
                rY -= 0.5;
            } else {
                rY += 0.5;
            }

            const linePath = `M0,${rY}L${width},${rY}`;
            const el = svg('path', {
                class: 'chart__grid-line',
                d: linePath,
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
        const labelsBox = this.xAxisLabelsGroup?.getBBox();
        const lastHLabelOffset = (labelsBox)
            ? (labelsBox.x + labelsBox.width)
            : 0;

        const contentWidth = Math.max(
            state.groupsCount * this.getGroupOuterWidth(state),
            lastHLabelOffset,
        );

        const newState = {
            ...state,
            chartContentWidth: contentWidth,
        };

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
            columnWidth: this.chart.parentNode.offsetWidth / valuesExtended,
        };
        if (newState.columnWidth > 10) {
            newState.groupsGap = newState.columnWidth / 5;
            newState.columnWidth -= newState.groupsGap;
        } else {
            newState.groupsGap = 0;
        }

        return newState;
    }

    /** Return array of currently visible items */
    getVisibleItems(state = this.state) {
        const groupWidth = this.getGroupOuterWidth(state);
        const res = [];
        const offs = state.visibilityOffset;

        let itemsOnWidth = Math.round(state.scrollerWidth / groupWidth);
        itemsOnWidth = Math.min(this.items.length, itemsOnWidth + 2 * offs);

        let firstItem = Math.round(state.scrollLeft / groupWidth);
        firstItem = Math.max(0, firstItem - offs);

        if (firstItem + itemsOnWidth >= this.items.length) {
            itemsOnWidth = this.items.length - firstItem;
        }

        for (let i = 0; i < itemsOnWidth; i += 1) {
            res.push(this.items[firstItem + i]);
        }

        return res;
    }

    /** Draw vertical labels */
    drawVLabels(state) {
        const { grid } = state;
        this.vertLabelsGroup?.remove();
        this.vertLabelsGroup = null;
        if (!grid.steps) {
            return;
        }

        const formatFunction = isFunction(state.renderYAxisLabel)
            ? state.renderYAxisLabel
            : (value) => value.toString();
        const xOffset = 5;
        const dyOffset = 5.5;
        let curY = grid.yFirst;
        let val = grid.valueFirst;
        let step = 0;

        this.vertLabelsGroup = svg('g');

        while (step <= grid.steps) {
            const isZero = Math.abs(grid.toPrec(val)) === 0;
            const tVal = (isZero) ? 0 : grid.toPrecString(val);

            const el = svg('text', {
                className: 'chart__text',
                x: xOffset,
                y: Math.round(curY) + dyOffset,
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

    /** Create horizontal labels */
    createHLabels(state) {
        let labelShift = 0;
        let lastOffset = 0;
        const lblMarginLeft = 10;
        const dyOffset = 5.5;
        const lblY = state.height - (state.hLabelsHeight / 2);

        const groupOuterWidth = this.getGroupOuterWidth(state);

        this.xAxisLabelsGroup?.remove();
        this.xAxisLabelsGroup = svg('g');

        const labels = [];
        for (let i = 0; i < state.data.series.length; i += 1) {
            const [itemDate, itemsCount] = state.data.series[i];
            const txtEl = svg('text', {
                class: 'chart__text',
                x: labelShift,
                y: lblY + dyOffset,
            });
            txtEl.textContent = itemDate.toString();

            this.xAxisLabelsGroup.append(txtEl);
            labels.push(txtEl);

            labelShift += itemsCount * groupOuterWidth;
        }
        this.content.append(this.xAxisLabelsGroup);

        const labelsToRemove = [];
        requestAnimationFrame(() => {
            for (let ind = 0; ind < labels.length; ind += 1) {
                const labelElem = labels[ind];

                const labelRect = labelElem.getBBox();
                const currentOffset = Math.ceil(labelRect.x + labelRect.width);

                // Check last label not overflow chart to prevent
                // horizontal scroll in fitToWidth mode
                if (
                    (lastOffset > 0 && labelRect.x < lastOffset + lblMarginLeft)
                    || (state.fitToWidth && currentOffset > state.chartContentWidth)
                ) {
                    labelsToRemove.push(labelElem);
                } else {
                    lastOffset = currentOffset;
                }
            }

            for (let ind = 0; ind < labelsToRemove.length; ind += 1) {
                const labelElem = labelsToRemove[ind];
                labelElem.remove();
            }
        });
    }

    /** Returns series value for specified items group */
    getSeriesByIndex(index, state = this.state) {
        if (index === -1) {
            return null;
        }
        const { seriesMap } = state;
        if (!seriesMap || seriesMap.length === 0) {
            return null;
        }

        const ind = Math.max(0, Math.min(index, state.seriesMap.length - 1));
        const seriesIndex = state.seriesMap[ind];
        const [value] = state.data.series[seriesIndex];
        return value;
    }

    /** Find item by event object */
    findItemByEvent(e) {
        const x = e.clientX - this.contentOffset.left + this.state.scrollLeft;
        const index = Math.floor(x / this.getGroupOuterWidth());
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

        const { showPopup, pinPopupOnClick } = this.state;
        if (showPopup) {
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

        this.activateTarget(target, e);

        if (isFunction(this.props.onitemclick)) {
            this.props.onitemclick({ ...target, event: e });
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

        const { activateOnHover, showPopupOnHover, pinPopupOnClick } = this.state;

        if (activateOnHover) {
            target.item.elem.classList.add(ACTIVE_ITEM_CLASS);
        }

        if (showPopupOnHover) {
            this.showPopup(target);
            // Hide popup if already pinned same item
            if (
                pinPopupOnClick
                && target.item === this.pinnedTarget
            ) {
                show(this.popup, false);
            }
        }

        if (isFunction(this.props.onitemover)) {
            this.props.onitemover({ ...target, event: e });
        }
    }

    /** Deactivates specified target */
    deactivateTarget(e) {
        const target = this.activeTarget;
        this.activeTarget = null;
        if (!target?.item) {
            return;
        }

        if (this.state.activateOnHover) {
            target.item.elem.classList.remove(ACTIVE_ITEM_CLASS);
        }
        if (isFunction(this.props.onitemout)) {
            this.props.onitemout({ ...target, event: e });
        }
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
        this.activateTarget(target, e);
    }

    /** Chart content 'mouseleave' event handler */
    onMouseLeave(e) {
        this.deactivateTarget(e);
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

        const itemBBox = this.getItemBBox(target.item);
        const chartsBRect = this.chartScroller.getBoundingClientRect();

        let popupX = itemBBox.x - this.chartScroller.scrollLeft
            + (itemBBox.width - this.popup.offsetWidth) / 2;
        let popupY = itemBBox.y - this.popup.offsetHeight - 10;

        const viewportPopupY = chartsBRect.top + popupY;
        if (viewportPopupY < 0) {
            popupY -= viewportPopupY;
        }

        if (popupX < 0) {
            popupX = 0;
        }
        if (this.popup.offsetWidth + popupX > chartsBRect.right) {
            popupX = chartsBRect.width - this.popup.offsetWidth;
        }

        this.popup.style.left = px(popupX);
        this.popup.style.top = px(popupY);

        setEmptyClick(this.emptyClickHandler, [
            target.item.elem,
            this.popup,
            this.pinnedPopup,
        ]);
    }

    /** Scale visible items of chart */
    scaleVisible(state = this.state) {
        if (this.scrollRequested) {
            this.scrollToRight();
            this.scrollRequested = false;
            return;
        }

        if (!state.autoScale) {
            return;
        }

        const vItems = this.getVisibleItems(state);
        const values = this.mapValues(vItems);

        const newState = {
            ...state,
            grid: this.calculateGrid(values, state),
        };

        this.updateItemsScale(vItems, newState);
        this.setState(newState);
    }

    /** Chart content 'scroll' event handler */
    onScroll() {
        this.state.scrollLeft = this.chartScroller.scrollLeft;

        if (this.scaleFunc) {
            this.scaleFunc();
        }

        if (this.state.showPopup) {
            this.hidePopup();
        }

        if (isFunction(this.props.onscroll)) {
            this.props.onscroll.call(this);
        }
    }

    /** Create items with default scale */
    createItems() {
    }

    /** Remove all items from chart */
    resetItems() {
        this.itemsGroup?.remove();
        this.itemsGroup = svg('g');
        this.content.append(this.itemsGroup);
        this.items = [];
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

    renderLegend(state) {
        re(this.legend);
        if (!state.showLegend) {
            this.legend = null;
            return;
        }

        const categories = [];
        state.dataSets.forEach((dataSet, index) => {
            const category = (state.data.stacked && dataSet.category)
                ? dataSet.category
                : index;
            if (!categories.includes(category)) {
                categories.push(category);
            }
        });

        const legendContent = isFunction(state.renderLegend)
            ? state.renderLegend(categories)
            : this.defaultLegendContent(categories);

        this.legend = createElement('div', {
            props: { className: LEGEND_CLASS },
            children: legendContent,
        });

        this.elem.append(this.legend);
    }

    render(state, prevState = {}) {
        const animated = state.autoScale && state.animate;
        this.chartContainer.classList.toggle(ANIMATE_CLASS, animated);
        this.chartContainer.classList.toggle(STACKED_CLASS, state.data.stacked);

        this.drawVLabels(state);

        if (state.data !== prevState?.data) {
            this.resetItems();
            this.createItems(state);
        }

        // create horizontal labels
        if (state.data !== prevState?.data) {
            this.createHLabels(state);
        }

        if (this.isHorizontalScaleNeeded(state, prevState)) {
            this.updateHorizontalScale(state);
        }

        this.content.setAttribute('width', state.chartWidth);
        this.content.setAttribute('height', state.height);

        this.drawGrid(state);

        this.renderLegend(state);
    }
}
