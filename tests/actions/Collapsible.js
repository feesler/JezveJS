import {
    baseUrl,
    goTo,
    test,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { App } from '../app.js';
import { CollapsibleView } from '../view/CollapsibleView.js';

const checkNavigation = async () => {
    if (App.view instanceof CollapsibleView) {
        return;
    }

    const pageUrl = `${baseUrl()}collapsible.html`;
    await goTo(pageUrl);
    assert.instanceOf(App.view, CollapsibleView);
};

export const toggle = async (name) => {
    await test(`Toggle component '${name}'`, async () => {
        await checkNavigation();
        return App.view.toggleById(name);
    });
};

export const toggleDisabled = async () => {
    await test('Toggle component with disabled \'toggleOnClick\' prop', async () => {
        await checkNavigation();
        return App.view.toggleDisabled();
    });
};

export const collapseMethod = async () => {
    await test('.collapse() method', async () => {
        await checkNavigation();
        return App.view.collapse();
    });
};

export const expandMethod = async () => {
    await test('.expand() method', async () => {
        await checkNavigation();
        return App.view.expand();
    });
};

export const toggleMethod = async () => {
    await test('.toggle() method', async () => {
        await checkNavigation();
        return App.view.toggle();
    });
};
