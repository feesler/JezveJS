import {
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
import { assert } from '@jezvejs/assert';
import { AppView } from './AppView.js';

export class ControlledInputView extends AppView {
    inputSelectors = {
        digitsOnlyInput: '#digitsOnlyInput',
        lettersOnlyInput: '#lettersOnlyInput',
        testValueInput: '#testValueInput',
    };

    async parseContent() {
        const res = {};

        await asyncMap(
            Object.entries(this.inputSelectors),
            async ([name, selector]) => {
                res[name] = { elem: await query(selector) };
                assert(res[name], `Failed to initialize component '${name}'`);
            },
        );

        const inputNames = Object.keys(this.inputSelectors);

        const values = await evaluate((...elems) => (
            elems.map((el) => el?.value)
        ), ...inputNames.map((name) => res[name].elem));

        values.forEach((value, index) => {
            const name = inputNames[index];
            res[name].value = value;
        });

        return res;
    }

    buildModel(cont) {
        const res = {
        };

        const inputNames = Object.keys(this.inputSelectors);
        inputNames.forEach((name) => {
            res[name] = { value: cont[name].value };
        });

        return res;
    }

    getExpectedState(model = this.model) {
        const res = {
        };

        const inputNames = Object.keys(this.inputSelectors);
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

        return this.runTestAction(() => input(component.elem, value));
    }

    async inputFromPos(id, initialValue, pos, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;

        return this.runTestAction(async () => {
            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setCursorPos(component.elem, pos);
            return typeText(component.elem, value);
        });
    }

    async inputToSelection(id, initialValue, startPos, endPos, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;

        return this.runTestAction(async () => {
            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setSelection(component.elem, startPos, endPos);
            return typeText(component.elem, value);
        });
    }

    async pasteToEmpty(id, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        this.model.testValueInput.value = value;

        return this.runTestAction(async () => {
            await evaluate((el, val) => {
                /* eslint-disable-next-line no-param-reassign */
                el.value = val;
            }, this.content.testValueInput.elem, value);

            await setSelection(this.content.testValueInput.elem, 0, value.length);
            await copyText();
            await input(component.elem, '');
            return pasteText();
        });
    }

    async pasteFromPos(id, initialValue, pos, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        this.model.testValueInput.value = value;

        return this.runTestAction(async () => {
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
    }

    async pasteToSelection(id, initialValue, startPos, endPos, value, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;
        this.model.testValueInput.value = value;

        return this.runTestAction(async () => {
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
    }

    async cutSelection(id, initialValue, startPos, endPos, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;

        return this.runTestAction(async () => {
            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setSelection(component.elem, startPos, endPos);
            return cutText();
        });
    }

    async pressKeyFromPos(id, initialValue, pos, key, expectedValue) {
        const component = this.getComponentById(id);

        this.model[id].value = expectedValue;

        return this.runTestAction(async () => {
            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setCursorPos(component.elem, pos);
            return pressKey(key);
        });
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

        return this.runTestAction(async () => {
            if (component.value !== initialValue) {
                await evaluate((el, val) => {
                    /* eslint-disable-next-line no-param-reassign */
                    el.value = val;
                }, component.elem, initialValue);
            }

            await setSelection(component.elem, startPos, endPos);
            return pressKey(key);
        });
    }

    async backspaceSelection(id, initialValue, startPos, endPos, expected) {
        return this.pressKeyToSelection(id, initialValue, startPos, endPos, 'Backspace', expected);
    }

    async deleteSelection(id, initialValue, startPos, endPos, expected) {
        return this.pressKeyToSelection(id, initialValue, startPos, endPos, 'Delete', expected);
    }
}
