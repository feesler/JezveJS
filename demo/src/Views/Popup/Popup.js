import 'jezvejs/style';
import {
    ge,
    createElement,
    selectedValue,
    onReady,
    setEvents,
    show,
} from 'jezvejs';
import { Popup } from 'jezvejs/Popup';
import { Notification } from 'jezvejs/Notification';
import { PopupDragZone } from './impl/PopupDragZone.js';
import { PopupDropTarget } from './impl/PopupDropTarget.js';
import { initNavigation } from '../../app.js';
import './style.scss';

const logTo = (target, value) => {
    const elem = (typeof target === 'string') ? ge(target) : target;
    if (!elem) {
        return;
    }

    elem.value += `${value}\r\n`;
};

const onPopupResult = (res) => {
    const value = (res) ? 'OK Button' : 'Cancel Button';
    logTo('result', value);
};

const onPopupResultAndClose = (popup, res) => {
    onPopupResult(res);
    popup.close();
};

const createOkBtn = ({ onClick, textContent = 'ok', disabled = false }) => (
    createElement('button', {
        props: {
            className: 'btn action-btn submit-btn',
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
            className: 'btn action-btn cancel-btn',
            type: 'button',
            textContent,
            disabled,
        },
        events: { click: (e) => onClick(e) },
    })
);

let fullWidthPopup = null;
const showFullWidthPopup = () => {
    if (!fullWidthPopup) {
        fullWidthPopup = Popup.create({
            id: 'fullWidthPopup',
            title: 'Fullwidth popup',
            className: 'full-width',
            closeButton: false,
            content: `This popup is dynamically created and have content on the center of screen with fullwidth background.
                Control buttons are added and both will close popup.`,
            footer: [
                createOkBtn({ onClick: () => onPopupResultAndClose(fullWidthPopup, true) }),
                createCancelBtn({ onClick: () => onPopupResultAndClose(fullWidthPopup, false) }),
            ],
        });
    }

    fullWidthPopup.show();
};

const initFullWidthPopup = () => {
    setEvents(ge('showFullWidthBtn'), { click: showFullWidthPopup });
};

const placeholderMsg = 'Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.';
let closeBtnPopup = null;
const showCloseBtnPopup = () => {
    if (!closeBtnPopup) {
        closeBtnPopup = Popup.create({
            id: 'closeBtnPopup',
            title: 'Fullwidth popup',
            className: 'full-width',
            closeButton: true,
            content: `This popup is dynamically created and have content on the center of screen with fullwidth background.
                Close button is added. Control buttons will not close popup.
                On small screen message will overflow and whole popup should be scrolled

                ${placeholderMsg}${placeholderMsg}`,
            footer: [
                createOkBtn({ onClick: () => onPopupResult(true) }),
                createCancelBtn({ onClick: () => onPopupResult(false) }),
            ],
        });
    }

    closeBtnPopup.show();
};

const initCloseBtnPopup = () => {
    setEvents(ge('showCloseBtn'), { click: showCloseBtnPopup });
};

let messageScrollPopup = null;
const showMessageScrollPopup = () => {
    if (!messageScrollPopup) {
        messageScrollPopup = Popup.create({
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
                createOkBtn({ onClick: () => onPopupResult(true) }),
                createCancelBtn({ onClick: () => onPopupResult(false) }),
            ],
        });
    }

    messageScrollPopup.show();
};

const initMessageScrollPopup = () => {
    setEvents(ge('showMsgScrollBtn'), { click: showMessageScrollPopup });
};

let centerOnlyPopup = null;
const showCenterOnlyPopup = () => {
    if (!centerOnlyPopup) {
        centerOnlyPopup = Popup.create({
            id: 'centerOnlyPopup',
            title: 'Center popup',
            closeButton: true,
            content: 'This popup is dynamically created and have only center background.',
            className: 'center_only',
        });
    }

    centerOnlyPopup.show();
};

const initCenterOnlyPopup = () => {
    setEvents(ge('showCenterOnlyBtn'), { click: showCenterOnlyPopup });
};

let noDimPopup = null;
const showNoDimPopup = () => {
    if (!noDimPopup) {
        noDimPopup = Popup.create({
            id: 'noDimPopup',
            title: 'No dimming',
            content: 'This popup is dynamically created and doesn\'t dim page background.',
            closeButton: true,
            className: ['center_only', 'border_popup'],
            nodim: true,
        });
    }

    noDimPopup.show();
};

const initNoDimPopup = () => {
    setEvents(ge('showNoDimBtn'), { click: showNoDimPopup });
};

let draggablePopup = null;
const showDraggablePopup = () => {
    if (!draggablePopup) {
        draggablePopup = Popup.create({
            id: 'draggablePopup',
            title: 'Draggable',
            content: 'This popup is dynamically created and draggable.',
            closeButton: true,
            className: ['center_only', 'border_popup', 'draggable_popup'],
            nodim: true,
        });

        const { container, wrapperElem } = draggablePopup;
        PopupDragZone.create({ elem: container });
        PopupDropTarget.create({ elem: wrapperElem });
    }

    draggablePopup.show();
};

const initDraggablePopup = () => {
    setEvents(ge('showDraggableBtn'), { click: showDraggablePopup });
};

let notificationPopup = null;
const showNotifyPopup = () => {
    if (!notificationPopup) {
        notificationPopup = Notification.create({
            id: 'notificationPopup',
            closeButton: false,
            content: 'Default notification popup. Will be closed by click on empty place.',
        });
    }

    notificationPopup.show();
};

let successNotifyPopup = null;
const showSuccessNotifyPopup = () => {
    if (!successNotifyPopup) {
        successNotifyPopup = Notification.create({
            id: 'successNotifyPopup',
            content: 'Success message. Something created as expected.',
            type: 'success',
        });
    }

    successNotifyPopup.show();
};

let errorNotifyPopup = null;
const showErrorNotifyPopup = () => {
    if (!errorNotifyPopup) {
        errorNotifyPopup = Notification.create({
            id: 'errorNotifyPopup',
            content: 'Error message. Fail to create something',
            type: 'error',
        });
    }

    errorNotifyPopup.show();
};

const initNotifyPopup = () => {
    setEvents(ge('showNotifyBtn'), { click: showNotifyPopup });
    setEvents(ge('showSuccessNotifyBtn'), { click: showSuccessNotifyPopup });
    setEvents(ge('showErrorNotifyBtn'), { click: showErrorNotifyPopup });
};

let templatePopup = null;
const showTemplatePopup = () => {
    if (!templatePopup) {
        const content = ge('formTemplate');
        templatePopup = Popup.create({
            id: 'templatePopup',
            title: 'Template',
            content,
            closeButton: true,
            footer: [
                createOkBtn({ onClick: () => onPopupResultAndClose(templatePopup, true) }),
            ],
        });
        show(content, true);
    }

    templatePopup.show();
};

const initTemplatePopup = () => {
    setEvents(ge('showTplBtn'), { click: showTemplatePopup });
};

let nestedChildPopup = null;
const showNestedChildPopup = () => {
    if (!nestedChildPopup) {
        const content = ge('nestedChildTemplate');
        nestedChildPopup = Popup.create({
            id: 'nestedChildPopup',
            title: 'Select something',
            content,
            className: ['center_only', 'border_popup'],
            nodim: true,
            closeButton: true,
            footer: [
                createOkBtn({ onClick: () => onPopupResultAndClose(nestedChildPopup, true) }),
            ],
        });
        show(content, true);

        ge('valueselect').addEventListener('change', (e) => {
            ge('valueresult').textContent = selectedValue(e.target);
        });
    }

    nestedChildPopup.show();
};

let nestedParentPopup = null;
const showNestedPopup = () => {
    if (!nestedParentPopup) {
        const content = ge('nestedParentTemplate');
        nestedParentPopup = Popup.create({
            id: 'nestedParentPopup',
            title: 'Nested popups',
            content,
            closeButton: true,
            footer: [
                createOkBtn({
                    textContent: 'Select',
                    onClick: showNestedChildPopup,
                }),
            ],
        });
        show(content, true);
    }

    nestedParentPopup.show();
};

const initNestedPopup = () => {
    setEvents(ge('showNestedBtn'), { click: showNestedPopup });
};

let controlsUpdatePopup = null;
let restoreControlsBtn = null;
let removeControlsBtn = null;

const removeControls = () => {
    restoreControlsBtn.disabled = false;
    controlsUpdatePopup.setFooter([
        restoreControlsBtn,
    ]);
    controlsUpdatePopup.setCloseButton(false);
};

const restoreControls = (popup) => {
    restoreControlsBtn.disabled = true;
    popup.setFooter([
        restoreControlsBtn,
        removeControlsBtn,
    ]);

    popup.setCloseButton(true);
};

const showControlsUpdatePopup = () => {
    if (!controlsUpdatePopup) {
        restoreControlsBtn = createOkBtn({
            textContent: 'Restore',
            disabled: true,
            onClick: () => restoreControls(controlsUpdatePopup),
        });

        removeControlsBtn = createCancelBtn({
            textContent: 'Remove',
            onClick: () => removeControls(controlsUpdatePopup),
        });

        controlsUpdatePopup = Popup.create({
            id: 'controlsUpdatePopup',
            title: 'setControls() methods test',
            content: `After click on Remove button it and Close button will disappear and Restore button will be enabled.
                After click on Restore button Close and Remove button will appear and Restore button will be disabled.`,
            className: ['center_only', 'border_popup', 'controls_test'],
            nodim: true,
            closeButton: true,
            footer: [
                restoreControlsBtn,
                removeControlsBtn,
            ],
        });
    }

    controlsUpdatePopup.show();
};

const initControlsUpdatePopup = () => {
    setEvents(ge('showControlsUpdBtn'), { click: showControlsUpdatePopup });
};

let titleUpdatePopup = null;
let changeTitleBtn = null;
let removeTitleBtn = null;

/* eslint-disable no-param-reassign */
const toggleTitle = (popup) => {
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

    removeTitleBtn.disabled = false;
};

const delTitle = (popup) => {
    popup.titleState = -1;

    popup.setTitle(null);
    removeTitleBtn.disabled = true;
};
/* eslint-enable no-param-reassign */

const showTitleUpdatePopup = () => {
    if (!titleUpdatePopup) {
        changeTitleBtn = createOkBtn({
            textContent: 'Change title',
            onClick: () => toggleTitle(titleUpdatePopup),
        });
        removeTitleBtn = createCancelBtn({
            textContent: 'Remove title',
            disabled: true,
            onClick: () => delTitle(titleUpdatePopup),
        });

        titleUpdatePopup = Popup.create({
            id: 'popup14',
            title: 'setTitle() method test',
            content: 'This popup is able to change its title.',
            className: ['center_only', 'border_popup', 'controls_test'],
            nodim: true,
            closeButton: true,
            footer: [
                changeTitleBtn,
                removeTitleBtn,
            ],
        });

        titleUpdatePopup.titleState = 0;
    }

    titleUpdatePopup.show();
};

const initTitleUpdatePopup = () => {
    setEvents(ge('showTitleUpdBtn'), { click: showTitleUpdatePopup });
};

let contentUpdatePopup = null;
let stringContentBtn = null;
let templateContentBtn = null;

const stringContent = (popup) => {
    popup.setContent('This popup is able to change its content.');

    stringContentBtn.disabled = true;
    templateContentBtn.disabled = false;
};

const templateContent = (popup) => {
    popup.setContent(
        createElement('div', {
            children: [
                createElement('div', { props: { className: 'template-test__item' } }),
                createElement('div', { props: { className: 'template-test__item' } }),
                createElement('div', { props: { className: 'template-test__item' } }),
            ],
        }),
    );

    stringContentBtn.disabled = false;
    templateContentBtn.disabled = true;
};

const showContentUpdatePopup = () => {
    if (!contentUpdatePopup) {
        stringContentBtn = createOkBtn({
            textContent: 'String',
            disabled: true,
            onClick: () => stringContent(contentUpdatePopup),
        });
        templateContentBtn = createCancelBtn({
            textContent: 'Template',
            onClick: () => templateContent(contentUpdatePopup),
        });

        contentUpdatePopup = Popup.create({
            id: 'contentUpdatePopup',
            title: 'setContent() method test',
            content: 'This popup is able to change its content.',
            className: ['center_only', 'border_popup', 'controls_test'],
            nodim: true,
            closeButton: true,
            footer: [
                stringContentBtn,
                templateContentBtn,
            ],
        });
    }

    contentUpdatePopup.show();
};

const initContentUpdatePopup = () => {
    setEvents(ge('showContentUpdBtn'), { click: showContentUpdatePopup });
};

const init = () => {
    initNavigation();

    initFullWidthPopup();
    initCloseBtnPopup();
    initMessageScrollPopup();
    initCenterOnlyPopup();
    initNoDimPopup();
    initDraggablePopup();
    initNotifyPopup();
    initTemplatePopup();
    initNestedPopup();
    initControlsUpdatePopup();
    initTitleUpdatePopup();
    initContentUpdatePopup();
};

onReady(init);
