import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { MenuButton } from 'jezvejs/MenuButton';
import { PopupPosition } from 'jezvejs/PopupPosition';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import { PopupContainer } from './components/PopupContainer/PopupContainer.js';
import './PopupPositionView.scss';

/* CSS classes */
const CENTERED_CONTAINER_CLASS = 'centered-container';

/**
 * PopupPosition utility demo view
 */
class PopupPositionView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDefault();
        this.initPosition();
        this.initAllowFlip();
        this.initNoScroll();
        this.initNoResize();
    }

    initCommonSection(options) {
        const {
            id,
            title,
            description,
            positionProps,
        } = options;

        const logsField = LogsField.create();
        const popup = PopupContainer.create();
        let button = null;

        const onScrollDone = () => {
            logsField.write('onScrollDone()');
        };

        const togglePopup = () => {
            if (popup.isVisible()) {
                popup.hide();
                PopupPosition.reset(popup.elem);
                return;
            }

            popup.show();

            PopupPosition.calculate({
                elem: popup.elem,
                refElem: button.elem,
                ...positionProps,
                onScrollDone: () => onScrollDone(),
            });
        };

        button = MenuButton.create({
            onClick: () => togglePopup(),
        });

        const container = createElement('div', {
            props: { className: CENTERED_CONTAINER_CLASS },
            children: [
                button.elem,
                popup.elem,
            ],
        });

        this.addSection({
            id,
            title,
            description,
            content: [
                container,
                logsField.elem,
            ],
        });
    }

    initDefault() {
        this.initCommonSection({
            id: 'default',
            title: 'Default settings',
            positionProps: {
                margin: 10,
                screenPadding: 10,
                useRefWidth: true,
                scrollOnOverflow: true,
                allowResize: true,
                allowFlip: false,
            },
        });
    }

    initPosition() {
        this.initCommonSection({
            id: 'position',
            title: '\'position\' option',
            description: 'Available values: \'bottom\' and \'top\'.',
            positionProps: {
                margin: 10,
                screenPadding: 10,
                position: 'top',
                scrollOnOverflow: true,
                allowResize: false,
                allowFlip: false,
            },
        });
    }

    initAllowFlip() {
        this.initCommonSection({
            id: 'allowFlip',
            title: '\'allowFlip\' option',
            description: 'Set \'allowFlip\' option to true to enable flipping popup element if not enough space.',
            positionProps: {
                margin: 10,
                screenPadding: 10,
                scrollOnOverflow: true,
                allowResize: true,
                allowFlip: true,
            },
        });
    }

    initNoScroll() {
        this.initCommonSection({
            id: 'noScroll',
            title: 'Disable scroll on overflow',
            description: 'Set \'scrollOnOverflow\' option to false to disable scroll containers of popup element on overflow.',
            positionProps: {
                margin: 10,
                screenPadding: 10,
                scrollOnOverflow: false,
                allowResize: true,
                allowFlip: false,
            },
        });
    }

    initNoResize() {
        this.initCommonSection({
            id: 'noResize',
            title: 'Disable resize',
            description: 'Set \'allowResize\' option to false to disable resize popup element if not enough space.',
            positionProps: {
                margin: 10,
                screenPadding: 10,
                scrollOnOverflow: false,
                allowResize: false,
                allowFlip: false,
            },
        });
    }
}

PopupPositionView.create();
