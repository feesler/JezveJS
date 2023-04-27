import {
    assert,
    query,
    click,
    evaluate,
    asyncMap,
} from 'jezve-test';
import { DatePicker } from 'jezvejs-test';
import { AppView } from './AppView.js';
import { formatDate } from '../../packages/jezvejs/src/js/DateUtils.js';

const datePickerSelectors = {
    staticDatePicker: '#staticDateInp + .dp__container',
    popupDatePicker: '#dpPopupGroup + .dp__container',
    rangeDatePicker: '#dpRangeGroup + .dp__container',
    callbacksDatePicker: '#dpCallbacksGroup + .dp__container',
    selDatePicker: '#dpSelectionGroup + .dp__container',
    disabledFilterDatePicker: '#dpDisabledDateGroup + .dp__container',
    enLocaleDatePicker: '#dpEnLocale .dp__container',
    frLocaleDatePicker: '#dpFrLocale .dp__container',
    ruLocaleDatePicker: '#dpRuLocale .dp__container',
};

const controlIds = [
    'staticDateInp',
    'popupDateInp',
    'showPopupBtn',
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
            res.staticDateInp.value,
            res.popupDateInp.value,
            res.rangeInp.value,
            res.cbInp.value,
            res.cbStatusText.title,
            res.setSelInp.value,
        ] = await evaluate(
            (stInp, popupInp, rangeInp, chInp, statusEl, selInp) => ([
                stInp.value,
                popupInp.value,
                rangeInp.value,
                chInp.value,
                statusEl.textContent,
                selInp.value,
            ]),
            res.staticDateInp.elem,
            res.popupDateInp.elem,
            res.rangeInp.elem,
            res.cbInp.elem,
            res.cbStatusText.elem,
            res.setSelInp.elem,
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
}
