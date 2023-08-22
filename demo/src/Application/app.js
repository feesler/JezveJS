import packageConfig from 'jezvejs/package.json';
import './app.scss';

export const navigationMenuSections = [{
    id: 'testsGroup',
    type: 'group',
    title: 'jezveJS tests',
    items: [
        { id: 'browserTests', title: 'Tests', url: 'tests/index.html' },
    ],
}, {
    id: 'utilsGroup',
    type: 'group',
    title: 'Utils',
    items: [
        { id: 'dpiUtil', title: 'DPI test', url: 'demo/dpitest.html' },
        { id: 'emptyClickUtil', title: 'Empty click', url: 'demo/emptyclick.html' },
        { id: 'dragndropUtil', title: 'Drag\'n\'Drop and Sortable', url: 'demo/dragndrop.html' },
    ],
}, {
    id: 'inputComponents',
    type: 'group',
    title: 'Input',
    items: [
        { id: 'input', title: 'Input', url: 'demo/input.html' },
        { id: 'inputGroup', title: 'Input group', url: 'demo/inputgroup.html' },
        { id: 'decimalInput', title: 'Decimal input', url: 'demo/decimal.html' },
        { id: 'dateInput', title: 'Date input', url: 'demo/dateinput.html' },
    ],
}, {
    id: 'chartComponents',
    type: 'group',
    title: 'Charts',
    items: [
        { id: 'histogram', title: 'Histogram', url: 'demo/histogram.html' },
        { id: 'lineChart', title: 'Line chart', url: 'demo/linechart.html' },
        { id: 'pieChart', title: 'Pie chart', url: 'demo/piechart.html' },
        { id: 'chartGrid', title: 'Chart grid tests', url: 'demo/chartgrid.html' },
    ],
}, {
    id: 'components',
    type: 'group',
    title: 'Components',
    items: [
        { id: 'button', title: 'Button', url: 'demo/button.html' },
        { id: 'checkbox', title: 'Checkbox and Radio', url: 'demo/checkbox.html' },
        { id: 'collapsible', title: 'Collapsible', url: 'demo/collapsible.html' },
        { id: 'datePicker', title: 'Date Picker', url: 'demo/datepicker.html' },
        { id: 'dropDown', title: 'Drop Down', url: 'demo/dropdown.html' },
        { id: 'menu', title: 'Menu', url: 'demo/menu.html' },
        { id: 'lineMenu', title: 'Link Menu', url: 'demo/linkmenu.html' },
        { id: 'offcanvas', title: 'Offcanvas', url: 'demo/offcanvas.html' },
        { id: 'paginator', title: 'Paginator', url: 'demo/paginator.html' },
        { id: 'popup', title: 'Popup', url: 'demo/popup.html' },
        { id: 'popupMenu', title: 'Popup Menu', url: 'demo/popupmenu.html' },
        { id: 'progress', title: 'Progress and Spinner', url: 'demo/progress.html' },
        { id: 'slider', title: 'Slider', url: 'demo/slider.html' },
        { id: 'switch', title: 'Switch', url: 'demo/switch.html' },
        { id: 'tabList', title: 'Tab List', url: 'demo/tablist.html' },
        { id: 'tags', title: 'Tags', url: 'demo/tags.html' },
        { id: 'weekDaySelect', title: 'Week day select', url: 'demo/weekdayselect.html' },
    ],
}];

export const getBaseURL = () => {
    const { origin } = window.location;
    const res = `${origin}/`;

    if (origin.includes('localtest')) {
        return `${res}jezvejs/dist/`;
    }
    if (origin.includes('localhost')) {
        return res;
    }

    return `${res}jezvejs/`;
};

/**
 * Returns version of jezvejs library from package data
 * @returns string
 */
export const getVersion = () => (packageConfig.version);
