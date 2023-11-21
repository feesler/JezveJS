import { assert } from '@jezvejs/assert';
import { createElement } from '@jezvejs/dom';

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
    mainChart: {
        height: 300,
    },
    navigationChart: {
        height: 100,
        marginTop: 0,
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
        });

        this.state = {
            ...this.props,
            start: 0,
            end: 1,
            scrollLeft: 0,
            chartScrollRequested: false,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        const { mainChart, navigationChart } = this.props;

        // Main chart
        this.mainChart = this.createChart({
            ...mainChart,
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
            props: { className: SLIDER_CONTAINER_CLASS },
            children: this.navigationChart.elem,
        });

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
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

        const {
            scrollLeft,
            scrollWidth,
            scrollerWidth,
        } = this.mainChart.state;

        this.setState({
            ...this.state,
            start: getSliderStart({ scrollLeft, scrollWidth }),
            end: getSliderEnd({ scrollLeft, scrollWidth, scrollerWidth }),
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

        this.setState({
            ...this.state,
            scrollLeft,
            start: getSliderStart({ scrollLeft, scrollWidth }),
            end: getSliderEnd({ scrollLeft, scrollWidth, scrollerWidth }),
        });
    }

    onSliderScroll(value) {
        const { start, end } = value;
        if (this.state.start === start && this.state.end === end) {
            return;
        }

        this.setState({
            ...this.state,
            start,
            end,
            scrollLeft: start * this.mainChart.state.scrollWidth,
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
        } = this.mainChart.state;

        const valuesExtended = groupsCount + 4;
        const expContentWidth = scrollerWidth / Math.abs(start - end);
        const expColumnWidth = expContentWidth / valuesExtended;
        if (expColumnWidth - groupsGap <= maxColumnWidth) {
            return value;
        }

        const fixedContentWidth = (maxColumnWidth + groupsGap) * valuesExtended;
        const delta = (scrollerWidth / fixedContentWidth);
        return (changeType === 'start')
            ? { start: end - delta, end }
            : { start, end: start + delta };
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
        } = this.mainChart.state;
        let { groupsGap } = this.mainChart.state;
        const valuesExtended = groupsCount + 4;
        const contentWidth = scrollerWidth / Math.abs(start - end);
        let columnWidth = contentWidth / valuesExtended;

        // Check new column width not exceeds value of 'maxColumnWidth' property
        if (columnWidth - groupsGap > maxColumnWidth) {
            ({ start, end } = this.onBeforeSliderChange(value, changeType));
            columnWidth = maxColumnWidth;
        }

        if (columnWidth > 10) {
            groupsGap = columnWidth / 5;
            columnWidth -= groupsGap;
        } else {
            groupsGap = 0;
        }

        this.mainChart.setColumnWidth(columnWidth);
        this.mainChart.setGroupsGap(groupsGap);

        const { scrollWidth } = this.mainChart.state;
        const scrollLeft = start * scrollWidth;
        this.setState({
            ...this.state,
            start,
            end,
            scrollLeft,
            chartScrollRequested: this.state.scrollLeft !== scrollLeft,
        });
    }

    renderMainChart(state, prevState) {
        if (
            state.scrollLeft === prevState?.scrollLeft
        ) {
            return;
        }

        this.mainChart.setState((histogramState) => ({
            ...histogramState,
            scrollLeft: state.scrollLeft,
        }));
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
