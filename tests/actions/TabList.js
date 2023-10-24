import { test } from 'jezve-test';
import { App } from '../app.js';

export const selectTabById = async (component, id) => (
    test(`Select tab by id '${id}' at ${component}`, () => App.view.selectTabById(component, id))
);

export const toggleShowItem = async () => (
    test('Toggle show item', () => App.view.toggleShowItem())
);

export const toggleEnableItem = async () => (
    test('Toggle enable item', () => App.view.toggleEnableItem())
);

export const toggleEnable = async () => (
    test('Toggle enable component', () => App.view.toggleEnable())
);
