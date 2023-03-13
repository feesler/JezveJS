import 'jezvejs/style';
import 'jezvejs/style/Button';
import {
    ge,
    setEvents,
    onReady,
    createElement,
} from 'jezvejs';
import { Collapsible } from 'jezvejs/Collapsible';
import { Icon } from 'jezvejs/Icon';
import { initNavigation } from '../../app.js';
import './CollapsibleView.scss';

const CUSTOM_BTN_CLASS = 'custom-header-btn';
const CUSTOM_ICON_CLASS = 'custom-header-icon';

/** Create button for custom header */
const createButton = (icon) => createElement('button', {
    props: { className: `btn ${CUSTOM_BTN_CLASS}`, type: 'button' },
    children: Icon.create({ icon, className: CUSTOM_ICON_CLASS }).elem,
    events: { click: (e) => e.stopPropagation() },
});

const initSimple = () => {
    const collapse = Collapsible.create({
        content: 'Content',
        className: 'simple',
        onStateChange: (expanded) => collapse.setHeader(expanded ? 'Hide' : 'Show'),
    });

    ge('defaultContainer').append(collapse.elem);
};

const initStyled = () => {
    const collapse = Collapsible.create({
        content: ge('styledContent'),
        className: 'styled',
        onStateChange: (expanded) => collapse.setHeader(expanded ? 'Hide' : 'Show'),
    });

    ge('styledContainer').append(collapse.elem);
};

const initCustomHeader = () => {
    const titleContainer = createElement('div', {
        props: {
            className: 'custom-title',
            textContent: 'Hover/focus to see controls',
        },
    });
    const updateBtn = createButton('update');
    const delBtn = createButton('del');

    const collapse = Collapsible.create({
        header: [titleContainer, updateBtn, delBtn],
        content: 'Custom header',
        className: 'custom',
        onStateChange: (expanded) => {
            titleContainer.textContent = (expanded) ? 'Hide' : 'Show';
        },
    });
    collapse.headerContainer.tabIndex = 0;

    ge('custom').append(collapse.elem);
};

const initDisabledToggle = () => {
    const titleContainer = createElement('div', {
        props: {
            className: 'custom-title',
            textContent: 'Toggle only by click button',
        },
    });
    const toggleBtn = createElement('button', {
        props: { className: `btn ${CUSTOM_BTN_CLASS}`, type: 'button' },
        children: Icon.create({ icon: 'toggle-ext', className: CUSTOM_ICON_CLASS }).elem,
    });

    const collapse = Collapsible.create({
        toggleOnClick: false,
        header: [titleContainer, toggleBtn],
        content: 'Content',
        className: 'disabled-toggle',
    });
    setEvents(toggleBtn, { click: () => collapse?.toggle() });

    ge('disabledToggle').append(collapse.elem);
};

const initMethods = () => {
    const collapse = Collapsible.create({
        className: 'methods',
        header: null,
        content: 'Content',
    });
    ge('methodsContainer').append(collapse.elem);

    setEvents(ge('expandBtn'), { click: () => collapse.expand() });
    setEvents(ge('collapseBtn'), { click: () => collapse.collapse() });
    setEvents(ge('toggleBtn'), { click: () => collapse.toggle() });
};

onReady(() => {
    initNavigation();

    initSimple();
    initStyled();
    initCustomHeader();
    initDisabledToggle();
    initMethods();
});
