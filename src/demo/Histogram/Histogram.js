import {
    onReady,
    ge,
    setEvents,
    Histogram,
} from '../../js/index.js';
import { initNavigation } from '../common/app.js';
import '../../css/common.scss';
import '../common/app.scss';
import './style.scss';

/* eslint-disable no-unused-vars */

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
        ['01.01.2013', 1], ['27.01.2013', 1], ['04.02.2013', 1], ['10.02.2013', 1],
        ['16.02.2013', 2], ['20.02.2013', 1], ['04.03.2013', 1], ['17.03.2013', 1],
        ['18.03.2013', 2], ['01.04.2013', 1], ['09.04.2013', 1], ['17.04.2013', 1],
        ['18.04.2013', 2], ['06.05.2013', 1], ['10.05.2013', 1], ['12.05.2013', 1],
        ['13.05.2013', 3], ['17.05.2013', 1], ['19.05.2013', 1], ['28.05.2013', 1],
        ['03.06.2013', 1], ['08.06.2013', 1], ['12.06.2013', 1], ['16.06.2013', 1],
        ['01.07.2013', 1], ['25.07.2013', 1], ['05.08.2013', 1], ['12.09.2013', 1],
        ['19.10.2013', 1], ['30.10.2013', 1], ['05.11.2013', 1], ['09.11.2013', 2],
        ['10.11.2013', 1], ['15.11.2013', 3], ['17.11.2013', 1], ['19.11.2013', 3],
        ['01.12.2013', 1], ['03.12.2013', 1], ['04.12.2013', 2], ['08.12.2013', 2],
        ['15.12.2013', 1], ['16.12.2013', 1], ['18.12.2013', 1], ['19.12.2013', 5],
        ['20.12.2013', 6], ['23.12.2013', 7],
    ],
};

const chartData2 = {
    values: [
        1000, 1001, 1002, 1005, 1050, 1200, 1000, 1001, 1002, 1005, 1050, 1200,
        2000, 2001, 2002, 2005, 2050, 2200, 2000, 2001, 2002, 2005, 2050, 2200,
        10000, 10001, 10002, 10005, 10050, 10200, 10000, 10001, 10002, 10005, 10050, 10200,
    ],
    series: [
        ['1000', 12], ['2000', 12], ['10000', 12],
    ],
};

const chartData3 = {
    values: [{
        data: [100, 10.1, 100.2, 10.5, 50, 1200, 99, 57.4, 10.02, 100.5, 10.50, 37],
    }, {
        data: [200, 200.1, 20.02, 200.5, 114, 220, 200, 201, 20, 45.7, 99.1, 100],
    }],
    series: [
        ['09.22', 12],
    ],
};

const chartMultiData = {
    values: [{
        data: [1000, 1001, 1002, 1005, 1050, 1200, 1000, 1001, 1002, 1005, 1050, 1200],
    }, {
        data: [553, 200, 5500, 0, 58, 347, 1302, 12, 780, 5600, 460, 150],
    }],
    series: [
        ['10.22', 4], ['11.22', 4],
    ],
};

const noData = {
    values: [],
    series: [],
};

const singleNegData = {
    values: [-12000],
    series: [['x', 1]],
};

const posData = {
    values: [180, 150, 100],
    series: [['x1', 3]],
};

const negData = {
    values: [-180, -80, -100],
    series: [['x1', 3]],
};

const negPosData = {
    values: [-450, 210, 200, -250, 100],
    series: [['x1', 5]],
};

function setHistogramEvent(str) {
    ge('histogram_events').textContent = str;
}

function onChartsScroll() {
    setHistogramEvent('Histogram scroll');
}

function onBarClick({ item }) {
    setHistogramEvent(`Clicked bar, value=${item.value}`);
}

function onBarOver({ item }) {
    setHistogramEvent(`Mouse over bar, value=${item.value}`);
}

function onBarOut({ item }) {
    setHistogramEvent(`Mouse out bar, value=${item.value}`);
}

const defaultHistogram = () => {
    Histogram.create({
        data: chartData,
        elem: 'chart',
    });
};

const fitToWidthHistogram = () => {
    Histogram.create({
        data: chartData,
        elem: 'chart_fittowidth',
        fitToWidth: true,
    });
};

const autoScaleHistogram = () => {
    Histogram.create({
        data: chartData2,
        elem: 'chart_autoscale',
        autoScale: true,
        scrollThrottle: 200,
    });
};

const formatDecimalValue = (val) => val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
const formatAsUSD = (value) => `$ ${formatDecimalValue(value)}`;

const callbacksHistogram = () => {
    Histogram.create({
        data: chartData2,
        elem: 'chart_callbacks',
        height: 320,
        marginTop: 35,
        scrollToEnd: true,
        autoScale: true,
        animate: true,
        showPopup: true,
        scrollThrottle: 50,
        activateOnHover: true,
        renderPopup: (target) => formatAsUSD(target.item.value),
        renderYAxisLabel: formatDecimalValue,
        onitemclick: onBarClick,
        onscroll: onChartsScroll,
        onitemover: onBarOver,
        onitemout: onBarOut,
    });
};

const multiColumnHistogram = () => {
    Histogram.create({
        data: chartMultiData,
        elem: 'chart_multicolumn',
        height: 320,
        marginTop: 35,
        autoScale: true,
        showPopup: true,
        scrollThrottle: 50,
        activateOnHover: true,
    });
};

const noDataHistogram = () => {
    Histogram.create({
        data: noData,
        elem: 'chart_no_data',
        autoScale: true,
    });
};

const singleNegativeHistogram = () => {
    Histogram.create({
        data: singleNegData,
        elem: 'chart_single_neg',
        autoScale: true,
        onitemover: onBarOver,
        onitemout: onBarOut,
    });
};

const onlyPositiveHistogram = () => {
    Histogram.create({
        data: posData,
        elem: 'chart_pos',
        autoScale: true,
    });
};

const onlyNegativeHistogram = () => {
    Histogram.create({
        data: negData,
        elem: 'chart_neg',
        autoScale: true,
    });
};

const negativeAndPositiveHistogram = () => {
    Histogram.create({
        data: negPosData,
        elem: 'chart_negpos',
        autoScale: true,
    });
};

const setDataHistogram = () => {
    const histogram = Histogram.create({
        data: chartData,
        elem: 'chart_setdata',
        autoScale: true,
    });

    const setData1Btn = ge('setData1Btn');
    setEvents(setData1Btn, { click: () => histogram.setData(chartData2) });
    const setData2Btn = ge('setData2Btn');
    setEvents(setData2Btn, { click: () => histogram.setData(chartData3) });
};

const init = () => {
    initNavigation();

    defaultHistogram();
    fitToWidthHistogram();
    autoScaleHistogram();
    callbacksHistogram();
    multiColumnHistogram();
    // Different data tests
    noDataHistogram();
    singleNegativeHistogram();
    onlyPositiveHistogram();
    onlyNegativeHistogram();
    negativeAndPositiveHistogram();
    setDataHistogram();
};

onReady(init);
