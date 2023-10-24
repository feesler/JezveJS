import { test } from 'jezve-test';
import { App } from '../app.js';

export const selectTest = async (name, value) => (
    test(`[DropDown] Select by value '${value}' of ${name}`, () => (
        App.view.toggleItem(name, value)
    ))
);

export const deselectTest = async (name, value) => (
    test(`[DropDown] Deselect by tag '${value}' of ${name}`, () => (
        App.view.deselectByTag(name, value)
    ))
);

export const clearTest = async (name) => (
    test(`[DropDown] Clear selection of ${name}`, () => App.view.clearSelection(name))
);

export const toggleEnableFilter = async () => (
    test('[DropDown] Toggle enable filter', () => App.view.toggleEnableFilter())
);

export const toggleEnableMultiFilter = async () => {
    await test('[DropDown] Toggle enable filter multiple select', () => (
        App.view.toggleEnableMultiFilter()
    ));
};

export const filterTest = async (name, value) => (
    test(`[DropDown] Filter ${name} by '${value}'`, () => App.view.filter(name, value))
);

export const addItemTest = async () => (
    test('[DropDown] Add item', () => App.view.addItem())
);

export const addDisabledItem = async () => (
    test('[DropDown] Add disabled item', () => App.view.addDisabledItem())
);

export const addHiddenItem = async () => (
    test('[DropDown] Add hidden item', () => App.view.addHiddenItem())
);

export const removeLastItem = async () => (
    test('[DropDown] Remove last item', () => App.view.removeLastItem())
);

export const removeAllItems = async () => (
    test('[DropDown] Remove all items', () => App.view.removeAllItems())
);

export const addRemoveItemsTest = async () => {
    await addItemTest();
    await addDisabledItem();
    await addHiddenItem();
    await removeLastItem();
    await removeAllItems();
};
