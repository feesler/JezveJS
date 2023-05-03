import { setBlock } from 'jezve-test';
import * as Actions from '../actions/DateInput.js';

const typeToEmpty = async () => {
    setBlock('Type to empty input', 1);

    setBlock('en-US locale', 2);
    await Actions.inputToEmpty('usLocaleInput', '1', '1_/__/__');
    await Actions.inputToEmpty('usLocaleInput', '11', '11/__/__');
    await Actions.inputToEmpty('usLocaleInput', '112', '11/2_/__');
    await Actions.inputToEmpty('usLocaleInput', '1122', '11/22/__');
    await Actions.inputToEmpty('usLocaleInput', '11220', '11/22/0_');
    await Actions.inputToEmpty('usLocaleInput', '112203', '11/22/03');

    setBlock('ko-KR locale', 2);
    await Actions.inputToEmpty('koLocaleInput', '0', '0_. __. __');
    await Actions.inputToEmpty('koLocaleInput', '03', '03. __. __');
    await Actions.inputToEmpty('koLocaleInput', '031', '03. 1_. __');
    await Actions.inputToEmpty('koLocaleInput', '0311', '03. 11. __');
    await Actions.inputToEmpty('koLocaleInput', '03112', '03. 11. 2_');
    await Actions.inputToEmpty('koLocaleInput', '031122', '03. 11. 22');

    setBlock('ru-RU locale', 2);
    await Actions.inputToEmpty('ruLocaleInput', '2', '2_.__.____');
    await Actions.inputToEmpty('ruLocaleInput', '22', '22.__.____');
    await Actions.inputToEmpty('ruLocaleInput', '221', '22.1_.____');
    await Actions.inputToEmpty('ruLocaleInput', '2211', '22.11.____');
    await Actions.inputToEmpty('ruLocaleInput', '22113', '22.11.3___');
    await Actions.inputToEmpty('ruLocaleInput', '221133', '22.11.33__');
    await Actions.inputToEmpty('ruLocaleInput', '2211333', '22.11.333_');
    await Actions.inputToEmpty('ruLocaleInput', '22113333', '22.11.3333');

    setBlock('es-ES locale', 2);
    await Actions.inputToEmpty('esLocaleInput', '2', '2_/__/__');
    await Actions.inputToEmpty('esLocaleInput', '22', '22/__/__');
    await Actions.inputToEmpty('esLocaleInput', '221', '22/1_/__');
    await Actions.inputToEmpty('esLocaleInput', '2211', '22/11/__');
    await Actions.inputToEmpty('esLocaleInput', '22113', '22/11/3_');
    await Actions.inputToEmpty('esLocaleInput', '221133', '22/11/33');
};

const typeInvalidToEmpty = async () => {
    setBlock('Type invalid values for current part of date', 1);

    setBlock('en-US locale', 2);
    // Month
    await Actions.inputToEmpty('usLocaleInput', 'x', '');
    await Actions.inputToEmpty('usLocaleInput', '13', '1_/__/__');
    await Actions.inputToEmpty('usLocaleInput', '1x', '1_/__/__');
    await Actions.inputToEmpty('usLocaleInput', '0x', '0_/__/__');
    // Day
    await Actions.inputToEmpty('usLocaleInput', '4x', '04/__/__');
    await Actions.inputToEmpty('usLocaleInput', '438', '04/3_/__');
    await Actions.inputToEmpty('usLocaleInput', '43x', '04/3_/__');
    await Actions.inputToEmpty('usLocaleInput', '40x', '04/0_/__');
    // Year
    await Actions.inputToEmpty('usLocaleInput', '45x', '04/05/__');
    await Actions.inputToEmpty('usLocaleInput', '451x', '04/05/1_');

    setBlock('ko-KR locale', 2);
    // Year
    await Actions.inputToEmpty('koLocaleInput', 'x', '');
    await Actions.inputToEmpty('koLocaleInput', '1x', '1_. __. __');
    // Month
    await Actions.inputToEmpty('koLocaleInput', '33x', '33. __. __');
    await Actions.inputToEmpty('koLocaleInput', '3313', '33. 1_. __');
    await Actions.inputToEmpty('koLocaleInput', '331x', '33. 1_. __');
    await Actions.inputToEmpty('koLocaleInput', '330x', '33. 0_. __');
    // Day
    await Actions.inputToEmpty('koLocaleInput', '334x', '33. 04. __');
    await Actions.inputToEmpty('koLocaleInput', '33438', '33. 04. 3_');
    await Actions.inputToEmpty('koLocaleInput', '3343x', '33. 04. 3_');
    await Actions.inputToEmpty('koLocaleInput', '3340x', '33. 04. 0_');

    setBlock('ru-RU locale', 2);
    // Day
    await Actions.inputToEmpty('ruLocaleInput', 'x', '');
    await Actions.inputToEmpty('ruLocaleInput', '38', '3_.__.____');
    await Actions.inputToEmpty('ruLocaleInput', '3x', '3_.__.____');
    await Actions.inputToEmpty('ruLocaleInput', '0x', '0_.__.____');
    // Month
    await Actions.inputToEmpty('ruLocaleInput', '4x', '04.__.____');
    await Actions.inputToEmpty('ruLocaleInput', '413', '04.1_.____');
    await Actions.inputToEmpty('ruLocaleInput', '41x', '04.1_.____');
    await Actions.inputToEmpty('ruLocaleInput', '40x', '04.0_.____');
    // Year
    await Actions.inputToEmpty('ruLocaleInput', '45x', '04.05.____');
    await Actions.inputToEmpty('ruLocaleInput', '451x', '04.05.1___');

    setBlock('es-ES locale', 2);
    // Day
    await Actions.inputToEmpty('esLocaleInput', 'x', '');
    await Actions.inputToEmpty('esLocaleInput', '38', '3_/__/__');
    await Actions.inputToEmpty('esLocaleInput', '3x', '3_/__/__');
    await Actions.inputToEmpty('esLocaleInput', '0x', '0_/__/__');
    // Month
    await Actions.inputToEmpty('esLocaleInput', '4x', '04/__/__');
    await Actions.inputToEmpty('esLocaleInput', '413', '04/1_/__');
    await Actions.inputToEmpty('esLocaleInput', '41x', '04/1_/__');
    await Actions.inputToEmpty('esLocaleInput', '40x', '04/0_/__');
    // Year
    await Actions.inputToEmpty('esLocaleInput', '45x', '04/05/__');
    await Actions.inputToEmpty('esLocaleInput', '451x', '04/05/1_');
};

const pasteToEmpty = async () => {
    setBlock('Paste text to empty input', 1);

    setBlock('en-US locale', 2);
    await Actions.pasteToEmpty('usLocaleInput', '11', '11/__/__');
    await Actions.pasteToEmpty('usLocaleInput', '1122', '11/22/__');
    await Actions.pasteToEmpty('usLocaleInput', '11220', '11/22/0_');
    await Actions.pasteToEmpty('usLocaleInput', '112203', '11/22/03');
    await Actions.pasteToEmpty('usLocaleInput', '11/22', '11/22/__');
    await Actions.pasteToEmpty('usLocaleInput', '11/22/', '11/22/__');
    await Actions.pasteToEmpty('usLocaleInput', '11/22/03', '11/22/03');
    await Actions.pasteToEmpty('usLocaleInput', '4', '04/__/__');
    await Actions.pasteToEmpty('usLocaleInput', '045', '04/05/__');
    await Actions.pasteToEmpty('usLocaleInput', '04050', '04/05/0_');

    setBlock('ko-KR locale', 2);
    await Actions.pasteToEmpty('koLocaleInput', '03', '03. __. __');
    await Actions.pasteToEmpty('koLocaleInput', '0311', '03. 11. __');
    await Actions.pasteToEmpty('koLocaleInput', '031122', '03. 11. 22');
    await Actions.pasteToEmpty('koLocaleInput', '03. 11', '03. 11. __');
    await Actions.pasteToEmpty('koLocaleInput', '03. 11. ', '03. 11. __');
    await Actions.pasteToEmpty('koLocaleInput', '03. 11. 22', '03. 11. 22');
    await Actions.pasteToEmpty('koLocaleInput', '034', '03. 04. __');
    await Actions.pasteToEmpty('koLocaleInput', '03045', '03. 04. 05');

    setBlock('ru-RU locale', 2);
    await Actions.pasteToEmpty('ruLocaleInput', '22', '22.__.____');
    await Actions.pasteToEmpty('ruLocaleInput', '2211', '22.11.____');
    await Actions.pasteToEmpty('ruLocaleInput', '22113333', '22.11.3333');
    await Actions.pasteToEmpty('ruLocaleInput', '22.11', '22.11.____');
    await Actions.pasteToEmpty('ruLocaleInput', '22.11.', '22.11.____');
    await Actions.pasteToEmpty('ruLocaleInput', '22.11.3333', '22.11.3333');
    await Actions.pasteToEmpty('ruLocaleInput', '4', '04.__.____');
    await Actions.pasteToEmpty('ruLocaleInput', '045', '04.05.____');

    setBlock('es-ES locale', 2);
    await Actions.pasteToEmpty('esLocaleInput', '22', '22/__/__');
    await Actions.pasteToEmpty('esLocaleInput', '2211', '22/11/__');
    await Actions.pasteToEmpty('esLocaleInput', '22110', '22/11/0_');
    await Actions.pasteToEmpty('esLocaleInput', '221103', '22/11/03');
    await Actions.pasteToEmpty('esLocaleInput', '22/11', '22/11/__');
    await Actions.pasteToEmpty('esLocaleInput', '22/11/03', '22/11/03');
    await Actions.pasteToEmpty('esLocaleInput', '4', '04/__/__');
    await Actions.pasteToEmpty('esLocaleInput', '045', '04/05/__');
};

const pasteInvalidToEmpty = async () => {
    setBlock('Paste invalid text to empty input', 1);

    setBlock('en-US locale', 2);
    await Actions.pasteToEmpty('usLocaleInput', 'x', '');
    await Actions.pasteToEmpty('usLocaleInput', '45', '');
    await Actions.pasteToEmpty('usLocaleInput', '04x5', '');
    await Actions.pasteToEmpty('usLocaleInput', '04/05/x', '');

    setBlock('ko-KR locale', 2);
    await Actions.pasteToEmpty('koLocaleInput', 'x', '');
    await Actions.pasteToEmpty('koLocaleInput', '11x', '');
    await Actions.pasteToEmpty('koLocaleInput', '1145', '');
    await Actions.pasteToEmpty('koLocaleInput', '1104x5', '');

    setBlock('ru-RU locale', 2);
    await Actions.pasteToEmpty('ruLocaleInput', 'x', '');
    await Actions.pasteToEmpty('ruLocaleInput', '0x', '');
    await Actions.pasteToEmpty('ruLocaleInput', '04x5', '');
    await Actions.pasteToEmpty('ruLocaleInput', '04.05.x', '');

    setBlock('es-ES locale', 2);
    await Actions.pasteToEmpty('esLocaleInput', 'x', '');
    await Actions.pasteToEmpty('esLocaleInput', '45', '');
    await Actions.pasteToEmpty('esLocaleInput', '04x5', '');
    await Actions.pasteToEmpty('esLocaleInput', '04/05/x', '');
};

const backspaceKey = async () => {
    setBlock('Backspace key', 1);

    setBlock('en-US locale', 2);
    await Actions.backspaceFromPos('usLocaleInput', '11/22/33', 8, '11/22/3_');
    await Actions.backspaceFromPos('usLocaleInput', '11/22/3_', 7, '11/22/__');
    await Actions.backspaceFromPos('usLocaleInput', '11/22/__', 6, '11/2_/__');
    await Actions.backspaceFromPos('usLocaleInput', '11/22/__', 5, '11/2_/__');
    await Actions.backspaceFromPos('usLocaleInput', '11/2_/__', 4, '11/__/__');
    await Actions.backspaceFromPos('usLocaleInput', '11/__/__', 3, '1_/__/__');
    await Actions.backspaceFromPos('usLocaleInput', '11/__/__', 2, '1_/__/__');
    await Actions.backspaceFromPos('usLocaleInput', '1_/__/__', 1, '');
    await Actions.backspaceFromPos('usLocaleInput', '', 0, '');

    await Actions.backspaceFromPos('usLocaleInput', '11/22/33', 4, '11/_2/33');
    await Actions.backspaceFromPos('usLocaleInput', '11/_2/33', 3, '1_/_2/33');
    await Actions.backspaceFromPos('usLocaleInput', '1_/_2/33', 1, '__/_2/33');
    await Actions.backspaceFromPos('usLocaleInput', '__/_2/33', 0, '__/_2/33');

    setBlock('ko-KR locale', 2);
    await Actions.backspaceFromPos('koLocaleInput', '33. 11. 22', 10, '33. 11. 2_');
    await Actions.backspaceFromPos('koLocaleInput', '33. 11. 2_', 9, '33. 11. __');
    await Actions.backspaceFromPos('koLocaleInput', '33. 11. __', 8, '33. 1_. __');
    await Actions.backspaceFromPos('koLocaleInput', '33. 11. __', 6, '33. 1_. __');
    await Actions.backspaceFromPos('koLocaleInput', '33. 1_. __', 5, '33. __. __');
    await Actions.backspaceFromPos('koLocaleInput', '33. __. __', 4, '3_. __. __');
    await Actions.backspaceFromPos('koLocaleInput', '33. __. __', 2, '3_. __. __');
    await Actions.backspaceFromPos('koLocaleInput', '3_. __. __', 1, '');
    await Actions.backspaceFromPos('koLocaleInput', '', 0, '');

    await Actions.backspaceFromPos('koLocaleInput', '33. 11. 22', 5, '33. _1. 22');
    await Actions.backspaceFromPos('koLocaleInput', '33. _1. 22', 4, '3_. _1. 22');
    await Actions.backspaceFromPos('koLocaleInput', '3_. _1. 22', 1, '__. _1. 22');
    await Actions.backspaceFromPos('koLocaleInput', '__. _1. 22', 0, '__. _1. 22');

    setBlock('ru-RU locale', 2);
    await Actions.backspaceFromPos('ruLocaleInput', '22.11.3333', 10, '22.11.333_');
    await Actions.backspaceFromPos('ruLocaleInput', '22.11.333_', 9, '22.11.33__');
    await Actions.backspaceFromPos('ruLocaleInput', '22.11.33__', 8, '22.11.3___');
    await Actions.backspaceFromPos('ruLocaleInput', '22.11.3___', 7, '22.11.____');
    await Actions.backspaceFromPos('ruLocaleInput', '22.11.____', 6, '22.1_.____');
    await Actions.backspaceFromPos('ruLocaleInput', '22.11.____', 5, '22.1_.____');
    await Actions.backspaceFromPos('ruLocaleInput', '22.1_.____', 4, '22.__.____');
    await Actions.backspaceFromPos('ruLocaleInput', '22.__.____', 3, '2_.__.____');
    await Actions.backspaceFromPos('ruLocaleInput', '22.__.____', 2, '2_.__.____');
    await Actions.backspaceFromPos('ruLocaleInput', '2_.__.____', 1, '');
    await Actions.backspaceFromPos('ruLocaleInput', '', 0, '');

    await Actions.backspaceFromPos('ruLocaleInput', '22.11.3333', 4, '22._1.3333');
    await Actions.backspaceFromPos('ruLocaleInput', '22._1.3333', 3, '2_._1.3333');
    await Actions.backspaceFromPos('ruLocaleInput', '2_._1.3333', 1, '__._1.3333');
    await Actions.backspaceFromPos('ruLocaleInput', '__._1.3333', 0, '__._1.3333');

    setBlock('es-ES locale', 2);
    await Actions.backspaceFromPos('esLocaleInput', '22/11/33', 8, '22/11/3_');
    await Actions.backspaceFromPos('esLocaleInput', '22/11/3_', 7, '22/11/__');
    await Actions.backspaceFromPos('esLocaleInput', '22/11/__', 6, '22/1_/__');
    await Actions.backspaceFromPos('esLocaleInput', '22/11/__', 5, '22/1_/__');
    await Actions.backspaceFromPos('esLocaleInput', '22/1_/__', 4, '22/__/__');
    await Actions.backspaceFromPos('esLocaleInput', '22/__/__', 3, '2_/__/__');
    await Actions.backspaceFromPos('esLocaleInput', '22/__/__', 2, '2_/__/__');
    await Actions.backspaceFromPos('esLocaleInput', '2_/__/__', 1, '');

    await Actions.backspaceFromPos('esLocaleInput', '22/11/33', 4, '22/_1/33');
    await Actions.backspaceFromPos('esLocaleInput', '22/_1/33', 3, '2_/_1/33');
    await Actions.backspaceFromPos('esLocaleInput', '2_/_1/33', 1, '__/_1/33');
    await Actions.backspaceFromPos('esLocaleInput', '__/_1/33', 0, '__/_1/33');
};

const deleteKey = async () => {
    setBlock('Delete key', 1);
    setBlock('en-US locale', 2);
    await Actions.deleteFromPos('usLocaleInput', '11/22/33', 6, '11/22/_3');
    await Actions.deleteFromPos('usLocaleInput', '11/22/33', 5, '11/22/_3');
    await Actions.deleteFromPos('usLocaleInput', '11/22/33', 4, '11/2_/33');
    await Actions.deleteFromPos('usLocaleInput', '11/22/33', 0, '_1/22/33');

    setBlock('ko-KR locale', 2);
    await Actions.deleteFromPos('koLocaleInput', '33. 11. 22', 8, '33. 11. _2');
    await Actions.deleteFromPos('koLocaleInput', '33. 11. 22', 6, '33. 11. _2');
    await Actions.deleteFromPos('koLocaleInput', '33. 11. 22', 4, '33. _1. 22');
    await Actions.deleteFromPos('koLocaleInput', '33. 11. 22', 0, '_3. 11. 22');

    setBlock('ru-RU locale', 2);
    await Actions.deleteFromPos('ruLocaleInput', '22.11.3333', 6, '22.11._333');
    await Actions.deleteFromPos('ruLocaleInput', '22.11.3333', 5, '22.11._333');
    await Actions.deleteFromPos('ruLocaleInput', '22.11.3333', 4, '22.1_.3333');
    await Actions.deleteFromPos('ruLocaleInput', '22.11.3333', 0, '_2.11.3333');

    setBlock('es-ES locale', 2);
    await Actions.deleteFromPos('esLocaleInput', '22/11/33', 6, '22/11/_3');
    await Actions.deleteFromPos('esLocaleInput', '22/11/33', 5, '22/11/_3');
    await Actions.deleteFromPos('esLocaleInput', '22/11/33', 4, '22/1_/33');
    await Actions.deleteFromPos('esLocaleInput', '22/11/33', 0, '_2/11/33');
};

const inputFromPos = async () => {
    setBlock('Input text inside value', 1);

    setBlock('en-US locale', 2);
    await Actions.inputFromPos('usLocaleInput', '11/__/33', 3, '2', '11/2_/33');
    await Actions.inputFromPos('usLocaleInput', '11/2_/33', 4, '2', '11/22/33');

    setBlock('ko-KR locale', 2);
    await Actions.inputFromPos('koLocaleInput', '33. __. 22', 4, '1', '33. 1_. 22');
    await Actions.inputFromPos('koLocaleInput', '33. 1_. 22', 5, '1', '33. 11. 22');

    setBlock('ru-RU locale', 2);
    await Actions.inputFromPos('ruLocaleInput', '22.__.3333', 3, '1', '22.1_.3333');
    await Actions.inputFromPos('ruLocaleInput', '22.1_.3333', 4, '1', '22.11.3333');

    setBlock('es-ES locale', 2);
    await Actions.inputFromPos('esLocaleInput', '22/__/33', 3, '1', '22/1_/33');
    await Actions.inputFromPos('esLocaleInput', '22/1_/33', 4, '1', '22/11/33');
};

const inputInvalidFromPos = async () => {
    setBlock('Input invalid text inside value', 1);

    setBlock('en-US locale', 2);
    await Actions.inputFromPos('usLocaleInput', '11/__/33', 3, 'x', '11/__/33');
    await Actions.inputFromPos('usLocaleInput', '1_/22/33', 1, '5', '1_/22/33');

    setBlock('ko-KR locale', 2);
    await Actions.inputFromPos('koLocaleInput', '33. __. 22', 4, 'x', '33. __. 22');
    await Actions.inputFromPos('koLocaleInput', '33. 1_. 22', 5, '5', '33. 1_. 22');

    setBlock('ru-RU locale', 2);
    await Actions.inputFromPos('ruLocaleInput', '22.__.3333', 3, 'x', '22.__.3333');
    await Actions.inputFromPos('ruLocaleInput', '22.1_.3333', 4, '5', '22.1_.3333');

    setBlock('es-ES locale', 2);
    await Actions.inputFromPos('esLocaleInput', '22/__/33', 3, 'x', '22/__/33');
    await Actions.inputFromPos('esLocaleInput', '22/1_/33', 4, '5', '22/1_/33');
};

const inputToSelection = async () => {
    setBlock('Input text into selection', 1);

    setBlock('en-US locale', 2);
    await Actions.inputToSelection('usLocaleInput', '11/22/33', 1, 4, '1', '11/_2/33');
    await Actions.inputToSelection('usLocaleInput', '11/22/33', 0, 7, '2', '02/__/_3');

    setBlock('ko-KR locale', 2);
    await Actions.inputToSelection('koLocaleInput', '33. 11. 22', 5, 9, '1', '33. 11. _2');
    await Actions.inputToSelection('koLocaleInput', '33. 11. 22', 0, 9, '3', '3_. __. _2');

    setBlock('ru-RU locale', 2);
    await Actions.inputToSelection('ruLocaleInput', '22.11.3333', 1, 4, '2', '22._1.3333');
    await Actions.inputToSelection('ruLocaleInput', '22.11.3333', 0, 9, '2', '2_.__.___3');

    setBlock('es-ES locale', 2);
    await Actions.inputToSelection('esLocaleInput', '22/11/33', 1, 4, '2', '22/_1/33');
    await Actions.inputToSelection('esLocaleInput', '22/11/33', 0, 7, '2', '2_/__/_3');
};

const inputInvalidToSelection = async () => {
    setBlock('Input invalid text into selection', 1);

    setBlock('en-US locale', 2);
    await Actions.inputToSelection('usLocaleInput', '11/22/33', 1, 4, 'x', '11/22/33');
    await Actions.inputToSelection('usLocaleInput', '11/22/33', 1, 4, '5', '11/22/33');

    setBlock('ko-KR locale', 2);
    await Actions.inputToSelection('koLocaleInput', '33. 11. 22', 5, 9, 'x', '33. 11. 22');
    await Actions.inputToSelection('koLocaleInput', '33. 11. 22', 5, 9, '5', '33. 11. 22');

    setBlock('ru-RU locale', 2);
    await Actions.inputToSelection('ruLocaleInput', '22.11.3333', 1, 4, 'x', '22.11.3333');
    await Actions.inputToSelection('ruLocaleInput', '22.11.3333', 4, 7, '5', '22.11.3333');

    setBlock('es-ES locale', 2);
    await Actions.inputToSelection('esLocaleInput', '22/11/33', 1, 4, 'x', '22/11/33');
    await Actions.inputToSelection('esLocaleInput', '22/11/33', 4, 7, '5', '22/11/33');
};

const pasteToSelection = async () => {
    setBlock('Paste text into selection', 1);

    setBlock('en-US locale', 2);
    await Actions.pasteToSelection('usLocaleInput', '11/22/33', 1, 4, '1', '11/_2/33');
    await Actions.pasteToSelection('usLocaleInput', '11/22/33', 0, 7, '2', '02/__/_3');

    setBlock('ko-KR locale', 2);
    await Actions.pasteToSelection('koLocaleInput', '33. 11. 22', 5, 9, '1', '33. 11. _2');
    await Actions.pasteToSelection('koLocaleInput', '33. 11. 22', 0, 9, '3', '3_. __. _2');

    setBlock('ru-RU locale', 2);
    await Actions.pasteToSelection('ruLocaleInput', '22.11.3333', 1, 4, '2', '22._1.3333');
    await Actions.pasteToSelection('ruLocaleInput', '22.11.3333', 0, 9, '2', '2_.__.___3');

    setBlock('es-ES locale', 2);
    await Actions.pasteToSelection('esLocaleInput', '22/11/33', 1, 4, '2', '22/_1/33');
    await Actions.pasteToSelection('esLocaleInput', '22/11/33', 0, 7, '2', '2_/__/_3');
};

const pasteInvalidToSelection = async () => {
    setBlock('Paste invalid text into selection', 1);

    setBlock('en-US locale', 2);
    await Actions.pasteToSelection('usLocaleInput', '11/22/33', 1, 4, 'x', '11/22/33');
    await Actions.pasteToSelection('usLocaleInput', '11/22/33', 1, 4, '5', '11/22/33');

    setBlock('ko-KR locale', 2);
    await Actions.pasteToSelection('koLocaleInput', '33. 11. 22', 5, 9, 'x', '33. 11. 22');
    await Actions.pasteToSelection('koLocaleInput', '33. 11. 22', 5, 9, '5', '33. 11. 22');

    setBlock('ru-RU locale', 2);
    await Actions.pasteToSelection('ruLocaleInput', '22.11.3333', 1, 4, 'x', '22.11.3333');
    await Actions.pasteToSelection('ruLocaleInput', '22.11.3333', 4, 7, '5', '22.11.3333');

    setBlock('es-ES locale', 2);
    await Actions.pasteToSelection('esLocaleInput', '22/11/33', 1, 4, 'x', '22/11/33');
    await Actions.pasteToSelection('esLocaleInput', '22/11/33', 4, 7, '5', '22/11/33');
};

const pasteFromPos = async () => {
    setBlock('Paste text inside value', 1);

    setBlock('en-US locale', 2);
    await Actions.pasteFromPos('usLocaleInput', '11/__/33', 3, '2', '11/2_/33');
    await Actions.pasteFromPos('usLocaleInput', '11/2_/33', 4, '2', '11/22/33');

    setBlock('ko-KR locale', 2);
    await Actions.pasteFromPos('koLocaleInput', '33. __. 22', 4, '1', '33. 1_. 22');
    await Actions.pasteFromPos('koLocaleInput', '33. 1_. 22', 5, '1', '33. 11. 22');

    setBlock('ru-RU locale', 2);
    await Actions.pasteFromPos('ruLocaleInput', '22.__.3333', 3, '1', '22.1_.3333');
    await Actions.pasteFromPos('ruLocaleInput', '22.1_.3333', 4, '1', '22.11.3333');

    setBlock('es-ES locale', 2);
    await Actions.pasteFromPos('esLocaleInput', '22/__/33', 3, '1', '22/1_/33');
    await Actions.pasteFromPos('esLocaleInput', '22/1_/33', 4, '1', '22/11/33');
};

const pasteInvalidFromPos = async () => {
    setBlock('Paste invalid text inside value', 1);

    setBlock('en-US locale', 2);
    await Actions.pasteFromPos('usLocaleInput', '11/__/33', 3, 'x', '11/__/33');
    await Actions.pasteFromPos('usLocaleInput', '1_/22/33', 1, '5', '1_/22/33');

    setBlock('ko-KR locale', 2);
    await Actions.pasteFromPos('koLocaleInput', '33. __. 22', 4, 'x', '33. __. 22');
    await Actions.pasteFromPos('koLocaleInput', '33. 1_. 22', 5, '5', '33. 1_. 22');

    setBlock('ru-RU locale', 2);
    await Actions.pasteFromPos('ruLocaleInput', '22.__.3333', 3, 'x', '22.__.3333');
    await Actions.pasteFromPos('ruLocaleInput', '22.1_.3333', 4, '5', '22.1_.3333');

    setBlock('es-ES locale', 2);
    await Actions.pasteFromPos('esLocaleInput', '22/__/33', 3, 'x', '22/__/33');
    await Actions.pasteFromPos('esLocaleInput', '22/1_/33', 4, '5', '22/1_/33');
};

const backspaceSelection = async () => {
    setBlock('Backspace key with selection', 1);

    setBlock('en-US locale', 2);
    await Actions.backspaceSelection('usLocaleInput', '11/22/33', 4, 7, '11/2_/_3');
    await Actions.backspaceSelection('usLocaleInput', '11/22/33', 0, 8, '');

    setBlock('ko-KR locale', 2);
    await Actions.backspaceSelection('koLocaleInput', '33. 11. 22', 5, 9, '33. 1_. _2');
    await Actions.backspaceSelection('koLocaleInput', '33. 11. 22', 0, 10, '');

    setBlock('ru-RU locale', 2);
    await Actions.backspaceSelection('ruLocaleInput', '22.11.3333', 4, 7, '22.1_._333');
    await Actions.backspaceSelection('ruLocaleInput', '22.11.3333', 0, 10, '');

    setBlock('es-ES locale', 2);
    await Actions.backspaceSelection('esLocaleInput', '22/11/33', 4, 7, '22/1_/_3');
    await Actions.backspaceSelection('esLocaleInput', '22/11/33', 0, 8, '');
};

const deleteSelection = async () => {
    setBlock('Delete key with selection', 1);

    setBlock('en-US locale', 2);
    await Actions.deleteSelection('usLocaleInput', '11/22/33', 4, 7, '11/2_/_3');
    await Actions.deleteSelection('usLocaleInput', '11/22/33', 0, 8, '');

    setBlock('ko-KR locale', 2);
    await Actions.deleteSelection('koLocaleInput', '33. 11. 22', 5, 9, '33. 1_. _2');
    await Actions.deleteSelection('koLocaleInput', '33. 11. 22', 0, 10, '');

    setBlock('ru-RU locale', 2);
    await Actions.deleteSelection('ruLocaleInput', '22.11.3333', 4, 7, '22.1_._333');
    await Actions.deleteSelection('ruLocaleInput', '22.11.3333', 0, 10, '');

    setBlock('es-ES locale', 2);
    await Actions.deleteSelection('esLocaleInput', '22/11/33', 4, 7, '22/1_/_3');
    await Actions.deleteSelection('esLocaleInput', '22/11/33', 0, 8, '');
};

const cutSelection = async () => {
    setBlock('Cut selection', 1);

    setBlock('en-US locale', 2);
    await Actions.cutSelection('usLocaleInput', '11/22/33', 4, 7, '11/2_/_3');
    await Actions.cutSelection('usLocaleInput', '11/22/33', 0, 8, '');

    setBlock('ko-KR locale', 2);
    await Actions.cutSelection('koLocaleInput', '33. 11. 22', 5, 9, '33. 1_. _2');
    await Actions.cutSelection('koLocaleInput', '33. 11. 22', 0, 10, '');

    setBlock('ru-RU locale', 2);
    await Actions.cutSelection('ruLocaleInput', '22.11.3333', 4, 7, '22.1_._333');
    await Actions.cutSelection('ruLocaleInput', '22.11.3333', 0, 10, '');

    setBlock('es-ES locale', 2);
    await Actions.cutSelection('esLocaleInput', '22/11/33', 4, 7, '22/1_/_3');
    await Actions.cutSelection('esLocaleInput', '22/11/33', 0, 8, '');
};

export const dateInputTests = async () => {
    setBlock('DateInput component', 1);

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
