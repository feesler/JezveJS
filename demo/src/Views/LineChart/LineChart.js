import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
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
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import { RadioFieldset } from '../../Components/RadioFieldset/RadioFieldset.js';
import { RangeInputField } from '../../Components/RangeInputField/RangeInputField.js';

import './LineChartView.scss';

/* eslint-disable max-len */
const eurData = {
    values: [46.8507, 46.8350, 46.4266, 46.7712, 47.0161, 47.1145, 47.2677, 47.5463, 47.6296, 47.8253, 47.4908, 47.3211, 46.8746, 46.7269, 46.4764, 46.8085, 47.2121, 47.1715, 46.6960, 46.8821, 46.6478, 46.2212, 46.1576, 46.0226, 45.8251, 46.1827, 46.8335, 46.8398, 46.6863, 46.6870, 46.9448, 46.8122, 46.4146, 46.1649, 46.3328, 46.6835, 46.7910, 46.6299, 47.0702, 47.5505, 47.5048, 47.3758, 46.8718, 47.1702, 47.2206, 47.4799, 47.8635, 47.8958, 47.4699, 47.8244, 47.8671, 48.0490, 48.2432, 48.4947, 48.7722, 48.2856, 48.2402, 48.4110, 48.1416, 48.1231, 48.2398, 48.2133, 48.1924, 48.1686, 47.8548, 47.6641, 47.7282, 47.6177, 47.9520, 48.6315, 48.9677, 49.0193, 49.0213, 48.3786, 47.7806, 47.9789, 47.7118, 48.0636, 48.2484, 48.6647, 49.1958, 50.0582, 49.6923, 49.4592, 49.5379, 49.6193, 49.6912, 49.3145, 48.8449, 49.3386, 49.9540, 49.9817, 50.0554, 49.9484, 50.2021, 50.0775, 50.2017, 50.5091, 50.9585, 51.0538, 51.0798, 51.5141, 51.7829, 52.1504, 52.5253, 52.1198, 52.6468, 52.1388, 52.4424, 52.9065, 53.2342, 53.8693, 54.3393, 54.6378, 52.7219, 55.6234, 56.5450, 59.3153, 57.2418, 57.0494, 57.8575, 57.4235, 58.9793, 59.3081, 58.6448, 58.9090, 58.5817, 57.4377, 55.5336, 55.8779, 57.9052, 59.6215, 61.4108, 64.4425, 63.2414, 67.2652, 64.8443, 65.7168, 65.4248, 66.8809, 67.1989, 68.2942, 70.5289, 72.6642, 76.1516, 84.5890, 73.3414, 74.5727, 69.2503, 66.7539, 66.4031, 64.3177, 63.5131, 69.0590, 68.3427, 68.3681, 74.3551, 76.7735, 77.9629, 76.3352, 75.8623, 75.1740, 75.2735, 75.8218, 75.7724, 71.9067, 73.5633, 76.2922, 76.2629, 77.5690, 78.1105, 78.7900, 76.8271, 75.0415, 77.9356, 75.6591, 74.5833, 74.1382, 74.7386, 74.8311, 74.3675, 71.5426, 71.3243, 71.0800, 70.9408, 70.0315, 71.9422, 71.1655, 68.9797, 68.6857, 69.5424, 69.8487, 69.1138, 68.3086, 66.1012, 65.5242, 66.9168, 64.6232, 64.9650, 65.4063, 65.4314, 65.0108, 64.1446, 64.0504, 64.1473, 64.3425, 62.7651, 62.0811, 62.5655, 63.3695, 62.0487, 62.7476, 61.6919, 61.7363, 62.0377, 60.4124, 58.7003, 56.5251, 54.2749, 55.5201, 54.8387, 53.6598, 52.9087, 54.5163, 55.5496, 57.5998, 57.7226, 55.1255, 54.6590, 55.8747, 56.9016, 56.8060, 57.1578, 57.4093, 56.1843, 57.2207, 56.8971, 57.1102, 55.7138, 57.1383, 56.9881, 56.1030, 55.1085, 55.2441, 55.5714, 55.5508, 54.7477, 54.8412, 55.6757, 57.1433, 58.0145, 57.7020, 58.6037, 59.1130, 61.9471, 63.3221, 62.5053, 63.0721, 62.2064, 61.4754, 62.1045, 61.1040, 60.7452, 60.6417, 60.9130, 60.8567, 61.0546, 60.5852, 61.1986, 61.4066, 61.5206, 62.3803, 61.6556, 61.5661, 61.7492, 62.4246, 63.0441, 63.0822, 63.0430, 62.9474, 62.9819, 62.6239, 62.3986, 62.1841, 61.9183, 61.6929, 61.7622, 62.3948, 62.9330, 63.6090, 65.0830, 66.6248, 65.9882, 64.6478, 66.0002, 68.5770, 68.9961, 68.1435, 69.6314, 69.8089, 70.7540, 69.6762, 72.2078, 71.1475, 72.3650, 72.5712, 72.9187, 72.7085, 74.4738, 76.6709, 81.1533, 80.7248, 79.7252, 76.3369, 75.0469, 74.8478, 73.8449, 75.0901, 75.2659, 75.4011, 76.3692, 76.9246, 75.5742, 76.6951, 76.8165, 77.1313, 75.9013, 74.2407, 73.9378, 74.9726, 74.8304, 73.9568, 73.5367, 74.5435, 73.1397, 73.2684, 74.5825, 73.7760, 72.4865, 73.6302, 73.7951, 72.9468, 70.4691, 70.3052, 69.3450, 69.5499, 70.8977, 72.0506, 71.2810, 69.7710, 69.7796, 70.5290, 71.1738, 71.0895, 68.7903, 69.0104, 70.2124, 72.1479, 70.1427, 70.7537, 70.3961, 70.3782, 68.8261, 69.2555, 69.6136, 69.2394, 69.3797, 70.3370, 71.8184, 71.3987, 69.7819, 69.0021, 69.3390, 69.3886, 69.7037, 69.8076, 69.8987, 69.7034, 70.3859, 70.6478, 70.1345, 70.8647, 71.7404, 73.6721, 74.4079, 75.3111, 75.5595, 76.0674, 75.7472, 75.7472, 76.9659, 78.2312, 77.0400, 76.6788, 77.4052, 77.4830, 77.6145, 77.5443, 76.0441, 77.0500, 77.6032, 79.5470, 79.6972, 79.6395, 82.8090,
    ],
    series: [
    ],
};
/* eslint-enable max-len */

const chartContainer = (id, chart) => createElement('div', {
    props: { id, className: 'std_chart_wrap' },
    children: chart?.elem,
});

const formatDecimalValue = (val) => val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
const formatAsUSD = (value) => `$ ${formatDecimalValue(value)}`;

const renderMultiColumnPopup = (target) => {
    if (!target.group) {
        return createElement('span', { props: { textContent: target.item.value } });
    }

    return createElement('ul', {
        props: { className: 'custom-chart-popup__list' },
        children: target.group.map(
            (item, index) => createElement('li', {
                props: {
                    className: `list-item_category-${item.categoryIndex + 1}`,
                },
                children: createElement(((target.index === index) ? 'b' : 'span'), {
                    props: { textContent: item.value },
                }),
            }),
        ),
    });
};

/**
 * LineChart component demo view
 */
class LineChartView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.columnWidthAndGap();
        this.fitToWidth();

        this.chartAxes();
        this.xAxisGrid();

        this.autoScale();
        this.callbacks();
        this.multiple();
        this.alignColumns();
        this.stacked();
        this.stackedNegative();
        // Different data tests
        this.noData();
        this.singleNegative();
        this.onlyPositive();
        this.onlyNegative();
        this.negativeAndPositive();
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
        const container = chartContainer('chartAxes');
        const state = {
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

        let chart = null;

        const createChart = (xAxis, yAxis) => {
            state.xAxis = xAxis;
            state.yAxis = yAxis;

            chart = LineChart.create({
                data: chartData2,
                xAxis,
                yAxis,
                yAxisLabelsAlign: state.yAxisLabelsAlign,
            });

            container.replaceChildren(chart.elem);
        };

        const controls = [
            RadioFieldset.create({
                title: 'X-Axis',
                radioName: 'xAxis',
                items: Object.entries(xAxisMap).map(([value, label]) => ({
                    value,
                    label,
                    checked: (state.xAxis === value),
                })),
                onChange: (value) => createChart(value, state.yAxis),
            }).elem,
            RadioFieldset.create({
                title: 'Y-Axis',
                radioName: 'yAxis',
                items: Object.entries(yAxisMap).map(([value, label]) => ({
                    value,
                    label,
                    checked: (state.yAxis === value),
                })),
                onChange: (value) => {
                    chart?.setState((chartState) => ({ ...chartState, yAxis: value }));
                    state.yAxis = value;
                },
            }).elem,
            RadioFieldset.create({
                title: 'Y-Axis text align',
                radioName: 'yAxisLabelsAlign',
                items: Object.entries(textAlignMap).map(([value, label]) => ({
                    value,
                    label,
                    checked: (state.yAxisLabelsAlign === value),
                })),
                onChange: (value) => {
                    chart?.setState((chartState) => ({ ...chartState, yAxisLabelsAlign: value }));
                    state.yAxisLabelsAlign = value;
                },
            }).elem,
        ];

        createChart(state.xAxis, state.yAxis);

        this.addSection({
            id: 'axes',
            title: '\'xAxis\' and \'yAxis\' options',
            content: [
                container,
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
            renderPopup: renderMultiColumnPopup,
            activateOnHover: true,
            showLegend: true,
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

    stacked() {
        const chart = LineChart.create({
            data: chartStackedData,
            height: 320,
            marginTop: 35,
            autoScale: true,
            showPopupOnClick: true,
            renderPopup: renderMultiColumnPopup,
            activateOnHover: true,
            showLegend: true,
            activateCategoryOnClick: true,
            components: {
                Legend: ChartCustomLegend,
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
            renderPopup: renderMultiColumnPopup,
            activateOnHover: true,
            showLegend: true,
            components: {
                Legend: ChartCustomLegend,
            },
        });

        this.addSection({
            id: 'stackedNegative',
            title: 'Stacked with negative values',
            content: chartContainer('linechart-neg-stacked', chart),
        });
    }

    noData() {
        const chart = LineChart.create({
            data: emptyData,
            autoScale: true,
        });

        this.addSection({
            id: 'noData',
            title: 'No data',
            content: chartContainer('linechart_no_data', chart),
        });
    }

    singleNegative() {
        const chart = LineChart.create({
            data: singleNegData,
            autoScale: true,
            drawNodeCircles: true,
        });

        this.addSection({
            id: 'singleNegative',
            title: 'Single negative value',
            content: chartContainer('linechart_single_neg', chart),
        });
    }

    onlyPositive() {
        const chart = LineChart.create({
            data: posData,
            autoScale: true,
        });

        this.addSection({
            id: 'onlyPositive',
            title: 'Only positive values',
            content: chartContainer('linechart_pos', chart),
        });
    }

    onlyNegative() {
        const chart = LineChart.create({
            data: negData,
            autoScale: true,
        });

        this.addSection({
            id: 'onlyNegative',
            title: 'Only negative values',
            content: chartContainer('linechart_neg', chart),
        });
    }

    negativeAndPositive() {
        const chart = LineChart.create({
            data: negPosData,
            autoScale: true,
        });

        this.addSection({
            id: 'negativePositive',
            title: 'Negative and positive values',
            content: chartContainer('linechart_negpos', chart),
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
            id: 'setNoDataBtn',
            title: 'No data',
            onClick: () => chart.setData(emptyData),
        }, {
            id: 'setData1Btn',
            title: 'Data set 1',
            onClick: () => chart.setData(negPosData),
        }, {
            id: 'setData2Btn',
            title: 'Data set 2',
            onClick: () => chart.setData(chartData3),
        }, {
            id: 'setData3Btn',
            title: 'Data set 3',
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
