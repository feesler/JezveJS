import {
    ce, setEvents,
} from '../../js/index.js';
import { Offcanvas } from '../../Components/Offcanvas/Offcanvas.js';

const navigationMenu = [{
    title: 'jezveJS tests',
    items: [{
        title: 'Tests', url: '../tests/index.html',
    }],
}, {
    title: 'Utils',
    items: [
        { title: 'Common', url: './common.html' },
        { title: 'DPI test', url: './dpitest.html' },
        { title: 'Empty click', url: './emptyclick.html' },
        { title: 'Drag\'n\'Drop and Sortable', url: './dragndrop.html' },
    ],
}, {
    title: 'Input',
    items: [
        { title: 'Input group', url: './inputgroup.html' },
        { title: 'Decimal input', url: './decimal.html' },
        { title: 'Date input', url: './dateinput.html' },
    ],
}, {
    title: 'Charts',
    items: [
        { title: 'Histogram', url: './histogram.html' },
        { title: 'Line chart', url: './linechart.html' },
        { title: 'Pie chart', url: './piechart.html' },
        { title: 'Chart grid tests', url: './chartgrid.html' },
    ],
}, {
    title: 'Components',
    items: [
        { title: 'Checkbox and Radio', url: './checkbox.html' },
        { title: 'Collapsible', url: './collapsible.html' },
        { title: 'Date Picker', url: './datepicker.html' },
        { title: 'Drop Down', url: './dropdown.html' },
        { title: 'Offcanvas', url: './offcanvas.html' },
        { title: 'Paginator', url: './paginator.html' },
        { title: 'Popup', url: './popup.html' },
        { title: 'Progress and Spinner', url: './progress.html' },
        { title: 'Slider', url: './slider.html' },
        { title: 'Switch', url: './switch.html' },
    ],
}];

const renderMenuItem = ({ title, url }) => (
    ce('li', {}, ce('a', { href: url, textContent: title }))
);

const renderNavSection = ({ title, items }) => {
    const header = ce('h2', { textContent: title });
    const menu = ce(
        'ul',
        { className: 'nav-menu' },
        items.map((item) => renderMenuItem(item)),
    );

    return [header, menu];
};

const renderNavigationMenu = () => {
    const sections = navigationMenu.map((item) => renderNavSection(item)).flat();
    return ce('div', { className: 'nav-menu-container' }, sections);
};

export const initNavigation = () => {
    const navMenu = renderNavigationMenu();

    const offcanvas = Offcanvas.create({
        content: navMenu,
    });

    const navToggleBtn = document.querySelector('.nav-header .nav-toggle-btn');
    setEvents(navToggleBtn, { click: () => offcanvas.toggle() });
};
