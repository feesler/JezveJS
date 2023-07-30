import 'jezvejs/style';
import 'jezvejs/style/Button';
import {
    ge,
    setEvents,
    createElement,
} from 'jezvejs';
import { Histogram } from 'jezvejs/Histogram';

import { DemoView } from '../../Application/DemoView.js';
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

const setHistogramEvent = (str) => {
    ge('histogram_events').textContent = str;
};

const onChartsScroll = () => {
    setHistogramEvent('Histogram scroll');
};

const onBarClick = ({ item }) => {
    setHistogramEvent(`Clicked bar, value=${item.value}`);
};

const onBarOver = ({ item }) => {
    setHistogramEvent(`Mouse over bar, value=${item.value}`);
};

const onBarOut = ({ item }) => {
    setHistogramEvent(`Mouse out bar, value=${item.value}`);
};

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

const onChangeColumnWidth = (chart, value) => {
    const columnWidthValue = ge('columnWidthValue');
    columnWidthValue.textContent = value;

    chart.setColumnWidth(value);
};

const onChangeGroupsGap = (chart, value) => {
    const groupsGapValue = ge('groupsGapValue');
    groupsGapValue.textContent = value;

    chart.setGroupsGap(value);
};

const columnWidthAndGap = () => {
    const histogram = Histogram.create({
        data: chartData,
    });
    ge('chart').append(histogram.elem);

    setEvents(ge('columnWidthRange'), {
        input: (e) => onChangeColumnWidth(histogram, e.target.value),
    });
    setEvents(ge('groupsGapRange'), {
        input: (e) => onChangeGroupsGap(histogram, e.target.value),
    });
};

const fitToWidth = () => {
    const histogram = Histogram.create({
        data: chartData,
        fitToWidth: true,
    });
    ge('chart_fittowidth').append(histogram.elem);
};

const autoScale = () => {
    const histogram = Histogram.create({
        data: chartData2,
        autoScale: true,
        className: 'histogram_autoscale',
    });
    ge('chart_autoscale').append(histogram.elem);
};

const formatDecimalValue = (val) => val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
const formatAsUSD = (value) => `$ ${formatDecimalValue(value)}`;

const callbacks = () => {
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
        onItemClick: onBarClick,
        onScroll: onChartsScroll,
        onItemOver: onBarOver,
        onItemOut: onBarOut,
    });
    ge('chart_callbacks').append(histogram.elem);
};

const multiColumn = () => {
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
    ge('chart_multicolumn').append(histogram.elem);
};

const stacked = () => {
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
    ge('stacked-histogram').append(histogram.elem);
};

const stackedNegative = () => {
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
    ge('stacked-neg-histogram').append(histogram.elem);
};

const stackedGrouped = () => {
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
    ge('stacked-grouped-histogram').append(histogram.elem);
};

const stackedCategories = () => {
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
    ge('stacked-categories-histogram').append(histogram.elem);
};

const noData = () => {
    const histogram = Histogram.create({
        data: emptyData,
        autoScale: true,
    });
    ge('chart_no_data').append(histogram.elem);
};

const singleNegative = () => {
    const histogram = Histogram.create({
        data: singleNegData,
        autoScale: true,
        onItemOver: onBarOver,
        onItemOut: onBarOut,
    });
    ge('chart_single_neg').append(histogram.elem);
};

const onlyPositive = () => {
    const histogram = Histogram.create({
        data: posData,
        autoScale: true,
    });
    ge('chart_pos').append(histogram.elem);
};

const onlyNegative = () => {
    const histogram = Histogram.create({
        data: negData,
        autoScale: true,
    });
    ge('chart_neg').append(histogram.elem);
};

const negativeAndPositive = () => {
    const histogram = Histogram.create({
        data: negPosData,
        elem: 'chart_negpos',
        autoScale: true,
    });
    ge('chart_negpos').append(histogram.elem);
};

const setData = () => {
    const histogram = Histogram.create({
        data: negPosData,
        elem: 'chart_setdata',
        autoScale: true,
        showLegend: true,
        scrollToEnd: true,
        renderLegend: renderCustomLegend,
    });
    ge('chart_setdata').append(histogram.elem);

    setEvents(ge('setNoDataBtn'), { click: () => histogram.setData(emptyData) });
    setEvents(ge('setData1Btn'), { click: () => histogram.setData(negPosData) });
    setEvents(ge('setData2Btn'), { click: () => histogram.setData(chartData3) });
    setEvents(ge('setData3Btn'), { click: () => histogram.setData(chartGroupedCategoriesData) });
    setEvents(ge('largeDataBtn'), { click: () => histogram.setData(largeData) });
};

class HistogramView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initTableOfContents();
        this.addTableOfContentsItem({ title: 'Change \'columnWidth\' and \'groupsGap\'', url: 'columnWidth' });
        this.addTableOfContentsItem({ title: '\'fitToWidth\' option', url: 'fitToWidth' });
        this.addTableOfContentsItem({ title: '\'autoScale\' option', url: 'autoScale' });
        this.addTableOfContentsItem({ title: 'Callbacks', url: 'callbacks' });
        this.addTableOfContentsItem({ title: 'Multi column + Legend', url: 'multiColumn' });
        this.addTableOfContentsItem({ title: 'Stacked + Custom legend', url: 'stacked' });
        this.addTableOfContentsItem({ title: 'Stacked + Custom legend', url: 'stacked' });
        this.addTableOfContentsItem({ title: 'Stacked with negative values', url: 'stackedNegative' });
        this.addTableOfContentsItem({ title: 'Stacked and grouped', url: 'grouped' });
        this.addTableOfContentsItem({ title: 'Stacked and grouped with custom categories', url: 'customCategories' });
        this.addTableOfContentsItem({ title: 'No data', url: 'noData' });
        this.addTableOfContentsItem({ title: 'Single negative value', url: 'singleNagative' });
        this.addTableOfContentsItem({ title: 'Only positive values', url: 'onlyPositive' });
        this.addTableOfContentsItem({ title: 'Negative and positive values', url: 'negativePositive' });
        this.addTableOfContentsItem({ title: 'Set data', url: 'setData' });

        columnWidthAndGap();
        fitToWidth();

        autoScale();
        callbacks();
        multiColumn();
        stacked();
        stackedNegative();
        stackedGrouped();
        stackedCategories();
        // Different data tests
        noData();
        singleNegative();
        onlyPositive();
        onlyNegative();
        negativeAndPositive();
        setData();
    }
}

HistogramView.create();
