import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { Input } from 'jezvejs/Input';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createControls } from '../../Application/utils.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import './InputView.scss';

/**
 * Input component demo view
 */
class InputView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Input');

        this.initDefault();
        this.initPlaceholder();
        this.initFullWidth();
        this.initStyled();
        this.initDisabled();
    }

    initDefault() {
        const logsField = LogsField.create();

        const input = createElement('input', {
            id: 'defaultInput',
            className: 'input',
            type: 'text',
        });
        const container = createElement('div', {
            children: input,
        });

        Input.fromElement(input, {
            onFocus: () => logsField.write('onFocus'),
            onBlur: () => logsField.write('onBlur'),
            onInput: () => logsField.write('onInput'),
            onChange: () => logsField.write('onChange'),
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [container, logsField.elem],
        });
    }

    initPlaceholder() {
        this.addSection({
            id: 'placeholder',
            title: 'Placeholder',
            content: createElement('div', {
                children: Input.create({
                    placeholder: 'Input value',
                }).elem,
            }),
        });
    }

    initFullWidth() {
        this.addSection({
            id: 'fullwidth',
            title: 'Full width',
            content: createElement('div', {
                children: Input.create({
                    className: 'full-width',
                }).elem,
            }),
        });
    }

    initStyled() {
        this.addSection({
            id: 'styled',
            title: 'Styled component',
            content: createElement('div', {
                children: Input.create({
                    className: 'styled',
                    placeholder: 'Input correct value',
                }).elem,
            }),
        });
    }

    initDisabled() {
        const disabledInp = Input.create({
            value: 'Disabled input',
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

InputView.create();
