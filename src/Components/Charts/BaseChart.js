import {
    ce,
    svg,
    setParam,
    isFunction,
    isObject,
    show,
    setEmptyClick,
    removeEmptyClick,
    getOffset,
    prependChild,
    removeChilds,
    px,
    throttle,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { ChartGrid } from './ChartGrid.js';
import '../../css/common.scss';
import './style.scss';

/* CSS classes */
const CHARTS_CLASS = 'charts';
const CONTAINER_CLASS = 'chart__container';
const SCROLLER_CLASS = 'chart__scroller';
const CONTENT_CLASS = 'chart__content';
const VLABELS_CLASS = 'chart__vert-labels';
const VLABELS_CONTAINER_CLASS = 'vertical-legend';
const POPUP_CLASS = 'chart__popup';
const POPUP_LIST_CLASS = 'chart__popup-list';
const ACTIVE_ITEM_CLASS = 'chart__item--active';
const ANIMATE_CLASS = 'chart--animated';

/** Default properties */
const defaultProps = {
    // Layout
    height: 300,
    barWidth: 38,
    barMargin: 10,
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
    showPopup: false,
    renderPopup: null,
    scrollThrottle: false,
    activateOnHover: false,
    // Callbacks
    onscroll: null,
    onitemclick: null,
    onitemover: null,
    onitemout: null,
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

        if (!this.elem
            || !this.props
            || !this.props.data
            || !this.props.data.values
            || !this.props.data.series) {
            throw new Error('Invalid chart properties');
        }

        this.chartContainer = null;
        this.chart = null;
        this.chartScroller = null;
        this.verticalLabels = null;
        this.content = null;
        this.labelsContainer = null;
        this.popup = null;
        this.items = [];
        this.grid = null;
        this.gridLines = [];
        this.vertLabels = [];

        if (!this.props.autoScale) {
            this.scaleFunc = null;
        } else if (this.props.scrollThrottle === false) {
            this.scaleFunc = () => this.scaleVisible();
        } else {
            this.scaleFunc = throttle(() => this.scaleVisible(), this.props.scrollThrottle);
        }

        this.emptyClickHandler = () => this.hidePopup();

        this.state = {
            barWidth: this.props.barWidth,
            barMargin: this.props.barMargin,
            chartContentWidth: 0,
            hLabelsHeight: 25,
            vLabelsWidth: 10,
            chartWidth: 0,
            chartHeight: 0,
            lastHLabelOffset: 0,
            data: this.props.data,
        };
        this.state.columnsCount = this.getColumnsCount();
    }

    get barOuterWidth() {
        return this.state.barWidth + this.state.barMargin;
    }

    /** Initialization of chart */
    init() {
        this.verticalLabels = ce('div');
        this.chart = ce('div');
        this.chartScroller = ce(
            'div',
            { className: SCROLLER_CLASS },
            this.chart,
            { scroll: this.onScroll.bind(this) },
        );

        this.chartContainer = ce('div', { className: CHARTS_CLASS }, [
            ce('div', { className: CONTAINER_CLASS }, this.chartScroller),
            ce('div', { className: VLABELS_CONTAINER_CLASS }, this.verticalLabels),
        ]);
        if (this.props.autoScale && this.props.animate) {
            this.chartContainer.classList.add(ANIMATE_CLASS);
        }

        this.elem.appendChild(this.chartContainer);

        const { height, marginTop } = this.props;
        this.state.chartHeight = height - this.state.hLabelsHeight - marginTop;

        this.labelsContainer = svg('svg', {
            class: VLABELS_CLASS,
            width: this.state.vLabelsWidth,
            height: height + 20,
        });
        this.verticalLabels.appendChild(this.labelsContainer);

        // create grid
        this.calculateGrid(this.state.data.values);

        this.state.chartContentWidth = this.state.columnsCount * this.barOuterWidth;
        this.state.chartWidth = Math.max(this.chart.offsetWidth, this.state.chartContentWidth);

        const events = {
            click: (e) => this.onClick(e),
        };
        if (
            this.props.activateOnHover
            || isFunction(this.props.onitemover)
            || isFunction(this.props.onitemout)
        ) {
            events.mousemove = (e) => this.onMouseMove(e);
            events.mouseleave = (e) => this.onMouseLeave(e);
        }

        this.content = svg(
            'svg',
            {
                class: CONTENT_CLASS,
                width: this.state.chartWidth,
                height: this.props.height,
            },
            null,
            events,
        );

        this.chart.appendChild(this.content);

        this.contentOffset = getOffset(this.content);

        this.drawVLabels();
        this.updateBarWidth();
        this.updateChartWidth();

        // create bars
        this.createItems();
        this.scaleVisible();

        // create horizontal labels
        this.createHLabels();
        this.updateChartWidth();

        this.drawGrid();

        if (this.props.scrollToEnd) {
            this.chartScroller.scrollLeft = this.chartScroller.scrollWidth;
        }
    }

    /** Returns count of data categories */
    getCategoriesCount() {
        const { values } = this.state.data;
        if (values.length === 0) {
            return 0;
        }

        const [firstItem] = values;
        if (isObject(firstItem)) {
            return values.length;
        }

        return 1;
    }

    /** Returns count of data columns */
    getColumnsCount() {
        const { values } = this.state.data;
        if (values.length === 0) {
            return 0;
        }

        const [firstItem] = values;
        if (isObject(firstItem)) {
            const valuesLength = values.map((item) => item.data.length);
            return Math.max(...valuesLength);
        }

        return values.length;
    }

    /** Returns array of data sets */
    getDataSets() {
        const { values } = this.state.data;
        if (values.length === 0) {
            return [];
        }

        const [firstItem] = values;
        if (isObject(firstItem)) {
            return values.map((item) => item.data);
        }

        return [values];
    }

    formatCoord(value, asPixels = false) {
        const fmt = value.toFixed(3);
        return (asPixels) ? `${fmt}px` : fmt;
    }

    /**
     * Calculate grid for specified set of values
     * @param {number[]} values
     */
    calculateGrid(values) {
        const grid = new ChartGrid({
            scaleAroundAxis: this.props.scaleAroundAxis,
            height: this.state.chartHeight,
            margin: this.props.marginTop,
            minStep: this.props.minGridStep,
            maxStep: this.props.maxGridStep,
            valuesMargin: this.props.gridValuesMargin,
        });

        grid.calculate(values);

        this.grid = grid;
    }

    /** Remove elements */
    removeElements(elem) {
        const elems = Array.isArray(elem) ? elem : [elem];

        elems.forEach((el) => el?.parentNode?.removeChild(el));
    }

    /** Draw grid and return array of grid lines */
    drawGrid() {
        const width = this.state.chartWidth;
        let step = 0;
        const lines = [];

        if (!this.grid.steps) {
            return;
        }

        let curY = this.grid.yFirst;
        while (step <= this.grid.steps) {
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

            lines.push(el);

            curY += this.grid.yStep;
            step += 1;
        }

        this.removeElements(this.gridLines);
        prependChild(this.content, lines);

        this.gridLines = lines;
    }

    /** Save total width of chart block with labels */
    getChartOffset(chartElem) {
        if (!chartElem
            || !chartElem.parentNode
            || !chartElem.parentNode.parentNode
            || !chartElem.parentNode.parentNode.parentNode) {
            return null;
        }

        return chartElem.parentNode.parentNode.parentNode.offsetWidth;
    }

    /** Return array of values */
    mapValues(items) {
        if (!items || !Array.isArray(items)) {
            return null;
        }

        return items.flat().map((item) => item.value);
    }

    /** Update width of chart block */
    updateChartWidth() {
        const contentWidth = Math.max(
            this.state.columnsCount * this.barOuterWidth,
            this.state.lastHLabelOffset,
        );

        this.state.chartContentWidth = contentWidth;
        const chartOffset = this.getChartOffset(this.chart);
        const paperWidth = Math.max(chartOffset - this.state.vLabelsWidth, contentWidth);

        this.content.setAttribute('width', paperWidth);
        this.content.setAttribute('height', this.props.height);

        this.state.chartWidth = Math.max(paperWidth, contentWidth);
    }

    /** Calculate width and margin of bar for fitToWidth option */
    updateBarWidth() {
        if (!this.props.fitToWidth) {
            return;
        }

        const valuesExtended = this.state.columnsCount + 1;
        this.state.barWidth = this.chart.parentNode.offsetWidth / valuesExtended;
        if (this.state.barWidth > 10) {
            this.state.barMargin = this.state.barWidth / 5;
            this.state.barWidth -= this.state.barMargin * 4;
        } else {
            this.state.barMargin = 0;
        }
    }

    /** Set new width for vertical labels block and SVG object */
    setVertLabelsWidth(width) {
        if (!this.labelsContainer || !this.chart) {
            return;
        }

        const lWidth = Math.ceil(width);
        if (this.state.vLabelsWidth === lWidth) {
            return;
        }

        this.labelsContainer.setAttribute('width', lWidth);
        this.labelsContainer.setAttribute('height', this.props.height + 20);
        this.state.vLabelsWidth = lWidth;

        this.updateChartWidth();
    }

    /** Return array of currently visible items */
    getVisibleItems() {
        const { barOuterWidth } = this;
        const res = [];
        const offs = this.props.visibilityOffset;

        let itemsOnWidth = Math.round(this.chartScroller.offsetWidth / barOuterWidth);
        itemsOnWidth = Math.min(this.items.length, itemsOnWidth + 2 * offs);

        let firstItem = Math.floor(this.chartScroller.scrollLeft / barOuterWidth);
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
    drawVLabels() {
        const xOffset = 5;
        const dyOffset = 5.5;
        let curY = this.grid.yFirst;
        let val = this.grid.valueFirst;
        let step = 0;
        let labelsWidth = 0;

        if (!this.grid.steps) {
            return;
        }

        this.removeElements(this.vertLabels);

        this.vertLabels = [];
        while (step <= this.grid.steps) {
            const isZero = Math.abs(this.grid.toPrec(val)) === 0;
            const tVal = (isZero) ? 0 : this.grid.toPrecString(val);

            const tspan = svg('tspan', { dy: dyOffset });
            const prop = ('innerHTML' in tspan) ? 'innerHTML' : 'textContent';
            tspan[prop] = tVal.toString();
            const el = svg('text', {
                className: 'chart__text',
                x: xOffset,
                y: Math.round(curY),
            }, tspan);

            this.labelsContainer.appendChild(el);
            this.vertLabels.push(el);

            const labelRect = el.getBoundingClientRect();
            labelsWidth = Math.max(labelsWidth, Math.ceil(labelRect.width) + 10);
            val -= this.grid.valueStep;
            curY += this.grid.yStep;
            step += 1;
        }

        this.setVertLabelsWidth(labelsWidth);
    }

    /** Create horizontal labels */
    createHLabels() {
        let labelShift = 0;
        let lastOffset = 0;
        const lblMarginLeft = 10;
        const dyOffset = 5.5;
        const lblY = this.props.height - (this.state.hLabelsHeight / 2);

        this.state.data.series.forEach((val) => {
            const [itemDate, itemsCount] = val;

            if (lastOffset === 0 || labelShift > lastOffset + lblMarginLeft) {
                const tspan = svg('tspan', { dy: dyOffset });
                const prop = ('innerHTML' in tspan) ? 'innerHTML' : 'textContent';
                tspan[prop] = itemDate.toString();
                const txtEl = svg('text', {
                    className: 'chart__text',
                    x: labelShift,
                    y: lblY,
                }, tspan);

                this.content.appendChild(txtEl);

                const labelRect = txtEl.getBoundingClientRect();
                const currentOffset = labelShift + Math.ceil(labelRect.width);

                // Check last label not overflow chart to prevent
                // horizontal scroll in fitToWidth mode
                if (this.props.fitToWidth && currentOffset > this.state.chartContentWidth) {
                    txtEl.remove();
                } else {
                    lastOffset = currentOffset;
                }
            }
            labelShift += itemsCount * this.barOuterWidth;
        });

        this.state.lastHLabelOffset = lastOffset;
    }

    /** Find item by event object */
    findItemByEvent(e) {
        const x = e.clientX - this.contentOffset.left + this.chartScroller.scrollLeft;
        const index = Math.floor(x / this.barOuterWidth);
        if (index < 0 || index >= this.items.length) {
            return { x, item: null, index: -1 };
        }

        const item = this.items[index];
        return { x, item, index };
    }

    /** Chart content 'click' event handler */
    onClick(e) {
        const target = this.findItemByEvent(e);
        if (!target.item) {
            return;
        }

        if (this.props.showPopup) {
            this.showPopup(target);
        }

        if (isFunction(this.props.onitemclick)) {
            this.props.onitemclick({ ...target, event: e });
        }
    }

    /** Chart content 'mousemove' event handler */
    onMouseMove(e) {
        const target = this.findItemByEvent(e);
        if (this.activeTarget?.item === target.item) {
            return;
        }
        if (this.activeTarget?.item && isFunction(this.props.onitemout)) {
            if (this.props.activateOnHover) {
                this.activeTarget.item.elem.classList.remove(ACTIVE_ITEM_CLASS);
            }
            this.props.onitemout({ ...this.activeTarget, event: e });
        }

        if (!target.item) {
            return;
        }

        this.activeTarget = target;
        if (this.props.activateOnHover) {
            target.item.elem.classList.add(ACTIVE_ITEM_CLASS);
        }

        if (isFunction(this.props.onitemover)) {
            this.props.onitemover({ ...target, event: e });
        }
    }

    /** Chart content 'mouseleave' event handler */
    onMouseLeave(e) {
        const target = this.activeTarget;
        this.activeTarget = null;
        if (!target) {
            return;
        }
        if (this.props.activateOnHover) {
            target.item.elem.classList.remove(ACTIVE_ITEM_CLASS);
        }

        if (isFunction(this.props.onitemout)) {
            this.props.onitemout({ ...target, event: e });
        }
    }

    defaultPopupContent(target) {
        if (!target.group) {
            return ce('span', { textContent: target.item.value });
        }

        return ce(
            'ul',
            { className: POPUP_LIST_CLASS },
            target.group.map((item) => ce('li', { textContent: item.value })),
        );
    }

    renderPopupContent(target) {
        if (isFunction(this.props.renderPopup)) {
            return this.props.renderPopup(target);
        }

        return this.defaultPopupContent(target);
    }

    hidePopup() {
        if (!this.popup) {
            return;
        }

        show(this.popup, false);

        removeEmptyClick(this.emptyClickHandler);
    }

    showPopup(target) {
        if (!target?.item) {
            return;
        }

        if (this.popup) {
            removeEmptyClick(this.emptyClickHandler);
        } else {
            this.popup = ce('div', { className: POPUP_CLASS });
            this.chartContainer.appendChild(this.popup);
        }

        show(this.popup, true);

        this.chartContainer.style.position = 'relative';

        const content = this.renderPopupContent(target);
        if (typeof content === 'string') {
            this.popup.textContent = content;
        } else {
            removeChilds(this.popup);
            this.popup.append(content);
        }

        const rectBBox = target.item.elem.getBBox();
        const chartsBRect = this.chartScroller.getBoundingClientRect();

        let popupX = rectBBox.x - this.chartScroller.scrollLeft
            + (rectBBox.width - this.popup.offsetWidth) / 2;
        const popupY = rectBBox.y - this.popup.offsetHeight - 10;

        if (popupX < 0) {
            popupX = 0;
        }
        if (this.popup.offsetWidth + popupX > chartsBRect.right) {
            popupX = chartsBRect.width - this.popup.offsetWidth;
        }

        setParam(this.popup.style, { left: px(popupX), top: px(popupY) });

        setEmptyClick(this.emptyClickHandler, [target.item.elem, this.popup]);
    }

    /** Scale visible items of chart */
    scaleVisible() {
        if (!this.props.autoScale) {
            return;
        }

        const vItems = this.getVisibleItems();
        const values = this.mapValues(vItems);

        this.calculateGrid(values);
        this.drawVLabels();
        this.drawGrid();

        this.updateItemsScale(vItems);
    }

    /** Chart content 'scroll' event handler */
    onScroll() {
        if (this.scaleFunc) {
            this.scaleFunc();
        }

        if (this.props.showPopup) {
            this.hidePopup();
        }

        if (isFunction(this.props.onscroll)) {
            this.props.onscroll.call(this);
        }
    }

    /** Create items with default scale */
    createItems() {
    }

    /** Update vertical scale of items */
    /* eslint-disable-next-line no-unused-vars */
    updateItemsScale(items) {
    }

    /** Update horizontal scale of items */
    updateItemsWidth() {
    }
}
