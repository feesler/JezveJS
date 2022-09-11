import { ge, onReady, PieChart } from '../../js/index.js';
import '../../css/common.scss';
import '../common/app.scss';
import './style.scss';
import { initNavigation } from '../common/app.js';

/* eslint-disable no-unused-vars */

function init() {
    initNavigation();

    const hovtitle = ge('hovtitle');

    PieChart.create({
        elem: 'pchart',
        extraClass: 'small_pie',
        colors: [
            0xDCF900, 0x00B74A, 0xFF8700, 0xDB0058, 0x086CA2,
            0xFFBA00, 0xFF3900, 0xDC0055, 0x00B64F,
        ],
        data: [100, 150, 120, 20, 10, 6, 8, 220],
        radius: 50,
    });

    PieChart.create({
        elem: 'pchart2',
        extraClass: 'middle_pie',
        data: [
            { value: 10, title: 'First category', offset: 10 },
            { value: 10, title: 'Second category' },
            { value: 10, title: 'Third category' },
            { value: 20, title: 'Fourth category' },
        ],
        radius: 100,
        offset: 10,
        onitemover(_, item) {
            hovtitle.textContent = item.title;
        },
        onitemout() {
            hovtitle.textContent = '';
        },
        onitemclick(_, item) {
            this.data = this.sectors.map((sector) => ({
                value: sector.value,
                title: sector.title,
                offset: (sector === item) ? 10 : 0,
            }));

            this.render();
        },
    });
}

onReady(init);
