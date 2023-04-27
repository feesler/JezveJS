import { formatDate, test } from 'jezve-test';
import { App } from '../app.js';

export const selectDateStatic = async (date) => {
    const dateFmt = formatDate(date);
    await test(`Select date (${dateFmt})`, () => App.view.selectDateStatic(date));
};

export const selectDatePopup = async (date) => {
    const dateFmt = formatDate(date);
    await test('Show date picker', () => App.view.showPopup());
    await test(`Select date (${dateFmt})`, () => App.view.selectDatePopup(date));
};

export const selectDateRange = async (range) => {
    const rangeFmt = `${formatDate(range.start)} - ${formatDate(range.end)}`;
    await test('Show date picker', () => App.view.showRange());
    await test(`Select range (${rangeFmt})`, () => (
        App.view.selectDateRange(range, 'rangeInp', 'rangeDatePicker')
    ));
};

export const testCallbacks = async (range) => {
    await test('Initial state', () => {
        App.view.expectedState = {
            cbStatusText: {
                title: 'Waiting',
            },
        };

        return App.view.checkState();
    });

    await test('Show date picker', async () => {
        await App.view.toggleCallbacks();

        App.view.expectedState = {
            cbStatusText: {
                title: 'Select range...',
            },
        };

        return App.view.checkState();
    });

    const startFmt = formatDate(range.start);
    const endFmt = formatDate(range.end);
    const rangeFmt = `${startFmt} - ${endFmt}`;
    await test(`Select range (${rangeFmt})`, async () => {
        await App.view.selectDateRange(range, 'cbInp', 'callbacksDatePicker');

        App.view.expectedState = {
            cbStatusText: {
                title: `Date selected: ${endFmt}`,
            },
        };

        return App.view.checkState();
    });

    await test('Close date picker', async () => {
        await App.view.toggleCallbacks();

        App.view.expectedState = {
            cbStatusText: {
                title: 'Loading...',
            },
        };

        return App.view.checkState();
    });
};

const getHighlightCells = (start, end, monthDays) => {
    const res = [];
    for (let day = 1; day <= monthDays; day += 1) {
        res.push({
            title: day.toString(),
            highlighted: (day >= start && day <= end),
        });
    }

    return res;
};

export const testSetSelection = async () => {
    await test('Initial setSelection() method', async () => {
        await App.view.toggleSetSelection();

        const expected = {
            selDatePicker: {
                visible: true,
                cells: getHighlightCells(1, 7, 31),
                current: {
                    month: 11,
                    year: 2020,
                },
            },
        };

        return App.view.checkState(expected);
    });

    await test('clearSelection() method', async () => {
        await App.view.toggleSetSelection();
        await App.view.clearSelection();
        await App.view.toggleSetSelection();

        const expected = {
            selDatePicker: {
                visible: true,
                cells: getHighlightCells(-1, -1, 31),
                current: {
                    month: 11,
                    year: 2020,
                },
            },
        };

        return App.view.checkState(expected);
    });

    await test('Update setSelection() method', async () => {
        await App.view.toggleSetSelection();
        await App.view.updateSelection();
        await App.view.toggleSetSelection();

        const expected = {
            selDatePicker: {
                visible: true,
                cells: getHighlightCells(8, 14, 31),
                current: {
                    month: 11,
                    year: 2020,
                },
            },
        };

        return App.view.checkState(expected);
    });
};

const getDisabledCells = (start, end, monthDays) => {
    const res = [];
    for (let day = 1; day <= monthDays; day += 1) {
        res.push({
            title: day.toString(),
            disabled: !!start && !!end && !(day >= start && day <= end),
        });
    }

    return res;
};

export const testDisabledDateFilter = async () => {
    const expectedDefaults = {
        disabledFilterDatePicker: {
            visible: true,
            cells: getDisabledCells(8, 12, 28),
            current: {
                month: 1,
                year: 2010,
            },
        },
    };

    await test('Initial state of disabled date filter', async () => {
        await App.view.toggleDisabledFilter();
        return App.view.checkState(expectedDefaults);
    });

    await test('Clear disabled date filter', async () => {
        await App.view.toggleDisabledFilter();
        await App.view.clearDisabledFilter();
        await App.view.toggleDisabledFilter();

        const expected = {
            disabledFilterDatePicker: {
                visible: true,
                cells: getDisabledCells(null, null, 28),
                current: {
                    month: 1,
                    year: 2010,
                },
            },
        };

        return App.view.checkState(expected);
    });

    await test('Set disabled date filter', async () => {
        await App.view.toggleDisabledFilter();
        await App.view.setDisabledFilter();
        await App.view.toggleDisabledFilter();

        return App.view.checkState(expectedDefaults);
    });
};

export const testRangeParts = async () => {
    await test('Select start date', async () => {
        const expected = {
            rangePartDatePicker: {
                visible: true,
                cells: getDisabledCells(null, null, 28),
                current: {
                    month: 1,
                    year: 2010,
                },
            },
        };

        await App.view.toggleStartDate();
        App.view.checkState(expected);

        await App.view.selectRangePartDate(new Date(Date.UTC(2010, 1, 10)));

        return true;
    });

    await test('Select end date', async () => {
        const expected = {
            rangePartDatePicker: {
                visible: true,
                cells: getDisabledCells(10, 28, 28),
                current: {
                    month: 1,
                    year: 2010,
                },
            },
        };

        await App.view.toggleEndDate();
        App.view.checkState(expected);

        await App.view.selectRangePartDate(new Date(Date.UTC(2010, 1, 18)));

        return true;
    });

    await test('Select start date when end date is selected', async () => {
        const expected = {
            rangePartDatePicker: {
                visible: true,
                cells: getDisabledCells(1, 18, 28),
                current: {
                    month: 1,
                    year: 2010,
                },
            },
        };

        await App.view.toggleStartDate();
        return App.view.checkState(expected);
    });
};
