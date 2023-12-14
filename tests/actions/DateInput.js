import {
    baseUrl,
    goTo,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { App } from '../app.js';
import { DateInputView } from '../view/DateInputView.js';

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
    if (App.view instanceof DateInputView) {
        return;
    }

    const pageUrl = `${baseUrl()}dateinput.html`;
    await goTo(pageUrl);
    assert.instanceOf(App.view, DateInputView);
};
