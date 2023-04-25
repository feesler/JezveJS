import { test } from 'jezve-test';
import { App } from '../app.js';

export const selectTabById = async (component, id) => {
    await test(`Select tab by id '${id}' at ${component}`, () => App.view.selectTabById(component, id));
};

export const toggleEnableItem = async () => {
    await test('Toggle enable item', () => App.view.toggleEnableItem());
};

export const toggleEnable = async () => {
    await test('Toggle enable component', () => App.view.toggleEnable());
};
