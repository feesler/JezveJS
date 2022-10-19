import {
    isFunction,
    setEvents,
    getCursorPos,
    setCursorPos,
    isNum,
    removeEvents,
} from '../../js/common.js';
import '../../css/common.scss';

const DEFAULT_SEPARATOR = '.';
const defaultProps = {
    guideChar: '_',
    locales: [],
    name: null,
    form: null,
};

/**
 * Decimal value input
 * @param {Object} props
 */
export class DateInput {
    static create(props) {
        return new DateInput(props);
    }

    constructor(props = {}) {
        this.props = {
            ...defaultProps,
            ...props,
        };

        if (!this.props?.elem) {
            throw new Error('Invalid input element specified');
        }

        this.init();
    }

    init() {
        this.elem = this.props.elem;
        this.getDateFormat();

        const { dayRange, monthRange, yearRange } = this;
        this.maxLength = (
            dayRange.length + monthRange.length + yearRange.length + (this.separator.length * 2)
        );

        this.emptyState = {
            day: ''.padStart(dayRange.length, this.props.guideChar),
            month: ''.padStart(monthRange.length, this.props.guideChar),
            year: ''.padStart(yearRange.length, this.props.guideChar),
        };
        this.emptyStateValue = this.formatDateString(this.emptyState);

        this.state = {
            ...this.emptyState,
        };

        this.elem.inputMode = 'decimal';
        this.elem.placeholder = this.props.placeholder ?? this.formatMask;
        if (typeof this.props.name === 'string') {
            this.input.name = this.props.name;
        }
        if (typeof this.props.form === 'string') {
            this.input.form = this.props.form;
        }

        this.beforeInputHandler = (e) => this.validateInput(e);
        this.eventHandlers = {
            keypress: this.beforeInputHandler,
            paste: this.beforeInputHandler,
            beforeinput: this.beforeInputHandler,
        };
        if (isFunction(this.props.oninput)) {
            this.eventHandlers.input = (e) => this.handleInput(e);
        }
        setEvents(this.elem, this.eventHandlers);
        this.observeInputValue();

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

    /** Define setter for 'value' property of input to prevent invalid values */
    observeInputValue() {
        const self = this;
        const elementPrototype = Object.getPrototypeOf(this.elem);
        const descriptor = Object.getOwnPropertyDescriptor(elementPrototype, 'value');

        Object.defineProperty(this.elem, 'value', {
            get() {
                return descriptor.get.call(this);
            },
            set(value) {
                if (value === this.value) {
                    return;
                }

                const content = self.replaceSelection(value, true);
                const state = self.handleExpectedContent(content);
                if (state !== self.state) {
                    const fixedValue = self.renderValue(state);
                    descriptor.set.call(this, fixedValue);
                    self.state = state;
                }
            },
        });
    }

    getDateFormat() {
        const formatter = Intl.DateTimeFormat(this.props.locales);
        const parts = formatter.formatToParts();

        this.separator = null;
        let currentPos = 0;
        let order = 0;
        parts.forEach(({ type, value }) => {
            if (type === 'day') {
                this.dayRange = { start: currentPos, length: 2, order };
                this.dayRange.end = this.dayRange.start + this.dayRange.length;
                currentPos += this.dayRange.length;
                order += 1;
            }
            if (type === 'month') {
                this.monthRange = { start: currentPos, length: 2, order };
                this.monthRange.end = this.monthRange.start + this.monthRange.length;
                currentPos += this.monthRange.length;
                order += 1;
            }
            if (type === 'year') {
                this.yearRange = { start: currentPos, length: value.length, order };
                this.yearRange.end = this.yearRange.start + this.yearRange.length;
                currentPos += this.yearRange.length;
                order += 1;
            }
            if (type === 'literal') {
                if (!this.separator) {
                    this.separator = value;
                }
                currentPos += value.length;
            }
        });

        if (!this.separator) {
            this.separator = DEFAULT_SEPARATOR;
        }

        const yearLength = this.yearRange.end - this.yearRange.start;
        this.formatMask = this.formatDateString({
            day: 'dd',
            month: 'mm',
            year: ''.padStart(yearLength, 'y'),
        });
    }

    formatDateString({ day, month, year }) {
        const groups = [
            [day, this.dayRange.start],
            [month, this.monthRange.start],
            [year, this.yearRange.start],
        ].sort((a, b) => a[1] - b[1]);

        return groups.map((group) => group[0]).join(this.separator);
    }

    /** Returns range of specified group('d', 'm' or 'y') for current format */
    getGroupRange(group) {
        const res = {
            start: this.formatMask.indexOf(group),
        };
        res.end = this.formatMask.indexOf(this.separator, res.start + 1);
        if (res.end === -1) {
            res.end = this.maxLength;
        }
        return res;
    }

    /**
     * Replace current selection by specified string or insert it to cursor position
     * @param {string} text - string to insert
     */
    replaceSelection(text, replaceAll = false) {
        const origValue = (this.elem.value.length > 0)
            ? this.elem.value
            : this.formatDateString(this.state);

        const range = (replaceAll)
            ? { start: 0, end: origValue.length }
            : getCursorPos(this.elem);
        const selRangeLength = Math.abs(range.end - range.start);

        const beforeSelection = origValue.substr(0, range.start);
        const afterSelection = origValue.substr(range.end);
        let selection = origValue.substr(range.start);

        let fixedText = text;
        if (replaceAll) {
            if (text.length === 0) {
                return text;
            }

            const expectedParts = text.split(this.separator);
            if (expectedParts.length !== 3) {
                return origValue;
            }

            let day = expectedParts[this.dayRange.order];
            let month = expectedParts[this.monthRange.order];
            const year = expectedParts[this.yearRange.order];

            if (day.length === 1) {
                day = `0${day}`;
            }
            if (month.length === 1) {
                month = `0${month}`;
            }

            fixedText = this.formatDateString({ day, month, year });
        }

        let textValue = this.removeMaskChars(fixedText);

        if (!replaceAll) {
            this.cursorPos = beforeSelection.length;
        }

        // Replace leading guide characters after selection with remain text
        let textCharsRemain = fixedText.length - selRangeLength;
        let after = this.removeMaskChars(afterSelection);
        while (textCharsRemain > 0 && after.substr(0, 1) === this.props.guideChar) {
            after = after.substr(1);
            textCharsRemain -= 1;
        }
        if (textCharsRemain > 0) {
            return origValue;
        }

        let value = this.removeMaskChars(fixedText + after);
        let res = beforeSelection;
        while (selection.length > 0) {
            const maskChar = selection.charAt(0);
            selection = selection.substring(1);

            if (this.separator.includes(maskChar)) {
                res += maskChar;
                if (!replaceAll && textValue.length > 0) {
                    this.cursorPos += 1;
                }

                continue;
            }

            if (value.length > 0) {
                const char = value.charAt(0);
                value = value.substring(1);

                res += char;
                if (textValue.length > 0) {
                    if (!replaceAll) {
                        this.cursorPos += 1;
                    }
                    textValue = textValue.substring(1);
                }
            } else {
                res += this.props.guideChar;
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
            if (this.separator.includes(maskChar)) {
                res += maskChar;
            } else {
                do {
                    char = afterSelection.charAt(0);
                    afterSelection = afterSelection.substr(1);
                } while (this.separator.includes(char) && afterSelection.length > 0);

                if (this.separator.includes(char) && !afterSelection.length) {
                    char = this.props.guideChar;
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
            if (this.separator.includes(char)) {
                afterSelection = char + afterSelection;
            } else {
                afterSelection = this.props.guideChar + afterSelection;
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
        const escaped = this.escapeRegExp(this.separator);
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
            afterSelection = this.props.guideChar + afterSelection.substr(1);
        }

        while (selection.length) {
            const maskChar = selection.charAt(0);
            selection = selection.substr(1);

            if (this.separator.includes(maskChar)) {
                res += maskChar;

                if (this.cursorPos === res.length) {
                    this.cursorPos += 1;
                }
            } else {
                if (afterSelection.length > 0) {
                    char = afterSelection.charAt(0);
                    afterSelection = afterSelection.substr(1);
                } else {
                    char = this.props.guideChar;
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

        const state = this.handleExpectedContent(expectedContent);
        if (state !== this.state) {
            this.state = state;
            this.render(this.state);
        }
    }

    handleExpectedContent(content) {
        if (content === '' || content === this.emptyStateValue) {
            return {
                ...this.state,
                ...this.emptyState,
            };
        }

        const expectedParts = content.split(this.separator);
        if (expectedParts.length !== 3) {
            return this.state;
        }

        let expectedDay = expectedParts[this.dayRange.order];
        let expectedMonth = expectedParts[this.monthRange.order];
        const expectedYear = expectedParts[this.yearRange.order];

        const search = new RegExp(`${this.props.guideChar}`, 'g');
        const dayStr = expectedDay.replaceAll(search, '');
        const monthStr = expectedMonth.replaceAll(search, '');
        const yearStr = expectedYear.replaceAll(search, '');

        const dayVal = parseInt(dayStr, 10);
        const monthVal = parseInt(monthStr, 10);
        const yearVal = parseInt(yearStr, 10);

        if (dayStr.length > 0 && (!isNum(dayStr) || !(dayVal >= 0 && dayVal <= 31))) {
            return this.state;
        }
        if (dayStr.length === 2 && dayVal === 0) {
            return this.state;
        }
        if (monthStr.length > 0 && (!isNum(monthStr) || !(monthVal >= 0 && monthVal <= 12))) {
            return this.state;
        }
        if (monthStr.length === 2 && monthVal === 0) {
            return this.state;
        }
        if (yearStr.length > 0 && !isNum(yearVal)) {
            return this.state;
        }

        // input day
        if (expectedDay !== this.state.day) {
            const firstChar = expectedDay.substring(0, 1);
            if (
                firstChar !== this.props.guideChar
                && firstChar !== '0'
                && dayVal < 10
                && dayVal * 10 > 31
            ) {
                expectedDay = `0${dayVal}`;
                this.cursorPos += 1;
            }
            this.moveCursor('dayRange');
        }
        // input month
        if (expectedMonth !== this.state.month) {
            const firstChar = expectedMonth.substring(0, 1);
            if (
                firstChar !== this.props.guideChar
                && firstChar !== '0'
                && monthVal < 10
                && monthVal * 10 > 12
            ) {
                expectedMonth = `0${monthVal}`;
                this.cursorPos += 1;
            }
            this.moveCursor('monthRange');
        }
        // input year
        if (expectedYear !== this.state.year) {
            this.moveCursor('yearRange');
        }

        return {
            ...this.state,
            day: expectedDay,
            month: expectedMonth,
            year: expectedYear,
        };
    }

    /** Move cursor beyond the groups separator */
    moveCursor(group) {
        if (
            this.cursorPos === this[group].end
            && this.cursorPos < this.maxLength
        ) {
            this.cursorPos += this.separator.length;
        }
    }

    /** 'input' event handler */
    handleInput(e) {
        if (isFunction(this.props.oninput)) {
            this.props.oninput(e);
        }
    }

    isEmptyState(state) {
        return (
            state.day === this.emptyState.day
            && state.month === this.emptyState.month
            && state.year === this.emptyState.year
        );
    }

    renderValue(state) {
        return this.isEmptyState(state) ? '' : this.formatDateString(state);
    }

    /** Render component */
    render(state) {
        this.elem.value = this.renderValue(state);

        setCursorPos(this.elem, this.cursorPos);
    }
}
