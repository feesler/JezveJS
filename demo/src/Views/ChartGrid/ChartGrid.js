import 'jezvejs/style';
import { createElement } from 'jezvejs';
import { ChartGrid } from 'jezvejs/ChartGrid';
import { Histogram } from 'jezvejs/Histogram';
import { LineChart } from 'jezvejs/LineChart';

import { DemoView } from '../../Application/DemoView.js';
import './ChartGridView.scss';

const assert = {
    equal(a, b) {
        const result = (a === b);
        if (!result) {
            throw new Error(`Value '${a}' not equal to '${b}'`);
        }
    },
};

const runTests = () => {
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
};

class ChartGridView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        runTests();

        this.initTableOfContents();

        this.initHistogram();
        this.initLineChart();
    }

    initChartContainer(data) {
        const res = {
            descrElem: createElement('div', {
                props: {
                    className: 'test-chart__descr',
                    textContent: data.values.join(', '),
                },
            }),
            chartElem: createElement('div', { props: { className: 'std_chart_wrap' } }),
        };

        res.elem = createElement('div', {
            props: { className: 'test-chart-container' },
            children: [
                res.descrElem,
                res.chartElem,
            ],
        });

        return res;
    }

    createHistogram(data) {
        const container = this.initChartContainer(data);
        const chart = Histogram.create({ data });
        container.chartElem.append(chart.elem);
        return container;
    }

    createLineChart(data) {
        const container = this.initChartContainer(data);
        const chart = LineChart.create({ data });
        container.chartElem.append(chart.elem);
        return container;
    }

    initHistogram() {
        const data = [{
            values: [16925],
            series: [['01.01.2021', 1]],
        }, {
            values: [16925],
            series: [['01.01.2021', 1]],
        }, {
            values: [-16925],
            series: [['01.01.2021', 1]],
        }, {
            values: [16925, -16925],
            series: [['01.01.2021', 2]],
        }, {
            values: [2580, 2],
            series: [['02.01.2021', 2]],
        }, {
            values: [-6925, -300],
            series: [['02.01.2021', 2]],
        }, {
            values: [2580, 2, -6925, -300],
            series: [['02.01.2021', 4]],
        }, {
            values: [0, 0, 0, 0],
            series: [['02.01.2021', 4]],
        }];

        this.addSection({
            id: 'histogram',
            title: 'Histogram',
            content: createElement('div', {
                props: { className: 'row-section row-wrap' },
                children: data.map((item) => this.createHistogram(item).elem),
            }),
        });
    }

    initLineChart() {
        const data = [{
            values: [55.5336, 67.2652, 58.1207],
            series: [['01.01.2021', 2], ['02.01.2021', 1]],
        }, {
            values: [46.5, 48.26],
            series: [['01.01.2021', 2]],
        }, {
            values: [5500.536, 5517.652, 5441.1207],
            series: [['01.01.2021', 2], ['02.01.2021', 1]],
        }, {
            values: [1.007536, 1.00652, 1.01207],
            series: [['01.01.2021', 2], ['02.01.2021', 1]],
        }, {
            values: [0.007536, 0.00652, 0.01207],
            series: [['01.01.2021', 2], ['02.01.2021', 1]],
        }, {
            values: [0.00036, 0.00002],
            series: [['01.01.2021', 2]],
        }, {
            values: [100, 100, 100, 100],
            series: [['02.01.2021', 4]],
        }];

        this.addSection({
            id: 'linechart',
            title: 'Line Chart',
            content: createElement('div', {
                props: { className: 'row-section row-wrap' },
                children: data.map((item) => this.createLineChart(item).elem),
            }),
        });
    }
}

ChartGridView.create();
