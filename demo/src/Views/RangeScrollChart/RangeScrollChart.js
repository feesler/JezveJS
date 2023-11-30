import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { RangeScrollChart } from 'jezvejs/RangeScrollChart';

import { chartData, chartMultiData } from '../../assets/data/index.js';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import './RangeScrollChartView.scss';

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
            navigationChart: {
                showLegend: true,
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
