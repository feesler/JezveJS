import {
    baseUrl,
    goTo,
    setBlock,
    test,
} from 'jezve-test';

const views = {
    chartgrid: 'ChartGrid',
    checkbox: 'Checkbox',
    colorutils: 'Color utils',
    debug: 'Debug',
    dpitest: 'DPI test',
    dragndrop: 'DragnDrop',
    emptyclick: 'emptyClick',
    header: 'Header',
    histogram: 'Histogram',
    button: 'Button',
    index: 'Main view',
    inputgroup: 'InputGroup',
    linechart: 'LineChart',
    linkmenu: 'LinkMenu',
    menu: 'Menu',
    offcanvas: 'Offcanvas',
    piechart: 'PieChart',
    popup: 'Popup',
    progress: 'Progress',
    slider: 'Slider',
    switch: 'Switch',
    tags: 'Tags',
    weekdayselect: 'WeekDaySelect',
};

const loadView = async (view) => test(`${views[view]} view`, async () => {
    await goTo(`${baseUrl()}demo/${view}.html`);
    return true;
});

export const loadTests = async () => {
    setBlock('Minor load tests', 1);

    for (const view of Object.keys(views)) {
        await loadView(view);
    }
};
