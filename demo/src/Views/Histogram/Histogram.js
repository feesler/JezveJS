import 'jezvejs/style';
import { Histogram } from 'jezvejs/Histogram';

import { createButtons, createControls } from '../../Application/utils.js';
import {
    chartData,
    chartData2,
    chartData3,
    chartMultiData,
    chartNegMultiData,
    chartStackedData,
    emptyData,
    singleNegData,
    posData,
    negData,
    negPosData,
    chartShortMultiData,
} from '../../assets/data/index.js';
import { largeData } from '../../assets/data/largeData.js';

import { ChartCategoriesPopup } from '../../Components/ChartCategoriesPopup/ChartCategoriesPopup.js';
import { ChartCustomLegend } from '../../Components/ChartCustomLegend/ChartCustomLegend.js';
import { ChartMultiColumnPopup } from '../../Components/ChartMultiColumnPopup/ChartMultiColumnPopup.js';
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import { RadioFieldset } from '../../Components/RadioFieldset/RadioFieldset.js';
import { RangeInputField } from '../../Components/RangeInputField/RangeInputField.js';

import {
    maxColumnWidthData,
    chartGroupedData,
    chartGroupedCategoriesData,
    legendCategoriesData,
} from './data.js';
import {
    chartContainer,
    formatDecimalValue,
    formatAsUSD,
} from './helpers.js';
import './HistogramView.scss';

/**
 * Histogram component demo view
 */
class HistogramView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Histogram');

        this.columnWidthAndGap();
        this.fitToWidth();

        this.horizontalLabels();
        this.maxColumnWidth();

        this.chartAxes();
        this.xAxisGrid();

        this.autoScale();
        this.callbacks();
        this.multiColumn();
        this.alignColumns();
        this.stacked();
        this.stackedNegative();
        this.stackedGrouped();
        this.stackedCategories();
        this.legendCategories();

        this.setData();
    }

    columnWidthAndGap() {
        const histogram = Histogram.create({
            maxColumnWidth: 40,
            data: chartData,
        });

        const controls = createControls([
            RangeInputField.create({
                title: 'columnWidth:',
                min: 1,
                max: 50,
                value: 38,
                onInput: (value) => histogram.setColumnWidth(value),
            }).elem,
            RangeInputField.create({
                title: 'groupsGap:',
                min: 1,
                max: 50,
                value: 10,
                onInput: (value) => histogram.setGroupsGap(value),
            }).elem,
        ]);

        this.addSection({
            id: 'columnWidth',
            title: 'Change \'columnWidth\' and \'groupsGap\'',
            content: [
                chartContainer('chart', histogram),
                controls,
            ],
        });
    }

    fitToWidth() {
        const histogram = Histogram.create({
            data: chartData,
            fitToWidth: true,
        });

        this.addSection({
            id: 'fitToWidth',
            title: '\'fitToWidth\' option',
            content: chartContainer('chart_fittowidth', histogram),
        });
    }

    horizontalLabels() {
        const histogram = Histogram.create({
            maxColumnWidth: 38,
            groupsGap: 3,
        });

        this.addSection({
            id: 'horizontalLabels',
            title: 'Horizontal labels test',
            description: 'x-axis label for the second column should be hidded.',
            content: chartContainer('horizontalLabelsChart', histogram),
        });

        histogram.setData(maxColumnWidthData);
    }

    maxColumnWidth() {
        const histogram = Histogram.create({
            data: maxColumnWidthData,
            maxColumnWidth: 75,
            fitToWidth: true,
        });

        this.addSection({
            id: 'maxColumnWidth',
            title: '\'maxColumnWidth\' option',
            content: chartContainer('maxColumnWidthChart', histogram),
        });
    }

    chartAxes() {
        const props = {
            xAxis: 'bottom',
            yAxis: 'right',
            yAxisLabelsAlign: 'left',
        };

        const xAxisMap = {
            top: 'Top',
            bottom: 'Bottom',
            none: 'None',
        };

        const yAxisMap = {
            left: 'Left',
            right: 'Right',
            none: 'None',
        };

        const textAlignMap = {
            left: 'Left',
            right: 'Right',
            center: 'Center',
        };

        const chart = Histogram.create({
            ...props,
            data: chartData2,
        });

        const controls = [
            RadioFieldset.create({
                title: 'X-Axis',
                radioName: 'xAxis',
                items: Object.entries(xAxisMap).map(([value, label]) => ({
                    value,
                    label,
                    checked: (props.xAxis === value),
                })),
                onChange: (xAxis) => {
                    chart.setState((chartState) => ({ ...chartState, xAxis }));
                },
            }).elem,
            RadioFieldset.create({
                title: 'Y-Axis',
                radioName: 'yAxis',
                items: Object.entries(yAxisMap).map(([value, label]) => ({
                    value,
                    label,
                    checked: (props.yAxis === value),
                })),
                onChange: (yAxis) => {
                    chart.setState((chartState) => ({ ...chartState, yAxis }));
                },
            }).elem,
            RadioFieldset.create({
                title: 'Y-Axis text align',
                radioName: 'yAxisLabelsAlign',
                items: Object.entries(textAlignMap).map(([value, label]) => ({
                    value,
                    label,
                    checked: (props.yAxisLabelsAlign === value),
                })),
                onChange: (yAxisLabelsAlign) => {
                    chart.setState((chartState) => ({ ...chartState, yAxisLabelsAlign }));
                },
            }).elem,
        ];

        this.addSection({
            id: 'axes',
            title: '\'xAxis\' and \'yAxis\' options',
            content: [
                chartContainer('chartAxes', chart),
                createControls(controls),
            ],
        });
    }

    xAxisGrid() {
        const chart = Histogram.create({
            data: chartData,
            xAxisGrid: true,
            className: 'x-axis-grid-chart',
        });

        this.addSection({
            id: 'xAxisGrid',
            title: '\'xAxisGrid\' option',
            content: chartContainer('xAxisGridChart', chart),
        });
    }

    autoScale() {
        const histogram = Histogram.create({
            data: chartData2,
            autoScale: true,
            className: 'histogram_autoscale',
        });

        this.addSection({
            id: 'autoScale',
            title: '\'autoScale\' option',
            content: chartContainer('chart_autoscale', histogram),
        });
    }

    callbacks() {
        const logsField = LogsField.create();

        const histogram = Histogram.create({
            data: chartData2,
            height: 320,
            marginTop: 35,
            scrollToEnd: true,
            autoScale: true,
            animate: true,
            showPopupOnClick: true,
            activateOnClick: true,
            renderPopup: (target) => formatAsUSD(target.item.value),
            renderXAxisLabel: formatDecimalValue,
            renderYAxisLabel: formatDecimalValue,
            onItemClick: ({ item }) => logsField.write(`Clicked bar, value=${item.value}`),
            onScroll: () => logsField.write('Histogram scroll'),
            onItemOver: ({ item }) => logsField.write(`Mouse over bar, value=${item.value}`),
            onItemOut: ({ item }) => logsField.write(`Mouse out bar, value=${item.value}`),
        });

        this.addSection({
            id: 'callbacks',
            title: 'Callbacks',
            description: ' + \'animate\', \'showPopupOnClick\' and \'activateOnClick\' options',
            content: [
                chartContainer('chart_callbacks', histogram),
                logsField.elem,
            ],
        });
    }

    multiColumn() {
        const histogram = Histogram.create({
            data: chartMultiData,
            height: 320,
            marginTop: 35,
            autoScale: true,
            showPopupOnHover: true,
            activateOnHover: true,
            showLegend: true,
            components: {
                ChartPopup: ChartCategoriesPopup,
            },
        });

        this.addSection({
            id: 'multiColumn',
            title: 'Multi column + Legend',
            description: ' + \'showPopupOnHover\' and \'activateOnHover\' options',
            content: chartContainer('chart_multicolumn', histogram),
        });
    }

    alignColumns() {
        const initialProps = {
            data: chartShortMultiData,
            maxColumnWidth: 40,
            fitToWidth: true,
            xAxisGrid: true,
            alignColumns: 'right',
            showPopupOnClick: true,
            activateOnClick: true,
            showPopupOnHover: true,
            activateOnHover: true,
        };

        const chart = Histogram.create(initialProps);

        const alignMap = {
            left: 'Left',
            right: 'Right',
            center: 'Center',
        };

        const alignFieldset = RadioFieldset.create({
            title: 'Align columns',
            radioName: 'align',
            items: Object.entries(alignMap).map(([value, label]) => ({
                value,
                label,
                checked: (initialProps.alignColumns === value),
            })),
            onChange: (alignColumns) => (
                chart.setState((chartState) => ({
                    ...chartState,
                    alignColumns,
                }))
            ),
        });

        this.addSection({
            id: 'alignColumns',
            title: '\'alignColumns\' option',
            content: [
                chartContainer('alignColumnsChart', chart),
                createControls(alignFieldset.elem),
            ],
        });
    }

    stacked() {
        const histogram = Histogram.create({
            data: chartStackedData,
            height: 320,
            marginTop: 35,
            autoScale: true,
            showPopupOnClick: true,
            activateOnClick: true,
            activateOnHover: true,
            showLegend: true,
            activateCategoryOnClick: true,
            setActiveCategory: (...args) => histogram.setActiveCategory(...args),
            components: {
                Legend: ChartCustomLegend,
                ChartPopup: ChartMultiColumnPopup,
            },
        });

        this.addSection({
            id: 'stacked',
            title: 'Stacked + Custom legend',
            description: 'Data categories are activated by click on legend items.',
            content: chartContainer('stacked-histogram', histogram),
        });
    }

    stackedNegative() {
        const histogram = Histogram.create({
            data: chartNegMultiData,
            height: 320,
            marginTop: 35,
            autoScale: true,
            showPopupOnClick: true,
            activateOnClick: true,
            activateOnHover: true,
            showLegend: true,
            components: {
                Legend: ChartCustomLegend,
                ChartPopup: ChartMultiColumnPopup,
            },
        });

        this.addSection({
            id: 'stackedNegative',
            title: 'Stacked with negative values',
            content: chartContainer('stacked-neg-histogram', histogram),
        });
    }

    stackedGrouped() {
        const histogram = Histogram.create({
            data: chartGroupedData,
            height: 320,
            marginTop: 35,
            columnWidth: 25,
            groupsGap: 15,
            columnGap: 2,
            autoScale: true,
            showPopupOnClick: true,
            activateOnClick: true,
            activateOnHover: true,
            animatePopup: true,
            pinPopupOnClick: true,
            showLegend: true,
            components: {
                Legend: ChartCustomLegend,
                ChartPopup: ChartMultiColumnPopup,
            },
        });

        this.addSection({
            id: 'grouped',
            title: 'Stacked and grouped',
            description: ' + \'animatePopup\' and \'pinPopupOnClick\' options',
            content: chartContainer('stacked-grouped-histogram', histogram),
        });
    }

    stackedCategories() {
        const histogram = Histogram.create({
            data: chartGroupedCategoriesData,
            height: 320,
            marginTop: 35,
            columnWidth: 25,
            groupsGap: 15,
            columnGap: 2,
            autoScale: true,
            showPopupOnClick: true,
            showPopupOnHover: true,
            animatePopup: true,
            pinPopupOnClick: true,
            activateOnClick: true,
            activateOnHover: true,
            showLegend: true,
            components: {
                Legend: ChartCustomLegend,
                ChartPopup: ChartCategoriesPopup,
            },
        });

        this.addSection({
            id: 'customCategories',
            title: 'Stacked and grouped with custom categories',
            description: ' + \'showPopupOnHover\', \'animatePopup\' and \'pinPopupOnClick\' options',
            content: chartContainer('stacked-categories-histogram', histogram),
        });
    }

    legendCategories() {
        const histogram = Histogram.create({
            data: legendCategoriesData,
            height: 320,
            marginTop: 35,
            columnWidth: 25,
            groupsGap: 15,
            columnGap: 2,
            autoScale: true,
            showPopupOnClick: true,
            showPopupOnHover: true,
            animatePopup: true,
            pinPopupOnClick: true,
            activateOnClick: true,
            activateOnHover: true,
            showLegend: true,
            onlyVisibleCategoriesLegend: true,
            components: {
                Legend: ChartCustomLegend,
                ChartPopup: ChartMultiColumnPopup,
            },
        });

        this.addSection({
            id: 'legendCategories',
            title: 'Only visible categories legend',
            description: '\'onlyVisibleCategoriesLegend\' option. Default value if false',
            content: chartContainer('legendCategoriesHistogram', histogram),
        });
    }

    setData() {
        const chart = Histogram.create({
            data: negPosData,
            autoScale: true,
            showLegend: true,
            scrollToEnd: true,
            components: {
                Legend: ChartCustomLegend,
            },
        });

        const items = [{
            id: 'emptyDataBtn',
            title: 'No data',
            onClick: () => chart.setData(emptyData),
        }, {
            id: 'singleNegDataBtn',
            title: 'Single negative',
            onClick: () => chart.setData(singleNegData),
        }, {
            id: 'posDataBtn',
            title: 'Only positive',
            onClick: () => chart.setData(posData),
        }, {
            id: 'negDataBtn',
            title: 'Only negative',
            onClick: () => chart.setData(negData),
        }, {
            id: 'negPosDataBtn',
            title: 'Negative and positive',
            onClick: () => chart.setData(negPosData),
        }, {
            id: 'multiColumnDataBtn',
            title: 'Multi column',
            onClick: () => chart.setData(chartData3),
        }, {
            id: 'stackedDataBtn',
            title: 'Stacked',
            onClick: () => chart.setData(chartStackedData),
        }, {
            id: 'stackedGroupedDataBtn',
            title: 'Stacked and grouped',
            onClick: () => chart.setData(chartGroupedCategoriesData),
        }, {
            id: 'largeDataBtn',
            title: 'Large data set',
            onClick: () => chart.setData(largeData),
        }];

        this.addSection({
            id: 'setData',
            title: 'Set data',
            content: [
                chartContainer('chart_setdata', chart),
                createButtons(items),
            ],
        });
    }
}

HistogramView.create();
