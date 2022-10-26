import {
    isFunction,
    getCursorPos,
    isInt,
    setEvents,
    removeEvents,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';

const defaultProps = {
    digits: undefined,
    oninput: null,
    allowNegative: true,
    allowMultipleLeadingZeros: false,
    placeholder: null,
    name: null,
    form: null,
};

/**
 * Decimal value input
 * @param {Object} props
 * @param {string|Element} props.elem - identifier or element to attach component to
 * @param {Number} props.digits - decimal digits limit
 * @param {Function} props.oninput - 'input' event handler
 * @param {Function} props.allowNegative - enables input negative values
 */
export class DecimalInput extends Component {
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        if (!this.props.elem) {
            throw new Error('Invalid input element specified');
        }

        this.init();
    }

    init() {
        this.elem = this.props.elem;

        this.useFixed = (typeof this.props.digits !== 'undefined');
        if (this.useFixed) {
            if (!isInt(this.props.digits)) {
                throw new Error('Invalid digits property specified');
            }
        }

        this.elem.inputMode = 'decimal';
        if (this.props.placeholder) {
            this.elem.placeholder = this.props.placeholder;
        }
        if (typeof this.props.name === 'string') {
            this.elem.name = this.props.name;
        }
        if (typeof this.props.form === 'string') {
            this.elem.form = this.props.form;
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
        this.setClassNames();
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
        if (this.isValidValue(val)) {
            this.elem.value = val;
        }
    }

    /** Define setter for 'value' property of input to prevent invalid values */
    observeInputValue() {
        const decimalInput = this;
        const elementPrototype = Object.getPrototypeOf(this.elem);
        const descriptor = Object.getOwnPropertyDescriptor(elementPrototype, 'value');

        Object.defineProperty(this.elem, 'value', {
            get() {
                return descriptor.get.call(this);
            },
            set(value) {
                if (decimalInput.isValidValue(value)) {
                    descriptor.set.call(this, value);
                }

                return this.value;
            },
        });
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
        if (e.type === 'keypress' && e.keyCode !== 13) {
            return e.key;
        }

        return null;
    }

    /**
     * Fix string to correct float number format
     * @param {string} str - decimal value string
     */
    fixFloat(str) {
        if (typeof str === 'number') {
            return str.toString();
        }

        if (typeof str !== 'string') {
            return null;
        }

        let res = str.replace(/,/g, '.');
        if (res.indexOf('-') === 0
            && (
                res.length === 1
                || res.indexOf('.') === 1
            )) {
            res = `-0${res.substring(1)}`;
        }
        if (res.indexOf('.') === 0 || !res.length) {
            res = `0${res}`;
        }
        return res;
    }

    isNumber(value) {
        return /^-?\d*\.?\d*$/g.test(value);
    }

    isMultipleLeadingZeros(value) {
        return /^-?00/g.test(value);
    }

    /** Validate specified value */
    isValidValue(value) {
        const fixed = this.fixFloat(value);
        if (!this.isNumber(fixed)) {
            return false;
        }

        if (!this.props.allowMultipleLeadingZeros && this.isMultipleLeadingZeros(fixed)) {
            return false;
        }

        const float = parseFloat(fixed);
        if (!this.props.allowNegative && (float < 0 || fixed.startsWith('-'))) {
            return false;
        }

        if (this.useFixed) {
            const intPart = Math.trunc(float).toString();

            if (this.props.digits === 0) {
                return fixed.length <= intPart.length;
            }

            const dotOffset = (float < 0) ? 2 : 1;
            return fixed.length <= intPart.length + this.props.digits + dotOffset;
        }

        return true;
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
        if (isFunction(this.props.oninput)) {
            this.props.oninput(e);
        }
    }
}
