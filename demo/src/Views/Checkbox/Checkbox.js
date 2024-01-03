import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { Checkbox } from 'jezvejs/Checkbox';
import { Radio } from 'jezvejs/Radio';

import { createButtons } from '../../Application/utils.js';

import { CheckIcon } from '../../assets/icons/CheckIcon.js';
import { SmallCloseIcon } from '../../assets/icons/SmallCloseIcon.js';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import './CheckboxView.scss';

/**
 * Checkbox and Radio components demo view
 */
class CheckboxView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Checkbox and Radio');

        this.addSectionsGroup({ title: 'Checkbox' });
        this.initParsed();
        this.initIcon();
        this.initDynamic();
        this.initLarge();

        this.addSectionsGroup({ title: 'Radio' });
        this.initParsedRadio();
        this.initDynamicRadio();

        this.initLogs();
    }

    initLogs() {
        this.logsField = LogsField.create();
        this.container.append(this.logsField.elem);
    }

    addEventLog(value) {
        this.logsField?.write(value);
    }

    initParsed() {
        const checkboxes = [
            createElement('label', {
                id: 'defaultCheckboxNoLabel',
                className: 'checkbox',
                children: [
                    createElement('input', { type: 'checkbox', checked: true }),
                    createElement('span', {
                        className: 'checkbox__check',
                        children: CheckIcon({ class: 'checkbox__icon' }),
                    }),
                ],
            }),
            createElement('label', {
                id: 'circleCheckboxLabel',
                className: 'checkbox',
                children: [
                    createElement('input', { type: 'checkbox', checked: true }),
                    createElement('span', {
                        className: 'checkbox__check',
                        children: CheckIcon({ class: 'checkbox__icon' }),
                    }),
                    createElement('span', {
                        className: 'checkbox__label',
                        children: createElement('a', {
                            href: '#',
                            textContent: 'Custom label content',
                        }),
                    }),
                ],
            }),
        ];

        this.addSection({
            id: 'checkboxParse',
            title: 'Parse component from DOM',
            content: createElement('div', {
                children: checkboxes.map((item) => (
                    Checkbox.fromElement(item, {
                        onChange: (checked) => this.addEventLog(`Checkbox '${item}' changed. checked: ${checked}`),
                    }).elem
                )),
            }),
        });
    }

    initIcon() {
        this.addSection({
            id: 'checkboxIcon',
            title: 'Custom icon',
            content: Checkbox.create({
                checked: true,
                checkIcon: SmallCloseIcon({ class: 'checkbox__icon' }),
            }).elem,
        });
    }

    initDynamic() {
        const checkbox = Checkbox.create({
            id: 'dynCheckbox',
            name: 'check1',
            label: 'Checkbox methods',
            tooltip: 'Custom tooltip',
            className: 'right-check',
            onChange: (checked) => this.addEventLog(`Dynamic Checkbox change. checked: ${checked}`),
        });

        const form = createElement('form', {
            id: 'dynamicContainer',
            children: checkbox.elem,
        });

        const rows = [
            [{
                id: 'checkBtn',
                title: 'Check',
                onClick: () => checkbox.check(true),
            }, {
                id: 'uncheckBtn',
                title: 'Uncheck',
                onClick: () => checkbox.check(false),
            }, {
                id: 'toggleBtn',
                title: 'Toggle',
                onClick: () => checkbox.toggle(),
            }, {
                id: 'enableBtn',
                title: 'Enable',
                onClick: () => checkbox.enable(true),
            }, {
                id: 'disableBtn',
                title: 'Disable',
                onClick: () => checkbox.enable(false),
            }],
            [{
                id: 'changePropBtn',
                title: 'Change property',
                onClick: () => {
                    checkbox.input.checked = false;
                },
            }, {
                id: 'resetBtn',
                title: 'Reset form',
                onClick: () => form.reset(),
            }],
        ];

        this.addSection({
            id: 'checkboxMethods',
            title: 'Methods',
            content: [
                form,
                ...rows.map((items) => (
                    createButtons(items)
                )),
            ],
        });
    }

    initLarge() {
        this.addSection({
            id: 'checkboxLarge',
            title: 'Large + styled background',
            content: Checkbox.create({
                className: 'checkbox-large',
                onChange: (checked) => this.addEventLog(`Large Checkbox change. checked: ${checked}`),
            }).elem,
        });
    }

    initParsedRadio() {
        const ids = [1, 2, 3, 4];
        const radioName = 'radio1';

        const radios = ids.map((item) => (
            createElement('label', {
                id: `defaultRadio${item}`,
                className: 'radio',
                children: [
                    createElement('input', {
                        type: 'radio',
                        name: radioName,
                        value: item,
                    }),
                    createElement('span', { className: 'radio__check' }),
                    createElement('span', {
                        className: 'radio__label',
                        textContent: `Value ${item}`,
                    }),
                ],
            })
        ));

        this.addSection({
            id: 'radioParse',
            title: 'Parse component from DOM',
            content: createElement('form', {
                className: 'radio-group',
                children: radios.map((item) => (
                    Radio.fromElement(item, {
                        onChange: (checked) => this.addEventLog(`Parsed Radio ${item} change. checked: ${checked}`),
                    }).elem
                )),
            }),
        });
    }

    initDynamicRadio() {
        const ids = [1, 2, 3];
        const radios = ids.map((item) => (
            Radio.create({
                id: `dynRadio${item}`,
                value: item.toString(),
                name: 'radio2',
                label: `Value ${item}`,
                tooltip: `Custom tooltip for value ${item}`,
                onChange: (checked) => this.addEventLog(`Dynamic Radio ${item} change. checked: ${checked}`),
            })
        ));
        const radio3 = radios[2];

        const form = createElement('form', {
            id: 'dynamicRadioContainer',
            className: 'radio-group',
            children: radios.map((item) => item.elem),
        });

        const rows = [
            [{
                id: 'checkRadioBtn',
                title: 'Check',
                onClick: () => radio3.check(true),
            }, {
                id: 'uncheckRadioBtn',
                title: 'Uncheck',
                onClick: () => radio3.check(false),
            }, {
                id: 'toggleRadioBtn',
                title: 'Toggle',
                onClick: () => radio3.toggle(),
            }, {
                id: 'enableRadioBtn',
                title: 'Enable',
                onClick: () => radio3.enable(true),
            }, {
                id: 'disableRadioBtn',
                title: 'Disable',
                onClick: () => radio3.enable(false),
            }],
            [{
                id: 'changeRadioPropBtn',
                title: 'Change property',
                onClick: () => {
                    radio3.input.checked = false;
                },
            }, {
                id: 'resetRadioBtn',
                title: 'Reset form',
                onClick: () => form.reset(),
            }],
        ];

        this.addSection({
            id: 'radioMethods',
            title: 'Methods',
            content: [
                form,
                ...rows.map((items) => createButtons(items)),
            ],
        });
    }
}

CheckboxView.create();
