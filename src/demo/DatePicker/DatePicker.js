import {
    ge,
    onReady,
    formatDate,
    DatePicker,
    insertAfter,
} from '../../js/index.js';
import '../../css/common.scss';
import '../css/app.scss';
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
        ondateselect: (date) => formatDateToInput(date, 'staticDateInp'),
    });

    insertAfter(datePicker.elem, ge('staticDateInp'));
};

const initPopup = () => {
    const inpGroup = ge('dpPopupGroup');
    const datePicker = DatePicker.create({
        relparent: inpGroup,
        ondateselect: (date) => {
            formatDateToInput(date, 'popupDateInp');
            datePicker.hide();
        },
    });
    insertAfter(datePicker.elem, inpGroup);

    const btn = ge('showPopupBtn');
    btn.addEventListener('click', () => datePicker.show());
};

const initRangeSelect = () => {
    const inpGroup = ge('dpRangeGroup');
    const datePicker = DatePicker.create({
        relparent: inpGroup,
        range: true,
        onrangeselect: (range) => {
            formatRangeToInput(range, 'rangeInp');
            datePicker.hide();
        },
    });
    insertAfter(datePicker.elem, inpGroup);

    const btn = ge('showRangeBtn');
    btn.addEventListener('click', () => datePicker.show());
};

const initCallbacks = () => {
    const inpGroup = ge('dpCallbacksGroup');
    const statustext = ge('statustext');
    const datePicker = DatePicker.create({
        relparent: inpGroup,
        range: true,
        ondateselect: (date) => {
            statustext.textContent = `Date selected: ${formatDate(date)}`;
        },
        onrangeselect: (range) => formatRangeToInput(range, 'cbInp'),
        onhide: () => {
            statustext.textContent = 'Loading...';
        },
    });
    insertAfter(datePicker.elem, inpGroup);

    const btn = ge('showCbBtn');
    btn.addEventListener('click', () => datePicker.show());
};

const initSetSelection = () => {
    const inpGroup = ge('dpSelectionGroup');
    const datePicker = DatePicker.create({
        relparent: inpGroup,
        range: true,
    });
    datePicker.setSelection('01.12.2020', '07.12.2020');
    insertAfter(datePicker.elem, inpGroup);

    const btn = ge('showSelBtn');
    btn.addEventListener('click', () => datePicker.show());
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
    initStatic();
    initPopup();
    initRangeSelect();
    initCallbacks();
    initSetSelection();
    initLocales();
};

onReady(init);
