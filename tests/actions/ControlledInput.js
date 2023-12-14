import {
    baseUrl,
    goTo,
    test,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { App } from '../app.js';
import { ControlledInputView } from '../view/ControlledInputView.js';

export const checkNavigation = async () => {
    if (App.view instanceof ControlledInputView) {
        return;
    }

    const pageUrl = `${baseUrl()}controlledinput.html`;
    await goTo(pageUrl);
    assert.instanceOf(App.view, ControlledInputView);
};

export const inputToEmpty = (name, value, expected) => (
    test(`[${name}] Type to empty input '${value}' -> '${expected}'`, () => (
        App.view.inputToEmpty(name, value, expected)
    ))
);

export const inputFromPos = (name, initial, pos, value, expected) => (
    test(`[${name}] Type '${value}' from position ${pos} of '${initial}' -> '${expected}'`, () => (
        App.view.inputFromPos(name, initial, pos, value, expected)
    ))
);

export const inputToSelection = (name, initial, start, end, value, expected) => (
    test(
        `[${name}] Type '${value}' to selection ${start}-${end} of '${initial}' -> '${expected}'`,
        () => (
            App.view.inputToSelection(name, initial, start, end, value, expected)
        ),
    )
);

export const pasteToEmpty = (name, value, expected) => (
    test(`[${name}] Paste to empty input '${value}' -> '${expected}'`, () => (
        App.view.pasteToEmpty(name, value, expected)
    ))
);

export const pasteFromPos = (name, initial, pos, value, expected) => (
    test(
        `[${name}] Paste '${value}' from position ${pos} of '${initial}' -> '${expected}'`,
        () => (
            App.view.pasteFromPos(name, initial, pos, value, expected)
        ),
    )
);

export const pasteToSelection = (name, initial, start, end, value, expected) => (
    test(
        `[${name}] Paste '${value}' to selection ${start}-${end} of '${initial}' -> '${expected}'`,
        () => (
            App.view.pasteToSelection(name, initial, start, end, value, expected)
        ),
    )
);

export const cutSelection = (name, initial, start, end, expected) => (
    test(
        `[${name}] Cut selection ${start}-${end} of '${initial}' -> '${expected}'`,
        () => (
            App.view.cutSelection(name, initial, start, end, expected)
        ),
    )
);

export const backspaceFromPos = (name, value, pos, expected) => (
    test(
        `[${name}] Press Backspace key from position ${pos} of '${value}' -> '${expected}'`,
        () => (
            App.view.backspaceFromPos(name, value, pos, expected)
        ),
    )
);

export const backspaceSelection = (name, initial, start, end, expected) => (
    test(
        `[${name}] Press Backspace key to selection ${start}-${end} of '${initial}' -> '${expected}'`,
        () => (
            App.view.backspaceSelection(name, initial, start, end, expected)
        ),
    )
);

export const deleteFromPos = (name, value, pos, expected) => (
    test(
        `[${name}] Press Delete key from position ${pos} of '${value}' -> '${expected}'`,
        () => (
            App.view.deleteFromPos(name, value, pos, expected)
        ),
    )
);

export const deleteSelection = (name, initial, start, end, expected) => (
    test(
        `[${name}] Press Delete key to selection ${start}-${end} of '${initial}' -> '${expected}'`,
        () => (
            App.view.deleteSelection(name, initial, start, end, expected)
        ),
    )
);
