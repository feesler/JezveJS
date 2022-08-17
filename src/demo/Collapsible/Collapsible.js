import {
    ge,
    ce,
    svg,
    setEvents,
    onReady,
    Collapsible,
} from '../../js/index.js';
import '../../css/common.scss';
import '../css/app.scss';
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
const createButton = (icon) => ce(
    'button',
    { className: `btn ${CUSTOM_BTN_CLASS}`, type: 'button' },
    createIcon(icon),
    { click: (e) => e.stopPropagation() },
);

function initSimple() {
    const collapse = new Collapsible({
        content: 'Content',
        className: 'simple',
        onStateChange: (expanded) => collapse.setHeader(expanded ? 'Hide' : 'Show'),
    });

    ge('simple-collapse').appendChild(collapse.elem);
}

function initStyled() {
    const collapse = new Collapsible({
        content: ge('styled-content'),
        className: 'styled',
        onStateChange: (expanded) => collapse.setHeader(expanded ? 'Hide' : 'Show'),
    });

    ge('styled-collapse').appendChild(collapse.elem);
}

function initCustomHeader() {
    const titleContainer = ce('div', {
        className: 'custom-title',
        textContent: 'Hover/focus to see controls',
    });
    const updateBtn = createButton('update');
    const delBtn = createButton('del');

    const collapse = new Collapsible({
        header: [titleContainer, updateBtn, delBtn],
        content: 'Custom header',
        className: 'custom',
        onStateChange: (expanded) => {
            titleContainer.textContent = (expanded) ? 'Hide' : 'Show';
        },
    });

    ge('custom-collapse').appendChild(collapse.elem);
}

function initMethods() {
    const collapse = new Collapsible({
        className: 'methods',
        header: 'Header',
        content: 'Content',
    });
    ge('methods-collapse').appendChild(collapse.elem);

    setEvents(ge('expand-btn'), { click: () => collapse.expand() });
    setEvents(ge('collapse-btn'), { click: () => collapse.collapse() });
}

onReady(() => {
    initSimple();
    initStyled();
    initCustomHeader();
    initMethods();
});
