import 'jezvejs/style';
import { createElement, ge, setEvents } from 'jezvejs';
import { Button } from 'jezvejs/Button';
import { Offcanvas } from 'jezvejs/Offcanvas';

import { DemoView } from '../../Application/DemoView.js';
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
        this.initDefault();
        this.initRight();
        this.initTop();
        this.initBottom();
        this.initResponsive();
        this.initUseScrollLock();
    }

    initDefault() {
        const logsField = LogsField.create();

        const offcanvas = Offcanvas.create({
            content: ge('defaultContent'),
            onOpened: () => logsField.write('Opened'),
            onClosed: () => logsField.write('Closed'),
        });

        setEvents(ge('toggleTopBtn'), { click: () => offcanvas.toggle() });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                createElement('div', {
                    props: { className: 'section-controls' },
                    children: Button.create({
                        id: 'showDefaultBtn',
                        className: 'action-btn',
                        title: 'Show',
                        onClick: () => offcanvas.open(),
                    }).elem,
                }),
                logsField.elem,
            ],
        });
    }

    initRight() {
        const offcanvas = Offcanvas.create({
            content: ge('rightContent'),
            placement: 'right',
        });

        this.addSection({
            id: 'right',
            title: 'Right placement',
            content: createElement('div', {
                props: { className: 'section-controls' },
                children: Button.create({
                    id: 'showRightBtn',
                    className: 'action-btn',
                    title: 'Show',
                    onClick: () => offcanvas.open(),
                }).elem,
            }),
        });
    }

    initTop() {
        const offcanvas = Offcanvas.create({
            content: ge('topContent'),
            placement: 'top',
        });

        this.addSection({
            id: 'top',
            title: 'Top placement',
            content: createElement('div', {
                props: { className: 'section-controls' },
                children: Button.create({
                    id: 'showTopBtn',
                    className: 'action-btn',
                    title: 'Show',
                    onClick: () => offcanvas.open(),
                }).elem,
            }),
        });
    }

    initBottom() {
        const offcanvas = Offcanvas.create({
            content: ge('bottomContent'),
            placement: 'bottom',
        });

        this.addSection({
            id: 'bottom',
            title: 'Bottom placement',
            content: createElement('div', {
                props: { className: 'section-controls' },
                children: Button.create({
                    id: 'showBottomBtn',
                    className: 'action-btn',
                    title: 'Show',
                    onClick: () => offcanvas.open(),
                }).elem,
            }),
        });
    }

    initResponsive() {
        const offcanvas = Offcanvas.create({
            content: ge('responsiveContent'),
            className: 'offcanvas-responsive',
        });

        this.addSection({
            id: 'responsive',
            title: 'Responsive',
            content: createElement('div', {
                props: { className: 'section-controls' },
                children: Button.create({
                    id: 'showResponsiveBtn',
                    className: 'action-btn',
                    title: 'Show',
                    onClick: () => offcanvas.open(),
                }).elem,
            }),
        });
    }

    initUseScrollLock() {
        const offcanvas = Offcanvas.create({
            useScrollLock: false,
            content: ge('useScrollLockContent'),
        });

        this.addSection({
            id: 'useScrollLock',
            title: '\'useScrollLock\' option',
            description: 'In this example scroll lock is disabled, so body scroll should be available under backdrop of active component.',
            content: createElement('div', {
                props: { className: 'section-controls' },
                children: Button.create({
                    id: 'showScrollLockBtn',
                    className: 'action-btn',
                    title: 'Show',
                    onClick: () => offcanvas.open(),
                }).elem,
            }),
        });
    }
}

OffcanvasView.create();
