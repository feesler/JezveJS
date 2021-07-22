import { isFunction, getCursorPos, isNum } from '../../js/common.js';
import '../../css/common.css';

/**
 * Decimal value input
 * @param {Object} props
 */
export class DecimalInput {
    constructor(props) {
        this.props = props;

        if (!props.elem) {
            throw new Error('Invalid input element specified');
        }

        this.elem = props.elem;

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
        if (this.isValidValue(val)) {
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

        return beforeSelection + text + afterSelection;
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

    /**
     * Fix string to correct float number format
     * @param {string} str - decimal value string
     */
    fixFloat(str) {
        let res;

        if (typeof str === 'number') {
            return str;
        }

        if (typeof str === 'string') {
            res = str.replace(/,/g, '.');
            if (res.indexOf('-') === 0
                && (
                    res.length === 1
                    || res.indexOf('.') === 1
                )) {
                res = `-0${res.substr(1)}`;
            }
            if (res.indexOf('.') === 0 || !res.length) {
                res = `0${res}`;
            }
            return res;
        }

        return null;
    }

    /** Validate specified value */
    isValidValue(value) {
        return isNum(this.fixFloat(value));
    }

    /** Before input events('keypress', 'paste', 'beforeinput) handler */
    validateInput(e) {
        const inputContent = this.getInputContent(e);
        if (!inputContent || inputContent.length === 0) {
            return true;
        }

        const expectedContent = this.replaceSelection(inputContent);
        const res = this.isValidValue(expectedContent);
        if (!res) {
            e.preventDefault();
            e.stopPropagation();
        }

        return res;
    }

    /** 'input' event handler */
    handleInput(e) {
        if (isFunction(this.oninput)) {
            this.oninput(e);
        }
    }

    /** Static alias for DecimalInput constructor */
    static create(props) {
        if (!props || !props.elem) {
            return null;
        }

        return new DecimalInput(props);
    }
}
