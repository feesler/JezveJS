import { ge, setEvents } from 'jezvejs';
import packageConfig from 'jezvejs/package.json';
import { Offcanvas } from 'jezvejs/Offcanvas';
import { NavigationMenu } from '../Components/NavigationMenu/NavigationMenu.js';
import './app.scss';

export const navigationMenuSections = [{
    title: 'jezveJS tests',
    items: [{
        title: 'Tests', url: 'tests/index.html',
    }],
}, {
    title: 'Utils',
    items: [
        { title: 'DPI test', url: 'demo/dpitest.html' },
        { title: 'Empty click', url: 'demo/emptyclick.html' },
        { title: 'Drag\'n\'Drop and Sortable', url: 'demo/dragndrop.html' },
    ],
}, {
    title: 'Input',
    items: [
        { title: 'Input', url: 'demo/input.html' },
        { title: 'Input group', url: 'demo/inputgroup.html' },
        { title: 'Decimal input', url: 'demo/decimal.html' },
        { title: 'Date input', url: 'demo/dateinput.html' },
    ],
}, {
    title: 'Charts',
    items: [
        { title: 'Histogram', url: 'demo/histogram.html' },
        { title: 'Line chart', url: 'demo/linechart.html' },
        { title: 'Pie chart', url: 'demo/piechart.html' },
        { title: 'Chart grid tests', url: 'demo/chartgrid.html' },
    ],
}, {
    title: 'Components',
    items: [
        { title: 'Button', url: 'demo/button.html' },
        { title: 'Checkbox and Radio', url: 'demo/checkbox.html' },
        { title: 'Collapsible', url: 'demo/collapsible.html' },
        { title: 'Date Picker', url: 'demo/datepicker.html' },
        { title: 'Drop Down', url: 'demo/dropdown.html' },
        { title: 'Link Menu', url: 'demo/linkmenu.html' },
        { title: 'Offcanvas', url: 'demo/offcanvas.html' },
        { title: 'Paginator', url: 'demo/paginator.html' },
        { title: 'Popup', url: 'demo/popup.html' },
        { title: 'Popup Menu', url: 'demo/popupmenu.html' },
        { title: 'Progress and Spinner', url: 'demo/progress.html' },
        { title: 'Slider', url: 'demo/slider.html' },
        { title: 'Switch', url: 'demo/switch.html' },
        { title: 'Tab List', url: 'demo/tablist.html' },
        { title: 'Tags', url: 'demo/tags.html' },
        { title: 'Week day select', url: 'demo/weekdayselect.html' },
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

export const renderVersion = () => {
    const version = ge('version');
    version.textContent = packageConfig.version;
};

export const initNavigation = () => {
    const navMenu = NavigationMenu.create({
        sections: navigationMenuSections,
        baseURL: getBaseURL(),
    });

    const offcanvas = Offcanvas.create({
        content: navMenu.elem,
    });

    const navToggleBtn = document.querySelector('.nav-header .nav-toggle-btn');
    setEvents(navToggleBtn, { click: () => offcanvas.toggle() });

    renderVersion();
};
