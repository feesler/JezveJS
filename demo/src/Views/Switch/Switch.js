import 'jezvejs/style';
import {
    asArray,
    createElement,
    ge,
    getClassName,
} from 'jezvejs';
import { Button } from 'jezvejs/Button';
import { Switch } from 'jezvejs/Switch';

import { DemoView } from '../../Application/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import './SwitchView.scss';

const createContainer = (id, children) => createElement('div', {
    props: { id },
    children,
});

const createForm = (id, children) => createElement('form', {
    props: { id },
    children,
});

const createButtons = (items) => (
    createElement('div', {
        props: { className: 'section-controls' },
        children: asArray(items).map((item) => (
            Button.create({
                ...item,
                className: getClassName('action-btn', item.className),
            }).elem
        )),
    })
);

/**
 * Switch component demo view
 */
class SwitchView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initParsed();
        this.initDynamic();
        this.initLarge();
    }

    initParsed() {
        const logsField = LogsField.create();

        const defaultSwitch = Switch.fromElement(ge('defaultSwitch'), {
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
