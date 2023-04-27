import 'jezvejs/style';
import 'jezvejs/style/Button';
import 'jezvejs/style/Input';
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
import './DatePickerView.scss';

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

const initFillWidth = () => {
    const datePicker = DatePicker.create({
        static: true,
        animated: true,
        className: 'dp_full-width',
        onDateSelect: (date) => formatDateToInput(date, 'fillWidthDateInp'),
    });

    insertAfter(datePicker.elem, ge('fillWidthDateInp'));
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

    setEvents(btn, { click: () => datePicker.show() });
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
    const cbStatusText = ge('cbStatusText');
    const datePicker = DatePicker.create({
        relparent: inpGroup,
        range: true,
        onDateSelect: (date) => {
            cbStatusText.textContent = `Date selected: ${formatDate(date)}`;
        },
        onRangeSelect: (range) => formatRangeToInput(range, 'cbInp'),
        onShow: () => {
            cbStatusText.textContent = 'Select range...';
        },
        onHide: () => {
            cbStatusText.textContent = 'Loading...';
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
    datePicker.setSelection(
        new Date(Date.UTC(2020, 11, 1)),
        new Date(Date.UTC(2020, 11, 7)),
    );
    insertAfter(datePicker.elem, inpGroup);

    setEvents(ge('showSelectionBtn'), { click: () => datePicker.show() });
    setEvents(ge('setSelectionBtn'), {
        click: () => datePicker.setSelection(
            new Date(Date.UTC(2020, 11, 8)),
            new Date(Date.UTC(2020, 11, 14)),
        ),
    });
    setEvents(ge('clearSelectionBtn'), { click: () => datePicker.clearSelection() });
};

const inDateRange = (date, { start = null, end = null }) => (
    ((start === null) || (date - start >= 0))
    && ((end === null) || (date - end <= 0))
);

const enabledRange = {
    start: new Date(Date.UTC(2010, 1, 8)),
    end: new Date(Date.UTC(2010, 1, 12)),
};
const disabledOutsideRange = (date) => !inDateRange(date, enabledRange);

const initDisabledDate = () => {
    const inpGroup = ge('dpDisabledDateGroup');
    const datePicker = DatePicker.create({
        relparent: inpGroup,
        range: true,
        disabledDateFilter: disabledOutsideRange,
        onDateSelect: (date) => {
            formatDateToInput(date, 'disabledDateInp');
            datePicker.hide();
        },
    });
    datePicker.setSelection(new Date(Date.UTC(2010, 1, 10)));
    insertAfter(datePicker.elem, inpGroup);

    setEvents(ge('showDisabledDateBtn'), { click: () => datePicker.show() });
    setEvents(ge('setDisabledBtn'), {
        click: () => datePicker.setDisabledDateFilter(disabledOutsideRange),
    });
    setEvents(ge('clearDisabledBtn'), { click: () => datePicker.setDisabledDateFilter(null) });
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
    initFillWidth();
    initPopup();
    initPosition();
    initRangeSelect();
    initCallbacks();
    initSetSelection();
    initDisabledDate();
    initLocales();
};

onReady(init);
