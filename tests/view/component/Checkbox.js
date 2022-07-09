import {
    TestComponent,
    assert,
    query,
    prop,
    hasClass,
    click,
} from 'jezve-test';

export class Checkbox extends TestComponent {
    async parseContent() {
        if (!this.elem) {
            return {};
        }

        const validClass = await hasClass(this.elem, 'checkbox');
        assert(validClass, 'Invalid checkbox');

        const res = {
            inputElem: await query(this.elem, 'input[type="checkbox"]'),
            labelElem: await query(this.elem, '.checkbox__label'),
        };

        assert(res.inputElem, 'Checkbox input element not found');

        res.checked = await prop(res.inputElem, 'checked');
        res.disabled = await prop(res.inputElem, 'disabled');

        return res;
    }

    get checked() {
        return this.content.checked;
    }

    get disabled() {
        return this.content.disabled;
    }

    async toggle() {
        return click(this.elem);
    }
}
