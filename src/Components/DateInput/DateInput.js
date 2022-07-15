import {
    isFunction,
    getCursorPos,
    setCursorPos,
    isNum,
} from '../../js/index.js';
import '../../css/common.css';

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
        this.elem.addEventListener('keypress', this.beforeInputHandler);
        this.elem.addEventListener('paste', this.beforeInputHandler);
        this.elem.addEventListener('beforeinput', this.beforeInputHandler);

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
        if (e.type === 'keypress') {
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
        let res;

        const inputContent = this.getInputContent(e);
        if (!inputContent || inputContent.length === 0) {
            if (e.type !== 'beforeinput') {
                return;
            }

            if (!['deleteContentBackward', 'deleteContentForward'].includes(e.inputType)) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (e.inputType === 'deleteContentBackward') {
                expectedContent = this.backspaceHandler();
            } else if (e.inputType === 'deleteContentForward') {
                expectedContent = this.deleteHandler();
            }
        } else {
            expectedContent = this.replaceSelection(inputContent);
        }

        const expectedParts = expectedContent.split('.');
        if (expectedParts.length !== 3) {
            res = false;
        } else {
            const dayVal = expectedParts[0].replaceAll(/_/g, '');
            const monthVal = expectedParts[1].replaceAll(/_/g, '');
            const yearVal = expectedParts[2].replaceAll(/_/g, '');

            res = ((isNum(dayVal) && dayVal > 0 && dayVal <= 31) || !dayVal.length)
                && ((isNum(monthVal) && monthVal > 0 && monthVal <= 12) || !monthVal.length)
                && (isNum(yearVal) || !yearVal.length);

            if (res) {
                this.state = {
                    day: expectedParts[0],
                    month: expectedParts[1],
                    year: expectedParts[2],
                };
                this.render(this.state);
                setCursorPos(this.elem, this.expectedCursorPos);
            }
        }

        e.preventDefault();
        e.stopPropagation();
    }

    /** 'input' event handler */
    handleInput(e) {
        if (isFunction(this.oninput)) {
            this.oninput(e);
        }
    }

    /** Render component */
    render(state) {
        this.elem.value = `${state.day}.${state.month}.${state.year}`;
    }

    /** Static alias for DateInput constructor */
    static create(props) {
        if (!props || !props.elem) {
            return null;
        }

        return new DateInput(props);
    }
}
