import { ge, onReady } from '../../js/common.js';
import { DatePicker } from '../../Components/DatePicker/DatePicker.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import '../css/datepicker.css';

let calendarObj2 = null;
let calendarObj3 = null;
let calendarObj4 = null;
let calendarObj5 = null;

/** Date select callback */
function onSelectDate(date) {
    const datefield = ge('dateinp');
    if (datefield) {
        datefield.value = DatePicker.format(date);
    }
}

/** Date select callback */
function onSelectDate2(date) {
    const datefield = ge('dateinp2');
    if (datefield) {
        datefield.value = DatePicker.format(date);
    }

    calendarObj2.hide();
}

/** Show calendar block */
function showCalendar2() {
    calendarObj2.show();
}

/** Date range select callback */
function onRangeSelect(range) {
    const datefield = ge('rangeinp');
    if (datefield) {
        const startFmt = DatePicker.format(range.start);
        const endFmt = DatePicker.format(range.end);
        datefield.value = `${startFmt} - ${endFmt}`;
    }

    calendarObj3.hide();
}

/** Show range select calendar */
function showCalendar3() {
    calendarObj3.show();
}

/** Date range select callback */
function onCBRangeSelect(range) {
    const datefield = ge('cbinp');
    if (datefield) {
        const startFmt = DatePicker.format(range.start);
        const endFmt = DatePicker.format(range.end);
        datefield.value = `${startFmt} - ${endFmt}`;
    }
}

/** Date select callback */
function CBDateSelect(date) {
    const statustext = ge('statustext');
    if (statustext) {
        statustext.textContent = `Date selected: ${DatePicker.format(date)}`;
    }
}

/** Show range select calendar */
function showCalendar4() {
    calendarObj4.show();
}

/** Show setSelection() test calendar */
function showCalendar5() {
    calendarObj5.show();
}

function onHide() {
    const statustext = ge('statustext');
    if (statustext) {
        statustext.textContent = 'Loading...';
    }
}

function init() {
    DatePicker.create({
        wrapper: 'calendar',
        static: true,
        animated: true,
        ondateselect: onSelectDate,
    });

    calendarObj2 = DatePicker.create({
        wrapper: 'calendar2',
        relparent: 'dategroup2',
        ondateselect: onSelectDate2,
    });
    const calbtn2 = ge('calbtn2');
    calbtn2.onclick = showCalendar2;

    calendarObj3 = DatePicker.create({
        wrapper: 'calendar3',
        relparent: 'dategroup3',
        range: true,
        onrangeselect: onRangeSelect,
    });
    const calbtn3 = ge('calbtn3');
    calbtn3.onclick = showCalendar3;

    calendarObj4 = DatePicker.create({
        wrapper: 'calendar4',
        relparent: 'dategroup4',
        range: true,
        ondateselect: CBDateSelect,
        onrangeselect: onCBRangeSelect,
        onhide: onHide,
    });
    const calbtn4 = ge('calbtn4');
    calbtn4.onclick = showCalendar4;

    calendarObj5 = DatePicker.create({
        wrapper: 'calendar5',
        relparent: 'dategroup5',
        range: true,
    });
    calendarObj5.setSelection('01.12.2020', '07.12.2020');

    const calbtn5 = ge('calbtn5');
    calbtn5.onclick = showCalendar5;
}

onReady(init);
