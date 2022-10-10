import 'jezvejs/style';
import { ge, onReady } from 'jezvejs';
import { PieChart } from 'jezvejs/PieChart';
import '../common/app.scss';
import './style.scss';
import { initNavigation } from '../common/app.js';

const initSmall = () => {
    const container = ge('pchart');
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

const initOffset = () => {
    const hovtitle = ge('hovtitle');
    const container = ge('pchart2');

    const initialData = [
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
        data: initialData,
        radius: 100,
        offset: 10,
        onitemover: ({ sector }) => {
            hovtitle.textContent = sector.title;
        },
        onitemout: () => {
            hovtitle.textContent = '';
        },
        onitemclick: ({ sector }) => {
            const newData = initialData.map((item) => ({
                ...item,
                offset: (sector.id === item.id) ? 10 : 0,
            }));

            chart.setData(newData);
        },
    });

    container.append(chart.elem);
};

const initInnerRadius = () => {
    const hovtitle = ge('hovtitle-inner');
    const container = ge('pchart3');

    const initialData = [
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
        data: initialData,
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
            const newData = initialData.map((item) => ({
                ...item,
                offset: (sector.id === item.id) ? 10 : 0,
            }));

            chart.setData(newData);
        },
    });

    container.append(chart.elem);
};

const init = () => {
    initNavigation();

    initSmall();
    initOffset();
    initInnerRadius();
};

onReady(init);
