import 'jezvejs/style';
import { createElement } from 'jezvejs';
import { Histogram } from 'jezvejs/Histogram';

import { DemoView } from '../../Application/DemoView.js';
import { createButtons, createControls } from '../../Application/utils.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import { RangeInputField } from '../../Components/RangeInputField/RangeInputField.js';
import largeData from './largeData.json';
import './HistogramView.scss';

const chartData = {
    values: [
        30, 25639, 30, 1653.72, 10496, 974, 195, 30, 845, 890, 1165, 30, 4990, 2750,
        741, 893.48, 30, 132, 1250, 1009, 231, 774, 1230, 1018, 3444.86, 30, 3700, 598,
        100, 30, 630, 30, 30, 30, 150, 12787.9, 12787.9, 30, 214, 248, 416, 738.4, 791,
        493, 510, 585, 4938, 775, 30, 619.4, 335, 1759, 1987.7, 875, 3289.44, 928.73,
        100, 3831, 3245.9, 2929.55, 2789.94, 279.23, 3718.37, 2005.78, 2266.39,
        2871.38, 100, 100, 930.76, 642.22, 1303.06, 3197.15, 100,
    ],
    series: [
        '01.01.2013', '27.01.2013', '04.02.2013', '10.02.2013', '16.02.2013',
        '16.02.2013', '20.02.2013', '04.03.2013', '17.03.2013', '18.03.2013',
        '18.03.2013', '01.04.2013', '09.04.2013', '17.04.2013', '18.04.2013',
        '18.04.2013', '06.05.2013', '10.05.2013', '12.05.2013', '13.05.2013',
        '13.05.2013', '13.05.2013', '17.05.2013', '19.05.2013', '28.05.2013',
        '03.06.2013', '08.06.2013', '12.06.2013', '16.06.2013', '01.07.2013',
        '25.07.2013', '05.08.2013', '12.09.2013', '19.10.2013', '30.10.2013',
        '05.11.2013', '09.11.2013', '09.11.2013', '10.11.2013', '15.11.2013',
        '15.11.2013', '15.11.2013', '17.11.2013', '19.11.2013', '19.11.2013',
        '19.11.2013', '01.12.2013', '03.12.2013', '04.12.2013', '04.12.2013',
        '08.12.2013', '08.12.2013', '15.12.2013', '16.12.2013', '18.12.2013',
        '19.12.2013', '19.12.2013', '19.12.2013', '19.12.2013', '19.12.2013',
        '20.12.2013', '20.12.2013', '20.12.2013', '20.12.2013', '20.12.2013',
        '20.12.2013', '23.12.2013', '23.12.2013', '23.12.2013', '23.12.2013',
        '23.12.2013', '23.12.2013', '23.12.2013',
    ],
};

const chartData2 = {
    values: [
        1000, 1001, 1002, 1005, 1050, 1200, 1000, 1001, 1002, 1005, 1050, 1200,
        2000, 2001, 2002, 2005, 2050, 2200, 2000, 2001, 2002, 2005, 2050, 2200,
        10000, 10001, 10002, 10005, 10050, 10200, 10000, 10001, 10002, 10005, 10050, 10200,
    ],
    series: [
        '1000', '1000', '1000', '1000', '1000',
        '1000', '1000', '1000', '1000', '1000',
        '1000', '1000', '2000', '2000', '2000',
        '2000', '2000', '2000', '2000', '2000',
        '2000', '2000', '2000', '2000', '10000',
        '10000', '10000', '10000', '10000', '10000',
        '10000', '10000', '10000', '10000', '10000',
        '10000/10000',
    ],
};

const chartData3 = {
    values: [{
        data: [100, 10.1, 100.2, 10.5, 50, 1200, 99, 57.4, 10.02, 100.5, 10.50, 37],
    }, {
        data: [200, 200.1, 20.02, 200.5, 114, 220, 200, 201, 20, 45.7, 99.1, 100],
    }],
    series: [
        '09.22', '09.22', '09.22', '09.22', '09.22',
        '09.22', '09.22', '09.22', '09.22', '09.22',
        '09.22', '09.22',
    ],
};

const chartMultiData = {
    values: [{
        data: [1000, 1001, 1002, 1005, 1050, 1200, 1000, 1001, 1002, 1005, 1050, 1200],
        category: 'cat1',
        group: 1,
    }, {
        data: [553, 200, 5500, 0, 58, 347, 1302, 12, 780, 5600, 460, 150, 2000, 2000],
        category: 'cat1',
        group: 2,
    }, {
        data: [50, 200, 550, 100, 850, 1220, 1302, 900, 780, 1800, 2210, 2500, 2100, 2200],
        category: 'cat1',
        group: 3,
    }],
    series: [
        '10.22', '10.22', '10.22', '10.22', '11.22',
        '11.22', '11.22', '11.22', '12.22', '12.22',
        '12.22', '12.22',
    ],
};

const chartNegMultiData = {
    values: [{
        data: [1000, 1001, 1002, 1005, 1050, 1200, 1000, 1001, 1002, 1005, 1050, 1200],
    }, {
        data: [50, 200, 550, 100, 850, 1220, 1302, 900, 780, 1800, 2210, 2500, 2100, 2200],
    }, {
        data: [-553, -200, -5500, 0, -58, -347, -1302, -12, -780, -5600, -460, -150, -2000, -2000],
    }, {
        data: [-50, -200, -550, -100, -850, -1220, -1302, -900, -780, -1800, -2210, -2500, -2100],
    }],
    series: [
        '10.22', '10.22', '10.22', '10.22', '11.22',
        '11.22', '11.22', '11.22', '12.22', '12.22',
        '12.22', '12.22',
    ],
    stacked: true,
};

const chartStackedData = {
    values: [{
        data: [1000, 1001, 1002, 1005, 1050, 1200, 1000, 1001, 1002, 1005, 1050, 1200],
    }, {
        data: [553, 200, 5500, 0, 58, 347, 1302, 12, 780, 5600, 460, 150, 2000, 2000],
    }, {
        data: [50, 200, 550, 100, 850, 1220, 1302, 900, 780, 1800, 2210, 2500, 2100, 2200],
    }],
    series: [
        '10.22', '10.22', '10.22', '10.22', '11.22',
        '11.22', '11.22', '11.22', '12.22', '12.22',
        '12.22', '12.22',
    ],
    stacked: true,
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

const emptyData = {
    values: [],
    series: [],
};

const singleNegData = {
    values: [-12000],
    series: ['x'],
};

const posData = {
    values: [180, 150, 100],
    series: ['x1', 'x1', 'x1'],
};

const negData = {
    values: [-180, -80, -100],
    series: ['x1', 'x1', 'x1'],
};

const negPosData = {
    values: [-450, 210, 200, -250, 100],
    series: ['x1', 'x1', 'x1', 'x1', 'x1'],
};

const chartContainer = (id, chart) => createElement('div', {
    props: { id, className: 'std_chart_wrap' },
    children: chart.elem,
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

const renderCustomLegend = (categories) => {
    if (!Array.isArray(categories) || categories.length === 0) {
        return null;
    }

    return createElement('ul', {
        props: { className: 'chart__legend-list' },
        children: categories.map((_, index) => createElement('li', {
            props: {
                className: `list-item_category-${index + 1}`,
            },
            children: createElement('span', {
                props: { textContent: `Category ${index + 1}` },
            }),
        })),
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
                props: { textContent: item.value },
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

        this.leftYAxis();
        this.noYAxis();

        this.autoScale();
        this.callbacks();
        this.multiColumn();
        this.stacked();
        this.stackedNegative();
        this.stackedGrouped();
        this.stackedCategories();
        // Different data tests
        this.noData();
        this.singleNegative();
        this.onlyPositive();
        this.onlyNegative();
        this.negativeAndPositive();
        this.setData();
    }

    columnWidthAndGap() {
        const histogram = Histogram.create({
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

    leftYAxis() {
        const histogram = Histogram.create({
            data: chartData2,
            yAxis: 'left',
            className: 'histogram_left_yaxis',
        });

        this.addSection({
            id: 'leftYAxis',
            title: '\'yAxis\' option: left',
            content: chartContainer('chart_left_yaxis', histogram),
        });
    }

    noYAxis() {
        const histogram = Histogram.create({
            data: chartData2,
            yAxis: 'none',
            className: 'histogram_no_yaxis',
        });

        this.addSection({
            id: 'noYAxis',
            title: '\'yAxis\' option: none',
            content: chartContainer('chart_no_yaxis', histogram),
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
            renderPopup: renderMultiColumnPopup,
            showLegend: true,
        });

        this.addSection({
            id: 'multiColumn',
            title: 'Multi column + Legend',
            description: ' + \'showPopupOnHover\' and \'activateOnHover\' options',
            content: chartContainer('chart_multicolumn', histogram),
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
            renderLegend: renderCustomLegend,
        });

        this.addSection({
            id: 'stacked',
            title: 'Stacked + Custom legend',
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
            renderLegend: renderCustomLegend,
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
            renderLegend: renderCustomLegend,
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
            renderLegend: renderCustomLegend,
        });

        this.addSection({
            id: 'customCategories',
            title: 'Stacked and grouped with custom categories',
            description: ' + \'showPopupOnHover\', \'animatePopup\' and \'pinPopupOnClick\' options',
            content: chartContainer('stacked-categories-histogram', histogram),
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
            renderLegend: renderCustomLegend,
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
