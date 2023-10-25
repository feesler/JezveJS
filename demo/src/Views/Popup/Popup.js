import 'jezvejs/style';
import {
    ge,
    createElement,
    selectedValue,
    setEvents,
    show,
} from '@jezvejs/dom';
import { Popup } from 'jezvejs/Popup';
import { Notification } from 'jezvejs/Notification';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createButtons } from '../../Application/utils.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import { PopupDragZone } from './impl/PopupDragZone.js';
import { PopupDropTarget } from './impl/PopupDropTarget.js';
import './PopupView.scss';

const createOkBtn = ({ onClick, textContent = 'ok', disabled = false }) => (
    createElement('button', {
        props: {
            className: 'btn action-btn',
            type: 'button',
            textContent,
            disabled,
        },
        events: { click: (e) => onClick(e) },
    })
);

const createCancelBtn = ({ onClick, textContent = 'cancel', disabled = false }) => (
    createElement('button', {
        props: {
            className: 'btn action-btn',
            type: 'button',
            textContent,
            disabled,
        },
        events: { click: (e) => onClick(e) },
    })
);

const placeholderMsg = 'Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.';

/**
 * Popup component demo view
 */
class PopupView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initFullWidthPopup();
        this.initCloseBtnPopup();
        this.initMessageScrollPopup();
        this.initCenterOnlyPopup();
        this.initNoDimPopup();
        this.initDraggablePopup();
        this.initNotifyPopup();
        this.initTemplatePopup();
        this.initNestedPopup();
        this.initControlsUpdatePopup();
        this.initTitleUpdatePopup();
        this.initContentUpdatePopup();
    }

    onPopupResult(res) {
        this.logsField.write((res) ? 'OK Button' : 'Cancel Button');
    }

    onPopupResultAndClose(popup, res) {
        this.onPopupResult(res);
        popup.close();
    }

    showFullWidthPopup() {
        if (!this.fullWidthPopup) {
            this.fullWidthPopup = Popup.create({
                id: 'fullWidthPopup',
                title: 'Fullwidth popup',
                className: 'full-width',
                closeButton: false,
                content: `This popup is dynamically created and have content on the center of screen with fullwidth background.
                Control buttons are added and both will close popup.`,
                footer: [
                    createOkBtn({
                        onClick: () => this.onPopupResultAndClose(this.fullWidthPopup, true),
                    }),
                    createCancelBtn({
                        onClick: () => this.onPopupResultAndClose(this.fullWidthPopup, false),
                    }),
                ],
            });
        }

        this.fullWidthPopup.show();
    }

    initFullWidthPopup() {
        this.logsField = LogsField.create();

        this.addSection({
            id: 'fullwidth',
            title: 'Full width',
            content: [
                createButtons({
                    id: 'showFullWidthBtn',
                    className: 'action-btn',
                    title: 'Show',
                    onClick: () => this.showFullWidthPopup(),
                }),
                this.logsField.elem,
            ],
        });
    }

    showCloseBtnPopup() {
        if (!this.closeBtnPopup) {
            this.closeBtnPopup = Popup.create({
                id: 'closeBtnPopup',
                title: 'Fullwidth popup',
                className: 'full-width',
                closeButton: true,
                content: `This popup is dynamically created and have content on the center of screen with fullwidth background.
                Close button is added. Control buttons will not close popup.
                On small screen message will overflow and whole popup should be scrolled

                ${placeholderMsg}${placeholderMsg}`,
                footer: [
                    createOkBtn({ onClick: () => this.onPopupResult(true) }),
                    createCancelBtn({ onClick: () => this.onPopupResult(false) }),
                ],
            });
        }

        this.closeBtnPopup.show();
    }

    initCloseBtnPopup() {
        this.addSection({
            id: 'close',
            title: 'Close button',
            content: createButtons({
                id: 'showCloseBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showCloseBtnPopup(),
            }),
        });
    }

    showMessageScrollPopup() {
        if (!this.messageScrollPopup) {
            this.messageScrollPopup = Popup.create({
                id: 'messageScrollPopup',
                title: 'Fullwidth popup',
                className: 'full-width',
                closeButton: true,
                content: `This popup is dynamically created and have content on the center of screen with fullwidth background.
                Close button is added. Control buttons will not close popup.
                On small screen message will overflow and whole popup should be scrolled

                ${placeholderMsg}${placeholderMsg}`,
                scrollMessage: true,
                footer: [
                    createOkBtn({ onClick: () => this.onPopupResult(true) }),
                    createCancelBtn({ onClick: () => this.onPopupResult(false) }),
                ],
            });
        }

        this.messageScrollPopup.show();
    }

    initMessageScrollPopup() {
        this.addSection({
            id: 'msgScroll',
            title: 'Scroll message',
            content: createButtons({
                id: 'showMsgScrollBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showMessageScrollPopup(),
            }),
        });
    }

    showCenterOnlyPopup() {
        if (!this.centerOnlyPopup) {
            this.centerOnlyPopup = Popup.create({
                id: 'centerOnlyPopup',
                title: 'Center popup',
                closeButton: true,
                content: 'This popup is dynamically created and have only center background.',
                className: 'center_only',
            });
        }

        this.centerOnlyPopup.show();
    }

    initCenterOnlyPopup() {
        this.addSection({
            id: 'center',
            title: 'Center',
            content: createButtons({
                id: 'showCenterOnlyBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showCenterOnlyPopup(),
            }),
        });
    }

    showNoDimPopup() {
        if (!this.noDimPopup) {
            this.noDimPopup = Popup.create({
                id: 'noDimPopup',
                title: 'No dimming',
                content: 'This popup is dynamically created and doesn\'t dim page background.',
                closeButton: true,
                className: ['center_only', 'border_popup'],
                nodim: true,
            });
        }

        this.noDimPopup.show();
    }

    initNoDimPopup() {
        this.addSection({
            id: 'noDim',
            title: 'No dimming',
            content: createButtons({
                id: 'showNoDimBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showNoDimPopup(),
            }),
        });
    }

    showDraggablePopup() {
        if (!this.draggablePopup) {
            this.draggablePopup = Popup.create({
                id: 'draggablePopup',
                title: 'Draggable',
                content: 'This popup is dynamically created and draggable.',
                closeButton: true,
                className: ['center_only', 'border_popup', 'draggable_popup'],
                nodim: true,
            });

            const { container, wrapperElem } = this.draggablePopup;
            PopupDragZone.create({ elem: container });
            PopupDropTarget.create({ elem: wrapperElem });
        }

        this.draggablePopup.show();
    }

    initDraggablePopup() {
        this.addSection({
            id: 'draggable',
            title: 'Draggable',
            content: createButtons({
                id: 'showDraggableBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showDraggablePopup(),
            }),
        });
    }

    showNotifyPopup() {
        if (!this.notificationPopup) {
            this.notificationPopup = Notification.create({
                id: 'notificationPopup',
                closeButton: false,
                content: 'Default notification popup. Will be closed by click on empty place.',
            });
        }

        this.notificationPopup.show();
    }

    showSuccessNotifyPopup() {
        if (!this.successNotifyPopup) {
            this.successNotifyPopup = Notification.create({
                id: 'successNotifyPopup',
                content: 'Success message. Something created as expected.',
                type: 'success',
            });
        }

        this.successNotifyPopup.show();
    }

    showErrorNotifyPopup() {
        if (!this.errorNotifyPopup) {
            this.errorNotifyPopup = Notification.create({
                id: 'errorNotifyPopup',
                content: 'Error message. Fail to create something',
                type: 'error',
            });
        }

        this.errorNotifyPopup.show();
    }

    initNotifyPopup() {
        this.addSection({
            id: 'notification',
            title: 'Notification',
            content: createButtons([{
                id: 'showNotifyBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showNotifyPopup(),
            }, {
                id: 'showSuccessNotifyBtn',
                className: 'action-btn',
                title: 'Show success',
                onClick: () => this.showSuccessNotifyPopup(),
            }, {
                id: 'showErrorNotifyBtn',
                className: 'action-btn',
                title: 'Show error',
                onClick: () => this.showErrorNotifyPopup(),
            }]),
        });
    }

    showTemplatePopup() {
        if (!this.templatePopup) {
            const content = ge('formTemplate');
            this.templatePopup = Popup.create({
                id: 'templatePopup',
                title: 'Template',
                content,
                closeButton: true,
                footer: [
                    createOkBtn({
                        onClick: () => this.onPopupResultAndClose(this.templatePopup, true),
                    }),
                ],
            });
            show(content, true);
        }

        this.templatePopup.show();
    }

    initTemplatePopup() {
        this.addSection({
            id: 'template',
            title: 'Use template',
            content: createButtons({
                id: 'showTplBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showTemplatePopup(),
            }),
        });
    }

    showNestedChildPopup() {
        if (!this.nestedChildPopup) {
            const content = ge('nestedChildTemplate');
            this.nestedChildPopup = Popup.create({
                id: 'nestedChildPopup',
                title: 'Select something',
                content,
                className: ['center_only', 'border_popup'],
                nodim: true,
                closeButton: true,
                footer: [
                    createOkBtn({
                        onClick: () => this.onPopupResultAndClose(this.nestedChildPopup, true),
                    }),
                ],
            });
            show(content, true);

            setEvents(ge('valueselect'), {
                change: (e) => {
                    ge('valueresult').textContent = selectedValue(e.target);
                },
            });
        }

        this.nestedChildPopup.show();
    }

    showNestedPopup() {
        if (!this.nestedParentPopup) {
            const content = ge('nestedParentTemplate');
            this.nestedParentPopup = Popup.create({
                id: 'nestedParentPopup',
                title: 'Nested popups',
                content,
                closeButton: true,
                footer: [
                    createOkBtn({
                        textContent: 'Select',
                        onClick: () => this.showNestedChildPopup(),
                    }),
                ],
            });
            show(content, true);
        }

        this.nestedParentPopup.show();
    }

    initNestedPopup() {
        this.addSection({
            id: 'nested',
            title: 'Nested popups',
            content: createButtons({
                id: 'showNestedBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showNestedPopup(),
            }),
        });
    }

    removeControls() {
        this.restoreControlsBtn.disabled = false;
        this.controlsUpdatePopup.setFooter([
            this.restoreControlsBtn,
        ]);
        this.controlsUpdatePopup.setCloseButton(false);
    }

    restoreControls = () => {
        this.restoreControlsBtn.disabled = true;
        this.controlsUpdatePopup.setFooter([
            this.restoreControlsBtn,
            this.removeControlsBtn,
        ]);

        this.controlsUpdatePopup.setCloseButton(true);
    };

    showControlsUpdatePopup() {
        if (!this.controlsUpdatePopup) {
            this.restoreControlsBtn = createOkBtn({
                textContent: 'Restore',
                disabled: true,
                onClick: () => this.restoreControls(),
            });

            this.removeControlsBtn = createCancelBtn({
                textContent: 'Remove',
                onClick: () => this.removeControls(),
            });

            this.controlsUpdatePopup = Popup.create({
                id: 'controlsUpdatePopup',
                title: 'setControls() methods test',
                content: `After click on Remove button it and Close button will disappear and Restore button will be enabled.
                After click on Restore button Close and Remove button will appear and Restore button will be disabled.`,
                className: ['center_only', 'border_popup', 'controls_test'],
                nodim: true,
                closeButton: true,
                footer: [
                    this.restoreControlsBtn,
                    this.removeControlsBtn,
                ],
            });
        }

        this.controlsUpdatePopup.show();
    }

    initControlsUpdatePopup() {
        this.addSection({
            id: 'controls',
            title: 'Update controls',
            content: createButtons({
                id: 'showControlsUpdBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showControlsUpdatePopup(),
            }),
        });
    }

    toggleTitle() {
        const popup = this.titleUpdatePopup;

        if (popup.titleState === 1) {
            popup.titleState = 2;

            const elementTitle = createElement('div', {
                props: { className: 'element-title' },
                children: [
                    createElement('button', {
                        props: { className: 'element-title__btn', innerHTML: '&#10004;' },
                    }),
                    createElement('span', { props: { textContent: 'Element title' } }),
                ],
            });

            popup.setTitle(elementTitle);
        } else {
            popup.titleState = 1;
            popup.setTitle('String title');
        }

        this.removeTitleBtn.disabled = false;
    }

    delTitle() {
        const popup = this.titleUpdatePopup;
        popup.titleState = -1;

        popup.setTitle(null);
        this.removeTitleBtn.disabled = true;
    }

    showTitleUpdatePopup() {
        if (!this.titleUpdatePopup) {
            this.changeTitleBtn = createOkBtn({
                textContent: 'Change title',
                onClick: () => this.toggleTitle(this.titleUpdatePopup),
            });
            this.removeTitleBtn = createCancelBtn({
                textContent: 'Remove title',
                disabled: true,
                onClick: () => this.delTitle(this.titleUpdatePopup),
            });

            this.titleUpdatePopup = Popup.create({
                id: 'popup14',
                title: 'setTitle() method test',
                content: 'This popup is able to change its title.',
                className: ['center_only', 'border_popup', 'controls_test'],
                nodim: true,
                closeButton: true,
                footer: [
                    this.changeTitleBtn,
                    this.removeTitleBtn,
                ],
            });

            this.titleUpdatePopup.titleState = 0;
        }

        this.titleUpdatePopup.show();
    }

    initTitleUpdatePopup() {
        this.addSection({
            id: 'title',
            title: 'Update title',
            content: createButtons({
                id: 'showTitleUpdBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showTitleUpdatePopup(),
            }),
        });
    }

    stringContent() {
        this.contentUpdatePopup.setContent('This popup is able to change its content.');

        this.stringContentBtn.disabled = true;
        this.templateContentBtn.disabled = false;
    }

    templateContent() {
        this.contentUpdatePopup.setContent(
            createElement('div', {
                children: [
                    createElement('div', { props: { className: 'template-test__item' } }),
                    createElement('div', { props: { className: 'template-test__item' } }),
                    createElement('div', { props: { className: 'template-test__item' } }),
                ],
            }),
        );

        this.stringContentBtn.disabled = false;
        this.templateContentBtn.disabled = true;
    }

    showContentUpdatePopup() {
        if (!this.contentUpdatePopup) {
            this.stringContentBtn = createOkBtn({
                textContent: 'String',
                disabled: true,
                onClick: () => this.stringContent(),
            });
            this.templateContentBtn = createCancelBtn({
                textContent: 'Template',
                onClick: () => this.templateContent(),
            });

            this.contentUpdatePopup = Popup.create({
                id: 'contentUpdatePopup',
                title: 'setContent() method test',
                content: 'This popup is able to change its content.',
                className: ['center_only', 'border_popup', 'controls_test'],
                nodim: true,
                closeButton: true,
                footer: [
                    this.stringContentBtn,
                    this.templateContentBtn,
                ],
            });
        }

        this.contentUpdatePopup.show();
    }

    initContentUpdatePopup() {
        setEvents(ge('showContentUpdBtn'), { click: this.showContentUpdatePopup });

        this.addSection({
            id: 'content',
            title: 'Update content',
            content: createButtons({
                id: 'showContentUpdBtn',
                className: 'action-btn',
                title: 'Show',
                onClick: () => this.showContentUpdatePopup(),
            }),
        });
    }
}

PopupView.create();
