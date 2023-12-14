import {
    baseUrl,
    goTo,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { App } from '../app.js';
import { DecimalInputView } from '../view/DecimalInputView.js';

export {
    inputToEmpty,
    inputFromPos,
    inputToSelection,
    pasteToEmpty,
    pasteFromPos,
    pasteToSelection,
    cutSelection,
    backspaceFromPos,
    backspaceSelection,
    deleteFromPos,
    deleteSelection,
} from './ControlledInput.js';

export const checkNavigation = async () => {
    if (App.view instanceof DecimalInputView) {
        return;
    }

    const pageUrl = `${baseUrl()}decimalinput.html`;
    await goTo(pageUrl);
    assert.instanceOf(App.view, DecimalInputView);
};
