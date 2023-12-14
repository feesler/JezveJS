import { isFunction } from '@jezvejs/types';
import {
    getCursorPos,
    setEvents,
    removeEvents,
    setProps,
    setAttributes,
} from '@jezvejs/dom';
import { Input } from '../Input/Input.js';

const autoFeatureProps = {
    autocomplete: 'off',
    autocapitalize: 'none',
    spellcheck: false,
};

const autoFeatureAttrs = {
    autocorrect: 'off',
};

const defaultProps = {
    handleValueProperty: true,
    disableAutoFeatures: true,
    isValidValue: null,
    onInput: null,
};

/**
 * Controlled value input component
 */
export class ControlledInput extends Input {
    skipValidation = false;

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });
    }

    init() {
        super.init();

        if (this.props.disableAutoFeatures) {
            setProps(this.elem, autoFeatureProps);
            setAttributes(this.elem, autoFeatureAttrs);
        }
    }

    setHandlers() {
        super.setHandlers();

        this.beforeInputHandler = (e) => this.validateInput(e);
        this.eventHandlers = {
            keypress: this.beforeInputHandler,
            paste: this.beforeInputHandler,
            beforeinput: this.beforeInputHandler,
        };

        setEvents(this.elem, this.eventHandlers);

        if (this.props.handleValueProperty) {
            this.observeInputValue();
        }
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
        if (!this.elem) {
            return;
        }

        this.elem.value = (this.props.handleValueProperty)
            ? val
            : this.handleValue(val);
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

                descriptor.set.call(this, self.handleValue(value));
            },
        });
    }

    /**
     * Verifies update of input value and returns valid value
     *
     * @param {string} value
     * @returns {string}
     */
    handleValue(value) {
        if (this.skipValidation) {
            return value;
        }

        const isValid = this.isValidValue(value);
        return (isValid) ? value : this.renderValue();
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
        return (isFunction(this.props.isValidValue))
            ? this.props.isValidValue(value)
            : true;
    }

    /** Before input events('keypress', 'paste', 'beforeinput) handler */
    validateInput(e) {
        const inputContent = this.getInputContent(e) ?? '';

        const expectedContent = this.replaceSelection(inputContent);
        const res = this.isValidValue(expectedContent);
        if (!res) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    renderValue(state = this.state) {
        return state.value;
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.skipValidation = true;
        this.elem.value = this.renderValue(state);
        this.skipValidation = false;
    }
}
