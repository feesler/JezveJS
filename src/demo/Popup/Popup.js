import {
    ge,
    ce,
    selectedValue,
    onReady,
} from '../../js/common.js';
import { Popup } from '../../Components/Popup/Popup.js';
import { PopupDragZone } from './impl/PopupDragZone.js';
import { PopupDropTarget } from './impl/PopupDropTarget.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import './popup.css';

const popupArr = [];

function onClosePopup() {
}

function onPopupResult(res) {
    const result = ge('result');
    if (result) {
        result.textContent = (res) ? 'OK Button' : 'Cancel Button';
    }
}

function onPopupResultAndClose(res) {
    const result = ge('result');
    if (result) {
        result.textContent = (res) ? 'OK Button' : 'Cancel Button';
    }

    this.close();
}

function showPopup1() {
    const ind = 1;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup1',
            title: 'Fullwidth popup',
            content: `This popup is dynamically created and have content on the center of screen with fullwidth background.<br>
            Control buttons are added and both will close popup.`,
        });
        popupArr[ind].setControls({
            okBtn: { onclick: onPopupResultAndClose.bind(popupArr[ind], true) },
            cancelBtn: { onclick: onPopupResultAndClose.bind(popupArr[ind], false) },
        });
    }

    popupArr[ind].show();
}

function showPopup2() {
    const placeholderMsg = 'Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.';
    const ind = 2;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup2',
            title: 'Fullwidth popup',
            content: `This popup is dynamically created and have content on the center of screen with fullwidth background.<br>
            Close button is added. Control buttons will not close popup.<br><br>${placeholderMsg}`,
            btn: {
                okBtn: { onclick: onPopupResult.bind(null, true) },
                cancelBtn: { onclick: onPopupResult.bind(null, false) },
                closeBtn: true,
            },
            onclose: onClosePopup,
        });
    }

    popupArr[ind].show();
}

function showPopup3() {
    const ind = 3;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup3',
            title: 'Center popup',
            content: 'This popup is dynamically created and have only center background.',
            btn: { closeBtn: true },
            onclose: onClosePopup,
            additional: 'center_only',
        });
    }

    popupArr[ind].show();
}

function showPopup4() {
    const ind = 4;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup4',
            title: 'No dimming',
            content: 'This popup is dynamically created and doesn\'t dim page background.',
            btn: { closeBtn: true },
            onclose: onClosePopup,
            additional: 'center_only border_popup',
            nodim: true,
        });
    }

    popupArr[ind].show();
}

function showPopup5() {
    const ind = 5;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup5',
            title: 'Draggable',
            content: 'This popup is dynamically created and draggable.',
            btn: { closeBtn: true },
            onclose: onClosePopup,
            additional: 'center_only border_popup draggable_popup',
            nodim: true,
        });

        const contentObj = popupArr[ind].contentElem;
        const boxObj = popupArr[ind].boxElem;
        if (contentObj && boxObj) {
            this.popup5Zone = new PopupDragZone(boxObj);
            this.popup5Target = new PopupDropTarget(contentObj);
        }
    }

    popupArr[ind].show();
}

function showPopup6() {
    const ind = 6;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup6',
            content: 'This popup is dynamically created. It has no buttons and title and will be closed only on click on empty place.',
            onclose: onClosePopup,
            additional: 'center_only border_popup',
            nodim: true,
            closeOnEmptyClick: true,
        });
    }

    popupArr[ind].show();
}

function showPopup7() {
    const ind = 7;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup7',
            content: 'Success message. Something created as expected.',
            onclose: onClosePopup,
            btn: { closeBtn: true },
            additional: 'msg msg_success',
            nodim: true,
            closeOnEmptyClick: true,
        });
    }

    popupArr[ind].show();
}

function showPopup8() {
    const ind = 8;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup8',
            content: 'Error message. Fail to create something',
            onclose: onClosePopup,
            btn: { closeBtn: true },
            additional: 'msg msg_error',
            nodim: true,
            closeOnEmptyClick: true,
        });
    }

    popupArr[ind].show();
}

function showPopup9() {
    const ind = 9;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup9',
            content: ge('template1'),
            btn: { closeBtn: true },
            onclose: onClosePopup,
        });
    }

    popupArr[ind].show();
}

function showPopup10() {
    const ind = 10;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup10',
            title: 'Extended template',
            content: ge('template2'),
            onclose: onClosePopup,
        });
        popupArr[ind].setControls({
            okBtn: { onclick: onPopupResultAndClose.bind(popupArr[ind], true) },
            closeBtn: true,
        });
    }

    popupArr[ind].show();
}

function showPopup12() {
    const ind = 12;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup12',
            title: 'Select something',
            content: ge('template4'),
            additional: 'center_only border_popup',
            nodim: true,
            onclose: onClosePopup,
        });

        popupArr[ind].setControls({
            okBtn: { onclick: onPopupResultAndClose.bind(popupArr[ind], true) },
            closeBtn: true,
        });

        ge('valueselect').addEventListener('change', () => {
            ge('valueresult').textContent = selectedValue(this);
        });
    }

    popupArr[ind].show();
}

function showPopup11() {
    const ind = 11;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup11',
            title: 'Nested popups',
            content: ge('template3'),
            btn: {
                okBtn: { value: 'Select', onclick: showPopup12 },
                closeBtn: true,
            },
            onclose: onClosePopup,
        });
    }

    popupArr[ind].show();
}

function removeControls() {
    this.setControls({
        okBtn: { disabled: false },
        cancelBtn: false,
        closeBtn: false,
    });
}

function restoreControls() {
    this.setControls({
        okBtn: { disabled: true },
        cancelBtn: { value: 'Remove', onclick: removeControls.bind(this) },
        closeBtn: true,
    });
}

function showPopup13() {
    const ind = 13;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup13',
            title: 'setControls() methods test',
            content: 'After click on Remove button it and Close button will disappear and Restore button will be enabled.<br>'
                + 'After click on Restore button Close and Remove button will appear and Restore button will be disabled.',
            additional: 'center_only border_popup controls_test',
            nodim: true,
            btn: {
                okBtn: { value: 'Restore', disabled: true },
                cancelBtn: { value: 'Remove' },
                closeBtn: true,
            },
            onclose: onClosePopup,
        });

        popupArr[ind].setControls({
            okBtn: { onclick: restoreControls.bind(popupArr[ind]) },
            cancelBtn: { onclick: removeControls.bind(popupArr[ind]) },
        });

        ge('valueselect').addEventListener('change', () => {
            ge('valueresult').textContent = selectedValue(this);
        });
    }

    popupArr[ind].show();
}

function toggleTitle() {
    if (this.titleState === 1) {
        this.titleState = 2;
        this.setTitle('Multiple case popup');
    } else {
        this.titleState = 1;
        this.setTitle('Single case popup');
    }
    this.setControls({ cancelBtn: { disabled: false } });
}

function delTitle() {
    this.titleState = -1;

    this.removeTitle();
    this.setControls({
        okBtn: { disabled: false },
        cancelBtn: { disabled: true },
    });
}

function showPopup14() {
    const ind = 14;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup14',
            title: 'setTitle() method test',
            content: 'This popup is able to change its title.<br>',
            additional: 'center_only border_popup controls_test',
            nodim: true,
            btn: {
                okBtn: { value: 'Change title' },
                cancelBtn: { value: 'Remove title' },
                closeBtn: true,
            },
            onclose: onClosePopup,
        });

        popupArr[ind].setControls({
            okBtn: { onclick: toggleTitle.bind(popupArr[ind]) },
            cancelBtn: { onclick: delTitle.bind(popupArr[ind]) },
        });

        popupArr[ind].titleState = 0;
    }

    popupArr[ind].show();
}

function stringContent() {
    this.setContent('This popup is able to change its content.');
    this.setControls({
        okBtn: { disabled: true },
        cancelBtn: { disabled: false },
    });
}

function templateContent() {
    this.setContent(
        ce(
            'div',
            { className: 'template_test' },
            [ce('div'), ce('div'), ce('div')],
        ),
    );
    this.setControls({
        okBtn: { disabled: false },
        cancelBtn: { disabled: true },
    });
}

function showPopup15() {
    const ind = 15;

    if (!popupArr[ind]) {
        popupArr[ind] = Popup.create({
            id: 'popup15',
            title: 'setContent() method test',
            content: 'This popup is able to change its content.',
            additional: 'center_only border_popup controls_test',
            nodim: true,
            btn: {
                okBtn: { value: 'String', disabled: true },
                cancelBtn: { value: 'Template' },
                closeBtn: true,
            },
            onclose: onClosePopup,
        });

        popupArr[ind].setControls({
            okBtn: { onclick: stringContent.bind(popupArr[ind]) },
            cancelBtn: { onclick: templateContent.bind(popupArr[ind]) },
        });
    }

    popupArr[ind].show();
}

function init() {
    ge('p1btn').onclick = showPopup1;
    ge('p2btn').onclick = showPopup2;
    ge('p3btn').onclick = showPopup3;
    ge('p4btn').onclick = showPopup4;
    ge('p5btn').onclick = showPopup5;
    ge('p6btn').onclick = showPopup6;
    ge('p7btn').onclick = showPopup7;
    ge('p8btn').onclick = showPopup8;
    ge('p9btn').onclick = showPopup9;
    ge('p10btn').onclick = showPopup10;
    ge('p11btn').onclick = showPopup11;
    ge('p13btn').onclick = showPopup13;
    ge('p14btn').onclick = showPopup14;
    ge('p15btn').onclick = showPopup15;
}

onReady(init);
