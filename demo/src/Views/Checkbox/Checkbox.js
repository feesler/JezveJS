import 'jezvejs/style';
import 'jezvejs/style/Button';
import { createElement, ge } from 'jezvejs';
import { Button } from 'jezvejs/Button';
import { Checkbox } from 'jezvejs/Checkbox';
import { Icon } from 'jezvejs/Icon';
import { Radio } from 'jezvejs/Radio';

import { DemoView } from '../../Application/DemoView.js';
import './CheckboxView.scss';

class CheckboxView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
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
        if (this.logsTextarea) {
            return;
        }

        this.logsTextarea = createElement('textarea');
        const logs = createElement('div', {
            props: { className: 'logs-container' },
            children: [
                createElement('label', { props: { textContent: 'Events log' } }),
                this.logsTextarea,
            ],
        });

        this.container.append(logs);
    }

    addEventLog(value) {
        if (this.logsTextarea) {
            this.logsTextarea.value += `${value}\r\n`;
        }
    }

    initParsed() {
        const checkboxes = ['defaultCheckboxNoLabel', 'circleCheckboxLabel'];

        this.addSection({
            id: 'checkboxParse',
            title: 'Parse component from DOM',
            content: createElement('div', {
                children: checkboxes.map((item) => (
                    Checkbox.fromElement(ge(item), {
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
                checkIcon: Icon.create({ icon: 'close-icon', className: 'checkbox__icon' }).elem,
            }).elem,
        });
    }

    initDynamic() {
        const checkbox = Checkbox.create({
            id: 'dynCheckbox',
            name: 'check1',
            label: 'Checkbox methods',
            onChange: (checked) => this.addEventLog(`Dynamic Checkbox change. checked: ${checked}`),
        });

        const form = createElement('form', {
            props: { id: 'dynamicContainer' },
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
            id: 'checkboxIcon',
            title: 'Methods',
            content: [
                form,
                ...rows.map((items) => (
                    createElement('div', {
                        props: { className: 'section-controls' },
                        children: items.map((item) => Button.create({
                            ...item,
                            className: 'action-btn',
                        }).elem),
                    })
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

        this.addSection({
            id: 'radioParse',
            title: 'Parse component from DOM',
            content: ids.map((item) => (
                Radio.fromElement(ge(`defaultRadio${item}`), {
                    onChange: (checked) => this.addEventLog(`Parsed Radio ${item} change. checked: ${checked}`),
                }).elem
            )),
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
                onChange: (checked) => this.addEventLog(`Dynamic Radio ${item} change. checked: ${checked}`),
            })
        ));
        const radio3 = radios[2];

        const form = createElement('form', {
            props: { id: 'dynamicRadioContainer' },
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
                ...rows.map((items) => (
                    createElement('div', {
                        props: { className: 'section-controls' },
                        children: items.map((item) => Button.create({
                            ...item,
                            className: 'action-btn',
                        }).elem),
                    })
                )),
            ],
        });
    }
}

CheckboxView.create();
