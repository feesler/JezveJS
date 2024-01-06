import 'jezvejs/style';
import { LineChart } from 'jezvejs/LineChart';

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

import { ChartCustomLegend } from '../../Components/ChartCustomLegend/ChartCustomLegend.js';
import { ChartMultiColumnPopup } from '../../Components/ChartMultiColumnPopup/ChartMultiColumnPopup.js';
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import { RadioFieldset } from '../../Components/RadioFieldset/RadioFieldset.js';
import { RangeInputField } from '../../Components/RangeInputField/RangeInputField.js';

// Local data
import { eurData } from './data.js';
import {
    chartContainer,
    formatDecimalValue,
    formatAsUSD,
} from './helpers.js';

import './LineChartView.scss';

/**
 * LineChart component demo view
 */
class LineChartView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('LineChart');

        this.columnWidthAndGap();
        this.fitToWidth();

        this.chartAxes();
        this.xAxisGrid();

        this.autoScale();
        this.callbacks();
        this.multiple();
        this.alignColumns();
        this.activeGroup();
        this.stacked();
        this.stackedNegative();

        this.setData();
    }

    columnWidthAndGap() {
        const chart = LineChart.create({
            data: chartData,
        });

        const controls = createControls([
            RangeInputField.create({
                title: 'columnWidth:',
                min: 1,
                max: 50,
                value: 38,
                onInput: (value) => chart.setColumnWidth(value),
            }).elem,
            RangeInputField.create({
                title: 'groupsGap:',
                min: 1,
                max: 50,
                value: 10,
                onInput: (value) => chart.setGroupsGap(value),
            }).elem,
        ]);

        this.addSection({
            id: 'columnWidth',
            title: 'Change \'columnWidth\' and \'groupsGap\'',
            content: [
                chartContainer('linechart', chart),
                controls,
            ],
        });
    }

    fitToWidth() {
        const chart = LineChart.create({
            data: chartData,
            fitToWidth: true,
        });

        this.addSection({
            id: 'fitToWidth',
            title: '\'fitToWidth\' option',
            content: chartContainer('linechart_fittowidth', chart),
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

        const chart = LineChart.create({
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
        const chart = LineChart.create({
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
        const chart = LineChart.create({
            data: eurData,
            autoScale: true,
            autoScaleTimeout: 0,
            drawNodeCircles: true,
        });

        this.addSection({
            id: 'autoScale',
            title: '\'autoScale\' and \'drawNodeCircles\' options',
            content: chartContainer('linechart_autoscale', chart),
        });
    }

    callbacks() {
        const logsField = LogsField.create();

        const chart = LineChart.create({
            data: chartData2,
            height: 320,
            marginTop: 35,
            scrollToEnd: true,
            autoScale: true,
            animate: true,
            showPopupOnClick: true,
            renderPopup: (target) => formatAsUSD(target.item.value),
            renderXAxisLabel: formatDecimalValue,
            renderYAxisLabel: formatDecimalValue,
            activateOnHover: true,
            onItemClick: ({ item }) => logsField.write(`Clicked node, value=${item.value}`),
            onScroll: () => logsField.write('LineChart scroll'),
            onItemOver: ({ item }) => logsField.write(`Mouse over node, value=${item.value}`),
            onItemOut: ({ item }) => logsField.write(`Mouse out node, value=${item.value}`),
        });

        this.addSection({
            id: 'callbacks',
            title: 'Callbacks + \'animate\' option',
            content: [
                chartContainer('linechart_callbacks', chart),
                logsField.elem,
            ],
        });
    }

    multiple() {
        const chart = LineChart.create({
            data: chartMultiData,
            height: 320,
            marginTop: 35,
            autoScale: true,
            showPopupOnClick: true,
            activateOnHover: true,
            showLegend: true,
            components: {
                ChartPopup: ChartMultiColumnPopup,
            },
        });

        this.addSection({
            id: 'multipleSeries',
            title: 'Multiple series',
            content: chartContainer('linechart_multiple', chart),
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

        const chart = LineChart.create(initialProps);

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

    activeGroup() {
        const chart = LineChart.create({
            data: chartData2,
            height: 320,
            marginTop: 35,
            alignColumns: 'center',
            showActiveGroup: true,
            autoScale: true,
            activateOnClick: true,
            activateOnHover: true,
        });

        this.addSection({
            id: 'showActiveGroup',
            title: '\'showActiveGroup\' option',
            content: chartContainer('chartActiveGroup', chart),
        });
    }

    stacked() {
        const chart = LineChart.create({
            data: chartStackedData,
            height: 320,
            marginTop: 35,
            autoScale: true,
            showPopupOnClick: true,
            activateOnHover: true,
            showLegend: true,
            activateCategoryOnClick: true,
            setActiveCategory: (...args) => chart.setActiveCategory(...args),
            components: {
                Legend: ChartCustomLegend,
                ChartPopup: ChartMultiColumnPopup,
            },
        });

        this.addSection({
            id: 'stacked',
            title: 'Stacked + Custom legend',
            description: 'Data categories are activated by click on legend items.',
            content: chartContainer('linechart_stacked', chart),
        });
    }

    stackedNegative() {
        const chart = LineChart.create({
            data: chartNegMultiData,
            height: 320,
            marginTop: 35,
            autoScale: true,
            showPopupOnClick: true,
            showPopupOnHover: true,
            animatePopup: true,
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
            content: chartContainer('linechart-neg-stacked', chart),
        });
    }

    setData() {
        const chart = LineChart.create({
            data: negPosData,
            autoScale: true,
            showLegend: true,
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
            id: 'largeDataBtn',
            title: 'Large data set',
            onClick: () => chart.setData(largeData),
        }];

        this.addSection({
            id: 'setData',
            title: 'Set data',
            content: [
                chartContainer('linechart_setdata', chart),
                createButtons(items),
            ],
        });
    }
}

LineChartView.create();
