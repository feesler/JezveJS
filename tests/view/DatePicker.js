import {
    assert,
    query,
    prop,
    click,
} from 'jezve-test';
import { DatePicker } from './component/DatePicker.js';
import { AppView } from './AppView.js';
import { formatDate } from '../../src/js/DateUtils.js';

export class DatePickerView extends AppView {
    async parseContent() {
        const res = {};

        res.staticDateInp = { elem: await query('#staticDateInp') };
        res.staticDatePicker = await DatePicker.create(
            this,
            await query('#staticDateInp + .dp__container'),
        );

        res.popupDateInp = { elem: await query('#popupDateInp') };
        res.showPopupBtn = await query('#showPopupBtn');
        res.popupDatePicker = await DatePicker.create(
            this,
            await query('#dpPopupGroup + .dp__container'),
        );

        res.rangeInp = { elem: await query('#rangeInp') };
        res.showRangeBtn = await query('#showRangeBtn');
        res.rangeDatePicker = await DatePicker.create(
            this,
            await query('#dpRangeGroup + .dp__container'),
        );

        res.cbInp = { elem: await query('#cbInp') };
        res.cbStatusText = { elem: await query('#statustext') };
        res.showCbBtn = await query('#showCbBtn');
        res.callbacksDatePicker = await DatePicker.create(
            this,
            await query('#dpCallbacksGroup + .dp__container'),
        );

        res.setSelInp = { elem: await query('#setSelInp') };
        res.showSelBtn = await query('#showSelBtn');
        res.selDatePicker = await DatePicker.create(
            this,
            await query('#dpSelectionGroup + .dp__container'),
        );

        res.enLocaleDatePicker = await DatePicker.create(
            this,
            await query('#dpEnLocale .dp__container'),
        );
        res.frLocaleDatePicker = await DatePicker.create(
            this,
            await query('#dpFrLocale .dp__container'),
        );
        res.ruLocaleDatePicker = await DatePicker.create(
            this,
            await query('#dpRuLocale .dp__container'),
        );

        assert(
            res.staticDateInp.elem
            && res.staticDatePicker
            && res.popupDateInp.elem
            && res.showPopupBtn
            && res.popupDatePicker
            && res.rangeInp.elem
            && res.showRangeBtn
            && res.rangeDatePicker
            && res.cbInp.elem
            && res.cbStatusText.elem
            && res.showCbBtn
            && res.callbacksDatePicker
            && res.setSelInp.elem
            && res.showSelBtn
            && res.selDatePicker
            && res.enLocaleDatePicker
            && res.frLocaleDatePicker
            && res.ruLocaleDatePicker,
            'Invalid view',
        );

        res.staticDateInp.value = await prop(res.staticDateInp.elem, 'value');
        res.popupDateInp.value = await prop(res.popupDateInp.elem, 'value');
        res.rangeInp.value = await prop(res.rangeInp.elem, 'value');
        res.cbInp.value = await prop(res.cbInp.elem, 'value');
        res.cbStatusText.title = await prop(res.cbStatusText.elem, 'textContent');
        res.setSelInp.value = await prop(res.setSelInp.elem, 'value');

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
        assert(this.content[btn], 'Invalid button');
        assert(this.content[datePicker], 'Invalid DatePicker');

        const expected = {
            [datePicker]: {
                visible: !this.content[datePicker].visible,
            },
        };

        await this.performAction(() => click(this.content[btn]));

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

        const rangeFmt = `${formatDate(start)} - ${formatDate(end)}`;
        const expected = {
            [input]: { value: rangeFmt },
        };

        await this.performAction(() => this.content[datePicker].selectRange(start, end));

        return this.checkState(expected);
    }

    async toggleCallbacks() {
        return this.clickShowButton('showCbBtn', 'callbacksDatePicker');
    }

    async showSetSelection() {
        return this.clickShowButton('showSelBtn', 'selDatePicker');
    }
}
