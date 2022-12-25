import 'jezvejs/style';
import { ge, onReady, setEvents } from 'jezvejs';
import { PieChart } from 'jezvejs/PieChart';
import { initNavigation } from '../../app.js';
import './style.scss';

const initSmall = () => {
    const container = ge('defaultPChart');
    const chart = PieChart.create({
        className: 'small_pie',
        colors: [
            0xDCF900, 0x00B74A, 0xFF8700, 0xDB0058, 0x086CA2,
            0xFFBA00, 0xFF3900, 0xDC0055, 0x00B64F,
        ],
        data: [100, 150, 120, 20, 10, 6, 8, 220],
        radius: 50,
    });
    container.append(chart.elem);
};

const toggleSectorOffset = (data, sector) => (
    data.map((item) => ({
        ...item,
        offset: (sector.id === item.id && item.offset !== 10) ? 10 : 0,
    }))
);

const initOffset = () => {
    const hovtitle = ge('hovtitle');
    const container = ge('offsetPChart');

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
        onitemover: ({ sector }) => {
            hovtitle.textContent = sector.title;
        },
        onitemout: () => {
            hovtitle.textContent = '';
        },
        onitemclick: ({ sector }) => {
            data = toggleSectorOffset(data, sector);
            chart.setData(data);
        },
    });

    container.append(chart.elem);
};

const initInnerRadius = () => {
    const hovtitle = ge('hovtitle-inner');
    const container = ge('innerPChart');

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
        onitemover: ({ sector }) => {
            hovtitle.textContent = sector.title;
        },
        onitemout: () => {
            hovtitle.textContent = '';
        },
        onitemclick: ({ sector }) => {
            data = toggleSectorOffset(data, sector);
            chart.setData(data);
        },
    });

    container.append(chart.elem);
};

const initSingleValue = () => {
    const container = ge('singleValPChart');
    const innerContainer = ge('singleValInnerPChart');

    let data = [{ value: 100 }];

    const chart = PieChart.create({
        className: 'middle_pie',
        data,
        radius: 100,
        offset: 10,
        onitemclick: ({ sector }) => {
            data = toggleSectorOffset(data, sector);
            chart.setData(data);
        },
    });
    container.append(chart.elem);

    let innerData = [{ value: 100 }];

    const innerChart = PieChart.create({
        className: 'middle_pie',
        data: innerData,
        radius: 100,
        innerRadius: 70,
        offset: 10,
        onitemclick: ({ sector }) => {
            innerData = toggleSectorOffset(innerData, sector);
            innerChart.setData(innerData);
        },
    });
    innerContainer.append(innerChart.elem);
};

const initNoData = () => {
    const initialData = [
        { category: 2, value: 10, title: 'First category' },
        { category: 3, value: 10, title: 'Second category' },
        { category: 5, value: 10, title: 'Third category' },
        { category: 7, value: 20, title: 'Fourth category' },
        { category: 8, value: 0, title: 'Fiveth category' },
        { category: 'gray', value: 5, title: 'Sixth category' },
    ];

    const container = ge('noDataPChart');
    const chart = PieChart.create({
        className: 'middle_pie',
        radius: 100,
        innerRadius: 70,
        offset: 10,
        data: null,
    });
    container.append(chart.elem);

    const setNoDataBtn = ge('setNoDataBtn');
    setEvents(setNoDataBtn, { click: () => chart.setData(null) });

    const setDataBtn = ge('setDataBtn');
    setEvents(setDataBtn, { click: () => chart.setData(initialData) });
};

const init = () => {
    initNavigation();

    initSmall();
    initOffset();
    initInnerRadius();
    initSingleValue();
    initNoData();
};

onReady(init);
