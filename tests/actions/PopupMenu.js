import { test } from 'jezve-test';
import { App } from '../app.js';

export const toggleDefault = async () => {
    await test('Toggle default menu', () => App.view.toggleDefault());
};

export const toggleAbsPosition = async () => {
    await test('Toggle absolute position menu', () => App.view.toggleAbsPosition());
};

export const toggleClipping = async () => {
    await test('Toggle clipping menu', () => App.view.toggleClipping());
};

export const toggleListMenu = async (index) => {
    await test(`Toggle list menu by index [${index}]`, () => App.view.toggleListMenu(index));
};
