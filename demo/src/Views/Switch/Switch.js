import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { Switch } from 'jezvejs/Switch';

import { createContainer, createForm, createButtons } from '../../Application/utils.js';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import './SwitchView.scss';

/**
 * Switch component demo view
 */
class SwitchView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Switch');

        this.initParsed();
        this.initDynamic();
        this.initLarge();
    }

    initParsed() {
        const logsField = LogsField.create();

        const elem = createElement('label', {
            id: 'defaultSwitch',
            className: 'switch',
            children: [
                createElement('input', { type: 'checkbox', checked: true }),
                createElement('div', {
                    className: 'switch-slider',
                }),
                createElement('span', {
                    className: 'switch__label', textContent: 'Enable something',
                }),
            ],
        });

        const defaultSwitch = Switch.fromElement(elem, {
            onChange: (checked) => logsField.write(`Parsed Switch change. checked: ${checked}`),
        });

        this.addSection({
            id: 'parse',
            title: 'Parse component',
            content: [
                createContainer('defaultContainer', defaultSwitch.elem),
                logsField.elem,
            ],
        });
    }

    initDynamic() {
        const logsField = LogsField.create();

        const dynamicSwitch = Switch.create({
            className: 'blue-switch',
            label: 'Switch component',
            tooltip: 'Custom tooltip',
            onChange: (checked) => logsField.write(`Dynamic Switch change. checked: ${checked}`),
        });
        const form = createForm('dynamicContainer', dynamicSwitch.elem);

        const controlsTopRow = createButtons([{
            id: 'checkBtn',
            title: 'Check',
            onClick: () => dynamicSwitch.check(true),
        }, {
            id: 'uncheckBtn',
            title: 'Uncheck',
            onClick: () => dynamicSwitch.check(false),
        }, {
            id: 'toggleBtn',
            title: 'Toggle',
            onClick: () => dynamicSwitch.toggle(),
        }, {
            id: 'enableBtn',
            title: 'Enable',
            onClick: () => dynamicSwitch.enable(true),
        }, {
            id: 'disableBtn',
            title: 'Disable',
            onClick: () => dynamicSwitch.enable(false),
        }]);

        const controlsBottomRow = createButtons([{
            id: 'changePropBtn',
            title: 'Change property',
            onClick: () => {
                dynamicSwitch.input.checked = false;
            },
        }, {
            id: 'resetBtn',
            title: 'Reset form',
            onClick: () => form.reset(),
        }]);

        this.addSection({
            id: 'create',
            title: 'Create component',
            content: [
                form,
                controlsTopRow,
                controlsBottomRow,
                logsField.elem,
            ],
        });
    }

    initLarge() {
        const logsField = LogsField.create();

        const largeSwitch = Switch.create({
            className: 'large-switch',
            onChange: (checked) => logsField.write(`Large Switch change. checked: ${checked}`),
        });

        this.addSection({
            id: 'large',
            title: 'Large',
            content: [
                createContainer('largeContainer', largeSwitch.elem),
                logsField.elem,
            ],
        });
    }
}

SwitchView.create();
