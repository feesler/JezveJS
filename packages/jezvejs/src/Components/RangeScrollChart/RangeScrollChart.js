import { assert } from '@jezvejs/assert';
import { createElement } from '@jezvejs/dom';

import { minmax, px } from '../../common.js';
import { Component } from '../../Component.js';

import { Histogram } from '../Histogram/Histogram.js';
import { LineChart } from '../LineChart/LineChart.js';
import { RangeSlider } from '../RangeSlider/RangeSlider.js';

import {
    getSliderChangeType,
    getSliderEnd,
    getSliderStart,
} from './helpers.js';
import './RangeScrollChart.scss';

/* CSS classes */
const CONTAINER_CLASS = 'range-scroll-chart';
const SLIDER_CONTAINER_CLASS = 'range-scroll-chart__slider-container';
const RANGE_SLIDER_CLASS = 'range-scroll-chart__range-slider';
const NAVIGATION_CHART_CLASS = 'range-scroll-chart__nav-chart';

const chartTypesMap = {
    histogram: Histogram,
    linechart: LineChart,
};

const defaultProps = {
    logField: null,
    type: 'histogram', // available values: 'histogram' and 'linechart'
    hideScrollBar: true,
    mainChart: {
        height: 300,
        resizeTimeout: 0,
    },
    navigationChart: {
        height: 100,
        marginTop: 0,
        resizeTimeout: 0,
    },
    navigationSlider: {
        scrollOnClickOutsideRange: true,
    },
};

/**
 * Chart component with RangeSlider and navigation chart as scrollbar
 */
export class RangeScrollChart extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            mainChart: {
                ...defaultProps.mainChart,
                ...(props?.mainChart ?? {}),
            },
            navigationChart: {
                ...defaultProps.navigationChart,
                ...(props?.navigationChart ?? {}),
            },
            navigationSlider: {
                ...defaultProps.navigationSlider,
                ...(props?.navigationSlider ?? {}),
            },
        });

        this.state = {
            ...this.props,
            start: 0,
            end: 1,
            scrollLeft: 0,
            columnWidth: 0,
            groupsGap: 0,
            scrollBarSize: 0,
            chartScrollRequested: false,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        const { mainChart, navigationChart, navigationSlider } = this.props;

        // Main chart
        this.mainChart = this.createChart({
            ...mainChart,
            allowLastXAxisLabelOverflow: false,
            onResize: () => this.onChartResize(),
            onScroll: () => this.onChartScroll(),
        });

        // Navigation chart
        this.navigationChart = this.createChart({
            ...navigationChart,
            className: NAVIGATION_CHART_CLASS,
            fitToWidth: true,
            data: navigationChart?.data ?? mainChart?.data,
        });

        // Range slider
        this.rangeSlider = RangeSlider.create({
            ...navigationSlider,
            range: true,
            className: RANGE_SLIDER_CLASS,
            min: 0,
            max: 1,
            step: null,
            beforeArea: true,
            afterArea: true,
            onBeforeChange: (value, changeType) => this.onBeforeSliderChange(value, changeType),
            onChange: (value) => this.onSliderChange(value),
            onScroll: (value) => this.onSliderScroll(value),
        });

        this.navigationChart.scrollerContainer.prepend(this.rangeSlider.elem);

        this.sliderContainer = createElement('div', {
            className: SLIDER_CONTAINER_CLASS,
            children: this.navigationChart.elem,
        });

        this.elem = createElement('div', {
            className: CONTAINER_CLASS,
            children: [
                this.mainChart.elem,
                this.sliderContainer,
            ],
        });
    }

    getChartComponent() {
        const { type } = this.props;
        const ChartComponent = chartTypesMap[type];
        assert(ChartComponent, 'Invalid type of chart');

        return ChartComponent;
    }

    createChart(props) {
        const ChartComponent = this.getChartComponent();
        return ChartComponent.create(props);
    }

    onChartResize() {
        if (this.state.chartScrollRequested) {
            return;
        }

        const { chartScroller } = this.mainChart;
        const scrollBarSize = chartScroller.offsetHeight - chartScroller.clientHeight;

        let { start, end } = this.state;
        const {
            groupsCount,
            maxColumnWidth,
            scrollerWidth,
            columnsInGroup,
        } = this.mainChart.state;
        let { groupsGap } = this.mainChart.state;
        const contentWidth = scrollerWidth / Math.abs(start - end);
        const groupOuterWidth = contentWidth / groupsCount;
        groupsGap = groupOuterWidth / 5;
        const groupWidth = groupOuterWidth - groupsGap;
        let columnWidth = groupWidth / columnsInGroup;

        // Check new column width not exceeds value of 'maxColumnWidth' property
        if (columnWidth > maxColumnWidth) {
            ({ start, end } = this.onBeforeSliderChange({ start, end }, 'resize'));
            columnWidth = maxColumnWidth;
            groupsGap = columnWidth / 4;
        }

        this.setState({
            ...this.state,
            columnWidth,
            groupsGap,
            scrollBarSize,
        });
    }

    onChartScroll() {
        if (this.state.chartScrollRequested) {
            this.setState({ ...this.state, chartScrollRequested: false });
            return;
        }

        const {
            scrollLeft,
            scrollWidth,
            scrollerWidth,
        } = this.mainChart.state;
        if (this.state.scrollLeft === scrollLeft) {
            return;
        }

        const delta = Math.abs(this.state.end - this.state.start);
        const maxScroll = Math.max(0, scrollWidth - scrollerWidth);

        let start = 0;
        let end = 1;
        if (scrollLeft < 0) {
            end = delta;
        } else if (scrollLeft > maxScroll) {
            start = 1 - delta;
        } else {
            start = getSliderStart({ scrollLeft, scrollWidth });
            end = getSliderEnd({ scrollLeft, scrollWidth, scrollerWidth });
        }

        this.setState({
            ...this.state,
            scrollLeft,
            start,
            end,
        });
    }

    onSliderScroll(value) {
        let { start, end } = value;
        if (this.state.start === start && this.state.end === end) {
            return;
        }

        const delta = Math.abs(end - start);

        if (start < 0) {
            start = 0;
            end = delta;
        } else if (end > 1) {
            start = 1 - delta;
            end = 1;
        }

        const { chartContentWidth, scrollerWidth } = this.mainChart.state;
        const maxScroll = Math.max(0, chartContentWidth - scrollerWidth);
        const scrollLeft = Math.min(maxScroll, start * chartContentWidth);

        this.setState({
            ...this.state,
            start,
            end,
            scrollLeft,
            chartScrollRequested: true,
        });
    }

    onBeforeSliderChange(value, changeType) {
        const { start, end } = value;
        if (this.state.start === start && this.state.end === end) {
            return value;
        }

        const {
            scrollerWidth,
            groupsCount,
            groupsGap,
            maxColumnWidth,
            columnsInGroup,
        } = this.mainChart.state;

        const maxGroupWidth = maxColumnWidth * columnsInGroup;
        const maxContentWidth = (maxGroupWidth + groupsGap) * groupsCount;
        const minDelta = (scrollerWidth / maxContentWidth);
        const currentDelta = Math.abs(start - end);

        if (currentDelta < minDelta) {
            return (changeType === 'start')
                ? { start: end - minDelta, end }
                : { start, end: start + minDelta };
        }

        return value;
    }

    onSliderChange(value) {
        const changeType = getSliderChangeType(value, this.state);
        if (changeType === null) {
            return;
        }

        let { start, end } = value;
        const {
            scrollerWidth,
            groupsCount,
            maxColumnWidth,
            columnsInGroup,
        } = this.mainChart.state;
        let { groupsGap } = this.mainChart.state;
        const contentWidth = scrollerWidth / Math.abs(start - end);
        const groupOuterWidth = contentWidth / groupsCount;
        const groupWidth = groupOuterWidth - groupsGap;
        let columnWidth = groupWidth / columnsInGroup;

        // Check new column width not exceeds value of 'maxColumnWidth' property
        if (columnWidth > maxColumnWidth) {
            ({ start, end } = this.onBeforeSliderChange(value, changeType));
            columnWidth = maxColumnWidth;
            groupsGap = columnWidth / 4;
        }

        if (this.state.start === start && this.state.end === end) {
            return;
        }

        const maxScroll = Math.max(0, contentWidth - scrollerWidth);
        const scrollLeft = minmax(0, maxScroll, start * contentWidth);

        this.setState({
            ...this.state,
            start,
            end,
            scrollLeft,
            columnWidth,
            groupsGap,
            chartScrollRequested: this.state.scrollLeft !== scrollLeft,
        });
    }

    renderMainChart(state, prevState) {
        if (
            (state.columnWidth !== prevState?.columnWidth)
            || (state.groupsGap !== prevState?.groupsGap)
        ) {
            this.mainChart.setColumnWidth(state.columnWidth);
            this.mainChart.setGroupsGap(state.groupsGap);
        }

        if (state.scrollLeft !== prevState?.scrollLeft) {
            this.mainChart.setScroll(state.scrollLeft);
        }

        if (
            (state.scrollBarSize !== prevState?.scrollBarSize)
            || (state.hideScrollBar !== prevState?.hideScrollBar)
        ) {
            const { style } = this.mainChart.scrollerContainer;
            style.marginBottom = (state.hideScrollBar) ? px(-state.scrollBarSize) : '';
        }
    }

    renderSlider(state, prevState) {
        if (
            state.start === prevState?.start
            && state.end === prevState?.end
        ) {
            return;
        }

        this.rangeSlider.setState((rangeState) => ({
            ...rangeState,
            start: state.start,
            end: state.end,
        }));
    }

    render(state, prevState = {}) {
        assert(state, 'Invalid state');

        this.renderMainChart(state, prevState);
        this.renderSlider(state, prevState);
    }
}
