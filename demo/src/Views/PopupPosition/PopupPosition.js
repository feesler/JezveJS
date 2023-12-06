import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { MenuButton } from 'jezvejs/MenuButton';
import { PopupPosition } from 'jezvejs/PopupPosition';

import { createControls } from '../../Application/utils.js';
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import { RadioFieldset } from '../../Components/RadioFieldset/RadioFieldset.js';

import { PopupContainer } from './components/PopupContainer/PopupContainer.js';
import './PopupPositionView.scss';

/* CSS classes */
const REF_SCROLLER_CLASS = 'ref-scroller';
const REF_CONTAINER_CLASS = 'ref-container';
const LEFT_CONTAINER_CLASS = 'left-container';
const CENTERED_CONTAINER_CLASS = 'centered-container';
const RIGHT_CONTAINER_CLASS = 'right-container';

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

    calculatePosition(context) {
        const {
            popup,
            button,
            logsField = null,
            positionProps = {},
        } = context;

        const res = context;
        res.position = PopupPosition.create({
            elem: popup.elem,
            refElem: button.elem,
            ...positionProps,
            onScrollDone: () => logsField?.write('onScrollDone()'),
        });
    }

    updatePosition(context) {
        const { position } = context;
        position?.updatePosition();
    }

    resetPosition(context) {
        const { popup, position } = context;
        popup.hide();
        position.reset();
    }

    renderContainer(context) {
        const { buttonAlign, scroller } = context;
        const { classList } = context.container;

        classList.toggle(LEFT_CONTAINER_CLASS, buttonAlign === 'left');
        classList.toggle(CENTERED_CONTAINER_CLASS, buttonAlign === 'center');
        classList.toggle(RIGHT_CONTAINER_CLASS, buttonAlign === 'right');

        if (buttonAlign === 'left') {
            scroller.scrollLeft = 0;
        } else if (buttonAlign === 'center') {
            scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;
        } else if (buttonAlign === 'right') {
            scroller.scrollLeft = scroller.scrollWidth - scroller.clientWidth;
        }

        scroller.scrollTop = (scroller.scrollHeight - scroller.clientHeight) / 2;
    }

    togglePopup(context) {
        const { popup } = context;

        if (popup.isVisible()) {
            this.resetPosition(context);
            return;
        }

        popup.show();
        this.calculatePosition(context);
    }

    createPopupContext(options) {
        const {
            positionProps = {},
            ...rest
        } = options;

        const context = {
            logsField: LogsField.create(),
            popup: PopupContainer.create(),
            positionProps,
            ...rest,
        };

        context.button = MenuButton.create({
            onClick: () => this.togglePopup(context),
        });

        return context;
    }

    initCommonSection(options) {
        const {
            id,
            title,
            description,
            positionProps,
        } = options;

        const context = this.createPopupContext({ positionProps });

        context.container = createElement('div', {
            props: { className: CENTERED_CONTAINER_CLASS },
            children: [
                context.button.elem,
                context.popup.elem,
            ],
        });

        this.addSection({
            id,
            title,
            description,
            content: [
                context.container,
                context.logsField.elem,
            ],
        });
    }

    initPositionSection(options) {
        const {
            id = null,
            title = null,
            description = null,
            positionProps = {},
            ...rest
        } = options;

        const context = this.createPopupContext({
            buttonAlign: 'center',
            positionProps,
            ...rest,
        });

        const buttonAlignMap = {
            left: 'Left',
            center: 'Center',
            right: 'Right',
        };

        const alignButtonFieldset = RadioFieldset.create({
            title: 'Button alignment',
            radioName: 'buttonAlign',
            items: Object.entries(buttonAlignMap).map(([value, label]) => ({
                value,
                label,
                checked: (context.buttonAlign === value),
            })),
            onChange: (align) => {
                context.buttonAlign = align;
                this.renderContainer(context);
                this.updatePosition(context);
            },
        });

        const positionMap = {
            top: 'Top',
            bottom: 'Bottom',
            left: 'Left',
            right: 'Right',
        };

        const alignFieldset = RadioFieldset.create({
            title: 'Position',
            radioName: 'position',
            items: Object.entries(positionMap).map(([value, label]) => ({
                value,
                label,
                checked: (context.positionProps.position === value),
            })),
            onChange: (position) => {
                context.positionProps.position = position;
                if (context.popup.isVisible()) {
                    this.calculatePosition(context);
                }
            },
        });

        context.container = createElement('div', {
            props: { className: REF_CONTAINER_CLASS },
            children: [
                context.button.elem,
                context.popup.elem,
            ],
        });
        context.scroller = createElement('div', {
            props: { className: REF_SCROLLER_CLASS },
            children: context.container,
        });

        this.addSection({
            id,
            title,
            description,
            content: [
                context.scroller,
                createControls([
                    alignFieldset.elem,
                    alignButtonFieldset.elem,
                    context.logsField.elem,
                ]),
            ],
        });

        this.renderContainer(context);
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
                updateProps: {
                    scrollOnOverflow: false,
                    allowResize: false,
                },
            },
        });
    }

    initPosition() {
        this.initPositionSection({
            id: 'position',
            title: '\'position\' option',
            positionProps: {
                margin: 10,
                screenPadding: 10,
                useRefWidth: true,
                scrollOnOverflow: true,
                allowResize: false,
                allowFlip: false,
                position: 'bottom',
                updateProps: {
                    scrollOnOverflow: false,
                    allowResize: false,
                },
            },
        });
    }

    initAllowFlip() {
        this.initPositionSection({
            id: 'allowFlip',
            title: '\'allowFlip\' option',
            description: 'Set \'allowFlip\' option to true to enable flipping popup element if not enough space.',
            positionProps: {
                margin: 10,
                screenPadding: 10,
                scrollOnOverflow: true,
                allowResize: true,
                allowFlip: true,
                position: 'bottom',
                updateProps: {
                    scrollOnOverflow: false,
                    allowResize: false,
                },
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
                updateProps: {
                    scrollOnOverflow: false,
                    allowResize: false,
                },
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
                updateProps: {
                    scrollOnOverflow: false,
                    allowResize: false,
                },
            },
        });
    }
}

PopupPositionView.create();
