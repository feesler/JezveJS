import 'jezvejs/style';
import { setEvents, createElement } from '@jezvejs/dom';
import { Collapsible } from 'jezvejs/Collapsible';

// Icons
import { DeleteIcon } from '../../assets/icons/DeleteIcon.js';
import { ToggleIcon } from '../../assets/icons/ToggleIcon.js';
import { UpdateIcon } from '../../assets/icons/UpdateIcon.js';

import { createButtons, createListContent } from '../../Application/utils.js';
import { DemoView } from '../../Components/DemoView/DemoView.js';

import {
    CUSTOM_BTN_CLASS,
    CUSTOM_ICON_CLASS,
    createButton,
    createContent,
} from './helpers.js';
import './CollapsibleView.scss';

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
