import {
    baseUrl,
    goTo,
    setBlock,
} from 'jezve-test';
import * as Actions from '../actions/DatePicker.js';
import { App } from '../app.js';

export const datePickerTests = async () => {
    const pageUrl = `${baseUrl()}demo/datepicker.html`;
    await goTo(pageUrl);

    setBlock('Date Picker component', 1);

    setBlock('Static Date Picker', 2);
    await Actions.selectDateStatic(App.dates.yesterday);
    await Actions.selectDateStatic(App.dates.weekAgo);
    await Actions.selectDateStatic(App.dates.weekAfter);
    await Actions.selectDateStatic(App.dates.monthAgo);
    await Actions.selectDateStatic(App.dates.yearAgo);

    setBlock('Popup Date Picker', 2);
    await Actions.selectDatePopup(App.dates.yesterday);
    await Actions.selectDatePopup(App.dates.monthAgo);

    setBlock('Multiple dates select', 2);
    await Actions.toggleShowMultiple();
    await Actions.toggleMultipleDate(App.dates.yesterday);
    await Actions.toggleMultipleDate(App.dates.now);
    await Actions.toggleMultipleDate(App.dates.weekAgo);
    await Actions.toggleMultipleDate(App.dates.yesterday);
    await Actions.toggleShowMultiple();

    setBlock('Range select', 2);
    await Actions.selectDateRange({
        start: App.dates.monthAgo,
        end: App.dates.weekAfter,
    });

    setBlock('Callbacks', 2);
    await Actions.testCallbacks({
        start: App.dates.monthAgo,
        end: App.dates.yearAgo,
    });

    setBlock('setSelection() method', 2);
    await Actions.testSetSelection();

    setBlock('Disable date filter', 2);
    await Actions.testDisabledDateFilter();

    setBlock('Date range parts', 2);
    await Actions.testRangeParts();

    setBlock('Month select', 2);
    await Actions.showMonth();
    await Actions.selectMonth(App.dates.now);
    await Actions.showMonth();
    await Actions.selectMonth(App.dates.monthAgo);

    setBlock('Year select', 2);
    await Actions.showYear();
    await Actions.selectYear(App.dates.now);
    await Actions.showYear();
    await Actions.selectYear(App.dates.yearAgo);
};
