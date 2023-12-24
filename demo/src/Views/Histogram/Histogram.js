import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
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

import { ChartCustomLegend } from '../../Components/ChartCustomLegend/ChartCustomLegend.js';
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import { RadioFieldset } from '../../Components/RadioFieldset/RadioFieldset.js';
import { RangeInputField } from '../../Components/RangeInputField/RangeInputField.js';

import './HistogramView.scss';

const maxColumnWidthData = {
    values: [
        30, 100, 50,
    ],
    series: [
        '01.01.2013', '27.01.2013', '04.02.2013',
    ],
};

const chartGroupedData = {
    values: [{
        data: [1000, 1001, 1002, 1005, -1050, -1200, 1000, 1001, 1002, -1005, 1050, 1200],
        group: 'first',
    }, {
        data: [50, 200, 550, -100, 850, -1220, 1302, 900, -780, 1800, 2210, 2500, -2100, 2200],
        group: 'first',
    }, {
        data: [553, 200, 5500, 0, 58, 347, 1302, -12, -780, 5600, 460, 150, 2000, 2000],
        group: 'second',
    }, {
        data: [50, 200, 550, -100, 850, -1220, 1302, 900, -780, 1800, 2210, -2500, 2100],
        group: 'second',
    }],
    series: [
        '10.22', '10.22', '10.22', '10.22', '11.22',
        '11.22', '11.22', '11.22', '12.22', '12.22',
        '12.22', '12.22',
    ],
    stacked: true,
};

const chartGroupedCategoriesData = {
    values: [{
        data: [1000, 1001, 1002, 1005, -1050, -1200, 1000, 1001, 1002, -1005, 1050, 1200],
        group: 'first',
        category: 'cat1',
    }, {
        data: [50, 200, 550, -100, 850, -1220, 1302, 900, -780, 1800, 2210, 2500, -2100, 2200],
        group: 'first',
        category: 'cat2',
    }, {
        data: [553, 200, 5500, 0, 58, 347, 1302, -12, -780, 5600, 460, 150, 2000, 2000],
        group: 'second',
        category: 'cat1',
    }, {
        data: [50, 200, 550, 0, 850, -1220, 1302, 900, -780, 1800, 2210, -2500, 2100],
        group: 'second',
        category: 'cat2',
    }],
    series: [
        '10.22', '10.22', '10.22', '10.22', '11.22',
        '11.22', '11.22', '11.22', '12.22', '12.22',
        '12.22', '12.22',
    ],
    stacked: true,
};

const legendCategoriesData = {
    values: [{
        data: [1000, 450, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        group: 'first',
        category: 'cat1',
    }, {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 320, 0, 0, 0, 0, 0, 0, 0, 0],
        group: 'second',
        category: 'cat2',
    }, {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 560, 890],
        group: 'third',
        category: 'cat3',
    }, {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        group: 'fourth',
        category: 'cat4',
    }],
    series: [
        '10.22', '10.22', '10.22', '10.22', '11.22',
        '11.22', '11.22', '11.22', '12.22', '12.22',
        '12.22', '12.22',
    ],
};

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

const renderCategoriesPopup = (target) => {
    if (!target.group) {
        return createElement('span', { props: { textContent: target.item.value } });
    }

    const listItems = [];
    target.group.forEach((item, index) => {
        if (
            item.columnIndex !== target.item.columnIndex
            || item.value === 0
        ) {
            return;
        }

        const listItem = createElement('li', {
            props: {
                className: `list-item_category-${item.categoryIndex + 1}`,
            },
            children: createElement(((target.index === index) ? 'b' : 'span'), {
                props: { textContent: `Long data category name ${index + 1}: ${item.value}` },
            }),
        });
        listItems.push(listItem);
    });

    if (listItems.length === 0) {
        return null;
    }

    const list = createElement('ul', {
        props: { className: 'custom-chart-popup__list' },
        children: listItems,
    });

    return createElement('div', {
        props: { className: 'custom-chart-popup' },
        children: [
            createElement('b', { props: { textContent: target.item.groupName } }),
            createElement('div', { props: { textContent: target.series } }),
            list,
        ],
    });
};

/**
 * Histogram component demo view
 */
class HistogramView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.columnWidthAndGap();
        this.fitToWidth();
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

        this.noData();
        this.singleNegative();
        this.onlyPositive();
        this.onlyNegative();
        this.negativeAndPositive();
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

            chart = Histogram.create({
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
            elem: 'chart_multicolumn',
            height: 320,
            marginTop: 35,
            autoScale: true,
            showPopupOnHover: true,
            activateOnHover: true,
            renderPopup: renderCategoriesPopup,
            showLegend: true,
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
            renderPopup: renderMultiColumnPopup,
            showLegend: true,
            activateCategoryOnClick: true,
            setActiveCategory: (...args) => histogram.setActiveCategory(...args),
            components: {
                Legend: ChartCustomLegend,
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
            renderPopup: renderMultiColumnPopup,
            showLegend: true,
            components: {
                Legend: ChartCustomLegend,
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
            renderPopup: renderMultiColumnPopup,
            showLegend: true,
            components: {
                Legend: ChartCustomLegend,
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
            renderPopup: renderCategoriesPopup,
            activateOnClick: true,
            activateOnHover: true,
            showLegend: true,
            components: {
                Legend: ChartCustomLegend,
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
            renderPopup: renderMultiColumnPopup,
            activateOnClick: true,
            activateOnHover: true,
            showLegend: true,
            onlyVisibleCategoriesLegend: true,
            components: {
                Legend: ChartCustomLegend,
            },
        });

        this.addSection({
            id: 'legendCategories',
            title: 'Only visible categories legend',
            description: '\'onlyVisibleCategoriesLegend\' option. Default value if false',
            content: chartContainer('legendCategoriesHistogram', histogram),
        });
    }

    noData() {
        const histogram = Histogram.create({
            data: emptyData,
            autoScale: true,
        });

        this.addSection({
            id: 'noData',
            title: 'No data',
            content: chartContainer('chart_no_data', histogram),
        });
    }

    singleNegative() {
        const histogram = Histogram.create({
            data: singleNegData,
            autoScale: true,
        });

        this.addSection({
            id: 'singleNagative',
            title: 'Single negative value',
            content: chartContainer('chart_single_neg', histogram),
        });
    }

    onlyPositive() {
        const histogram = Histogram.create({
            data: posData,
            autoScale: true,
        });

        this.addSection({
            id: 'onlyPositive',
            title: 'Only positive values',
            content: chartContainer('chart_pos', histogram),
        });
    }

    onlyNegative() {
        const histogram = Histogram.create({
            data: negData,
            autoScale: true,
        });

        this.addSection({
            id: 'onlyNegative',
            title: 'Only negative values',
            content: chartContainer('chart_neg', histogram),
        });
    }

    negativeAndPositive() {
        const histogram = Histogram.create({
            data: negPosData,
            elem: 'chart_negpos',
            autoScale: true,
        });

        this.addSection({
            id: 'negativePositive',
            title: 'Negative and positive values',
            content: chartContainer('chart_negpos', histogram),
        });
    }

    setData() {
        const histogram = Histogram.create({
            data: negPosData,
            elem: 'chart_setdata',
            autoScale: true,
            showLegend: true,
            scrollToEnd: true,
            components: {
                Legend: ChartCustomLegend,
            },
        });

        const items = [{
            id: 'setNoDataBtn',
            title: 'No data',
            onClick: () => histogram.setData(emptyData),
        }, {
            id: 'setData1Btn',
            title: 'Data set 1',
            onClick: () => histogram.setData(negPosData),
        }, {
            id: 'setData2Btn',
            title: 'Data set 2',
            onClick: () => histogram.setData(chartData3),
        }, {
            id: 'setData3Btn',
            title: 'Data set 3',
            onClick: () => histogram.setData(chartGroupedCategoriesData),
        }, {
            id: 'largeDataBtn',
            title: 'Large data set',
            onClick: () => histogram.setData(largeData),
        }];

        this.addSection({
            id: 'setData',
            title: 'Set data',
            content: [
                chartContainer('chart_setdata', histogram),
                createButtons(items),
            ],
        });
    }
}

HistogramView.create();
