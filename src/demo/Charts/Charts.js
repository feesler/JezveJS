import {
    onReady,
    Histogram,
    LineChart,
    ge,
} from '../../js/index.js';
import '../../css/common.scss';
import '../css/common.scss';
import '../css/app.scss';
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

const chartMultiData = {
    values: [{
        data: [1000, 1001, 1002, 1005, 1050, 1200, 1000, 1001, 1002, 1005, 1050, 1200],
    }, {
        data: [553, 200, 5500, 0, 58, 347, 1302, 12, 780, 5600, 460, 150],
    }],
    series: [
        ['10.22', 4], ['11.22', 4], ['12.22', 5],
    ],
};

/* eslint-disable max-len */
const eurData = {
    values: [46.8507, 46.8350, 46.4266, 46.7712, 47.0161, 47.1145, 47.2677, 47.5463, 47.6296, 47.8253, 47.4908, 47.3211, 46.8746, 46.7269, 46.4764, 46.8085, 47.2121, 47.1715, 46.6960, 46.8821, 46.6478, 46.2212, 46.1576, 46.0226, 45.8251, 46.1827, 46.8335, 46.8398, 46.6863, 46.6870, 46.9448, 46.8122, 46.4146, 46.1649, 46.3328, 46.6835, 46.7910, 46.6299, 47.0702, 47.5505, 47.5048, 47.3758, 46.8718, 47.1702, 47.2206, 47.4799, 47.8635, 47.8958, 47.4699, 47.8244, 47.8671, 48.0490, 48.2432, 48.4947, 48.7722, 48.2856, 48.2402, 48.4110, 48.1416, 48.1231, 48.2398, 48.2133, 48.1924, 48.1686, 47.8548, 47.6641, 47.7282, 47.6177, 47.9520, 48.6315, 48.9677, 49.0193, 49.0213, 48.3786, 47.7806, 47.9789, 47.7118, 48.0636, 48.2484, 48.6647, 49.1958, 50.0582, 49.6923, 49.4592, 49.5379, 49.6193, 49.6912, 49.3145, 48.8449, 49.3386, 49.9540, 49.9817, 50.0554, 49.9484, 50.2021, 50.0775, 50.2017, 50.5091, 50.9585, 51.0538, 51.0798, 51.5141, 51.7829, 52.1504, 52.5253, 52.1198, 52.6468, 52.1388, 52.4424, 52.9065, 53.2342, 53.8693, 54.3393, 54.6378, 52.7219, 55.6234, 56.5450, 59.3153, 57.2418, 57.0494, 57.8575, 57.4235, 58.9793, 59.3081, 58.6448, 58.9090, 58.5817, 57.4377, 55.5336, 55.8779, 57.9052, 59.6215, 61.4108, 64.4425, 63.2414, 67.2652, 64.8443, 65.7168, 65.4248, 66.8809, 67.1989, 68.2942, 70.5289, 72.6642, 76.1516, 84.5890, 73.3414, 74.5727, 69.2503, 66.7539, 66.4031, 64.3177, 63.5131, 69.0590, 68.3427, 68.3681, 74.3551, 76.7735, 77.9629, 76.3352, 75.8623, 75.1740, 75.2735, 75.8218, 75.7724, 71.9067, 73.5633, 76.2922, 76.2629, 77.5690, 78.1105, 78.7900, 76.8271, 75.0415, 77.9356, 75.6591, 74.5833, 74.1382, 74.7386, 74.8311, 74.3675, 71.5426, 71.3243, 71.0800, 70.9408, 70.0315, 71.9422, 71.1655, 68.9797, 68.6857, 69.5424, 69.8487, 69.1138, 68.3086, 66.1012, 65.5242, 66.9168, 64.6232, 64.9650, 65.4063, 65.4314, 65.0108, 64.1446, 64.0504, 64.1473, 64.3425, 62.7651, 62.0811, 62.5655, 63.3695, 62.0487, 62.7476, 61.6919, 61.7363, 62.0377, 60.4124, 58.7003, 56.5251, 54.2749, 55.5201, 54.8387, 53.6598, 52.9087, 54.5163, 55.5496, 57.5998, 57.7226, 55.1255, 54.6590, 55.8747, 56.9016, 56.8060, 57.1578, 57.4093, 56.1843, 57.2207, 56.8971, 57.1102, 55.7138, 57.1383, 56.9881, 56.1030, 55.1085, 55.2441, 55.5714, 55.5508, 54.7477, 54.8412, 55.6757, 57.1433, 58.0145, 57.7020, 58.6037, 59.1130, 61.9471, 63.3221, 62.5053, 63.0721, 62.2064, 61.4754, 62.1045, 61.1040, 60.7452, 60.6417, 60.9130, 60.8567, 61.0546, 60.5852, 61.1986, 61.4066, 61.5206, 62.3803, 61.6556, 61.5661, 61.7492, 62.4246, 63.0441, 63.0822, 63.0430, 62.9474, 62.9819, 62.6239, 62.3986, 62.1841, 61.9183, 61.6929, 61.7622, 62.3948, 62.9330, 63.6090, 65.0830, 66.6248, 65.9882, 64.6478, 66.0002, 68.5770, 68.9961, 68.1435, 69.6314, 69.8089, 70.7540, 69.6762, 72.2078, 71.1475, 72.3650, 72.5712, 72.9187, 72.7085, 74.4738, 76.6709, 81.1533, 80.7248, 79.7252, 76.3369, 75.0469, 74.8478, 73.8449, 75.0901, 75.2659, 75.4011, 76.3692, 76.9246, 75.5742, 76.6951, 76.8165, 77.1313, 75.9013, 74.2407, 73.9378, 74.9726, 74.8304, 73.9568, 73.5367, 74.5435, 73.1397, 73.2684, 74.5825, 73.7760, 72.4865, 73.6302, 73.7951, 72.9468, 70.4691, 70.3052, 69.3450, 69.5499, 70.8977, 72.0506, 71.2810, 69.7710, 69.7796, 70.5290, 71.1738, 71.0895, 68.7903, 69.0104, 70.2124, 72.1479, 70.1427, 70.7537, 70.3961, 70.3782, 68.8261, 69.2555, 69.6136, 69.2394, 69.3797, 70.3370, 71.8184, 71.3987, 69.7819, 69.0021, 69.3390, 69.3886, 69.7037, 69.8076, 69.8987, 69.7034, 70.3859, 70.6478, 70.1345, 70.8647, 71.7404, 73.6721, 74.4079, 75.3111, 75.5595, 76.0674, 75.7472, 75.7472, 76.9659, 78.2312, 77.0400, 76.6788, 77.4052, 77.4830, 77.6145, 77.5443, 76.0441, 77.0500, 77.6032, 79.5470, 79.6972, 79.6395, 82.8090,
    ],
    series: [
    ],
};
/* eslint-enable max-len */

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

function onBarClick(e, item) {
    setHistogramEvent(`Clicked bar, value=${item.value}`);
}

function onBarOver(e, item) {
    item.elem.classList.add('chart__item_active');

    setHistogramEvent(`Mouse over bar, value=${item.value}`);
}

function onBarOut(e, item) {
    item.elem.classList.remove('chart__item_active');

    setHistogramEvent(`Mouse out bar, value=${item.value}`);
}

function setLinechartEvent(str) {
    ge('linechart_events').textContent = str;
}

function onNodeClick(e, item) {
    setLinechartEvent(`Clicked node, value=${item.value}`);
}

function onNodeOver(e, item) {
    item.elem.classList.add('chart__item_active');

    setLinechartEvent(`Mouse over node, value=${item.value}`);
}

function onNodeOut(e, item) {
    item.elem.classList.remove('chart__item_active');

    setLinechartEvent(`Mouse out node, value=${item.value}`);
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
        renderPopup: (item) => `$ ${item.value}`,
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
        onitemclick: onBarClick,
        onscroll: onChartsScroll,
        onitemover: onBarOver,
        onitemout: onBarOut,
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

const defaultLinechart = () => {
    LineChart.create({
        data: chartData,
        elem: 'linechart',
    });
};

const fitToWidthLinechart = () => {
    LineChart.create({
        data: chartData,
        elem: 'linechart_fittowidth',
        fitToWidth: true,
    });
};

const autoScaleLinechart = () => {
    LineChart.create({
        data: eurData,
        elem: 'linechart_autoscale',
        autoScale: true,
    });
};

const callbacksLinechart = () => {
    LineChart.create({
        data: chartData,
        elem: 'linechart_callbacks',
        height: 320,
        marginTop: 35,
        scrollToEnd: true,
        autoScale: true,
        animate: true,
        showPopup: true,
        onitemclick: onNodeClick,
        onscroll: onChartsScroll,
        onitemover: onNodeOver,
        onitemout: onNodeOut,
    });
};

const multipleLinechart = () => {
    LineChart.create({
        data: chartMultiData,
        elem: 'linechart_multiple',
        height: 320,
        marginTop: 35,
        autoScale: true,
        showPopup: true,
        onitemclick: onNodeClick,
        onscroll: onChartsScroll,
        onitemover: onNodeOver,
        onitemout: onNodeOut,
    });
};

const noDataLinechart = () => {
    LineChart.create({
        data: noData,
        elem: 'linechart_no_data',
        autoScale: true,
    });
};

const singleNegativeLinechart = () => {
    LineChart.create({
        data: singleNegData,
        elem: 'linechart_single_neg',
        autoScale: true,
    });
};

const onlyPositiveLinechart = () => {
    LineChart.create({
        data: posData,
        elem: 'linechart_pos',
        autoScale: true,
    });
};

const onlyNegativeLinechart = () => {
    LineChart.create({
        data: negData,
        elem: 'linechart_neg',
        autoScale: true,
    });
};

const negativeAndPositiveLinechart = () => {
    LineChart.create({
        data: negPosData,
        elem: 'linechart_negpos',
        autoScale: true,
    });
};

const init = () => {
    // Histogram
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

    // LineChart
    defaultLinechart();
    fitToWidthLinechart();
    autoScaleLinechart();
    callbacksLinechart();
    multipleLinechart();
    // Different data tests
    noDataLinechart();
    singleNegativeLinechart();
    onlyPositiveLinechart();
    onlyNegativeLinechart();
    negativeAndPositiveLinechart();
};

onReady(init);
