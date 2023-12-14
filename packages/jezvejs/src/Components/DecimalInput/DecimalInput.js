import { isInteger } from '@jezvejs/types';
import {
    fixFloat,
    getAllowedDecimalPlaces,
    getDecimalPlaces,
    isMultipleLeadingZeros,
    isNumberString,
    trimDecimalPlaces,
} from '@jezvejs/number';
import { ControlledInput } from '../ControlledInput/ControlledInput.js';

const defaultProps = {
    id: undefined,
    name: undefined,
    form: undefined,
    placeholder: undefined,
    value: undefined,
    min: null,
    max: null,
    digits: undefined,
    onInput: null,
    allowNegative: true,
    allowMultipleLeadingZeros: false,
};

/**
 * Decimal value input component
 */
export class DecimalInput extends ControlledInput {
    static userProps = {
        elem: ['id', 'name', 'form', 'placeholder', 'value'],
    };

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            inputMode: 'decimal',
        });
    }

    init() {
        if (typeof this.state.digits !== 'undefined') {
            if (!isInteger(this.state.digits)) {
                throw new Error('Invalid digits property specified');
            }
        }

        super.init();
    }

    /** Validate specified value */
    isValidValue(value) {
        if (value === '') {
            return true;
        }

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

        const { min, max } = this.state;
        if (
            (typeof min === 'number' && float < min)
            || (typeof max === 'number' && float > max)
        ) {
            return false;
        }

        const { digits } = this.state;
        if (typeof digits === 'number') {
            const length = getDecimalPlaces(value);
            const allowedLength = getAllowedDecimalPlaces(digits);
            if (length > allowedLength) {
                return false;
            }
        }

        return true;
    }

    renderValue(state = this.state) {
        return (typeof digits === 'number')
            ? trimDecimalPlaces(this.value, state.digits)
            : this.value;
    }
}
