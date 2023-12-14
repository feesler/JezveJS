import { setBlock } from 'jezve-test';
import * as Actions from '../actions/ControlledInput.js';

const typeToEmpty = async () => {
    setBlock('Type to empty input', 1);

    await Actions.inputToEmpty('digitsOnlyInput', '1', '1');
    await Actions.inputToEmpty('digitsOnlyInput', '12', '12');

    await Actions.inputToEmpty('lettersOnlyInput', 'a', 'a');
    await Actions.inputToEmpty('lettersOnlyInput', 'aB', 'aB');
};

const typeInvalidToEmpty = async () => {
    setBlock('Type invalid values for current part of date', 1);

    await Actions.inputToEmpty('digitsOnlyInput', 'x', '');

    await Actions.inputToEmpty('lettersOnlyInput', '1', '');
};

const pasteToEmpty = async () => {
    setBlock('Paste text to empty input', 1);

    await Actions.pasteToEmpty('digitsOnlyInput', '1', '1');
    await Actions.pasteToEmpty('digitsOnlyInput', '12', '12');

    await Actions.pasteToEmpty('lettersOnlyInput', 'a', 'a');
    await Actions.pasteToEmpty('lettersOnlyInput', 'aB', 'aB');
};

const pasteInvalidToEmpty = async () => {
    setBlock('Paste invalid text to empty input', 1);

    await Actions.pasteToEmpty('digitsOnlyInput', 'x', '');

    await Actions.pasteToEmpty('lettersOnlyInput', '1', '');
};

const backspaceKey = async () => {
    setBlock('Backspace key', 1);

    await Actions.backspaceFromPos('digitsOnlyInput', '123', 3, '12');
    await Actions.backspaceFromPos('digitsOnlyInput', '12', 2, '1');
    await Actions.backspaceFromPos('digitsOnlyInput', '1', 1, '');
    await Actions.backspaceFromPos('digitsOnlyInput', '', 0, '');

    await Actions.backspaceFromPos('lettersOnlyInput', 'abc', 3, 'ab');
    await Actions.backspaceFromPos('lettersOnlyInput', 'ab', 2, 'a');
    await Actions.backspaceFromPos('lettersOnlyInput', 'a', 1, '');
    await Actions.backspaceFromPos('lettersOnlyInput', '', 0, '');
};

const deleteKey = async () => {
    setBlock('Delete key', 1);

    await Actions.deleteFromPos('digitsOnlyInput', '123456789', 0, '23456789');

    await Actions.deleteFromPos('lettersOnlyInput', 'abcdefg', 0, 'bcdefg');
};

const inputFromPos = async () => {
    setBlock('Input text inside value', 1);

    await Actions.inputFromPos('digitsOnlyInput', '1234', 2, '0', '12034');
};

const inputInvalidFromPos = async () => {
    setBlock('Input invalid text inside value', 1);

    await Actions.inputFromPos('digitsOnlyInput', '1234', 0, 'x', '1234');
};

const inputToSelection = async () => {
    setBlock('Input text into selection', 1);

    await Actions.inputToSelection('digitsOnlyInput', '123456', 0, 3, '0', '0456');
};

const inputInvalidToSelection = async () => {
    setBlock('Input invalid text into selection', 1);

    await Actions.inputToSelection('digitsOnlyInput', '123456', 2, 4, 'x', '123456');
};

const pasteToSelection = async () => {
    setBlock('Paste text into selection', 1);

    await Actions.pasteToSelection('digitsOnlyInput', '123456', 2, 4, '00', '120056');
};

const pasteInvalidToSelection = async () => {
    setBlock('Paste invalid text into selection', 1);

    await Actions.pasteToSelection('digitsOnlyInput', '123456', 2, 4, 'x', '123456');
};

const pasteFromPos = async () => {
    setBlock('Paste text inside value', 1);

    await Actions.pasteFromPos('digitsOnlyInput', '123456', 3, '00', '12300456');
};

const pasteInvalidFromPos = async () => {
    setBlock('Paste invalid text inside value', 1);

    await Actions.pasteFromPos('digitsOnlyInput', '1234', 0, 'x', '1234');
};

const backspaceSelection = async () => {
    setBlock('Backspace key with selection', 1);

    await Actions.backspaceSelection('digitsOnlyInput', '123456', 0, 3, '456');
};

const deleteSelection = async () => {
    setBlock('Delete key with selection', 1);

    await Actions.deleteSelection('digitsOnlyInput', '123456', 0, 3, '456');
};

const cutSelection = async () => {
    setBlock('Cut selection', 1);

    await Actions.cutSelection('digitsOnlyInput', '123456', 0, 3, '456');
};

export const controlledInputTests = async () => {
    setBlock('ControlledInput component', 1);

    await Actions.checkNavigation();

    await typeToEmpty();
    await typeInvalidToEmpty();
    await pasteToEmpty();
    await pasteInvalidToEmpty();
    await backspaceKey();
    await deleteKey();
    await inputFromPos();
    await inputInvalidFromPos();
    await inputToSelection();
    await inputInvalidToSelection();
    await pasteToSelection();
    await pasteInvalidToSelection();
    await pasteFromPos();
    await pasteInvalidFromPos();
    await backspaceSelection();
    await deleteSelection();
    await cutSelection();
};
