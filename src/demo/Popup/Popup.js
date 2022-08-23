import {
    ge,
    ce,
    selectedValue,
    onReady,
    Popup,
    setEvents,
} from '../../js/index.js';
import { PopupDragZone } from './impl/PopupDragZone.js';
import { PopupDropTarget } from './impl/PopupDropTarget.js';
import '../../css/common.scss';
import '../css/app.scss';
import './style.scss';

const onPopupResult = (res) => {
    const result = ge('result');
    if (result) {
        result.textContent = (res) ? 'OK Button' : 'Cancel Button';
    }
};

const onPopupResultAndClose = (popup, res) => {
    const result = ge('result');
    if (result) {
        result.textContent = (res) ? 'OK Button' : 'Cancel Button';
    }

    popup.close();
};

let fullWidthPopup = null;
const showFullWidthPopup = () => {
    if (!fullWidthPopup) {
        fullWidthPopup = Popup.create({
            id: 'fullWidthPopup',
            title: 'Fullwidth popup',
            content: `This popup is dynamically created and have content on the center of screen with fullwidth background.<br>
            Control buttons are added and both will close popup.`,
        });
        fullWidthPopup.setControls({
            okBtn: { onclick: () => onPopupResultAndClose(fullWidthPopup, true) },
            cancelBtn: { onclick: () => onPopupResultAndClose(fullWidthPopup, false) },
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
            content: `This popup is dynamically created and have content on the center of screen with fullwidth background.<br>
            Close button is added. Control buttons will not close popup.<br>
            On small screen message will overflow and whole popup should be scrolled<br><br>${placeholderMsg}${placeholderMsg}`,
            btn: {
                okBtn: { onclick: onPopupResult.bind(null, true) },
                cancelBtn: { onclick: onPopupResult.bind(null, false) },
                closeBtn: true,
            },
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
            content: `This popup is dynamically created and have content on the center of screen with fullwidth background.<br>
            Close button is added. Control buttons will not close popup.<br>
            On small screen message will overflow and whole popup should be scrolled<br><br>${placeholderMsg}${placeholderMsg}`,
            scrollMessage: true,
            btn: {
                okBtn: { onclick: () => onPopupResult(true) },
                cancelBtn: { onclick: () => onPopupResult(false) },
                closeBtn: true,
            },
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
            content: 'This popup is dynamically created and have only center background.',
            btn: { closeBtn: true },
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
            btn: { closeBtn: true },
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
            btn: { closeBtn: true },
            className: ['center_only', 'border_popup', 'draggable_popup'],
            nodim: true,
        });

        const { boxElem, contentElem } = draggablePopup;
        PopupDragZone.create({ elem: boxElem });
        PopupDropTarget.create({ elem: contentElem });
    }

    draggablePopup.show();
};

const initDraggablePopup = () => {
    setEvents(ge('showDraggableBtn'), { click: showDraggablePopup });
};

let notificationPopup = null;
const showNotifyPopup = () => {
    if (!notificationPopup) {
        notificationPopup = Popup.create({
            id: 'notificationPopup',
            content: 'This popup is dynamically created. It has no buttons and title and will be closed only on click on empty place.',
            className: ['center_only', 'border_popup'],
            nodim: true,
            closeOnEmptyClick: true,
        });
    }

    notificationPopup.show();
};

let successNotifyPopup = null;
const showSuccessNotifyPopup = () => {
    if (!successNotifyPopup) {
        successNotifyPopup = Popup.create({
            id: 'successNotifyPopup',
            content: 'Success message. Something created as expected.',
            btn: { closeBtn: true },
            className: ['msg', 'msg_success'],
            nodim: true,
            closeOnEmptyClick: true,
        });
    }

    successNotifyPopup.show();
};

let errorNotifyPopup = null;
const showErrorNotifyPopup = () => {
    if (!errorNotifyPopup) {
        errorNotifyPopup = Popup.create({
            id: 'errorNotifyPopup',
            content: 'Error message. Fail to create something',
            btn: { closeBtn: true },
            className: ['msg', 'msg_error'],
            nodim: true,
            closeOnEmptyClick: true,
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
        templatePopup = Popup.create({
            id: 'templatePopup',
            content: ge('template1'),
            btn: { closeBtn: true },
        });
    }

    templatePopup.show();
};

let template2Popup = null;
const showTemplate2Popup = () => {
    if (!template2Popup) {
        template2Popup = Popup.create({
            id: 'template2Popup',
            title: 'Extended template',
            content: ge('template2'),
        });
        template2Popup.setControls({
            okBtn: { onclick: () => onPopupResultAndClose(template2Popup, true) },
            closeBtn: true,
        });
    }

    template2Popup.show();
};

const initTemplatePopup = () => {
    setEvents(ge('showTplBtn'), { click: showTemplatePopup });
    setEvents(ge('showTpl2Btn'), { click: showTemplate2Popup });
};

let nestedChildPopup = null;
const showNestedChildPopup = () => {
    if (!nestedChildPopup) {
        nestedChildPopup = Popup.create({
            id: 'nestedChildPopup',
            title: 'Select something',
            content: ge('template4'),
            className: ['center_only', 'border_popup'],
            nodim: true,
        });

        nestedChildPopup.setControls({
            okBtn: { onclick: () => onPopupResultAndClose(nestedChildPopup, true) },
            closeBtn: true,
        });

        ge('valueselect').addEventListener('change', (e) => {
            ge('valueresult').textContent = selectedValue(e.target);
        });
    }

    nestedChildPopup.show();
};

let nestedParentPopup = null;
const showNestedPopup = () => {
    if (!nestedParentPopup) {
        nestedParentPopup = Popup.create({
            id: 'nestedParentPopup',
            title: 'Nested popups',
            content: ge('template3'),
            btn: {
                okBtn: { value: 'Select', onclick: showNestedChildPopup },
                closeBtn: true,
            },
        });
    }

    nestedParentPopup.show();
};

const initNestedPopup = () => {
    setEvents(ge('showNestedBtn'), { click: showNestedPopup });
};

const removeControls = (popup) => {
    popup.setControls({
        okBtn: { disabled: false },
        cancelBtn: false,
        closeBtn: false,
    });
};

const restoreControls = (popup) => {
    popup.setControls({
        okBtn: { disabled: true },
        cancelBtn: { value: 'Remove', onclick: () => removeControls(popup) },
        closeBtn: true,
    });
};

let controlsUpdatePopup = null;
const showControlsUpdatePopup = () => {
    if (!controlsUpdatePopup) {
        controlsUpdatePopup = Popup.create({
            id: 'controlsUpdatePopup',
            title: 'setControls() methods test',
            content: 'After click on Remove button it and Close button will disappear and Restore button will be enabled.<br>'
                + 'After click on Restore button Close and Remove button will appear and Restore button will be disabled.',
            className: ['center_only', 'border_popup', 'controls_test'],
            nodim: true,
            btn: {
                okBtn: { value: 'Restore', disabled: true },
                cancelBtn: { value: 'Remove' },
                closeBtn: true,
            },
        });

        controlsUpdatePopup.setControls({
            okBtn: { onclick: () => restoreControls(controlsUpdatePopup) },
            cancelBtn: { onclick: () => removeControls(controlsUpdatePopup) },
        });
    }

    controlsUpdatePopup.show();
};

const initControlsUpdatePopup = () => {
    setEvents(ge('showControlsUpdBtn'), { click: showControlsUpdatePopup });
};

/* eslint-disable no-param-reassign */
const toggleTitle = (popup) => {
    if (popup.titleState === 1) {
        popup.titleState = 2;

        const elementTitle = ce('div', { className: 'element-title' }, [
            ce('button', { className: 'element-title__btn', innerHTML: '&#10004;' }),
            ce('span', { textContent: 'Element title' }),
        ]);

        popup.setTitle(elementTitle);
    } else {
        popup.titleState = 1;
        popup.setTitle('String title');
    }
    popup.setControls({ cancelBtn: { disabled: false } });
};

const delTitle = (popup) => {
    popup.titleState = -1;

    popup.removeTitle();
    popup.setControls({
        okBtn: { disabled: false },
        cancelBtn: { disabled: true },
    });
};
/* eslint-enable no-param-reassign */

let titleUpdatePopup = null;
const showTitleUpdatePopup = () => {
    if (!titleUpdatePopup) {
        titleUpdatePopup = Popup.create({
            id: 'popup14',
            title: 'setTitle() method test',
            content: 'This popup is able to change its title.<br>',
            className: ['center_only', 'border_popup', 'controls_test'],
            nodim: true,
            btn: {
                okBtn: { value: 'Change title' },
                cancelBtn: { value: 'Remove title' },
                closeBtn: true,
            },
        });

        titleUpdatePopup.setControls({
            okBtn: { onclick: () => toggleTitle(titleUpdatePopup) },
            cancelBtn: { onclick: () => delTitle(titleUpdatePopup) },
        });

        titleUpdatePopup.titleState = 0;
    }

    titleUpdatePopup.show();
};

const initTitleUpdatePopup = () => {
    setEvents(ge('showTitleUpdBtn'), { click: showTitleUpdatePopup });
};

const stringContent = (popup) => {
    popup.setContent('This popup is able to change its content.');
    popup.setControls({
        okBtn: { disabled: true },
        cancelBtn: { disabled: false },
    });
};

const templateContent = (popup) => {
    popup.setContent(
        ce('div', {}, [
            ce('div', { className: 'template-test__item' }),
            ce('div', { className: 'template-test__item' }),
            ce('div', { className: 'template-test__item' }),
        ]),
    );
    popup.setControls({
        okBtn: { disabled: false },
        cancelBtn: { disabled: true },
    });
};

let contentUpdatePopup = null;
const showContentUpdatePopup = () => {
    if (!contentUpdatePopup) {
        contentUpdatePopup = Popup.create({
            id: 'contentUpdatePopup',
            title: 'setContent() method test',
            content: 'This popup is able to change its content.',
            className: ['center_only', 'border_popup', 'controls_test'],
            nodim: true,
            btn: {
                okBtn: { value: 'String', disabled: true },
                cancelBtn: { value: 'Template' },
                closeBtn: true,
            },
        });

        contentUpdatePopup.setControls({
            okBtn: { onclick: () => stringContent(contentUpdatePopup) },
            cancelBtn: { onclick: () => templateContent(contentUpdatePopup) },
        });
    }

    contentUpdatePopup.show();
};

const initContentUpdatePopup = () => {
    setEvents(ge('showContentUpdBtn'), { click: showContentUpdatePopup });
};

const init = () => {
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
