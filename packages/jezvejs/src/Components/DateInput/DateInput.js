import {
    isFunction,
    getCursorPos,
    setCursorPos,
    selectText,
    isNum,
} from '../../js/common.js';
import '../../css/common.scss';

/**
 * Decimal value input
 * @param {Object} props
 */
export class DateInput {
    constructor(props) {
        this.props = props;

        if (!props.elem) {
            throw new Error('Invalid input element specified');
        }

        this.elem = props.elem;

        this.guideChar = '_';
        this.formatChars = '.';

        this.state = {
            day: '__',
            month: '__',
            year: '____',
        };

        this.beforeInputHandler = this.validateInput.bind(this);
        this.focusHandler = (e) => this.onFocus(e);
        this.elem.addEventListener('keypress', this.beforeInputHandler);
        this.elem.addEventListener('paste', this.beforeInputHandler);
        this.elem.addEventListener('beforeinput', this.beforeInputHandler);
        this.elem.addEventListener('focus', this.focusHandler);

        this.elem.inputMode = 'decimal';

        if (isFunction(props.oninput)) {
            this.inputHandler = this.handleInput.bind(this);
            this.oninput = props.oninput;
            this.elem.addEventListener('input', this.inputHandler);
        }

        this.render(this.state);
    }

    /** Component destructor: free resources */
    destroy() {
        if (this.beforeInputHandler) {
            this.elem.removeEventListener('keypress', this.beforeInputHandler);
            this.elem.removeEventListener('paste', this.beforeInputHandler);
            this.elem.removeEventListener('beforeinput', this.beforeInputHandler);
            this.beforeInputHandler = null;
        }

        if (this.inputHandler) {
            this.elem.removeEventListener('input', this.inputHandler);
            this.inputHandler = null;
        }
    }

    get value() {
        return (this.elem) ? this.elem.value : null;
    }

    set value(val) {
        if (this.elem) {
            this.elem.value = val;
        }
    }

    /**
     * Replace current selection by specified string or insert it to cursor position
     * @param {string} text - string to insert
     */
    replaceSelection(text) {
        const range = getCursorPos(this.elem);

        const origValue = this.elem.value;
        const beforeSelection = origValue.substr(0, range.start);
        const afterSelection = origValue.substr(range.end);
        let selection = origValue.substr(range.start);
        let textValue = this.removeMaskChars(text);
        let value = this.removeMaskChars(text + afterSelection);
        let res = beforeSelection;
        let char;

        this.expectedCursorPos = beforeSelection.length;

        while (selection.length > 0) {
            const maskChar = selection.charAt(0);
            selection = selection.substr(1);

            if (this.formatChars.includes(maskChar)) {
                res += maskChar;

                if (textValue.length > 0) {
                    this.expectedCursorPos += 1;
                }
            } else {
                if (value.length > 0) {
                    char = value.charAt(0);
                    value = value.substr(1);
                    if (textValue.length > 0) {
                        this.expectedCursorPos += 1;
                        textValue = textValue.substr(1);
                    }
                } else {
                    char = this.guideChar;
                }
                res += char;
            }
        }

        return res;
    }

    /** Obtain from event input data to be inserted */
    getInputContent(e) {
        if (e.type === 'paste') {
            return (e.clipboardData || window.clipboardData).getData('text');
        }
        if (e.type === 'beforeinput') {
            return e.data;
        }
        if (e.type === 'keypress' && e.keyCode !== 13) {
            return e.key;
        }

        return null;
    }

    deleteSelection() {
        const range = getCursorPos(this.elem);
        const origValue = this.elem.value;
        const beforeSelection = origValue.substr(0, range.start);
        let afterSelection = origValue.substr(range.end);
        let char;
        let maskChar;

        let selection = origValue.substr(range.start);
        let res = beforeSelection;
        this.expectedCursorPos = beforeSelection.length;
        while (selection.length) {
            maskChar = selection.charAt(0);
            selection = selection.substr(1);
            if (this.formatChars.includes(maskChar)) {
                res += maskChar;
            } else {
                do {
                    char = afterSelection.charAt(0);
                    afterSelection = afterSelection.substr(1);
                } while (this.formatChars.includes(char) && afterSelection.length > 0);

                if (this.formatChars.includes(char) && !afterSelection.length) {
                    char = this.guideChar;
                }
                res += char;
            }
        }

        return res;
    }

    /** Backspace key handler */
    backspaceHandler() {
        const range = getCursorPos(this.elem);
        let char;

        if (range.start !== range.end) {
            return this.deleteSelection();
        }

        const origValue = this.elem.value;
        let beforeSelection = origValue.substr(0, range.start);
        let afterSelection = origValue.substr(range.end);

        do {
            char = beforeSelection.charAt(beforeSelection.length - 1);
            beforeSelection = beforeSelection.substr(0, beforeSelection.length - 1);
            if (this.formatChars.includes(char)) {
                afterSelection = char + afterSelection;
            } else {
                afterSelection = this.guideChar + afterSelection;
                break;
            }
        } while (beforeSelection.length);

        this.expectedCursorPos = beforeSelection.length;

        const res = beforeSelection + afterSelection;

        return res;
    }

    escapeRegExp(str) {
        return str.replaceAll(/\./g, '\\.');
    }

    removeMaskChars(str) {
        const escaped = this.escapeRegExp(this.formatChars);
        const expr = new RegExp(escaped, 'g');

        return str.replaceAll(expr, '');
    }

    /** Delete key handler */
    deleteHandler() {
        const range = getCursorPos(this.elem);
        let char;

        if (range.start !== range.end) {
            return this.deleteSelection();
        }

        const origValue = this.elem.value;
        const beforeSelection = origValue.substr(0, range.start);
        let afterSelection = origValue.substr(range.end);
        let selection = origValue.substr(range.start);
        this.expectedCursorPos = beforeSelection.length;
        let res = beforeSelection;

        afterSelection = this.removeMaskChars(afterSelection);
        // Remove first character from part after selection
        if (afterSelection.length > 0) {
            afterSelection = afterSelection.substr(1);
        }

        while (selection.length) {
            const maskChar = selection.charAt(0);
            selection = selection.substr(1);

            if (this.formatChars.includes(maskChar)) {
                res += maskChar;
            } else {
                if (afterSelection.length > 0) {
                    char = afterSelection.charAt(0);
                    afterSelection = afterSelection.substr(1);
                } else {
                    char = this.guideChar;
                }
                res += char;
            }
        }

        return res;
    }

    /** Before input events('keypress', 'paste', 'beforeinput) handler */
    validateInput(e) {
        let expectedContent;

        const inputContent = this.getInputContent(e);
        if (!inputContent || inputContent.length === 0) {
            if (e.type !== 'beforeinput') {
                return;
            }

            if (!['deleteContentBackward', 'deleteContentForward'].includes(e.inputType)) {
                return;
            }

            if (e.inputType === 'deleteContentBackward') {
                expectedContent = this.backspaceHandler();
            } else if (e.inputType === 'deleteContentForward') {
                expectedContent = this.deleteHandler();
            }
        } else {
            expectedContent = this.replaceSelection(inputContent);
        }

        e.preventDefault();
        e.stopPropagation();

        const expectedParts = expectedContent.split(this.formatChars);
        if (expectedParts.length !== 3) {
            return;
        }

        const search = new RegExp(`${this.guideChar}`, 'g');
        const dayStr = expectedParts[0].replaceAll(search, '');
        const monthStr = expectedParts[1].replaceAll(search, '');
        const yearStr = expectedParts[2].replaceAll(search, '');

        const dayVal = parseInt(dayStr, 10);
        const monthVal = parseInt(monthStr, 10);
        const yearVal = parseInt(yearStr, 10);

        if (dayStr.length > 0 && (!isNum(dayStr) || !(dayVal >= 0 && dayVal <= 31))) {
            return;
        }
        if (dayStr.length === 2 && dayVal === 0) {
            return;
        }
        if (monthStr.length > 0 && (!isNum(monthStr) || !(monthVal >= 0 && dayVal <= 31))) {
            return;
        }
        if (monthStr.length === 2 && monthVal === 0) {
            return;
        }
        if (yearStr.length > 0 && !isNum(yearVal)) {
            return;
        }

        let [expectedDay, expectedMonth] = expectedParts;
        const [, , expectedYear] = expectedParts;

        delete this.state.selectNext;

        // input day
        if (expectedDay !== this.state.day) {
            if (dayVal < 10 && dayVal * 10 > 31) {
                expectedDay = `0${dayVal}`;
                this.state.selectNext = 1;
            }
        }
        // input month
        if (expectedMonth !== this.state.month) {
            if (monthVal < 10 && monthVal * 10 > 12) {
                expectedMonth = `0${monthVal}`;
                this.state.selectNext = 2;
            }
        }

        this.state = {
            ...this.state,
            day: expectedDay,
            month: expectedMonth,
            year: expectedYear,
        };
        this.render(this.state);
    }

    /** 'input' event handler */
    handleInput(e) {
        if (isFunction(this.oninput)) {
            this.oninput(e);
        }
    }

    selectDatePart(index) {
        const ind = parseInt(index, 10);
        if (Number.isNaN(ind) || ind < 0 || ind > 2) {
            return;
        }

        if (ind === 0) {
            selectText(this.elem, 0, 2);
        } else if (ind === 1) {
            selectText(this.elem, 3, 5);
        } else if (ind === 2) {
            selectText(this.elem, 6, 10);
        }
    }

    onFocus() {
        this.selectDatePart(0);
    }

    /** Render component */
    render(state) {
        this.elem.value = `${state.day}.${state.month}.${state.year}`;

        if (state.selectNext) {
            this.selectDatePart(state.selectNext);
        } else {
            setCursorPos(this.elem, this.expectedCursorPos);
        }
    }

    /** Static alias for DateInput constructor */
    static create(props) {
        if (!props || !props.elem) {
            return null;
        }

        return new DateInput(props);
    }
}
