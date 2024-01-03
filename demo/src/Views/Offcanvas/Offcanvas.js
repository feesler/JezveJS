import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { Offcanvas } from 'jezvejs/Offcanvas';

import { createButtons, createListContent } from '../../Application/utils.js';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import './OffcanvasView.scss';

/**
 * Offcanvas component demo view
 */
class OffcanvasView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Offcanvas');

        this.initDefault();
        this.initRight();
        this.initTop();
        this.initBottom();
        this.initResponsive();
        this.initUseScrollLock();
    }

    initDefault() {
        const logsField = LogsField.create();

        let offcanvas = null;

        const content = createElement('div', {
            id: 'defaultContent',
            className: 'offcanvas-nav',
            children: [
                Button.create({
                    id: 'toggleTopBtn',
                    className: 'action-btn',
                    title: 'Toggle',
                    onClick: () => offcanvas?.toggle(),
                }).elem,
                createListContent(),
            ],
        });

        offcanvas = Offcanvas.create({
            content,
            onOpened: () => logsField.write('Opened'),
            onClosed: () => logsField.write('Closed'),
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                createButtons({
                    id: 'showDefaultBtn',
                    className: 'action-btn',
                    title: 'Show',
                    onClick: () => offcanvas.open(),
                }),
                logsField.elem,
            ],
        });
    }

    initRight() {
        const offcanvas = Offcanvas.create({
            content: createListContent({
                id: 'rightContent',
                className: 'offcanvas-nav',
            }),
            placement: 'right',
        });

        this.addSection({
            id: 'right',
            title: 'Right placement',
            content: createButtons({
                id: 'showRightBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => offcanvas.open(),
            }),
        });
    }

    initTop() {
        const offcanvas = Offcanvas.create({
            content: createListContent({
                id: 'topContent',
                className: 'offcanvas-horizontal-nav',
            }),
            placement: 'top',
        });

        this.addSection({
            id: 'top',
            title: 'Top placement',
            content: createButtons({
                id: 'showTopBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => offcanvas.open(),
            }),
        });
    }

    initBottom() {
        const offcanvas = Offcanvas.create({
            content: createListContent({
                id: 'bottomContent',
                className: 'offcanvas-horizontal-nav',
            }),
            placement: 'bottom',
        });

        this.addSection({
            id: 'bottom',
            title: 'Bottom placement',
            content: createButtons({
                id: 'showBottomBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => offcanvas.open(),
            }),
        });
    }

    initResponsive() {
        const content = createElement('div', {
            id: 'responsiveContent',
            children: [
                createElement('h3', { textContent: 'Responsive' }),
                createListContent({ className: 'offcanvas-nav' }),
            ],
        });

        const offcanvas = Offcanvas.create({
            content,
            className: 'offcanvas-responsive',
        });

        this.addSection({
            id: 'responsive',
            title: 'Responsive',
            content: createButtons({
                id: 'showResponsiveBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => offcanvas.open(),
            }),
        });
    }

    initUseScrollLock() {
        const content = createElement('div', {
            id: 'useScrollLockContent',
            children: [
                createElement('h3', { textContent: '\'useScrollLock\' option' }),
                createListContent({ className: 'offcanvas-nav' }),
            ],
        });

        const offcanvas = Offcanvas.create({
            useScrollLock: false,
            content,
        });

        this.addSection({
            id: 'useScrollLock',
            title: '\'useScrollLock\' option',
            description: 'In this example scroll lock is disabled, so body scroll should be available under backdrop of active component.',
            content: createButtons({
                id: 'showScrollLockBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => offcanvas.open(),
            }),
        });
    }
}

OffcanvasView.create();
