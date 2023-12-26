import 'jezvejs/style';
import { setEvents, createElement } from '@jezvejs/dom';
import { Collapsible } from 'jezvejs/Collapsible';
import { Icon } from 'jezvejs/Icon';

// Icons
import { DeleteIcon } from '../../assets/icons/DeleteIcon.js';
import { ToggleIcon } from '../../assets/icons/ToggleIcon.js';
import { UpdateIcon } from '../../assets/icons/UpdateIcon.js';

import { createButtons } from '../../Application/utils.js';
import { DemoView } from '../../Components/DemoView/DemoView.js';

import './CollapsibleView.scss';

const CUSTOM_BTN_CLASS = 'custom-header-btn';
const CUSTOM_ICON_CLASS = 'custom-header-icon';

/** Create button for custom header */
const createButton = (icon) => createElement('button', {
    props: { className: `btn ${CUSTOM_BTN_CLASS}`, type: 'button' },
    children: Icon.create({ icon, className: CUSTOM_ICON_CLASS }).elem,
    events: { click: (e) => e.stopPropagation() },
});

/** Returns new content */
const createContent = (content) => createElement('div', {
    props: {
        className: 'collapsible-content-container',
        textContent: (typeof content === 'string') ? content : '',
    },
    children: (typeof content !== 'string') ? content : null,
});

const createListContent = (props = {}) => (
    createElement('ul', {
        props,
        children: [1, 2, 3, 4].map((item) => (
            createElement('li', { props: { textContent: `Item ${item}` } })
        )),
    })
);

/**
 * Collapsible component demo view
 */
class CollapsibleView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Collapsible');

        this.initSimple();
        this.initStyled();
        this.initAnimated();
        this.initCustomHeader();
        this.initDisabledToggle();
        this.initMethods();
    }

    initSimple() {
        const collapse = Collapsible.create({
            content: 'Content',
            className: 'simple',
            onStateChange: (expanded) => collapse.setHeader(expanded ? 'Hide' : 'Show'),
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: createElement('div', { children: collapse.elem }),
        });
    }

    initStyled() {
        const styledContent = createListContent({ id: 'styledContent' });

        const collapse = Collapsible.create({
            content: createContent(styledContent),
            className: 'styled',
            onStateChange: (expanded) => collapse.setHeader(expanded ? 'Hide' : 'Show'),
        });

        this.addSection({
            id: 'styled',
            title: 'Styled container',
            content: createElement('div', { children: collapse.elem }),
        });
    }

    initAnimated() {
        const content = createListContent({ id: 'animatedContent' });

        const collapse = Collapsible.create({
            content: createContent(content),
            className: 'styled',
            animated: true,
            onStateChange: (expanded) => collapse.setHeader(expanded ? 'Hide' : 'Show'),
        });

        this.addSection({
            id: 'animated',
            title: 'Animated',
            content: createElement('div', { children: collapse.elem }),
        });
    }

    initCustomHeader() {
        const titleContainer = createElement('div', {
            props: {
                className: 'custom-title',
                textContent: 'Hover/focus to see controls',
            },
        });
        const updateBtn = createButton(UpdateIcon());
        const delBtn = createButton(DeleteIcon());

        const collapse = Collapsible.create({
            header: [titleContainer, updateBtn, delBtn],
            content: createContent('Custom header'),
            className: 'custom',
            animated: true,
            onStateChange: (expanded) => {
                titleContainer.textContent = (expanded) ? 'Hide' : 'Show';
            },
        });
        collapse.headerContainer.tabIndex = 0;

        this.addSection({
            id: 'customHeader',
            title: 'Custom header',
            content: createElement('div', { children: collapse.elem }),
        });
    }

    initDisabledToggle() {
        const titleContainer = createElement('div', {
            props: {
                className: 'custom-title',
                textContent: 'Toggle only by click button',
            },
        });
        const toggleBtn = createElement('button', {
            props: { className: `btn ${CUSTOM_BTN_CLASS}`, type: 'button' },
            children: ToggleIcon({ class: CUSTOM_ICON_CLASS }),
        });

        const collapse = Collapsible.create({
            toggleOnClick: false,
            header: [titleContainer, toggleBtn],
            content: createContent('Content'),
            animated: true,
            className: 'disabled-toggle',
        });
        setEvents(toggleBtn, { click: () => collapse?.toggle() });

        this.addSection({
            id: 'toggleOnClick',
            title: '\'toggleOnClick\' option',
            content: createElement('div', { children: collapse.elem }),
        });
    }

    initMethods() {
        const collapse = Collapsible.create({
            className: 'methods',
            header: null,
            content: 'Content',
        });

        const buttons = [{
            id: 'expandBtn',
            title: 'Expand',
            onClick: () => collapse.expand(),
        }, {
            id: 'collapseBtn',
            title: 'Collapse',
            onClick: () => collapse.collapse(),
        }, {
            id: 'toggleBtn',
            title: 'Toggle',
            onClick: () => collapse.toggle(),
        }];

        this.addSection({
            id: 'methods',
            title: 'Methods',
            content: [
                createElement('div', { children: collapse.elem }),
                createButtons(buttons),
            ],
        });
    }
}

CollapsibleView.create();
