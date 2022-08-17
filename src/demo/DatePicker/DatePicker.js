import {
    ge,
    onReady,
    formatDate,
    DatePicker,
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
    DatePicker.create({
        wrapper: 'dpStatic',
        static: true,
        animated: true,
        ondateselect: (date) => formatDateToInput(date, 'staticDateInp'),
    });
};

const initPopup = () => {
    const datePicker = DatePicker.create({
        wrapper: 'dpPopup',
        relparent: 'dpPopupGroup',
        ondateselect: (date) => {
            formatDateToInput(date, 'popupDateInp');
            datePicker.hide();
        },
    });

    const btn = ge('showPopupBtn');
    btn.addEventListener('click', () => datePicker.show());
};

const initRangeSelect = () => {
    const datePicker = DatePicker.create({
        wrapper: 'dpRange',
        relparent: 'dpRangeGroup',
        range: true,
        onrangeselect: (range) => {
            formatRangeToInput(range, 'rangeInp');
            datePicker.hide();
        },
    });

    const btn = ge('showRangeBtn');
    btn.addEventListener('click', () => datePicker.show());
};

const initCallbacks = () => {
    const statustext = ge('statustext');
    const datePicker = DatePicker.create({
        wrapper: 'dpCallbacks',
        relparent: 'dpCallbacksGroup',
        range: true,
        ondateselect: (date) => {
            statustext.textContent = `Date selected: ${formatDate(date)}`;
        },
        onrangeselect: (range) => formatRangeToInput(range, 'cbInp'),
        onhide: () => {
            statustext.textContent = 'Loading...';
        },
    });

    const btn = ge('showCbBtn');
    btn.addEventListener('click', () => datePicker.show());
};

const initSetSelection = () => {
    const datePicker = DatePicker.create({
        wrapper: 'dpSelection',
        relparent: 'dpSelectionGroup',
        range: true,
    });
    datePicker.setSelection('01.12.2020', '07.12.2020');

    const btn = ge('showSelBtn');
    btn.addEventListener('click', () => datePicker.show());
};

const initLocales = () => {
    DatePicker.create({
        wrapper: 'dpEnLocale',
        static: true,
        locales: ['en-US'],
    });
    DatePicker.create({
        wrapper: 'dpFrLocale',
        static: true,
        locales: ['fr'],
    });
    DatePicker.create({
        wrapper: 'dpRuLocale',
        static: true,
        locales: ['ru'],
    });
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
