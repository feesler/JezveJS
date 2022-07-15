import { ge, ce, onReady } from '../../js/index.js';
import { ChartGrid } from '../../Components/Charts/ChartGrid.js';
import { Histogram } from '../../Components/Charts/Histogram.js';
import { LineChart } from '../../Components/Charts/LineChart.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import '../Charts/charts.css';

const assert = {
    equal(a, b) {
        const result = (a === b);
        if (!result) {
            throw new Error(`Value '${a}' not equal to '${b}'`);
        }
    },
};

function runTests() {
    const exponentTestsData = [
        { value: 0, expected: 1 },
        { value: 1, expected: 1 },
        { value: 10, expected: 10 },
        { value: 15, expected: 10 },
        { value: 150, expected: 100 },
        { value: 1000, expected: 1000 },
        { value: 5000, expected: 1000 },
        { value: 500500, expected: 100000 },
        { value: -1, expected: 1 },
        { value: -10, expected: 10 },
        { value: 0.1, expected: 0.1 },
        { value: 0.9, expected: 0.1 },
        { value: 0.01, expected: 0.01 },
        { value: 0.015, expected: 0.01 },
        { value: 0.001, expected: 0.001 },
        { value: 0.0019, expected: 0.001 },
        { value: 0.009, expected: 0.001 },
        { value: 0.0009, expected: 0.0001 },
        { value: 0.00001, expected: 0.00001 },
        { value: 0.000009, expected: 0.000001 },
    ];

    const grid = new ChartGrid({
        height: 200,
        margin: 10,
    });

    exponentTestsData.forEach((data) => {
        const res = grid.getExp(data.value);
        assert.equal(res.exponent, data.expected);
    });
}

function initChartContainer(data) {
    const testCharts = ge('testCharts');
    const res = {};

    const dataDescr = data.values.join(', ');

    res.descrElem = ce('div', { className: 'test-chart__descr', textContent: dataDescr });
    res.chartElem = ce('div', { className: 'std_chart_wrap' });
    res.elem = ce('div', { className: 'test-chart-container' }, [
        res.descrElem,
        res.chartElem,
    ]);

    testCharts.appendChild(res.elem);

    return res;
}

function initHistogram(data) {
    const contaier = initChartContainer(data);
    Histogram.create({
        data,
        elem: contaier.chartElem,
    });
}

function initLineChart(data) {
    const contaier = initChartContainer(data);
    LineChart.create({
        data,
        elem: contaier.chartElem,
    });
}

function init() {
    runTests();

    initHistogram({
        values: [16925],
        series: [['01.01.2021', 1]],
    });
    initHistogram({
        values: [-16925],
        series: [['01.01.2021', 1]],
    });
    initHistogram({
        values: [16925, -16925],
        series: [['01.01.2021', 2]],
    });
    initHistogram({
        values: [2580, 2],
        series: [['02.01.2021', 2]],
    });
    initHistogram({
        values: [-6925, -300],
        series: [['02.01.2021', 2]],
    });
    initHistogram({
        values: [2580, 2, -6925, -300],
        series: [['02.01.2021', 4]],
    });

    initLineChart({
        values: [55.5336, 67.2652, 58.1207],
        series: [['01.01.2021', 2], ['02.01.2021', 1]],
    });
    initLineChart({
        values: [46.5, 48.26],
        series: [['01.01.2021', 2]],
    });
    initLineChart({
        values: [5500.536, 5517.652, 5441.1207],
        series: [['01.01.2021', 2], ['02.01.2021', 1]],
    });
    initLineChart({
        values: [1.007536, 1.00652, 1.01207],
        series: [['01.01.2021', 2], ['02.01.2021', 1]],
    });
    initLineChart({
        values: [0.007536, 0.00652, 0.01207],
        series: [['01.01.2021', 2], ['02.01.2021', 1]],
    });
    initLineChart({
        values: [0.00036, 0.00002],
        series: [['01.01.2021', 2]],
    });
}

onReady(init);
