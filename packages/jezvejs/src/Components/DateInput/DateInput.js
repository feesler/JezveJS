import { isNumber } from '@jezvejs/types';
import {
    getCursorPos,
    setCursorPos,
} from '@jezvejs/dom';
import { ControlledInput } from '../ControlledInput/ControlledInput.js';

const DEFAULT_SEPARATOR = '.';

const dateParts = ['day', 'month', 'year'];

const defaultProps = {
    guideChar: '_',
    locales: [],
};

/**
 * Date input component
 */
export class DateInput extends ControlledInput {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            inputMode: 'decimal',
        });
    }

    init() {
        this.getDateFormat();
        this.props.placeholder = this.props.placeholder ?? this.formatMask;

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

        this.state = this.handleExpectedContent(this.props.value);

        super.init();

        // Remove focus after getCursorPos() calls
        this.elem.blur();
    }

    dispatchInputEvent() {
        const event = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
        });

        this.elem.dispatchEvent(event);
    }

    handleValue(value) {
        if (this.skipValidation) {
            return value;
        }

        const content = this.replaceSelection(value, true);
        this.state = this.handleExpectedContent(content);

        return this.renderValue(this.state);
    }

    getDateFormat() {
        const formatter = Intl.DateTimeFormat(this.props.locales, { dateStyle: 'short' });
        const parts = formatter.formatToParts();

        this.separator = null;
        this.formatParts = [];
        let currentPos = 0;
        let order = 0;
        parts.forEach(({ type, value }) => {
            const part = {
                type,
                start: currentPos,
                length: (type === 'day' || type === 'month') ? 2 : value.length,
            };
            part.end = part.start + part.length;
            currentPos += part.length;

            if (type === 'day') {
                this.dayRange = { ...part, order };
                order += 1;
            }
            if (type === 'month') {
                this.monthRange = { ...part, order };
                order += 1;
            }
            if (type === 'year') {
                this.yearRange = { ...part, order };
                order += 1;
            }
            if (type === 'literal') {
                if (!this.separator) {
                    this.separator = value;
                }
                part.value = value;
            }

            this.formatParts.push(part);
        });

        if (!this.separator) {
            this.separator = DEFAULT_SEPARATOR;
        }

        this.formatMask = this.formatDateString({
            day: 'dd',
            month: 'mm',
            year: ''.padStart(this.yearRange.length, 'y'),
        });
    }

    formatDatePart(part, state) {
        if (part.type === 'literal') {
            return part.value;
        }

        return (dateParts.includes(part.type))
            ? state[part.type]
            : '';
    }

    formatDateString(state) {
        return this.formatParts.map((part) => (
            this.formatDatePart(part, state)
        )).join('');
    }

    /**
     * Returns true if specified position is in range
     * @param {Number} position - position to check
     * @param {object} range - range object
     */
    inRange(position, range) {
        return (position >= range.start && position <= range.end);
    }

    /**
     * Returns true if specified position is in day range
     * @param {Number} position - position to check
     */
    inDayRange(position) {
        return this.inRange(position, this.dayRange);
    }

    /**
     * Returns true if specified position is in month range
     * @param {Number} position - position to check
     */
    inMonthRange(position) {
        return this.inRange(position, this.monthRange);
    }

    /**
     * Returns true if specified position is in year range
     * @param {Number} position - position to check
     */
    inYearRange(position) {
        return this.inRange(position, this.yearRange);
    }

    /**
     * Returns type of range for specified position
     * @param {Number} position - position to check
     */
    getRangeTypeByPosition(position) {
        if (this.inDayRange(position)) {
            return 'day';
        }
        if (this.inMonthRange(position)) {
            return 'month';
        }
        if (this.inYearRange(position)) {
            return 'year';
        }

        return null;
    }

    /**
     * Returns string value for specified range
     *
     * @param {string} content - content string
     * @param {object} range - range object
     * @returns {string}
     */
    getContentRange(content, range) {
        if (typeof content !== 'string') {
            throw new Error('Invalid content');
        }
        if (!range) {
            throw new Error('Invalid range');
        }

        return content.substring(range.start, range.end);
    }

    fixCursorPos(pos) {
        if (this.getRangeTypeByPosition(pos)) {
            return pos;
        }

        const [validPos] = [this.dayRange, this.monthRange, this.yearRange]
            .flatMap((range) => ([range.start, range.end]))
            .map((value) => ({ value, diff: Math.abs(value - pos) }))
            .sort((a, b) => a.diff - b.diff);

        return validPos.value;
    }

    /**
     * Replace current selection by specified string or insert it to cursor position
     * @param {string} text - string to insert
     */
    replaceSelection(text, replaceAll = false) {
        if (replaceAll && text.length === 0) {
            return text;
        }

        const origValue = (this.value.length > 0)
            ? this.value
            : this.formatDateString(this.state);

        const range = (replaceAll)
            ? { start: 0, end: origValue.length }
            : getCursorPos(this.elem);

        range.start = this.fixCursorPos(range.start);
        range.end = this.fixCursorPos(range.end);

        const beforeSelection = origValue.substring(0, range.start);
        const afterSelection = origValue.substring(range.end);
        const selection = origValue.substring(range.start, range.end);

        // Fix length of day and month values: prepend leading zero
        let fixedText = text;
        if (replaceAll) {
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

        let textValue = this.removeSeparators(fixedText);
        if (!replaceAll) {
            this.cursorPos = beforeSelection.length;
        }

        // Append input/paste text with guide characters to the length of selection
        const digitsSelection = this.removeSeparators(selection);
        if (textValue.length < digitsSelection.length) {
            fixedText = fixedText.padEnd(digitsSelection.length, this.props.guideChar);
        }

        // Replace leading guide characters after selection with remain text
        let textCharsRemain = textValue.length - digitsSelection.length;
        let after = this.removeSeparators(afterSelection);
        while (textCharsRemain > 0 && after.substr(0, 1) === this.props.guideChar) {
            after = after.substring(1);
            textCharsRemain -= 1;
        }
        if (textCharsRemain > 0) {
            return origValue;
        }

        let value = fixedText + after;
        let res = beforeSelection;
        let valueToReplace = selection + afterSelection;
        while (valueToReplace.length > 0) {
            const maskChar = valueToReplace.charAt(0);

            if (this.separator.includes(maskChar)) {
                res += maskChar;

                const char = value.charAt(0);
                const isSeparatorChar = value.length > 0 && this.separator.includes(char);

                if (
                    !replaceAll
                    && (textValue.length > 0 || isSeparatorChar)
                ) {
                    this.cursorPos += 1;
                }

                valueToReplace = valueToReplace.substring(1);

                continue;
            }

            if (value.length > 0) {
                const char = value.charAt(0);
                value = value.substring(1);
                const isSeparatorChar = this.separator.includes(char);

                if (isSeparatorChar) {
                    const lastSepPos = res.lastIndexOf(this.separator);
                    const startPos = (lastSepPos !== -1) ? (lastSepPos + this.separator.length) : 0;
                    const rangeType = this.getRangeTypeByPosition(this.cursorPos);
                    const isDayOrMonth = rangeType === 'day' || rangeType === 'month';

                    if (!replaceAll && isDayOrMonth && this.cursorPos - startPos === 1) {
                        const currentPart = res.substring(startPos, this.cursorPos);
                        const beforeCurrentPart = res.substring(0, startPos);
                        res = `${beforeCurrentPart}0${currentPart}`;

                        this.cursorPos += 1;

                        valueToReplace = valueToReplace.substring(1);
                    }

                    continue;
                }

                res += char;
                if (textValue.length > 0 && !isSeparatorChar) {
                    if (!replaceAll) {
                        this.cursorPos += 1;
                    }
                    textValue = textValue.substring(1);
                }
            } else {
                res += this.props.guideChar;
            }

            valueToReplace = valueToReplace.substring(1);
        }

        return res;
    }

    deleteSelection() {
        const range = getCursorPos(this.elem);
        const origValue = this.elem.value;
        const beforeSelection = origValue.substr(0, range.start);
        const afterSelection = origValue.substring(range.end);
        let selection = origValue.substring(range.start, range.end);

        let res = beforeSelection;
        this.cursorPos = beforeSelection.length;
        while (selection.length) {
            const char = selection.charAt(0);
            selection = selection.substr(1);
            if (this.separator.includes(char)) {
                res += char;
            } else {
                res += this.props.guideChar;
            }
        }

        res += afterSelection;

        return res;
    }

    /** Backspace key handler */
    backspaceHandler() {
        const range = getCursorPos(this.elem);
        if (range.start !== range.end) {
            return this.deleteSelection();
        }

        const origValue = this.elem.value;
        let beforeSelection = origValue.substr(0, range.start);
        let afterSelection = origValue.substr(range.end);

        do {
            const char = beforeSelection.charAt(beforeSelection.length - 1);
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

    removeSeparators(str) {
        const chars = this.separator.split('');
        const escaped = chars.map((char) => this.escapeRegExp(char)).join('');
        const expr = new RegExp(`[${escaped}]+`, 'g');

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

        afterSelection = this.removeSeparators(afterSelection);
        // Remove first character from part after selection
        if (afterSelection.length > 0) {
            afterSelection = this.props.guideChar + afterSelection.substr(1);
            this.cursorPos += 1;
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

            if (e.inputType === 'deleteContentBackward') {
                expectedContent = this.backspaceHandler();
            } else if (e.inputType === 'deleteContentForward' || e.inputType === 'deleteByCut') {
                expectedContent = this.deleteHandler();
            } else {
                return;
            }
        } else {
            expectedContent = this.replaceSelection(inputContent);
        }

        e.preventDefault();
        e.stopPropagation();

        const state = this.handleExpectedContent(expectedContent);
        this.setState(state);

        this.dispatchInputEvent();
    }

    handleExpectedContent(content) {
        if (content === '' || content === this.emptyStateValue) {
            return {
                ...this.state,
                ...this.emptyState,
            };
        }

        let expectedDay = this.getContentRange(content, this.dayRange);
        let expectedMonth = this.getContentRange(content, this.monthRange);
        const expectedYear = this.getContentRange(content, this.yearRange);

        const search = new RegExp(`${this.props.guideChar}`, 'g');

        const dayStr = expectedDay.replaceAll(search, '');
        const dayVal = parseInt(dayStr, 10);
        if (dayStr.length > 0 && (!isNumber(dayStr) || !(dayVal >= 0 && dayVal <= 31))) {
            return this.state;
        }
        if (dayStr.length === 2 && dayVal === 0) {
            return this.state;
        }

        const monthStr = expectedMonth.replaceAll(search, '');
        const monthVal = parseInt(monthStr, 10);
        if (monthStr.length > 0 && (!isNumber(monthStr) || !(monthVal >= 0 && monthVal <= 12))) {
            return this.state;
        }
        if (monthStr.length === 2 && monthVal === 0) {
            return this.state;
        }

        const yearStr = expectedYear.replaceAll(search, '');
        const yearVal = parseInt(yearStr, 10);
        if (
            yearStr.length > 0
            && (!isNumber(yearStr) || (this.yearRange.length === 4 && yearVal < 1))
        ) {
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

    isEmptyState(state = this.state) {
        return (
            state.day === this.emptyState.day
            && state.month === this.emptyState.month
            && state.year === this.emptyState.year
        );
    }

    renderValue(state = this.state) {
        return this.isEmptyState(state) ? '' : this.formatDateString(state);
    }

    /** Render component */
    render(state) {
        super.render(state);

        setCursorPos(this.elem, this.cursorPos);
    }
}
