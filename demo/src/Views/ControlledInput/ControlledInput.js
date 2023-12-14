import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
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
        this.initDisabled();
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

    initDisabled() {
        const disabledInp = ControlledInput.create({
            value: '-5678.90',
            disabled: true,
            isValidValue: (value) => /^-?\d*\.?\d*$/.test(value),
        });

        const toggleEnableBtn = Button.create({
            id: 'toggleEnableBtn',
            className: 'action-btn',
            title: 'Enable',
            onClick: () => {
                const { disabled } = disabledInp;
                toggleEnableBtn.setTitle((disabled) ? 'Disable' : 'Enable');
                disabledInp.enable(disabled);
            },
        });

        this.addSection({
            id: 'disabled',
            title: 'Disabled component',
            content: [
                createElement('div', { children: disabledInp.elem }),
                createControls(toggleEnableBtn.elem),
            ],
        });
    }
}

ControlledInputView.create();
