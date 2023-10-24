import { test } from 'jezve-test';
import { App } from '../app.js';

export const toggleDefault = async () => (
    test('Toggle default menu', () => App.view.toggleDefault())
);

export const openToggleOnClick = async () => (
    test('Click by menu button of \'toggleOnClick\' option menu', () => App.view.openToggleOnClick())
);

export const closeToggleOnClick = async () => (
    test('Close \'toggleOnClick\' option menu by click outside', () => App.view.closeToggleOnClick())
);

export const toggleHideOnSelect = async () => (
    test('Toggle \'hideOnSelect\' option test menu', () => App.view.toggleHideOnSelect())
);

export const toggleAbsPosition = async () => (
    test('Toggle absolute position menu', () => App.view.toggleAbsPosition())
);

export const toggleClipping = async () => (
    test('Toggle clipping menu', () => App.view.toggleClipping())
);

export const toggleListMenu = async (index) => {
    await test(`Toggle list menu by index [${index}]`, () => App.view.toggleListMenu(index));
};

export const selectItemByIndex = async (name, index, ...args) => (
    test(`Select item of '${name}' menu by index [${index}]`, () => App.view.selectItemByIndex(name, index, ...args))
);

export const selectItemById = async (name, id, ...args) => (
    test(`Select item of '${name}' menu by id '${id}'`, () => App.view.selectItemById(name, id, ...args))
);
