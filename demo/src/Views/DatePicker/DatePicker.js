import 'jezvejs/style';
import 'jezvejs/style/Button';
import 'jezvejs/style/InputGroup';
import {
    ge,
    setEvents,
    onReady,
    formatDate,
    insertAfter,
} from 'jezvejs';
import { DatePicker } from 'jezvejs/DatePicker';
import { initNavigation } from '../../app.js';
import './style.scss';

const formatDateToInput = (date, inputId) => {
    const input = ge(inputId);
    if (input) {
        input.value = formatDate(date);
    }
};

const formatRangeToInput = (range, inputId) => {
    const input = ge(inputId);
    if (input) {
        const startFmt = formatDate(range.start);
        const endFmt = formatDate(range.end);
        input.value = `${startFmt} - ${endFmt}`;
    }
};

const initStatic = () => {
    const datePicker = DatePicker.create({
        static: true,
        animated: true,
        onDateSelect: (date) => formatDateToInput(date, 'staticDateInp'),
    });

    insertAfter(datePicker.elem, ge('staticDateInp'));
};

const initPopup = () => {
    const inpGroup = ge('dpPopupGroup');
    const datePicker = DatePicker.create({
        relparent: inpGroup,
        onDateSelect: (date) => {
            formatDateToInput(date, 'popupDateInp');
            datePicker.hide();
        },
    });
    insertAfter(datePicker.elem, inpGroup);

    setEvents(ge('showPopupBtn'), { click: () => datePicker.show() });
};

const initPosition = () => {
    const btn = ge('showPosBtn');
    const datePicker = DatePicker.create({
        relparent: btn,
    });
    insertAfter(datePicker.elem, btn);

    btn.addEventListener('click', () => datePicker.show());
};

const initRangeSelect = () => {
    const inpGroup = ge('dpRangeGroup');
    const datePicker = DatePicker.create({
        relparent: inpGroup,
        range: true,
        onRangeSelect: (range) => {
            formatRangeToInput(range, 'rangeInp');
            datePicker.hide();
        },
    });
    insertAfter(datePicker.elem, inpGroup);

    setEvents(ge('showRangeBtn'), { click: () => datePicker.show() });
};

const initCallbacks = () => {
    const inpGroup = ge('dpCallbacksGroup');
    const statustext = ge('statustext');
    const datePicker = DatePicker.create({
        relparent: inpGroup,
        range: true,
        onDateSelect: (date) => {
            statustext.textContent = `Date selected: ${formatDate(date)}`;
        },
        onRangeSelect: (range) => formatRangeToInput(range, 'cbInp'),
        onShow: () => {
            statustext.textContent = 'Select range...';
        },
        onHide: () => {
            statustext.textContent = 'Loading...';
        },
    });
    insertAfter(datePicker.elem, inpGroup);

    setEvents(ge('showCbBtn'), { click: () => datePicker.show(!datePicker.visible()) });
};

const initSetSelection = () => {
    const inpGroup = ge('dpSelectionGroup');
    const datePicker = DatePicker.create({
        relparent: inpGroup,
        range: true,
    });
    datePicker.setSelection('01.12.2020', '07.12.2020');
    insertAfter(datePicker.elem, inpGroup);

    setEvents(ge('showSelBtn'), { click: () => datePicker.show() });
    setEvents(ge('select-btn'), {
        click: () => datePicker.setSelection('08.12.2020', '14.12.2020'),
    });
    setEvents(ge('clear-btn'), { click: () => datePicker.clearSelection() });
};

const initLocales = () => {
    const enDatePicker = DatePicker.create({
        static: true,
        locales: ['en-US'],
    });
    ge('dpEnLocale').append(enDatePicker.elem);

    const frDatePicker = DatePicker.create({
        static: true,
        locales: ['fr'],
    });
    ge('dpFrLocale').append(frDatePicker.elem);

    const ruDatePicker = DatePicker.create({
        static: true,
        locales: ['ru'],
    });
    ge('dpRuLocale').append(ruDatePicker.elem);
};

const init = () => {
    initNavigation();

    initStatic();
    initPopup();
    initPosition();
    initRangeSelect();
    initCallbacks();
    initSetSelection();
    initLocales();
};

onReady(init);
