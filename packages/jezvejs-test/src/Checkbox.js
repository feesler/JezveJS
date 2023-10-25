import {
    TestComponent,
    query,
    hasClass,
    click,
    evaluate,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';

export class Checkbox extends TestComponent {
    async parseContent() {
        if (!this.elem) {
            return {};
        }

        const validClass = await hasClass(this.elem, 'checkbox');
        assert(validClass, 'Invalid checkbox');

        const inputElem = await query(this.elem, 'input[type="checkbox"]');
        assert(inputElem, 'Checkbox input element not found');

        const props = await evaluate((input) => ({
            checked: input.checked,
            disabled: input.disabled,
        }), inputElem);

        return {
            inputElem,
            labelElem: await query(this.elem, '.checkbox__label'),
            ...props,
        };
    }

    get checked() {
        return this.content.checked;
    }

    get disabled() {
        return this.content.disabled;
    }

    async toggle() {
        assert(!this.content.disabled, 'Component is disabled');

        return click(this.elem);
    }
}
