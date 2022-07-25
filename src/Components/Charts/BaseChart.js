import {
    ce,
    svg,
    isFunction,
    getOffset,
    prependChild,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { ChartGrid } from './ChartGrid.js';
import '../../css/common.css';
import './charts.css';

/**
 * Base chart class
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class BaseChart extends Component {
    constructor(props) {
        super(props);

        if (!this.elem
            || !this.props
            || !this.props.data
            || !this.props.data.values
            || !this.props.data.series) {
            throw new Error('Invalid chart properties');
        }

        this.chartsWrapObj = null;
        this.chart = null;
        this.chartContent = null;
        this.verticalLabels = null;
        this.container = null;
        this.labelsContainer = null;
        this.paperHeight = 300;
        this.hLabelsHeight = 25;
        this.vLabelsWidth = 10;
        this.chartMarginTop = 10;
        this.barMargin = 10;
        this.barWidth = 0;
        this.chartWidth = 0;
        this.chartHeight = 0;
        this.lastHLabelOffset = 0;
        this.chartContentWidth = 0;
        this.gridValuesMargin = 0.1;
        this.minGridStep = 30;
        this.maxGridStep = 60;
        if (!('visibilityOffset' in this)) {
            this.visibilityOffset = 1;
        }
        if (!('scaleAroundAxis' in this)) {
            this.scaleAroundAxis = true;
        }
        this.data = {};
        this.items = [];
        this.grid = null;
        this.gridLines = [];
        this.vertLabels = [];
        this.fitToWidth = false;
        this.autoScale = false;
        this.itemClickHandler = null;
        this.scrollHandler = null;
        this.itemOverHandler = null;
        this.itemOutHandler = null;

        this.data = this.props.data;

        if ('widthFit' in this.props) {
            this.fitToWidth = this.props.widthFit;
        }
        if ('autoScale' in this.props) {
            this.autoScale = this.props.autoScale;
        }
        if ('height' in this.props) {
            this.paperHeight = parseInt(this.props.height, 10);
        }

        this.scrollHandler = isFunction(this.props.onscroll) ? this.props.onscroll : null;
        this.itemClickHandler = isFunction(this.props.onitemclick) ? this.props.onitemclick : null;
        this.itemOverHandler = isFunction(this.props.onitemover) ? this.props.onitemover : null;
        this.itemOutHandler = isFunction(this.props.onitemout) ? this.props.onitemout : null;
    }

    /** Initialization of chart */
    init() {
        this.verticalLabels = ce('div');
        this.chart = ce('div');
        this.chartContent = ce(
            'div',
            { className: 'chart_content' },
            this.chart,
            { scroll: this.onScroll.bind(this) },
        );

        this.chartsWrapObj = ce('div', { className: 'charts' }, [
            ce('div', { className: 'chart_wrap' }, this.chartContent),
            ce('div', { className: 'vertical-legend' }, this.verticalLabels),
        ]);
        this.elem.appendChild(this.chartsWrapObj);

        this.chartHeight = this.paperHeight - this.hLabelsHeight - this.chartMarginTop;
        this.barWidth = 38;

        this.labelsContainer = svg('svg', { width: this.vLabelsWidth, height: this.paperHeight + 20 });
        this.verticalLabels.appendChild(this.labelsContainer);

        // create grid
        this.calculateGrid(this.data.values);

        if (this.fitToWidth) {
            this.barWidth = (this.chart.parentNode.offsetWidth / (this.data.values.length + 1));
            if (this.barWidth > 10) {
                this.barMargin = this.barWidth / 5;
                this.barWidth -= this.barMargin * 4;
            } else {
                this.barMargin = 0;
            }
        }

        this.chartContentWidth = (this.data.values.length) * (this.barWidth + this.barMargin);
        this.chartWidth = Math.max(this.chart.offsetWidth, this.chartContentWidth);

        const events = {};
        if (isFunction(this.itemOverHandler) || isFunction(this.itemOutHandler)) {
            events.mousemove = this.onItemOver.bind(this);
            events.mouseout = this.onItemOut.bind(this);
        }
        if (isFunction(this.itemClickHandler)) {
            events.click = this.onItemClick.bind(this);
        }

        this.container = svg(
            'svg',
            { width: this.chartWidth, height: this.paperHeight },
            null,
            events,
        );

        this.chart.appendChild(this.container);

        this.containerOffset = getOffset(this.container);

        this.drawVLabels();

        // create bars
        this.createItems();
        this.scaleVisible();

        // create horizontal labels
        this.createHLabels();
        this.updateChartWidth();

        this.drawGrid();
    }

    /** Return charts content elemtnt */
    getContent() {
        return this.chartContent;
    }

    /** Return charts wrap element */
    getWrapObject() {
        return this.chartsWrapObj;
    }

    /**
     * Calculate grid for specified set of values
     * @param {number[]} values
     */
    calculateGrid(values) {
        const grid = new ChartGrid({
            scaleAroundAxis: this.scaleAroundAxis,
            height: this.chartHeight,
            margin: this.chartMarginTop,
            minStep: this.minGridStep,
            maxStep: this.maxGridStep,
            valuesMargin: this.gridValuesMargin,
        });

        grid.calculate(values);

        this.grid = grid;
    }

    /** Remove elements */
    removeElements(elem) {
        const elems = Array.isArray(elem) ? elem : [elem];

        elems.forEach((el) => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }

    /** Draw grid and return array of grid lines */
    drawGrid() {
        const width = this.chartWidth;
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
        prependChild(this.container, lines);

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

        return items.map((item) => item.value);
    }

    /** Update width of chart block */
    updateChartWidth() {
        this.chartContentWidth = (this.data.values.length) * (this.barWidth + this.barMargin);
        this.chartContentWidth = Math.max(this.chartContentWidth, this.lastHLabelOffset);

        const chartOffset = this.getChartOffset(this.chart);
        const paperWidth = Math.max(chartOffset - this.vLabelsWidth, this.chartContentWidth);

        this.container.setAttribute('width', paperWidth);
        this.container.setAttribute('height', this.paperHeight);

        this.chartWidth = Math.max(paperWidth, this.chartContentWidth);
    }

    /** Set new width for vertical labels block and SVG object */
    setVertLabelsWidth(width) {
        if (!this.labelsContainer || !this.chart) {
            return;
        }

        const lWidth = Math.ceil(width);
        if (this.vLabelsWidth === lWidth) {
            return;
        }

        this.labelsContainer.setAttribute('width', lWidth);
        this.labelsContainer.setAttribute('height', this.paperHeight + 20);
        this.vLabelsWidth = lWidth;

        this.updateChartWidth();
    }

    /** Return array of currently visible items */
    getVisibleItems() {
        const res = [];
        const offs = this.visibilityOffset;

        const itemOutWidth = this.barWidth + this.barMargin;
        let itemsOnWidth = Math.round(this.chartContent.offsetWidth / itemOutWidth);
        itemsOnWidth = Math.min(this.items.length, itemsOnWidth + 2 * offs);

        let firstItem = Math.floor(this.chartContent.scrollLeft / itemOutWidth);
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
        const lblY = this.paperHeight - (this.hLabelsHeight / 2);

        this.data.series.forEach(function (val) {
            const itemDate = val[0];
            const itemsCount = val[1];

            if (lastOffset === 0 || labelShift > lastOffset + lblMarginLeft) {
                const tspan = svg('tspan', { dy: dyOffset });
                const prop = ('innerHTML' in tspan) ? 'innerHTML' : 'textContent';
                tspan[prop] = itemDate.toString();
                const txtEl = svg('text', {
                    className: 'chart__text',
                    x: labelShift,
                    y: lblY,
                }, tspan);

                this.container.appendChild(txtEl);

                const labelRect = txtEl.getBoundingClientRect();
                lastOffset = labelShift + Math.ceil(labelRect.width);
            }
            labelShift += itemsCount * (this.barWidth + this.barMargin);
        }, this);

        this.lastHLabelOffset = lastOffset;
    }

    /** Find item by event object */
    findItemByEvent(e) {
        const x = e.clientX - this.containerOffset.left + this.chartContent.scrollLeft;
        const index = Math.floor(x / (this.barWidth + this.barMargin));

        if (index < 0 || index >= this.items.length) {
            return null;
        }

        return this.items[index];
    }

    /** Chart item click event handler */
    onItemClick(e) {
        if (!isFunction(this.itemClickHandler)) {
            return;
        }
        const item = this.findItemByEvent(e);
        if (!item) {
            return;
        }

        this.itemClickHandler.call(this, e, item);
    }

    /** Chart item mouse over event handler */
    onItemOver(e) {
        if (!isFunction(this.itemOverHandler)) {
            return;
        }
        const item = this.findItemByEvent(e);
        if (this.activeItem === item) {
            return;
        }
        if (this.activeItem && isFunction(this.itemOutHandler)) {
            this.itemOutHandler.call(this, e, this.activeItem);
        }

        if (!item) {
            return;
        }

        this.activeItem = item;
        this.itemOverHandler.call(this, e, item);
    }

    /** Chart item mouse out from bar event handler */
    onItemOut(e) {
        if (!isFunction(this.itemOutHandler)) {
            return;
        }

        const item = this.activeItem;
        this.activeItem = null;

        if (!item) {
            return;
        }
        this.itemOutHandler.call(this, e, item);
    }

    /** Scale visible items of chart */
    scaleVisible() {
        if (!this.autoScale) {
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
        this.scaleVisible();

        if (isFunction(this.scrollHandler)) {
            this.scrollHandler.call(this);
        }
    }

    /** Create items with default scale */
    createItems() {
    }

    /** Update scale of items */
    /* eslint-disable-next-line no-unused-vars */
    updateItemsScale(items) {
    }
}
