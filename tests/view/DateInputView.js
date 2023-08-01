import {
    assert,
    query,
    asyncMap,
    evaluate,
    input,
    setSelection,
    copyText,
    pasteText,
    setCursorPos,
    pressKey,
    typeText,
    cutText,
} from 'jezve-test';
import { AppView } from './AppView.js';

const inputSelectors = {
    defaultInput: '#dateinput',
    placeholderInput: '#dateInputPh',
    createdInput: '#createContainer input',
    usLocaleInput: '#usDateInput',
    koLocaleInput: '#koDateInput',
    ruLocaleInput: '#ruDateInput',
    esLocaleInput: '#esDateInput',
    testValueInput: '#testValueInput',
};

const controlIds = [
    'inputStatus',
    'formStatus',
];

export class DateInputView extends AppView {
    async parseContent() {
        const res = {};

        await asyncMap(
            Object.entries(inputSelectors),
            async ([name, selector]) => {
                res[name] = { elem: await query(selector) };
                assert(res[name], `Failed to initialize component '${name}'`);
            },
        );

        const inputNames = Object.keys(inputSelectors);

        const values = await evaluate((...elems) => (
            elems.map((el) => el?.value)
        ), ...inputNames.map((name) => res[name].elem));

        values.forEach((value, index) => {
            const name = inputNames[index];
            res[name].value = value;
        });

        await asyncMap(controlIds, async (id) => {
            res[id] = { elem: await query(`#${id}`) };
            assert(res[id].elem, `Failed to initialize control '${id}'`);
        });

        [
            res.inputStatus.value,
            res.formStatus.value,
        ] = await evaluate((inpStatEl, formStatEl) => ([
            inpStatEl.textContent,
            formStatEl.textContent,
        ]), res.inputStatus.elem, res.formStatus.elem);

        return res;
    }

    buildModel(cont) {
        const res = {
            inputStatus: cont.inputStatus.value,
            formStatus: cont.formStatus.value,
        };

        const inputNames = Object.keys(inputSelectors);
        inputNames.forEach((name) => {
            res[name] = { value: cont[name].value };
        });

        return res;
    }

    getExpectedState(model = this.model) {
        const res = {
            inputStatus: {
                visible: true,
                value: model.inputStatus,
            },
            formStatus: {
                visible: true,
                value: model.formStatus,
            },
        };

        const inputNames = Object.keys(inputSelectors);
        inputNames.forEach((name) => {
            res[name] = {
                visible: true,
                value: model[name].value,
            };
        });

        return res;
    }

    getComponentById(id) {
        assert(this.content[id], 'Invalid component');
        return this.content[id];
    }

    async inputToEmpty(id, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        const expected = this.getExpectedState();

        await this.performAction(() => input(component.elem, value));

        return this.checkState(expected);
    }

    async inputFromPos(id, initialValue, pos, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        const expected = this.getExpectedState();

        await this.performAction(async () => {
            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setCursorPos(component.elem, pos);
            return typeText(component.elem, value);
        });

        return this.checkState(expected);
    }

    async inputToSelection(id, initialValue, startPos, endPos, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        const expected = this.getExpectedState();

        await this.performAction(async () => {
            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setSelection(component.elem, startPos, endPos);
            return typeText(component.elem, value);
        });

        return this.checkState(expected);
    }

    async pasteToEmpty(id, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        this.model.testValueInput.value = value;
        const expected = this.getExpectedState();

        await this.performAction(async () => {
            await evaluate((el, val) => {
                /* eslint-disable-next-line no-param-reassign */
                el.value = val;
            }, this.content.testValueInput.elem, value);

            await setSelection(this.content.testValueInput.elem, 0, value.length);
            await copyText();
            await input(component.elem, '');
            return pasteText();
        });

        return this.checkState(expected);
    }

    async pasteFromPos(id, initialValue, pos, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        this.model.testValueInput.value = value;
        const expected = this.getExpectedState();

        await this.performAction(async () => {
            await evaluate((el, val) => {
                /* eslint-disable-next-line no-param-reassign */
                el.value = val;
            }, this.content.testValueInput.elem, value);
            await setSelection(this.content.testValueInput.elem, 0, value.length);
            await copyText();

            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setCursorPos(component.elem, pos);
            return pasteText();
        });

        return this.checkState(expected);
    }

    async pasteToSelection(id, initialValue, startPos, endPos, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        this.model.testValueInput.value = value;
        const expected = this.getExpectedState();

        await this.performAction(async () => {
            await evaluate((el, val) => {
                /* eslint-disable-next-line no-param-reassign */
                el.value = val;
            }, this.content.testValueInput.elem, value);
            await setSelection(this.content.testValueInput.elem, 0, value.length);
            await copyText();

            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setSelection(component.elem, startPos, endPos);
            return pasteText();
        });

        return this.checkState(expected);
    }

    async cutSelection(id, initialValue, startPos, endPos, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        const expected = this.getExpectedState();

        await this.performAction(async () => {
            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setSelection(component.elem, startPos, endPos);
            return cutText();
        });

        return this.checkState(expected);
    }

    async pressKeyFromPos(id, initialValue, pos, key, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        const expected = this.getExpectedState();

        await this.performAction(async () => {
            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setCursorPos(component.elem, pos);
            return pressKey(key);
        });

        return this.checkState(expected);
    }

    async backspaceFromPos(id, initialValue, pos, expected) {
        return this.pressKeyFromPos(id, initialValue, pos, 'Backspace', expected);
    }

    async deleteFromPos(id, initialValue, pos, expected) {
        return this.pressKeyFromPos(id, initialValue, pos, 'Delete', expected);
    }

    async pressKeyToSelection(id, initialValue, startPos, endPos, key, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        const expected = this.getExpectedState();

        await this.performAction(async () => {
            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setSelection(component.elem, startPos, endPos);
            return pressKey(key);
        });

        return this.checkState(expected);
    }

    async backspaceSelection(id, initialValue, startPos, endPos, expected) {
        return this.pressKeyToSelection(id, initialValue, startPos, endPos, 'Backspace', expected);
    }

    async deleteSelection(id, initialValue, startPos, endPos, expected) {
        return this.pressKeyToSelection(id, initialValue, startPos, endPos, 'Delete', expected);
    }
}
