import { copyObject, assert, test } from 'jezve-test';
import { App } from '../app.js';

export async function selectTest(ddname, value) {
    if (typeof ddname !== 'string') {
        throw new Error('Invalid DropDown specified');
    }

    let dropdown = App.view.content[ddname];
    if (!dropdown) {
        throw new Error(`Component ${ddname} not found`);
    }

    const origSelected = dropdown.getSelectedValues();
    let expSelected;

    if (dropdown.content.isMulti) {
        // Deselect if already selected
        if (origSelected.includes(value)) {
            expSelected = origSelected.filter((item) => item !== value);
        } else {
            expSelected = copyObject(origSelected);
            expSelected.push(value);
        }
    } else {
        expSelected = [value];
    }

    await App.view.performAction(() => dropdown.toggleItem(value));
    dropdown = App.view.content[ddname];

    const selected = dropdown.getSelectedValues();
    await test(`[DropDown] Select by value (${value})`, () => assert.deepMeet(selected, expSelected));
}

export async function deselectTest(ddname, value) {
    if (typeof ddname !== 'string') {
        throw new Error('Invalid DropDown specified');
    }

    let dropdown = App.view.content[ddname];
    if (!dropdown) {
        throw new Error(`Component ${ddname} not found`);
    }
    if (!dropdown.content.isMulti) {
        throw new Error('Deselect is not available for single selection component');
    }

    // Check item is selected
    const origSelected = dropdown.getSelectedValues();
    if (!origSelected.includes(value)) {
        throw new Error(`Item ${value} not found`);
    }

    const expSelected = origSelected.filter((item) => item !== value);

    await App.view.performAction(() => dropdown.deselectItemByTag(value));
    dropdown = App.view.content[ddname];

    const selected = dropdown.getSelectedValues();

    await test(`[DropDown] Deselect by tag (${value})`, () => assert.deepMeet(selected, expSelected));
}
