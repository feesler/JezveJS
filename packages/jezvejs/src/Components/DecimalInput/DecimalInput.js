import {
    isFunction,
    getCursorPos,
    isInt,
    setEvents,
    removeEvents,
    createElement,
    setProps,
} from '../../js/common.js';
import {
    fixFloat,
    getAllowedDecimalPlaces,
    getDecimalPlaces,
    isMultipleLeadingZeros,
    isNumberString,
    trimDecimalPlaces,
} from '../../js/NumberUtils.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';

const inputProps = {
    inputMode: 'decimal',
    autocomplete: 'off',
    autocapitalize: 'none',
    autocorrect: 'off',
    spellcheck: false,
};

const defaultProps = {
    id: undefined,
    name: undefined,
    form: undefined,
    placeholder: undefined,
    value: undefined,
    digits: undefined,
    onInput: null,
    allowNegative: true,
    allowMultipleLeadingZeros: false,
};

/**
 * Decimal value input
 * @param {Object} props
 * @param {string|Element} props.elem - identifier or element to attach component to
 * @param {Number} props.digits - decimal digits limit
 * @param {Function} props.onInput - 'input' event handler
 * @param {Function} props.allowNegative - enables input negative values
 */
export class DecimalInput extends Component {
    static userProps = {
        elem: ['id', 'name', 'form', 'placeholder', 'value'],
    };

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = { ...this.props };

        this.init();
    }

    init() {
        if (!this.elem) {
            this.elem = createElement('input', { props: { type: 'text' } });
        }

        if (typeof this.state.digits !== 'undefined') {
            if (!isInt(this.state.digits)) {
                throw new Error('Invalid digits property specified');
            }
        }

        setProps(this.elem, inputProps);
        this.setUserProps();

        this.beforeInputHandler = (e) => this.validateInput(e);
        this.eventHandlers = {
            keypress: this.beforeInputHandler,
            paste: this.beforeInputHandler,
            beforeinput: this.beforeInputHandler,
            input: (e) => this.handleInput(e),
        };

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

    /** Validate specified value */
    isValidValue(value) {
        const fixed = fixFloat(value);
        if (!isNumberString(fixed)) {
            return false;
        }

        if (!this.state.allowMultipleLeadingZeros && isMultipleLeadingZeros(fixed)) {
            return false;
        }

        const float = parseFloat(fixed);
        if (!this.state.allowNegative && (float < 0 || fixed.startsWith('-'))) {
            return false;
        }

        if (typeof this.state.digits !== 'undefined') {
            const length = getDecimalPlaces(value);
            const allowedLength = getAllowedDecimalPlaces(this.state.digits);
            return length <= allowedLength;
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
        if (isFunction(this.state.onInput)) {
            this.state.onInput(e);
        }
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (state.digits === prevState?.digits) {
            return;
        }

        const allowedLength = getAllowedDecimalPlaces(state.digits);
        this.value = trimDecimalPlaces(this.value, allowedLength);
    }
}
