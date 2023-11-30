import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { RangeScrollChart } from 'jezvejs/RangeScrollChart';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import './RangeScrollChartView.scss';

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

const chartContainer = (id, chart) => createElement('div', {
    props: { id, className: 'std_chart_wrap' },
    children: chart.elem,
});

/**
 * RangeScrollChart component demo view
 */
class RangeScrollChartView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.histogram();
        this.lineChart();
        this.multiColumn();
    }

    histogram() {
        const logsField = LogsField.create();

        const rangeSelectorChart = RangeScrollChart.create({
            type: 'histogram',
            mainChart: {
                data: chartData,
                maxColumnWidth: 40,
            },
        });

        this.addSection({
            id: 'histogram',
            title: 'Histogram',
            content: [
                chartContainer('histogramChart', rangeSelectorChart),
                logsField.elem,
            ],
        });
    }

    lineChart() {
        const rangeSelectorChart = RangeScrollChart.create({
            type: 'linechart',
            mainChart: {
                data: chartData,
                maxColumnWidth: 40,
            },
        });

        this.addSection({
            id: 'linechart',
            title: 'LineChart',
            content: [
                chartContainer('linechartChart', rangeSelectorChart),
            ],
        });
    }

    multiColumn() {
        const rangeSelectorChart = RangeScrollChart.create({
            type: 'histogram',
            mainChart: {
                data: chartMultiData,
                maxColumnWidth: 40,
                showPopupOnClick: true,
            },
        });

        this.addSection({
            id: 'multiColumn',
            title: 'Multi column',
            content: [
                chartContainer('multiColumnChart', rangeSelectorChart),
            ],
        });
    }
}

RangeScrollChartView.create();
