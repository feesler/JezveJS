import 'jezvejs/style';
import {
    ge,
    svg,
    setEvents,
    onReady,
    createElement,
} from 'jezvejs';
import { Collapsible } from 'jezvejs/Collapsible';
import { initNavigation } from '../../app.js';
import './style.scss';

const CUSTOM_BTN_CLASS = 'custom-header-btn';
const CUSTOM_ICON_CLASS = 'custom-header-icon';

/** Create SVG icon element for buttons of custom header */
const createIcon = (icon) => {
    const useElem = svg('use');
    const res = svg('svg', { class: CUSTOM_ICON_CLASS }, useElem);

    useElem.href.baseVal = (icon) ? `#${icon}` : '';

    return res;
};

/** Create button for custom header */
const createButton = (icon) => createElement('button', {
    props: { className: `btn ${CUSTOM_BTN_CLASS}`, type: 'button' },
    children: createIcon(icon),
    events: { click: (e) => e.stopPropagation() },
});

const initSimple = () => {
    const collapse = Collapsible.create({
        content: 'Content',
        className: 'simple',
        onStateChange: (expanded) => collapse.setHeader(expanded ? 'Hide' : 'Show'),
    });

    ge('simple-collapse').append(collapse.elem);
};

const initStyled = () => {
    const collapse = Collapsible.create({
        content: ge('styled-content'),
        className: 'styled',
        onStateChange: (expanded) => collapse.setHeader(expanded ? 'Hide' : 'Show'),
    });

    ge('styled-collapse').append(collapse.elem);
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

    ge('custom-collapse').append(collapse.elem);
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
        children: createIcon('toggle-ext'),
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
        header: 'Header',
        content: 'Content',
    });
    ge('methods-collapse').append(collapse.elem);

    setEvents(ge('expand-btn'), { click: () => collapse.expand() });
    setEvents(ge('collapse-btn'), { click: () => collapse.collapse() });
    setEvents(ge('toggle-btn'), { click: () => collapse.toggle() });
};

onReady(() => {
    initNavigation();

    initSimple();
    initStyled();
    initCustomHeader();
    initDisabledToggle();
    initMethods();
});