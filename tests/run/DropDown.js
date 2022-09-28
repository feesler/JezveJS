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

export const addItemTest = async () => {
    await test('[DropDown] Add item', async () => {
        const expected = App.view.content.dynamicDropDown.model.items;
        const newId = expected.length + 1;
        expected.push({
            id: newId.toString(),
            text: `Item ${newId}`,
            selected: false,
            disabled: false,
            hidden: false,
        });

        await App.view.addItem();
        await App.view.performAction(() => App.view.content.dynamicDropDown.showList());

        const { items } = App.view.content.dynamicDropDown.model;

        assert.deepMeet(items, expected);
        return true;
    });
};

export const addDisabledItem = async () => {
    await test('[DropDown] Add disabled item', async () => {
        const expected = App.view.content.dynamicDropDown.model.items;
        const newId = expected.length + 1;
        expected.push({
            id: newId.toString(),
            text: `Item ${newId}`,
            selected: false,
            disabled: true,
            hidden: false,
        });

        await App.view.addDisabledItem();
        await App.view.performAction(() => App.view.content.dynamicDropDown.showList());

        const { items } = App.view.content.dynamicDropDown.model;
        assert.deepMeet(items, expected);
        return true;
    });
};

export const addHiddenItem = async () => {
    await test('[DropDown] Add hidden item', async () => {
        const expected = App.view.content.dynamicDropDown.model.items;
        const newId = expected.length + 1;
        expected.push({
            id: newId.toString(),
            text: `Item ${newId}`,
            selected: false,
            disabled: true,
            hidden: true,
        });

        await App.view.addHiddenItem();
        await App.view.performAction(() => App.view.content.dynamicDropDown.showList());

        const { items } = App.view.content.dynamicDropDown.model;
        assert.deepMeet(items, expected);
        return true;
    });
};

export const removeLastItem = async () => {
    await test('[DropDown] Remove last item', async () => {
        const expected = App.view.content.dynamicDropDown.model.items;
        expected.splice(expected.length - 1);

        await App.view.removeLastItem();

        const { items } = App.view.content.dynamicDropDown.model;
        assert.deepMeet(items, expected);
        return true;
    });
};

export const removeAllItems = async () => {
    await test('[DropDown] Remove all items', async () => {
        const expected = [];

        await App.view.removeAllItems();

        const { items } = App.view.content.dynamicDropDown.model;
        assert.deepMeet(items, expected);
        return true;
    });
};

export const addRemoveItemsTest = async () => {
    await addItemTest();
    await addDisabledItem();
    await addHiddenItem();
    await removeLastItem();
    await removeAllItems();
};
