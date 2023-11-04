import {
    query,
    click,
    evaluate,
    asyncMap,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { formatDate, isSameDate, parseDateString } from '@jezvejs/datetime';
import { DatePicker } from 'jezvejs-test';
import { AppView } from './AppView.js';

const datePickerSelectors = {
    staticDatePicker: '#staticDateInp + .dp__container',
    popupDatePicker: '#dpPopupGroup + .dp__container',
    multipleDatePicker: '#dpMultipleGroup + .dp__container',
    rangeDatePicker: '#dpRangeGroup + .dp__container',
    callbacksDatePicker: '#dpCallbacksGroup + .dp__container',
    selDatePicker: '#dpSelectionGroup + .dp__container',
    disabledFilterDatePicker: '#dpDisabledDateGroup + .dp__container',
    monthDatePicker: '#dpMonthGroup + .dp__container',
    yearDatePicker: '#dpYearGroup + .dp__container',
    rangePartDatePicker: '#dpRangePartGroup + .dp__container',
    enLocaleDatePicker: '#dpEnLocale .dp__container',
    frLocaleDatePicker: '#dpFrLocale .dp__container',
    ruLocaleDatePicker: '#dpRuLocale .dp__container',
};

const controlIds = [
    'staticDateInp',
    'popupDateInp',
    'showPopupBtn',
    'multipleInp',
    'showMultipleBtn',
    'rangeInp',
    'showRangeBtn',
    'cbInp',
    'cbStatusText',
    'showCbBtn',
    'setSelInp',
    'showSelectionBtn',
    'setSelectionBtn',
    'clearSelectionBtn',
    'showDisabledDateBtn',
    'setDisabledBtn',
    'clearDisabledBtn',
    'selectStartDateBtn',
    'selectEndDateBtn',
    'monthInp',
    'showMonthBtn',
    'yearInp',
    'showYearBtn',
];

export class DatePickerView extends AppView {
    async parseContent() {
        const res = {};

        await asyncMap(Object.keys(datePickerSelectors), async (name) => {
            const selector = datePickerSelectors[name];
            res[name] = await DatePicker.create(this, await query(selector));
            assert(res[name], `Failed to initialize component '${name}'`);
        });

        await asyncMap(controlIds, async (id) => {
            res[id] = { elem: await query(`#${id}`) };
            assert(res[id].elem, `Failed to initialize control '${id}'`);
        });

        [
            res.cbStatusText.title,
            res.staticDateInp.value,
            res.popupDateInp.value,
            res.multipleInp.value,
            res.rangeInp.value,
            res.cbInp.value,
            res.setSelInp.value,
            res.monthInp.value,
            res.yearInp.value,
        ] = await evaluate(
            (statusEl, ...inputElems) => ([
                statusEl.textContent,
                ...inputElems.map((el) => el.value),
            ]),
            res.cbStatusText.elem,
            res.staticDateInp.elem,
            res.popupDateInp.elem,
            res.multipleInp.elem,
            res.rangeInp.elem,
            res.cbInp.elem,
            res.setSelInp.elem,
            res.monthInp.elem,
            res.yearInp.elem,
        );

        return res;
    }

    async selectDateStatic(date) {
        assert.isDate(date, 'Invalid date');

        const expected = {
            staticDateInp: { value: formatDate(date) },
            staticDatePicker: { visible: true },
        };

        await this.performAction(() => this.content.staticDatePicker.selectDate(date));

        return this.checkState(expected);
    }

    async clickShowButton(btn, datePicker) {
        assert(this.content[btn]?.elem, 'Invalid button');
        assert(this.content[datePicker], 'Invalid DatePicker');

        const expected = {
            [datePicker]: {
                visible: !this.content[datePicker].visible,
            },
        };

        await this.performAction(() => click(this.content[btn].elem));

        return this.checkState(expected);
    }

    async showPopup() {
        return this.clickShowButton('showPopupBtn', 'popupDatePicker');
    }

    async selectDatePopup(date) {
        assert.isDate(date, 'Invalid date');

        const expected = {
            popupDateInp: { value: formatDate(date) },
        };

        await this.performAction(() => this.content.popupDatePicker.selectDate(date));

        return this.checkState(expected);
    }

    async toggleMultipleDate(date) {
        assert.isDate(date, 'Invalid date');

        const selectedDates = this.content.multipleInp.value
            .trim()
            .split(' ')
            .filter((item) => item?.length > 0)
            .map((item) => parseDateString(item));

        const selected = selectedDates.some((item) => isSameDate(item, date));
        const expectedDates = (selected)
            ? selectedDates.filter((item) => !isSameDate(item, date))
            : [...selectedDates, date];

        const expected = {
            multipleInp: {
                value: expectedDates.map((item) => formatDate(item)).join(' '),
            },
        };

        await this.performAction(() => this.content.multipleDatePicker.selectDate(date));

        return this.checkState(expected);
    }

    async toggleShowMultiple() {
        return this.clickShowButton('showMultipleBtn', 'multipleDatePicker');
    }

    async showRange() {
        return this.clickShowButton('showRangeBtn', 'rangeDatePicker');
    }

    async selectDateRange({ start, end }, input, datePicker) {
        assert.isDate(start, 'Invalid date');
        assert.isDate(end, 'Invalid date');

        const minDate = (start < end) ? start : end;
        const maxDate = (start < end) ? end : start;
        const rangeFmt = `${formatDate(minDate)} - ${formatDate(maxDate)}`;
        const expected = {
            [input]: { value: rangeFmt },
        };

        await this.performAction(() => this.content[datePicker].selectRange(start, end));

        return this.checkState(expected);
    }

    async toggleCallbacks() {
        return this.clickShowButton('showCbBtn', 'callbacksDatePicker');
    }

    async toggleSetSelection() {
        return this.clickShowButton('showSelectionBtn', 'selDatePicker');
    }

    async clearSelection() {
        await this.performAction(() => click(this.content.clearSelectionBtn.elem));
    }

    async updateSelection() {
        await this.performAction(() => click(this.content.setSelectionBtn.elem));
    }

    async toggleDisabledFilter() {
        return this.clickShowButton('showDisabledDateBtn', 'disabledFilterDatePicker');
    }

    async clearDisabledFilter() {
        await this.performAction(() => click(this.content.clearDisabledBtn.elem));
    }

    async setDisabledFilter() {
        await this.performAction(() => click(this.content.setDisabledBtn.elem));
    }

    async toggleStartDate() {
        return this.clickShowButton('selectStartDateBtn', 'rangePartDatePicker');
    }

    async toggleEndDate() {
        return this.clickShowButton('selectEndDateBtn', 'rangePartDatePicker');
    }

    async selectRangePartDate(date) {
        assert.isDate(date, 'Invalid date');

        await this.performAction(() => this.content.rangePartDatePicker.selectDate(date));
    }

    async showMonth() {
        return this.clickShowButton('showMonthBtn', 'monthDatePicker');
    }

    async selectMonth(date) {
        assert.isDate(date, 'Invalid date');

        const expected = {
            monthInp: {
                value: formatDate(date, {
                    locales: ['en'],
                    options: { month: 'long', year: 'numeric' },
                }),
            },
        };

        const year = date.getFullYear();
        const month = date.getMonth();

        await this.performAction(() => (
            this.content.monthDatePicker.selectMonth(month, year, false)
        ));

        return this.checkState(expected);
    }

    async showYear() {
        return this.clickShowButton('showYearBtn', 'yearDatePicker');
    }

    async selectYear(date) {
        assert.isDate(date, 'Invalid date');

        const expected = {
            yearInp: {
                value: formatDate(date, {
                    locales: ['en'],
                    options: { year: 'numeric' },
                }),
            },
        };

        const year = date.getFullYear();
        await this.performAction(() => (
            this.content.yearDatePicker.selectYear(year, false)
        ));

        return this.checkState(expected);
    }
}
