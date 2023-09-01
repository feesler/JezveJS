import {
    assert,
    baseUrl,
    goTo,
    test,
} from 'jezve-test';
import { App } from '../app.js';
import { DecimalInputView } from '../view/DecimalInputView.js';

const checkNavigation = async () => {
    if (App.view instanceof DecimalInputView) {
        return;
    }

    const pageUrl = `${baseUrl()}demo/decimalinput.html`;
    await goTo(pageUrl);
    assert.instanceOf(App.view, DecimalInputView);
};

export const inputToEmpty = async (name, value, expected) => {
    await test(`[${name}] Type to empty input '${value}' -> '${expected}'`, async () => {
        await checkNavigation();
        return App.view.inputToEmpty(name, value, expected);
    });
};

export const inputFromPos = async (name, initial, pos, value, expected) => {
    await test(`[${name}] Type '${value}' from position ${pos} of '${initial}' -> '${expected}'`, async () => {
        await checkNavigation();
        return App.view.inputFromPos(name, initial, pos, value, expected);
    });
};

export const inputToSelection = async (name, initial, start, end, value, expected) => {
    await test(
        `[${name}] Type '${value}' to selection ${start}-${end} of '${initial}' -> '${expected}'`,
        async () => {
            await checkNavigation();
            return App.view.inputToSelection(name, initial, start, end, value, expected);
        },
    );
};

export const pasteToEmpty = async (name, value, expected) => {
    await test(`[${name}] Paste to empty input '${value}' -> '${expected}'`, async () => {
        await checkNavigation();
        return App.view.pasteToEmpty(name, value, expected);
    });
};

export const pasteFromPos = async (name, initial, pos, value, expected) => {
    await test(
        `[${name}] Paste '${value}' from position ${pos} of '${initial}' -> '${expected}'`,
        async () => {
            await checkNavigation();
            return App.view.pasteFromPos(name, initial, pos, value, expected);
        },
    );
};

export const pasteToSelection = async (name, initial, start, end, value, expected) => {
    await test(
        `[${name}] Paste '${value}' to selection ${start}-${end} of '${initial}' -> '${expected}'`,
        async () => {
            await checkNavigation();
            return App.view.pasteToSelection(name, initial, start, end, value, expected);
        },
    );
};

export const cutSelection = async (name, initial, start, end, expected) => {
    await test(
        `[${name}] Cut selection ${start}-${end} of '${initial}' -> '${expected}'`,
        async () => {
            await checkNavigation();
            return App.view.cutSelection(name, initial, start, end, expected);
        },
    );
};

export const backspaceFromPos = async (name, value, pos, expected) => {
    await test(`[${name}] Press Backspace key from position ${pos} of '${value}' -> '${expected}'`, async () => {
        await checkNavigation();
        return App.view.backspaceFromPos(name, value, pos, expected);
    });
};

export const backspaceSelection = async (name, initial, start, end, expected) => {
    await test(
        `[${name}] Press Backspace key to selection ${start}-${end} of '${initial}' -> '${expected}'`,
        async () => {
            await checkNavigation();
            return App.view.backspaceSelection(name, initial, start, end, expected);
        },
    );
};

export const deleteFromPos = async (name, value, pos, expected) => {
    await test(`[${name}] Press Delete key from position ${pos} of '${value}' -> '${expected}'`, async () => {
        await checkNavigation();
        return App.view.deleteFromPos(name, value, pos, expected);
    });
};

export const deleteSelection = async (name, initial, start, end, expected) => {
    await test(
        `[${name}] Press Delete key to selection ${start}-${end} of '${initial}' -> '${expected}'`,
        async () => {
            await checkNavigation();
            return App.view.deleteSelection(name, initial, start, end, expected);
        },
    );
};
