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
        { id: 'colorUtil', title: 'Colors', url: 'colorutils.html' },
        { id: 'dpiUtil', title: 'DPI test', url: 'dpitest.html' },
        { id: 'emptyClickUtil', title: 'Empty click', url: 'emptyclick.html' },
        { id: 'debug', title: 'Debug', url: 'debug.html' },
        { id: 'dragndropUtil', title: 'Drag\'n\'Drop and Sortable', url: 'dragndrop.html' },
        { id: 'popupPositionUtil', title: 'PopupPosition', url: 'popupposition.html' },
    ],
}, {
    id: 'inputComponents',
    type: 'group',
    title: 'Input',
    items: [
        { id: 'input', title: 'Input', url: 'input.html' },
        { id: 'inputGroup', title: 'Input group', url: 'inputgroup.html' },
        { id: 'controlledInput', title: 'Controlled input', url: 'controlledinput.html' },
        { id: 'decimalInput', title: 'Decimal input', url: 'decimalinput.html' },
        { id: 'dateInput', title: 'Date input', url: 'dateinput.html' },
    ],
}, {
    id: 'chartComponents',
    type: 'group',
    title: 'Charts',
    items: [
        { id: 'histogram', title: 'Histogram', url: 'histogram.html' },
        { id: 'lineChart', title: 'Line chart', url: 'linechart.html' },
        { id: 'rangescrollchart', title: 'Range scroll chart', url: 'rangescrollchart.html' },
        { id: 'pieChart', title: 'Pie chart', url: 'piechart.html' },
        { id: 'chartGrid', title: 'Chart grid tests', url: 'chartgrid.html' },
    ],
}, {
    id: 'components',
    type: 'group',
    title: 'Components',
    items: [
        { id: 'button', title: 'Button', url: 'button.html' },
        { id: 'checkbox', title: 'Checkbox and Radio', url: 'checkbox.html' },
        { id: 'collapsible', title: 'Collapsible', url: 'collapsible.html' },
        { id: 'datePicker', title: 'Date Picker', url: 'datepicker.html' },
        { id: 'dropDown', title: 'Drop Down', url: 'dropdown.html' },
        { id: 'header', title: 'Header', url: 'header.html' },
        { id: 'menu', title: 'Menu', url: 'menu.html' },
        { id: 'lineMenu', title: 'Link Menu', url: 'linkmenu.html' },
        { id: 'offcanvas', title: 'Offcanvas', url: 'offcanvas.html' },
        { id: 'paginator', title: 'Paginator', url: 'paginator.html' },
        { id: 'popup', title: 'Popup', url: 'popup.html' },
        { id: 'popupMenu', title: 'Popup Menu', url: 'popupmenu.html' },
        { id: 'progress', title: 'Progress and Spinner', url: 'progress.html' },
        { id: 'rangeslider', title: 'Range slider', url: 'rangeslider.html' },
        { id: 'slider', title: 'Slider', url: 'slider.html' },
        { id: 'switch', title: 'Switch', url: 'switch.html' },
        { id: 'tabList', title: 'Tab List', url: 'tablist.html' },
        { id: 'tags', title: 'Tags', url: 'tags.html' },
        { id: 'weekDaySelect', title: 'Week day select', url: 'weekdayselect.html' },
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
