import 'jezvejs/style';
import { asArray } from '@jezvejs/types';
import { createElement } from '@jezvejs/dom';
import { PieChart } from 'jezvejs/PieChart';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createButtons } from '../../Application/utils.js';
import './PieChartView.scss';

const chartContainer = (id, elem) => createElement('div', {
    id,
    className: 'std_chart_wrap',
    children: asArray(elem),
});

const toggleSectorOffset = (data, sector) => (
    data.map((item) => ({
        ...item,
        offset: (sector.id === item.id && item.offset !== 10) ? 10 : 0,
    }))
);

/**
 * PieChart component demo view
 */
class PieChartView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('PieChart');

        this.initSmall();
        this.initOffset();
        this.initInnerRadius();
        this.initSingleValue();
        this.initNoData();
    }

    initSmall() {
        const chart = PieChart.create({
            className: 'small_pie',
            colors: [
                0xDCF900, 0x00B74A, 0xFF8700, 0xDB0058, 0x086CA2,
                0xFFBA00, 0xFF3900, 0xDC0055, 0x00B64F,
            ],
            data: [100, 150, 120, 20, 10, 6, 8, 220],
            radius: 50,
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: chartContainer('defaultPChart', chart.elem),
        });
    }

    initOffset() {
        const selectedInfo = createElement('div', {
            id: 'selectedInfo', className: 'info-bottom',
        });

        let data = [
            {
                id: 1,
                value: 10,
                title: 'First category',
                offset: 10,
            },
            { id: 2, value: 10, title: 'Second category' },
            { id: 3, value: 10, title: 'Third category' },
            { id: 4, value: 20, title: 'Fourth category' },
        ];

        const chart = PieChart.create({
            className: 'middle_pie',
            data,
            radius: 100,
            offset: 10,
            onItemOver: ({ sector }) => {
                selectedInfo.textContent = sector.title;
            },
            onItemOut: () => {
                selectedInfo.textContent = '';
            },
            onItemClick: ({ sector }) => {
                data = toggleSectorOffset(data, sector);
                chart.setData(data);
                selectedInfo.textContent = sector.title;
            },
        });

        this.addSection({
            id: 'offset',
            title: 'Title and offset sector',
            content: [
                chartContainer('offsetPChart', chart.elem),
                selectedInfo,
            ],
        });
    }

    initInnerRadius() {
        const selectedInfo = createElement('div', {
            id: 'selectedInfo-inner', className: 'info-inner',
        });

        let data = [
            {
                id: 1,
                value: 10,
                title: 'First category',
                offset: 10,
            },
            { id: 2, value: 10, title: 'Second category' },
            { id: 3, value: 10, title: 'Third category' },
            { id: 4, value: 20, title: 'Fourth category' },
            { id: 5, value: 3, title: 'Fiveth category' },
            { id: 6, value: 5, title: 'Sixth category' },
        ];

        const chart = PieChart.create({
            className: 'middle_pie',
            data,
            radius: 100,
            innerRadius: 70,
            offset: 10,
            onItemOver: ({ sector }) => {
                selectedInfo.textContent = sector.title;
            },
            onItemOut: () => {
                selectedInfo.textContent = '';
            },
            onItemClick: ({ sector }) => {
                data = toggleSectorOffset(data, sector);
                chart.setData(data);
            },
        });

        this.addSection({
            id: 'innerRadius',
            title: '\'innerRadius\' option',
            content: chartContainer('innerPChart', [
                chart.elem,
                selectedInfo,
            ]),
        });
    }

    initSingleValue() {
        let data = [{ value: 100 }];

        const chart = PieChart.create({
            className: 'middle_pie',
            data,
            radius: 100,
            offset: 10,
            onItemClick: ({ sector }) => {
                data = toggleSectorOffset(data, sector);
                chart.setData(data);
            },
        });

        let innerData = [{ value: 100 }];

        const innerChart = PieChart.create({
            className: 'middle_pie',
            data: innerData,
            radius: 100,
            innerRadius: 70,
            offset: 10,
            onItemClick: ({ sector }) => {
                innerData = toggleSectorOffset(innerData, sector);
                innerChart.setData(innerData);
            },
        });

        this.addSection({
            id: 'single',
            title: 'Single value',
            content: [
                chartContainer('singleValPChart', chart.elem),
                chartContainer('singleValInnerPChart', innerChart.elem),
            ],
        });
    }

    initNoData() {
        const initialData = [
            { category: 2, value: 10, title: 'First category' },
            { category: 3, value: 10, title: 'Second category' },
            { category: 5, value: 10, title: 'Third category' },
            { category: 7, value: 20, title: 'Fourth category' },
            { category: 8, value: 0, title: 'Fiveth category' },
            { category: 'gray', value: 5, title: 'Sixth category' },
        ];

        const chart = PieChart.create({
            className: 'middle_pie',
            radius: 100,
            innerRadius: 70,
            offset: 10,
            data: null,
        });

        const controls = createButtons([{
            id: 'setNoDataBtn',
            title: 'Set no data',
            className: 'action-btn',
            onClick: () => chart.setData(null),
        }, {
            id: 'setDataBtn',
            title: 'Set data',
            className: 'action-btn',
            onClick: () => chart.setData(initialData),
        }]);

        this.addSection({
            id: 'setData',
            title: 'Set data',
            content: [
                chartContainer('noDataPChart', chart.elem),
                controls,
            ],
        });
    }
}

PieChartView.create();
