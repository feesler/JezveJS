import { assert, test } from 'jezve-test';
import { App } from '../app.js';

export const selectTest = async (name, value) => {
    assert.isString(name, 'Invalid name of component');

    await test(`[DropDown] Select by value '${value}' of ${name}`, () => (
        App.view.toggleItem(name, value)
    ));
};

export const deselectTest = async (name, value) => {
    assert.isString(name, 'Invalid name of component');

    await test(`[DropDown] Deselect by tag '${value}' of ${name}`, () => (
        App.view.deselectByTag(name, value)
    ));
};

export const clearTest = async (name) => {
    assert.isString(name, 'Invalid name of component');

    await test(`[DropDown] Clear selection of ${name}`, () => App.view.clearSelection(name));
};

export const addItemTest = async () => {
    await test('[DropDown] Add item', () => App.view.addItem());
};

export const addDisabledItem = async () => {
    await test('[DropDown] Add disabled item', () => App.view.addDisabledItem());
};

export const addHiddenItem = async () => {
    await test('[DropDown] Add hidden item', () => App.view.addHiddenItem());
};

export const removeLastItem = async () => {
    await test('[DropDown] Remove last item', () => App.view.removeLastItem());
};

export const removeAllItems = async () => {
    await test('[DropDown] Remove all items', () => App.view.removeAllItems());
};

export const addRemoveItemsTest = async () => {
    await addItemTest();
    await addDisabledItem();
    await addHiddenItem();
    await removeLastItem();
    await removeAllItems();
};
