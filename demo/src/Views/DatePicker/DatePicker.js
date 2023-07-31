import 'jezvejs/style';
import 'jezvejs/style/Button';
import 'jezvejs/style/Input';
import 'jezvejs/style/InputGroup';
import {
    ge,
    setEvents,
    formatDate,
    insertAfter,
    parseDateString,
} from 'jezvejs';
import { DatePicker } from 'jezvejs/DatePicker';

import { DemoView } from '../../Application/DemoView.js';
import './DatePickerView.scss';

const formatDateToInput = (date, inputId) => {
    const input = ge(inputId);
    if (input) {
        input.value = formatDate(date);
    }
};

const parseDateFromInput = (inputId) => {
    const input = ge(inputId);
    return parseDateString(input?.value);
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

const initRangePart = () => {
    const inpGroup = ge('dpRangePartGroup');

    const datePicker = DatePicker.create({
        relparent: inpGroup,
        disabledDateFilter: (date, state) => {
            const rangePart = state?.rangePart;
            if (rangePart !== 'start' && rangePart !== 'end') {
                return false;
            }

            const limitInput = (rangePart === 'start') ? 'endDateInp' : 'startDateInp';
            const limitDate = parseDateFromInput(limitInput);
            if (!limitDate) {
                return false;
            }

            return (rangePart === 'start') ? (limitDate - date < 0) : (limitDate - date > 0);
        },
        onDateSelect: (date) => {
            if (datePicker.state.rangePart === 'start') {
                formatDateToInput(date, 'startDateInp');
            } else if (datePicker.state.rangePart === 'end') {
                formatDateToInput(date, 'endDateInp');
            }
            datePicker.hide();
        },
    });
    datePicker.setSelection(new Date(Date.UTC(2010, 1, 10)));
    insertAfter(datePicker.elem, inpGroup);

    setEvents(ge('selectStartDateBtn'), {
        click: () => {
            datePicker.setRangePart('start');
            datePicker.show();
        },
    });

    setEvents(ge('selectEndDateBtn'), {
        click: () => {
            datePicker.setRangePart('end');
            datePicker.show();
        },
    });
};

const initFirstDay = () => {
    const mondayWeekDatePicker = DatePicker.create({
        static: true,
        locales: ['en-US'],
        firstDay: 1,
    });
    ge('dpMondayWeek').append(mondayWeekDatePicker.elem);

    const subdayWeekDatePicker = DatePicker.create({
        static: true,
        locales: ['en-US'],
        firstDay: 7,
    });
    ge('dpSundayWeek').append(subdayWeekDatePicker.elem);
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

class DatePickerView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.addContentsMenuItem({ title: 'Animated static component', url: 'static' });
        this.addContentsMenuItem({ title: 'Fill parent width', url: 'fullwidth' });
        this.addContentsMenuItem({ title: 'Popup component', url: 'popup' });
        this.addContentsMenuItem({ title: 'Position', url: 'position' });
        this.addContentsMenuItem({ title: 'Range select', url: 'range' });
        this.addContentsMenuItem({ title: 'Callbacks', url: 'callbacks' });
        this.addContentsMenuItem({ title: 'setSelection() method', url: 'setSelection' });
        this.addContentsMenuItem({ title: 'disabledDate option', url: 'disabledDate' });
        this.addContentsMenuItem({ title: 'rangePart option', url: 'rangePart' });
        this.addContentsMenuItem({ title: 'firstDay option', url: 'firstDay' });
        this.addContentsMenuItem({ title: 'Locale', url: 'locale' });

        initStatic();
        initFillWidth();
        initPopup();
        initPosition();
        initRangeSelect();
        initCallbacks();
        initSetSelection();
        initDisabledDate();
        initRangePart();
        initFirstDay();
        initLocales();
    }
}

DatePickerView.create();
