import {
    ge,
    ce,
    svg,
    onReady,
} from '../../js/common.js';
import { Collapsible } from '../../Components/Collapsible/Collapsible.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import '../css/collapsible.css';

/** Create SVG icon element */
const createIcon = (icon) => {
    const useElem = svg('use');
    const res = svg('svg', {}, useElem);

    useElem.href.baseVal = (icon) ? `#${icon}` : '';

    return res;
};

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

    const updateBtn = ce(
        'button',
        { className: 'btn custom-header-btn', type: 'button' },
        createIcon('update'),
        { click: (e) => e.stopPropagation() },
    );
    const delBtn = ce(
        'button',
        { className: 'btn custom-header-btn', type: 'button' },
        createIcon('del'),
        { click: (e) => e.stopPropagation() },
    );

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

onReady(() => {
    initSimple();
    initStyled();
    initCustomHeader();
});
