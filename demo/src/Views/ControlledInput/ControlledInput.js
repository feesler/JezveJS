import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { ControlledInput } from 'jezvejs/ControlledInput';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import { createControls } from '../../Application/utils.js';

/**
 * ControlledInput component demo view
 */
class ControlledInputView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDigitsOnly();
        this.initLettersOnly();
    }

    initDigitsOnly() {
        const logsField = LogsField.create();

        const input = ControlledInput.create({
            id: 'digitsOnlyInput',
            isValidValue: (value) => {
                logsField.write(`isValidValue('${value}')`);
                return /^\d*$/.test(value);
            },
            onFocus: () => logsField.write('onFocus'),
            onBlur: () => logsField.write('onBlur'),
            onInput: () => logsField.write('onInput'),
            onChange: () => logsField.write('onChange'),
        });

        this.addSection({
            id: 'digitsOnly',
            title: 'Digits only',
            content: [
                input.elem,
                createControls([
                    createElement('input', {
                        props: {
                            id: 'testValueInput',
                            className: 'input',
                        },
                    }),
                    logsField.elem,
                ]),
            ],
        });
    }

    initLettersOnly() {
        const logsField = LogsField.create();

        const input = ControlledInput.create({
            id: 'lettersOnlyInput',
            isValidValue: (value) => {
                logsField.write(`isValidValue('${value}')`);
                return /^[a-zA-Z]*$/.test(value);
            },
        });

        const container = createElement('div', {
            children: input.elem,
        });

        this.addSection({
            id: 'lettersOnly',
            title: 'Letters only',
            content: [container, logsField.elem],
        });
    }
}

ControlledInputView.create();
