import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { ColorInput } from 'jezvejs/ColorInput';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import { createControls } from '../../Application/utils.js';

/**
 * ColorInput component demo view
 */
class ColorInputView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('ColorInput');

        this.initDefault();
        this.initDisabled();
    }

    initDefault() {
        const logsField = LogsField.create();

        const input = ColorInput.create({
            id: 'default',
            onFocus: () => logsField.write('onFocus'),
            onBlur: () => logsField.write('onBlur'),
            onInput: (e) => logsField.write(`onInput(${e?.target?.value})`),
            onChange: (e) => logsField.write(`onChange(${e?.target?.value})`),
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                input.elem,
                createControls([
                    logsField.elem,
                ]),
            ],
        });
    }

    initDisabled() {
        const disabledInp = ColorInput.create({
            value: '#ff00e6',
            disabled: true,
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

ColorInputView.create();
