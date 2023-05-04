import { setBlock } from 'jezve-test';
import * as Actions from '../actions/DecimalInput.js';

const typeToEmpty = async () => {
    setBlock('Type to empty input', 1);

    await Actions.inputToEmpty('defaultInput', '1', '1');
    await Actions.inputToEmpty('defaultInput', '1.', '1.');
    await Actions.inputToEmpty('defaultInput', '1.0', '1.0');
    await Actions.inputToEmpty('defaultInput', '1.01', '1.01');
    await Actions.inputToEmpty('defaultInput', '1.012', '1.012');
    await Actions.inputToEmpty('defaultInput', '1.0123', '1.0123');
    await Actions.inputToEmpty('defaultInput', '1.01234', '1.01234');
    await Actions.inputToEmpty('defaultInput', '-', '-');
    await Actions.inputToEmpty('defaultInput', '-.', '-.');
    await Actions.inputToEmpty('defaultInput', '-.0', '-.0');
    await Actions.inputToEmpty('defaultInput', '-.01', '-.01');
    await Actions.inputToEmpty('defaultInput', '-0', '-0');
    await Actions.inputToEmpty('defaultInput', '-0.', '-0.');
    await Actions.inputToEmpty('defaultInput', '-0.0', '-0.0');
    await Actions.inputToEmpty('defaultInput', '-0.01', '-0.01');
    await Actions.inputToEmpty('defaultInput', '-0.012', '-0.012');
    await Actions.inputToEmpty('defaultInput', '0', '0');
    await Actions.inputToEmpty('defaultInput', '00', '0');
    await Actions.inputToEmpty('defaultInput', '01', '01');
    await Actions.inputToEmpty('defaultInput', '0.', '0.');
    await Actions.inputToEmpty('defaultInput', '0.0', '0.0');
    await Actions.inputToEmpty('defaultInput', '0.01', '0.01');
    await Actions.inputToEmpty('defaultInput', '0.012', '0.012');
    await Actions.inputToEmpty('defaultInput', '.', '.');
    await Actions.inputToEmpty('defaultInput', '.0', '.0');
    await Actions.inputToEmpty('defaultInput', '.01', '.01');
    await Actions.inputToEmpty('defaultInput', '.012', '.012');

    await Actions.inputToEmpty('digitsLimitInput', '1.012', '1.012');
    await Actions.inputToEmpty('digitsLimitInput', '1.0123', '1.012');
    await Actions.inputToEmpty('digitsLimitInput', '1.01234', '1.012');
    await Actions.inputToEmpty('digitsLimitInput', '123.01234', '123.012');
    await Actions.inputToEmpty('digitsLimitInput', '.01234', '.012');
    await Actions.inputToEmpty('digitsLimitInput', '-.01234', '-.012');
    await Actions.inputToEmpty('digitsLimitInput', '-0.01234', '-0.012');
    await Actions.inputToEmpty('digitsLimitInput', '-1.01234', '-1.012');
    await Actions.inputToEmpty('digitsLimitInput', '-123.01234', '-123.012');

    await Actions.inputToEmpty('integerInput', '0', '0');
    await Actions.inputToEmpty('integerInput', '00', '0');
    await Actions.inputToEmpty('integerInput', '0.', '0');
    await Actions.inputToEmpty('integerInput', '0.1', '01');
    await Actions.inputToEmpty('integerInput', '01', '01');
    await Actions.inputToEmpty('integerInput', '01.', '01');
    await Actions.inputToEmpty('integerInput', '01.2', '012');
    await Actions.inputToEmpty('integerInput', '1', '1');
    await Actions.inputToEmpty('integerInput', '1.', '1');
    await Actions.inputToEmpty('integerInput', '1.2', '12');
    await Actions.inputToEmpty('integerInput', '-', '-');
    await Actions.inputToEmpty('integerInput', '-.', '-');
    await Actions.inputToEmpty('integerInput', '-0.', '-0');
    await Actions.inputToEmpty('integerInput', '-0.1', '-01');
    await Actions.inputToEmpty('integerInput', '-01', '-01');
    await Actions.inputToEmpty('integerInput', '-01.', '-01');
    await Actions.inputToEmpty('integerInput', '-01.2', '-012');

    await Actions.inputToEmpty('positiveInput', '.', '.');
    await Actions.inputToEmpty('positiveInput', '0', '0');
    await Actions.inputToEmpty('positiveInput', '1', '1');
    await Actions.inputToEmpty('positiveInput', '01', '01');
    await Actions.inputToEmpty('positiveInput', '001', '01');
    await Actions.inputToEmpty('positiveInput', '-', '');
    await Actions.inputToEmpty('positiveInput', '-1', '1');
    await Actions.inputToEmpty('positiveInput', '-0', '0');
    await Actions.inputToEmpty('positiveInput', '-00', '0');
    await Actions.inputToEmpty('positiveInput', '-.', '.');
    await Actions.inputToEmpty('positiveInput', '-.0', '.0');
    await Actions.inputToEmpty('positiveInput', '-0.01', '0.01');
    await Actions.inputToEmpty('positiveInput', '-00.01', '0.01');

    await Actions.inputToEmpty('leadZerosInput', '001', '001');
    await Actions.inputToEmpty('leadZerosInput', '00.1', '00.1');
    await Actions.inputToEmpty('leadZerosInput', '-001', '-001');
    await Actions.inputToEmpty('leadZerosInput', '-00.1', '-00.1');
};

const typeInvalidToEmpty = async () => {
    setBlock('Type invalid values for current part of date', 1);

    await Actions.inputToEmpty('defaultInput', 'x', '');
    await Actions.inputToEmpty('defaultInput', '1x', '1');
    await Actions.inputToEmpty('defaultInput', '1.x', '1.');
    await Actions.inputToEmpty('defaultInput', '1.0x', '1.0');
    await Actions.inputToEmpty('defaultInput', '1.01x', '1.01');
    await Actions.inputToEmpty('defaultInput', '1-', '1');
    await Actions.inputToEmpty('defaultInput', '--', '-');
    await Actions.inputToEmpty('defaultInput', '1.2.', '1.2');
    await Actions.inputToEmpty('defaultInput', '1..2', '1.2');
    await Actions.inputToEmpty('defaultInput', '1.2.3', '1.23');
    await Actions.inputToEmpty('defaultInput', '..2', '.2');
    await Actions.inputToEmpty('defaultInput', '-x', '-');
    await Actions.inputToEmpty('defaultInput', '-.x', '-.');
    await Actions.inputToEmpty('defaultInput', '-.0x', '-.0');
    await Actions.inputToEmpty('defaultInput', '-0.x', '-0.');
    await Actions.inputToEmpty('defaultInput', '-0.0x', '-0.0');
    await Actions.inputToEmpty('defaultInput', '-0.01x', '-0.01');
    await Actions.inputToEmpty('defaultInput', '0x', '0');
    await Actions.inputToEmpty('defaultInput', '0.x', '0.');
    await Actions.inputToEmpty('defaultInput', '0.0x', '0.0');
    await Actions.inputToEmpty('defaultInput', '0.01x', '0.01');

    await Actions.inputToEmpty('digitsLimitInput', 'x', '');
    await Actions.inputToEmpty('digitsLimitInput', '1x', '1');
    await Actions.inputToEmpty('digitsLimitInput', '1.x', '1.');
    await Actions.inputToEmpty('digitsLimitInput', '1.01x', '1.01');
    await Actions.inputToEmpty('digitsLimitInput', '1.012x', '1.012');

    await Actions.inputToEmpty('integerInput', 'x', '');
    await Actions.inputToEmpty('integerInput', '1x', '1');
    await Actions.inputToEmpty('integerInput', '1.x', '1');
    await Actions.inputToEmpty('integerInput', '1.0x', '10');

    await Actions.inputToEmpty('positiveInput', '0x', '0');
    await Actions.inputToEmpty('positiveInput', '0.x', '0.');
    await Actions.inputToEmpty('positiveInput', '0.0x', '0.0');
    await Actions.inputToEmpty('positiveInput', '0.01x', '0.01');
    await Actions.inputToEmpty('positiveInput', '1x', '1');
    await Actions.inputToEmpty('positiveInput', '01x', '01');
    await Actions.inputToEmpty('positiveInput', '.x', '.');
    await Actions.inputToEmpty('positiveInput', '-x', '');
    await Actions.inputToEmpty('positiveInput', '-.x', '.');
    await Actions.inputToEmpty('positiveInput', '-.0x', '.0');
    await Actions.inputToEmpty('positiveInput', '-.01x', '.01');
    await Actions.inputToEmpty('positiveInput', '-0x', '0');
    await Actions.inputToEmpty('positiveInput', '-0.x', '0.');
    await Actions.inputToEmpty('positiveInput', '-0.0x', '0.0');
    await Actions.inputToEmpty('positiveInput', '-0.01x', '0.01');

    await Actions.inputToEmpty('leadZerosInput', '00x', '00');
    await Actions.inputToEmpty('leadZerosInput', '001x', '001');
    await Actions.inputToEmpty('leadZerosInput', '-00x', '-00');
    await Actions.inputToEmpty('leadZerosInput', '-001x', '-001');
    await Actions.inputToEmpty('leadZerosInput', '00.x', '00.');
    await Actions.inputToEmpty('leadZerosInput', '00.1x', '00.1');
    await Actions.inputToEmpty('leadZerosInput', '-00.x', '-00.');
    await Actions.inputToEmpty('leadZerosInput', '-00.1x', '-00.1');
};

const pasteToEmpty = async () => {
    setBlock('Paste text to empty input', 1);

    await Actions.pasteToEmpty('defaultInput', '1', '1');
    await Actions.pasteToEmpty('defaultInput', '1.', '1.');
    await Actions.pasteToEmpty('defaultInput', '1.0', '1.0');
    await Actions.pasteToEmpty('defaultInput', '1.01', '1.01');
    await Actions.pasteToEmpty('defaultInput', '1.012', '1.012');
    await Actions.pasteToEmpty('defaultInput', '1.0123', '1.0123');
    await Actions.pasteToEmpty('defaultInput', '1.01234', '1.01234');
    await Actions.pasteToEmpty('defaultInput', '-', '-');
    await Actions.pasteToEmpty('defaultInput', '-.', '-.');
    await Actions.pasteToEmpty('defaultInput', '-.0', '-.0');
    await Actions.pasteToEmpty('defaultInput', '-.01', '-.01');
    await Actions.pasteToEmpty('defaultInput', '-0', '-0');
    await Actions.pasteToEmpty('defaultInput', '-0.', '-0.');
    await Actions.pasteToEmpty('defaultInput', '-0.0', '-0.0');
    await Actions.pasteToEmpty('defaultInput', '-0.01', '-0.01');
    await Actions.pasteToEmpty('defaultInput', '-0.012', '-0.012');
    await Actions.pasteToEmpty('defaultInput', '0', '0');
    await Actions.pasteToEmpty('defaultInput', '01', '01');
    await Actions.pasteToEmpty('defaultInput', '0.', '0.');
    await Actions.pasteToEmpty('defaultInput', '0.0', '0.0');
    await Actions.pasteToEmpty('defaultInput', '0.01', '0.01');
    await Actions.pasteToEmpty('defaultInput', '0.012', '0.012');
    await Actions.pasteToEmpty('defaultInput', '.', '.');
    await Actions.pasteToEmpty('defaultInput', '.0', '.0');
    await Actions.pasteToEmpty('defaultInput', '.01', '.01');
    await Actions.pasteToEmpty('defaultInput', '.012', '.012');

    await Actions.pasteToEmpty('digitsLimitInput', '1.', '1.');
    await Actions.pasteToEmpty('digitsLimitInput', '1.01', '1.01');
    await Actions.pasteToEmpty('digitsLimitInput', '1.012', '1.012');
    await Actions.pasteToEmpty('digitsLimitInput', '1234.012', '1234.012');
    await Actions.pasteToEmpty('digitsLimitInput', '-.', '-.');
    await Actions.pasteToEmpty('digitsLimitInput', '-.1', '-.1');
    await Actions.pasteToEmpty('digitsLimitInput', '-.12', '-.12');
    await Actions.pasteToEmpty('digitsLimitInput', '-.123', '-.123');
    await Actions.pasteToEmpty('digitsLimitInput', '-0.123', '-0.123');
    await Actions.pasteToEmpty('digitsLimitInput', '-1234.123', '-1234.123');

    await Actions.pasteToEmpty('leadZerosInput', '000', '000');
    await Actions.pasteToEmpty('leadZerosInput', '001', '001');
    await Actions.pasteToEmpty('leadZerosInput', '00.1', '00.1');
    await Actions.pasteToEmpty('leadZerosInput', '-000', '-000');
    await Actions.pasteToEmpty('leadZerosInput', '-0001', '-0001');
    await Actions.pasteToEmpty('leadZerosInput', '-00.01', '-00.01');
};

const pasteInvalidToEmpty = async () => {
    setBlock('Paste invalid text to empty input', 1);

    await Actions.pasteToEmpty('defaultInput', 'x', '');
    await Actions.pasteToEmpty('defaultInput', '00', '');
    await Actions.pasteToEmpty('defaultInput', '0x', '');
    await Actions.pasteToEmpty('defaultInput', '0.x', '');
    await Actions.pasteToEmpty('defaultInput', '0.0x', '');
    await Actions.pasteToEmpty('defaultInput', '0.01x', '');
    await Actions.pasteToEmpty('defaultInput', '--', '');
    await Actions.pasteToEmpty('defaultInput', '--1', '');
    await Actions.pasteToEmpty('defaultInput', '0.1.2', '');
    await Actions.pasteToEmpty('defaultInput', '0..1', '');

    await Actions.pasteToEmpty('digitsLimitInput', 'x', '');
    await Actions.pasteToEmpty('digitsLimitInput', '1x', '');
    await Actions.pasteToEmpty('digitsLimitInput', '1.x', '');
    await Actions.pasteToEmpty('digitsLimitInput', '1.01x', '');
    await Actions.pasteToEmpty('digitsLimitInput', '1.012x', '');
    await Actions.pasteToEmpty('digitsLimitInput', '1.0123', '');

    await Actions.pasteToEmpty('integerInput', 'x', '');
    await Actions.pasteToEmpty('integerInput', '1x', '');
    await Actions.pasteToEmpty('integerInput', '1.x', '');
    await Actions.pasteToEmpty('integerInput', '1.0x', '');
    await Actions.pasteToEmpty('integerInput', '1.0', '');
    await Actions.pasteToEmpty('integerInput', '.', '');
    await Actions.pasteToEmpty('integerInput', '-.', '');
    await Actions.pasteToEmpty('integerInput', '-1.', '');
    await Actions.pasteToEmpty('integerInput', '-1.0', '');

    await Actions.pasteToEmpty('positiveInput', 'x', '');
    await Actions.pasteToEmpty('positiveInput', '0x', '');
    await Actions.pasteToEmpty('positiveInput', '0.x', '');
    await Actions.pasteToEmpty('positiveInput', '01x', '');
    await Actions.pasteToEmpty('positiveInput', '1x', '');
    await Actions.pasteToEmpty('positiveInput', '1.x', '');
    await Actions.pasteToEmpty('positiveInput', '1.0x', '');
    await Actions.pasteToEmpty('positiveInput', '-x', '');
    await Actions.pasteToEmpty('positiveInput', '-0x', '');
    await Actions.pasteToEmpty('positiveInput', '-01x', '');
    await Actions.pasteToEmpty('positiveInput', '-1x', '');
    await Actions.pasteToEmpty('positiveInput', '-1.x', '');
    await Actions.pasteToEmpty('positiveInput', '-1.0x', '');
    await Actions.pasteToEmpty('positiveInput', '-1.0x', '');

    await Actions.pasteToEmpty('leadZerosInput', 'x', '');
    await Actions.pasteToEmpty('leadZerosInput', '0x', '');
    await Actions.pasteToEmpty('leadZerosInput', '01x', '');
    await Actions.pasteToEmpty('leadZerosInput', '001x', '');
    await Actions.pasteToEmpty('leadZerosInput', '-001x', '');
    await Actions.pasteToEmpty('leadZerosInput', '-00.1x', '');
};

const backspaceKey = async () => {
    setBlock('Backspace key', 1);

    await Actions.backspaceFromPos('defaultInput', '1234.56789012', 13, '1234.5678901');
    await Actions.backspaceFromPos('defaultInput', '1234.5678901', 12, '1234.567890');
    await Actions.backspaceFromPos('defaultInput', '1234.567890', 11, '1234.56789');
    await Actions.backspaceFromPos('defaultInput', '1234.56789', 10, '1234.5678');
    await Actions.backspaceFromPos('defaultInput', '1234.5678', 9, '1234.567');
    await Actions.backspaceFromPos('defaultInput', '1234.567', 8, '1234.56');
    await Actions.backspaceFromPos('defaultInput', '1234.56', 7, '1234.5');
    await Actions.backspaceFromPos('defaultInput', '1234.5', 6, '1234.');
    await Actions.backspaceFromPos('defaultInput', '1234.', 5, '1234');
    await Actions.backspaceFromPos('defaultInput', '1234', 4, '123');
    await Actions.backspaceFromPos('defaultInput', '123', 3, '12');
    await Actions.backspaceFromPos('defaultInput', '12', 2, '1');
    await Actions.backspaceFromPos('defaultInput', '1', 1, '');
    await Actions.backspaceFromPos('defaultInput', '', 0, '');

    await Actions.backspaceFromPos('defaultInput', '1234.567890', 8, '1234.56890');
    await Actions.backspaceFromPos('defaultInput', '1234.56890', 7, '1234.5890');
    await Actions.backspaceFromPos('defaultInput', '1234.5890', 6, '1234.890');
    await Actions.backspaceFromPos('defaultInput', '1234.890', 5, '1234890');
    await Actions.backspaceFromPos('defaultInput', '1234890', 4, '123890');
};

const deleteKey = async () => {
    setBlock('Delete key', 1);

    await Actions.deleteFromPos('defaultInput', '12.3456789', 0, '2.3456789');
    await Actions.deleteFromPos('defaultInput', '2.3456789', 0, '.3456789');
    await Actions.deleteFromPos('defaultInput', '.3456789', 0, '3456789');
    await Actions.deleteFromPos('defaultInput', '-0.3456789', 0, '0.3456789');
    await Actions.deleteFromPos('defaultInput', '-.3456789', 0, '.3456789');

    await Actions.deleteFromPos('defaultInput', '12.3456789', 2, '123456789');
    await Actions.deleteFromPos('defaultInput', '12.3456789', 3, '12.456789');
    await Actions.deleteFromPos('defaultInput', '-12.3456789', 1, '-2.3456789');
};

const inputFromPos = async () => {
    setBlock('Input text inside value', 1);

    await Actions.inputFromPos('defaultInput', '1234', 2, '.', '12.34');
    await Actions.inputFromPos('defaultInput', '1234', 2, '0', '12034');
    await Actions.inputFromPos('defaultInput', '0.1234', 2, '0', '0.01234');
    await Actions.inputFromPos('defaultInput', '.1234', 0, '0', '0.1234');
    await Actions.inputFromPos('defaultInput', '-1234', 3, '.', '-12.34');
    await Actions.inputFromPos('defaultInput', '-1234', 3, '0', '-12034');
    await Actions.inputFromPos('defaultInput', '-0.1234', 3, '0', '-0.01234');
    await Actions.inputFromPos('defaultInput', '-.1234', 1, '0', '-0.1234');
    await Actions.inputFromPos('defaultInput', '-.1234', 1, '1', '-1.1234');
    await Actions.inputFromPos('defaultInput', '-.1234', 6, '5', '-.12345');

    await Actions.inputFromPos('leadZerosInput', '1234', 0, '0', '01234');
    await Actions.inputFromPos('leadZerosInput', '01234', 0, '0', '001234');
    await Actions.inputFromPos('leadZerosInput', '.1234', 0, '0', '0.1234');
    await Actions.inputFromPos('leadZerosInput', '0.1234', 0, '0', '00.1234');
    await Actions.inputFromPos('leadZerosInput', '-.1234', 1, '0', '-0.1234');
    await Actions.inputFromPos('leadZerosInput', '-0.1234', 1, '0', '-00.1234');
};

const inputInvalidFromPos = async () => {
    setBlock('Input invalid text inside value', 1);

    await Actions.inputFromPos('defaultInput', '1234', 0, 'x', '1234');
    await Actions.inputFromPos('defaultInput', '1234', 2, 'x', '1234');
    await Actions.inputFromPos('defaultInput', '1234', 4, 'x', '1234');
    await Actions.inputFromPos('defaultInput', '1234', 2, '-', '1234');
    await Actions.inputFromPos('defaultInput', '-1234', 1, '-', '-1234');
    await Actions.inputFromPos('defaultInput', '-1234', 5, '-', '-1234');
    await Actions.inputFromPos('defaultInput', '-1.234', 0, '-.', '-1.234');
    await Actions.inputFromPos('defaultInput', '1.234', 2, '.', '1.234');
    await Actions.inputFromPos('defaultInput', '1.234', 3, '.', '1.234');
    await Actions.inputFromPos('defaultInput', '1.234', 3, '.', '1.234');
    await Actions.inputFromPos('defaultInput', '-1.234', 0, '.', '-1.234');
    await Actions.inputFromPos('defaultInput', '-1.234', 1, '.', '-1.234');
    await Actions.inputFromPos('defaultInput', '-1.234', 2, '.', '-1.234');
    await Actions.inputFromPos('defaultInput', '-1.234', 3, '.', '-1.234');

    await Actions.inputFromPos('digitsLimitInput', '123456', 0, '.', '123456');
    await Actions.inputFromPos('digitsLimitInput', '123456', 2, '.', '123456');
    await Actions.inputFromPos('digitsLimitInput', '123456', 6, 'x', '123456');
    await Actions.inputFromPos('digitsLimitInput', '-123456', 0, '.', '-123456');
    await Actions.inputFromPos('digitsLimitInput', '-123456', 1, '.', '-123456');
    await Actions.inputFromPos('digitsLimitInput', '-123456', 3, '.', '-123456');
    await Actions.inputFromPos('digitsLimitInput', '-123456', 7, 'x', '-123456');
    await Actions.inputFromPos('digitsLimitInput', '1.234', 0, 'x', '1.234');
    await Actions.inputFromPos('digitsLimitInput', '1.234', 1, 'x', '1.234');
    await Actions.inputFromPos('digitsLimitInput', '1.234', 5, 'x', '1.234');
    await Actions.inputFromPos('digitsLimitInput', '1.234', 5, '1', '1.234');
    await Actions.inputFromPos('digitsLimitInput', '1.234', 5, '0', '1.234');
    await Actions.inputFromPos('digitsLimitInput', '1.234', 5, '.', '1.234');
    await Actions.inputFromPos('digitsLimitInput', '.012', 4, '3', '.012');
    await Actions.inputFromPos('digitsLimitInput', '0.012', 5, '3', '0.012');
    await Actions.inputFromPos('digitsLimitInput', '-0.012', 6, '3', '-0.012');
    await Actions.inputFromPos('digitsLimitInput', '-.012', 5, '3', '-.012');

    await Actions.inputFromPos('integerInput', '123456', 0, '.', '123456');
    await Actions.inputFromPos('integerInput', '123456', 1, '.', '123456');
    await Actions.inputFromPos('integerInput', '123456', 4, '.', '123456');
    await Actions.inputFromPos('integerInput', '-123456', 0, '.', '-123456');
    await Actions.inputFromPos('integerInput', '-123456', 1, '.', '-123456');
    await Actions.inputFromPos('integerInput', '-123456', 4, '.', '-123456');
    await Actions.inputFromPos('integerInput', '123456', 0, 'x', '123456');
    await Actions.inputFromPos('integerInput', '123456', 2, 'x', '123456');
    await Actions.inputFromPos('integerInput', '123456', 6, 'x', '123456');
    await Actions.inputFromPos('integerInput', '-123456', 0, 'x', '-123456');
    await Actions.inputFromPos('integerInput', '-123456', 1, 'x', '-123456');
    await Actions.inputFromPos('integerInput', '-123456', 4, 'x', '-123456');
    await Actions.inputFromPos('integerInput', '-123456', 7, 'x', '-123456');

    await Actions.inputFromPos('positiveInput', '123456', 0, '-', '123456');
    await Actions.inputFromPos('positiveInput', '.123456', 0, '-', '.123456');
    await Actions.inputFromPos('positiveInput', '0.123456', 0, '-', '0.123456');
    await Actions.inputFromPos('positiveInput', '12.123456', 0, '-', '12.123456');
    await Actions.inputFromPos('positiveInput', '123456', 0, 'x', '123456');
    await Actions.inputFromPos('positiveInput', '123456', 2, 'x', '123456');
    await Actions.inputFromPos('positiveInput', '123456', 6, 'x', '123456');
    await Actions.inputFromPos('positiveInput', '.123456', 7, 'x', '.123456');
    await Actions.inputFromPos('positiveInput', '.123456', 0, 'x', '.123456');
    await Actions.inputFromPos('positiveInput', '0.123456', 0, 'x', '0.123456');
};

const inputToSelection = async () => {
    setBlock('Input text into selection', 1);

    await Actions.inputToSelection('defaultInput', '123456', 2, 4, '.', '12.56');
    await Actions.inputToSelection('defaultInput', '123456', 0, 6, '-', '-');
    await Actions.inputToSelection('defaultInput', '123456', 0, 3, '0', '0456');
    await Actions.inputToSelection('defaultInput', '123456', 0, 3, '-', '-456');
};

const inputInvalidToSelection = async () => {
    setBlock('Input invalid text into selection', 1);

    await Actions.inputToSelection('defaultInput', '123456', 2, 4, 'x', '123456');
    await Actions.inputToSelection('defaultInput', '12.3456', 3, 4, '.', '12.3456');
    await Actions.inputToSelection('defaultInput', '12.3456', 0, 2, '.', '12.3456');
    await Actions.inputToSelection('defaultInput', '12.3456', 0, 2, 'x', '12.3456');
    await Actions.inputToSelection('defaultInput', '12.3456', 5, 7, 'x', '12.3456');
    await Actions.inputToSelection('defaultInput', '12.3456', 5, 7, '-', '12.3456');
    await Actions.inputToSelection('defaultInput', '12.3456', 5, 7, '.', '12.3456');
    await Actions.inputToSelection('defaultInput', '12.3456', 5, 7, ' ', '12.3456');
    await Actions.inputToSelection('defaultInput', '-12.3456', 1, 2, '-', '-12.3456');
    await Actions.inputToSelection('defaultInput', '-12.3456', 1, 2, '.', '-12.3456');
    await Actions.inputToSelection('defaultInput', '0.3456', 1, 3, '0', '0.3456');
    await Actions.inputToSelection('defaultInput', '0.3456', 1, 3, 'x', '0.3456');
    await Actions.inputToSelection('defaultInput', '-0.3456', 1, 4, '-', '-0.3456');

    await Actions.inputToSelection('digitsLimitInput', '123456', 0, 2, 'x', '123456');
    await Actions.inputToSelection('digitsLimitInput', '123456', 4, 6, 'x', '123456');
    await Actions.inputToSelection('digitsLimitInput', '123456', 0, 2, '.', '123456');
    await Actions.inputToSelection('digitsLimitInput', '123456', 1, 2, '.', '123456');
    await Actions.inputToSelection('digitsLimitInput', '12340.123', 2, 4, '.', '12340.123');
    await Actions.inputToSelection('digitsLimitInput', '-123456', 2, 3, '.', '-123456');

    await Actions.inputToSelection('integerInput', '123456', 0, 3, 'x', '123456');
    await Actions.inputToSelection('integerInput', '123456', 2, 4, 'x', '123456');
    await Actions.inputToSelection('integerInput', '123456', 4, 6, 'x', '123456');
    await Actions.inputToSelection('integerInput', '123456', 0, 3, '.', '123456');
    await Actions.inputToSelection('integerInput', '123456', 2, 4, '.', '123456');
    await Actions.inputToSelection('integerInput', '123456', 4, 6, '.', '123456');
    await Actions.inputToSelection('integerInput', '-123456', 0, 3, '.', '-123456');
    await Actions.inputToSelection('integerInput', '-123456', 2, 4, '.', '-123456');

    await Actions.inputToSelection('positiveInput', '123456', 0, 3, 'x', '123456');
    await Actions.inputToSelection('positiveInput', '123456', 2, 4, 'x', '123456');
    await Actions.inputToSelection('positiveInput', '123456', 4, 6, 'x', '123456');
    await Actions.inputToSelection('positiveInput', '123456', 0, 3, '-', '123456');
    await Actions.inputToSelection('positiveInput', '123456', 0, 6, '-', '123456');
    await Actions.inputToSelection('positiveInput', '.123456', 0, 3, '-', '.123456');
    await Actions.inputToSelection('positiveInput', '0.123456', 0, 1, '-', '0.123456');
};

const pasteToSelection = async () => {
    setBlock('Paste text into selection', 1);

    await Actions.pasteToSelection('defaultInput', '123456', 2, 4, '.', '12.56');
    await Actions.pasteToSelection('defaultInput', '123456', 2, 4, '00', '120056');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 6, '-', '-');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 6, '.', '.');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 3, '0', '0456');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 3, '.', '.456');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 3, '0.', '0.456');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 3, '-', '-456');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 3, '-.', '-.456');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 3, '-0.', '-0.456');
    await Actions.pasteToSelection('defaultInput', '123456', 4, 6, '.', '1234.');
    await Actions.pasteToSelection('defaultInput', '123456', 4, 6, '.5', '1234.5');
};

const pasteInvalidToSelection = async () => {
    setBlock('Paste invalid text into selection', 1);

    await Actions.pasteToSelection('defaultInput', '123456', 2, 4, 'x', '123456');
    await Actions.pasteToSelection('defaultInput', '123456', 2, 4, '..', '123456');
    await Actions.pasteToSelection('defaultInput', '123456', 2, 4, '-', '123456');
    await Actions.pasteToSelection('defaultInput', '123456', 2, 4, ' ', '123456');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 3, '--', '123456');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 3, 'x', '123456');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 3, '00', '123456');
    await Actions.pasteToSelection('defaultInput', '123456', 0, 3, '..', '123456');

    await Actions.pasteToSelection('digitsLimitInput', '123456789', 0, 3, 'x', '123456789');
    await Actions.pasteToSelection('digitsLimitInput', '123456789', 0, 3, '.', '123456789');
    await Actions.pasteToSelection('digitsLimitInput', '-123456789', 1, 2, '.', '-123456789');
    await Actions.pasteToSelection('digitsLimitInput', '123456.789', 3, 7, '.456', '123456.789');

    await Actions.pasteToSelection('integerInput', '123456', 0, 3, 'x', '123456');
    await Actions.pasteToSelection('integerInput', '123456', 0, 3, '.', '123456');
    await Actions.pasteToSelection('integerInput', '123456', 2, 3, '.', '123456');
    await Actions.pasteToSelection('integerInput', '-123456', 2, 3, '.', '-123456');

    await Actions.pasteToSelection('positiveInput', '123456', 0, 3, '-', '123456');
    await Actions.pasteToSelection('positiveInput', '123.456', 0, 3, '-', '123.456');
};

const pasteFromPos = async () => {
    setBlock('Paste text inside value', 1);

    await Actions.pasteFromPos('defaultInput', '123456', 3, '.', '123.456');
    await Actions.pasteFromPos('defaultInput', '123456', 3, '00', '12300456');
    await Actions.pasteFromPos('defaultInput', '123456', 0, '-', '-123456');
    await Actions.pasteFromPos('defaultInput', '123456', 0, '.', '.123456');
    await Actions.pasteFromPos('defaultInput', '123456', 0, '0.', '0.123456');
    await Actions.pasteFromPos('defaultInput', '123456', 6, '0.1', '1234560.1');
};

const pasteInvalidFromPos = async () => {
    setBlock('Paste invalid text inside value', 1);

    await Actions.pasteFromPos('defaultInput', '1234', 0, 'x', '1234');
    await Actions.pasteFromPos('defaultInput', '1234', 2, 'x', '1234');
    await Actions.pasteFromPos('defaultInput', '1234', 4, 'x', '1234');
    await Actions.pasteFromPos('defaultInput', '1234', 2, '-', '1234');
    await Actions.pasteFromPos('defaultInput', '-1234', 1, '-', '-1234');
    await Actions.pasteFromPos('defaultInput', '-1234', 5, '-', '-1234');
    await Actions.pasteFromPos('defaultInput', '-1.234', 0, '-.', '-1.234');
    await Actions.pasteFromPos('defaultInput', '1.234', 2, '.', '1.234');
    await Actions.pasteFromPos('defaultInput', '1.234', 3, '.', '1.234');
    await Actions.pasteFromPos('defaultInput', '1.234', 3, '.', '1.234');
    await Actions.pasteFromPos('defaultInput', '-1.234', 0, '.', '-1.234');
    await Actions.pasteFromPos('defaultInput', '-1.234', 1, '.', '-1.234');
    await Actions.pasteFromPos('defaultInput', '-1.234', 2, '.', '-1.234');
    await Actions.pasteFromPos('defaultInput', '-1.234', 3, '.', '-1.234');

    await Actions.pasteFromPos('digitsLimitInput', '123456', 0, '.', '123456');
    await Actions.pasteFromPos('digitsLimitInput', '123456', 2, '.', '123456');
    await Actions.pasteFromPos('digitsLimitInput', '123456', 6, 'x', '123456');
    await Actions.pasteFromPos('digitsLimitInput', '-123456', 0, '.', '-123456');
    await Actions.pasteFromPos('digitsLimitInput', '-123456', 1, '.', '-123456');
    await Actions.pasteFromPos('digitsLimitInput', '-123456', 3, '.', '-123456');
    await Actions.pasteFromPos('digitsLimitInput', '-123456', 7, 'x', '-123456');
    await Actions.pasteFromPos('digitsLimitInput', '1.234', 0, 'x', '1.234');
    await Actions.pasteFromPos('digitsLimitInput', '1.234', 1, 'x', '1.234');
    await Actions.pasteFromPos('digitsLimitInput', '1.234', 5, 'x', '1.234');
    await Actions.pasteFromPos('digitsLimitInput', '1.234', 5, '1', '1.234');
    await Actions.pasteFromPos('digitsLimitInput', '1.234', 5, '0', '1.234');
    await Actions.pasteFromPos('digitsLimitInput', '1.234', 5, '.', '1.234');
    await Actions.pasteFromPos('digitsLimitInput', '.012', 4, '3', '.012');
    await Actions.pasteFromPos('digitsLimitInput', '0.012', 5, '3', '0.012');
    await Actions.pasteFromPos('digitsLimitInput', '-0.012', 6, '3', '-0.012');
    await Actions.pasteFromPos('digitsLimitInput', '-.012', 5, '3', '-.012');

    await Actions.pasteFromPos('integerInput', '123456', 0, '.', '123456');
    await Actions.pasteFromPos('integerInput', '123456', 1, '.', '123456');
    await Actions.pasteFromPos('integerInput', '123456', 4, '.', '123456');
    await Actions.pasteFromPos('integerInput', '-123456', 0, '.', '-123456');
    await Actions.pasteFromPos('integerInput', '-123456', 1, '.', '-123456');
    await Actions.pasteFromPos('integerInput', '-123456', 4, '.', '-123456');
    await Actions.pasteFromPos('integerInput', '123456', 0, 'x', '123456');
    await Actions.pasteFromPos('integerInput', '123456', 2, 'x', '123456');
    await Actions.pasteFromPos('integerInput', '123456', 6, 'x', '123456');
    await Actions.pasteFromPos('integerInput', '-123456', 0, 'x', '-123456');
    await Actions.pasteFromPos('integerInput', '-123456', 1, 'x', '-123456');
    await Actions.pasteFromPos('integerInput', '-123456', 4, 'x', '-123456');
    await Actions.pasteFromPos('integerInput', '-123456', 7, 'x', '-123456');

    await Actions.pasteFromPos('positiveInput', '123456', 0, '-', '123456');
    await Actions.pasteFromPos('positiveInput', '.123456', 0, '-', '.123456');
    await Actions.pasteFromPos('positiveInput', '0.123456', 0, '-', '0.123456');
    await Actions.pasteFromPos('positiveInput', '12.123456', 0, '-', '12.123456');
    await Actions.pasteFromPos('positiveInput', '123456', 0, 'x', '123456');
    await Actions.pasteFromPos('positiveInput', '123456', 2, 'x', '123456');
    await Actions.pasteFromPos('positiveInput', '123456', 6, 'x', '123456');
    await Actions.pasteFromPos('positiveInput', '.123456', 7, 'x', '.123456');
    await Actions.pasteFromPos('positiveInput', '.123456', 0, 'x', '.123456');
    await Actions.pasteFromPos('positiveInput', '0.123456', 0, 'x', '0.123456');
};

const backspaceSelection = async () => {
    setBlock('Backspace key with selection', 1);

    await Actions.backspaceSelection('defaultInput', '123456', 0, 3, '456');
    await Actions.backspaceSelection('defaultInput', '123.456', 2, 5, '1256');
    await Actions.backspaceSelection('defaultInput', '.123456', 4, 7, '.123');
    await Actions.backspaceSelection('defaultInput', '-123456', 4, 7, '-123');
    await Actions.backspaceSelection('defaultInput', '0.000123', 1, 3, '0.000123');
    await Actions.backspaceSelection('defaultInput', '-0.000123', 2, 4, '-0.000123');
};

const deleteSelection = async () => {
    setBlock('Delete key with selection', 1);

    await Actions.deleteSelection('defaultInput', '123456', 0, 3, '456');
    await Actions.deleteSelection('defaultInput', '123.456', 2, 5, '1256');
    await Actions.deleteSelection('defaultInput', '.123456', 4, 7, '.123');
    await Actions.deleteSelection('defaultInput', '-123456', 4, 7, '-123');
    await Actions.deleteSelection('defaultInput', '0.000123', 1, 3, '0.000123');
    await Actions.deleteSelection('defaultInput', '-0.000123', 2, 4, '-0.000123');
};

const cutSelection = async () => {
    setBlock('Cut selection', 1);

    await Actions.cutSelection('defaultInput', '123456', 0, 3, '456');
    await Actions.cutSelection('defaultInput', '123.456', 2, 5, '1256');
    await Actions.cutSelection('defaultInput', '.123456', 4, 7, '.123');
    await Actions.cutSelection('defaultInput', '-123456', 4, 7, '-123');
    await Actions.cutSelection('defaultInput', '0.000123', 1, 3, '0.000123');
    await Actions.cutSelection('defaultInput', '-0.000123', 2, 4, '-0.000123');
};

export const decimalInputTests = async () => {
    setBlock('DecimalInput component', 1);

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
