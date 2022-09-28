import { createElement, setEvents } from '../../js/index.js';
import { Offcanvas } from '../../Components/Offcanvas/Offcanvas.js';

const BASE_URL = 'https://localtest/jezvejs/dist/';
const DEMO_URL = `${BASE_URL}demo/`;

const navigationMenu = [{
    title: 'jezveJS tests',
    items: [{
        title: 'Tests', url: `${BASE_URL}tests/index.html`,
    }],
}, {
    title: 'Utils',
    items: [
        { title: 'Common', url: `${DEMO_URL}common.html` },
        { title: 'DPI test', url: `${DEMO_URL}dpitest.html` },
        { title: 'Empty click', url: `${DEMO_URL}emptyclick.html` },
        { title: 'Drag\'n\'Drop and Sortable', url: `${DEMO_URL}dragndrop.html` },
    ],
}, {
    title: 'Input',
    items: [
        { title: 'Input group', url: `${DEMO_URL}inputgroup.html` },
        { title: 'Decimal input', url: `${DEMO_URL}decimal.html` },
        { title: 'Date input', url: `${DEMO_URL}dateinput.html` },
    ],
}, {
    title: 'Charts',
    items: [
        { title: 'Histogram', url: `${DEMO_URL}histogram.html` },
        { title: 'Line chart', url: `${DEMO_URL}linechart.html` },
        { title: 'Pie chart', url: `${DEMO_URL}piechart.html` },
        { title: 'Chart grid tests', url: `${DEMO_URL}chartgrid.html` },
    ],
}, {
    title: 'Components',
    items: [
        { title: 'Checkbox and Radio', url: `${DEMO_URL}checkbox.html` },
        { title: 'Collapsible', url: `${DEMO_URL}collapsible.html` },
        { title: 'Date Picker', url: `${DEMO_URL}datepicker.html` },
        { title: 'Drop Down', url: `${DEMO_URL}dropdown.html` },
        { title: 'Offcanvas', url: `${DEMO_URL}offcanvas.html` },
        { title: 'Paginator', url: `${DEMO_URL}paginator.html` },
        { title: 'Popup', url: `${DEMO_URL}popup.html` },
        { title: 'Progress and Spinner', url: `${DEMO_URL}progress.html` },
        { title: 'Slider', url: `${DEMO_URL}slider.html` },
        { title: 'Switch', url: `${DEMO_URL}switch.html` },
    ],
}];

const renderMenuItem = ({ title, url }) => (
    createElement('li', {
        children: createElement('a', { props: { href: url, textContent: title } }),
    })
);

const renderNavSection = ({ title, items }) => {
    const header = createElement('h2', { props: { textContent: title } });
    const menu = createElement('ul', {
        props: { className: 'nav-menu' },
        children: items.map((item) => renderMenuItem(item)),
    });

    return [header, menu];
};

const renderNavigationMenu = () => {
    const sections = navigationMenu.map((item) => renderNavSection(item)).flat();
    return createElement('div', {
        props: { className: 'nav-menu-container' },
        children: sections,
    });
};

export const initNavigation = () => {
    const navMenu = renderNavigationMenu();

    const offcanvas = Offcanvas.create({
        content: navMenu,
    });

    const navToggleBtn = document.querySelector('.nav-header .nav-toggle-btn');
    setEvents(navToggleBtn, { click: () => offcanvas.toggle() });
};
