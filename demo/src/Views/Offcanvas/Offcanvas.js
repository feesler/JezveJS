import 'jezvejs/style';
import { ge, setEvents } from '@jezvejs/dom';
import { Offcanvas } from 'jezvejs/Offcanvas';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createButtons } from '../../Application/utils.js';
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
            content: ge('rightContent'),
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
            content: ge('topContent'),
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
            content: ge('bottomContent'),
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
        const offcanvas = Offcanvas.create({
            content: ge('responsiveContent'),
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
        const offcanvas = Offcanvas.create({
            useScrollLock: false,
            content: ge('useScrollLockContent'),
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
