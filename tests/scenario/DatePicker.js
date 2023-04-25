import {
    baseUrl,
    goTo,
    setBlock,
} from 'jezve-test';
import * as DatePickerTests from '../actions/DatePicker.js';
import { App } from '../app.js';

export const datePickerTests = async () => {
    const pageUrl = `${baseUrl()}demo/datepicker.html`;
    await goTo(pageUrl);

    setBlock('Date Picker component', 1);

    setBlock('Static Date Picker', 2);
    await DatePickerTests.selectDateStatic(App.dates.yesterday);
    await DatePickerTests.selectDateStatic(App.dates.weekAgo);
    await DatePickerTests.selectDateStatic(App.dates.weekAfter);
    await DatePickerTests.selectDateStatic(App.dates.monthAgo);
    await DatePickerTests.selectDateStatic(App.dates.yearAgo);

    setBlock('Popup Date Picker', 2);
    await DatePickerTests.selectDatePopup(App.dates.yesterday);
    await DatePickerTests.selectDatePopup(App.dates.monthAgo);

    setBlock('Range select', 2);
    await DatePickerTests.selectDateRange({
        start: App.dates.monthAgo,
        end: App.dates.weekAfter,
    });

    setBlock('Callbacks', 2);
    await DatePickerTests.testCallbacks({
        start: App.dates.monthAgo,
        end: App.dates.yearAgo,
    });

    setBlock('setSelection() method', 2);
    await DatePickerTests.testSetSelection();
};
