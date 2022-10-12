import {
    isFunction,
    setEvents,
    getCursorPos,
    setCursorPos,
    isNum,
    removeEvents,
} from '../../js/common.js';
import '../../css/common.scss';

const DAY_LENGTH = 2;
const MONTH_LENGTH = 2;
const YEAR_LENGTH = 4;

/**
 * Decimal value input
 * @param {Object} props
 */
export class DateInput {
    static create(props) {
        return new DateInput(props);
    }

    constructor(props) {
        this.props = props;
        if (!this.props?.elem) {
            throw new Error('Invalid input element specified');
        }

        this.init();
    }

    init() {
        this.elem = this.props.elem;

        this.guideChar = '_';
        this.formatChars = '.';
        this.maxLength = DAY_LENGTH + MONTH_LENGTH + YEAR_LENGTH + (this.formatChars.length * 2);

        this.formatMask = ['dd', 'mm', 'yyyy'].join(this.formatChars);

        this.dayRange = this.getGroupRange('d');
        this.monthRange = this.getGroupRange('m');
        this.yearRange = this.getGroupRange('y');

        this.state = {
            day: '__',
            month: '__',
            year: '____',
        };

        this.beforeInputHandler = (e) => this.validateInput(e);
        this.eventHandlers = {
            keypress: this.beforeInputHandler,
            paste: this.beforeInputHandler,
            beforeinput: this.beforeInputHandler,
        };

        this.elem.inputMode = 'decimal';
        this.elem.placeholder = this.formatMask;

        if (isFunction(this.props.oninput)) {
            this.eventHandlers.input = (e) => this.handleInput(e);
        }

        setEvents(this.elem, this.eventHandlers);
        this.render(this.state);
    }

    /** Component destructor: free resources */
    destroy() {
        if (this.eventHandlers) {
            removeEvents(this.elem, this.eventHandlers);
            this.eventHandlers = null;
        }
        this.beforeInputHandler = null;
    }

    get value() {
        return (this.elem) ? this.elem.value : null;
    }

    set value(val) {
        if (this.elem) {
            this.elem.value = val;
        }
    }

    /** Returns range of specified group('d', 'm' or 'y') for current format */
    getGroupRange(group) {
        const res = {
            start: this.formatMask.indexOf(group),
        };
        res.end = this.formatMask.indexOf(this.formatChars, res.start + 1);
        if (res.end === -1) {
            res.end = this.maxLength;
        }
        return res;
    }

    /**
     * Replace current selection by specified string or insert it to cursor position
     * @param {string} text - string to insert
     */
    replaceSelection(text) {
        const range = getCursorPos(this.elem);
        const selRangeLength = Math.abs(range.end - range.start);

        const origValue = (this.elem.value.length > 0)
            ? this.elem.value
            : this.formatDateString(this.state);

        const beforeSelection = origValue.substr(0, range.start);
        const afterSelection = origValue.substr(range.end);
        let selection = origValue.substr(range.start);
        let textValue = this.removeMaskChars(text);

        this.cursorPos = beforeSelection.length;

        // Replace leading guide characters after selection with remain text
        let textCharsRemain = textValue.length - selRangeLength;
        let after = this.removeMaskChars(afterSelection);
        while (textCharsRemain > 0 && after.substr(0, 1) === this.guideChar) {
            after = after.substr(1);
            textCharsRemain -= 1;
        }
        if (textCharsRemain > 0) {
            return origValue;
        }

        let value = this.removeMaskChars(text + after);
        let res = beforeSelection;
        while (selection.length > 0) {
            const maskChar = selection.charAt(0);
            selection = selection.substring(1);

            if (this.formatChars.includes(maskChar)) {
                res += maskChar;
                if (textValue.length > 0) {
                    this.cursorPos += 1;
                }

                continue;
            }

            if (value.length > 0) {
                const char = value.charAt(0);
                value = value.substring(1);

                res += char;
                if (textValue.length > 0) {
                    this.cursorPos += 1;
                    textValue = textValue.substring(1);
                }
            } else {
                res += this.guideChar;
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
        this.cursorPos = beforeSelection.length;
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

        this.cursorPos = beforeSelection.length;

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
        this.cursorPos = beforeSelection.length;
        let res = beforeSelection;

        afterSelection = this.removeMaskChars(afterSelection);
        // Remove first character from part after selection
        if (afterSelection.length > 0) {
            afterSelection = this.guideChar + afterSelection.substr(1);
        }

        while (selection.length) {
            const maskChar = selection.charAt(0);
            selection = selection.substr(1);

            if (this.formatChars.includes(maskChar)) {
                res += maskChar;

                if (this.cursorPos === res.length) {
                    this.cursorPos += 1;
                }
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
        if (monthStr.length > 0 && (!isNum(monthStr) || !(monthVal >= 0 && monthVal <= 12))) {
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

        // input day
        if (expectedDay !== this.state.day) {
            const firstChar = expectedDay.substring(0, 1);
            if (
                firstChar !== this.guideChar
                && firstChar !== '0'
                && dayVal < 10
                && dayVal * 10 > 31
            ) {
                expectedDay = `0${dayVal}`;
                this.cursorPos += 1;
            }
            // Move cursor beyond the groups separator
            if (
                this.cursorPos === this.dayRange.end
                && this.cursorPos < this.maxLength
            ) {
                this.cursorPos += 1;
            }
        }
        // input month
        if (expectedMonth !== this.state.month) {
            const firstChar = expectedMonth.substring(0, 1);
            if (
                firstChar !== this.guideChar
                && firstChar !== '0'
                && monthVal < 10
                && monthVal * 10 > 12
            ) {
                expectedMonth = `0${monthVal}`;
                this.cursorPos += 1;
            }
            // Move cursor beyond the groups separator
            if (
                this.cursorPos === this.monthRange.end
                && this.cursorPos < this.maxLength
            ) {
                this.cursorPos += 1;
            }
        }
        // input year
        if (expectedYear !== this.state.year) {
            // Move cursor beyond the groups separator
            if (
                this.cursorPos === this.yearRange.end
                && this.cursorPos < this.maxLength
            ) {
                this.cursorPos += 1;
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
        if (isFunction(this.props.oninput)) {
            this.props.oninput(e);
        }
    }

    formatDateString({ day, month, year }) {
        const groups = [
            [day, this.dayRange.start],
            [month, this.monthRange.start],
            [year, this.yearRange.start],
        ].sort((a, b) => a[1] - b[1]);

        return groups.map((group) => group[0]).join(this.formatChars);
    }

    /** Render component */
    render(state) {
        if (state.day === '__' && state.month === '__' && state.year === '____') {
            this.elem.value = '';
        } else {
            this.elem.value = this.formatDateString(state);
        }

        setCursorPos(this.elem, this.cursorPos);
    }
}
