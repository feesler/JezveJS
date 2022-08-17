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
    await test(`Select range (${rangeFmt})`, () => App.view.selectDateRange(range));
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
    await test('Show date picker', () => App.view.showSetSelection());
    await test('setSelection() method', () => {
        const expected = {
            selDatePicker: {
                visible: true,
                cells: getHighlightCells(1, 6, 31),
                current: {
                    month: 11,
                    year: 2020,
                },
            },
        };

        return App.view.checkState(expected);
    });
};
