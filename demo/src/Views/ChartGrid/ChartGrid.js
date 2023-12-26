import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { Histogram } from 'jezvejs/Histogram';
import { LineChart } from 'jezvejs/LineChart';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import './ChartGridView.scss';

/**
 * ChartGrid utility demo view
 */
class ChartGridView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('ChartGrid');

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
