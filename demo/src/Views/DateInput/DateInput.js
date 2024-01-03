import 'jezvejs/style';
import 'jezvejs/style/Input';
import { createElement } from '@jezvejs/dom';
import { DateInput } from 'jezvejs/DateInput';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createControls } from '../../Application/utils.js';
import { LocalesContainer } from '../../Components/LocalesContainer/LocalesContainer.js';

/**
 * DateInput component demo view
 */
class DateInputView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('DateInput');

        this.initDefault();
        this.initPlaceholder();
        this.initCreate();
        this.initLocales();
    }

    initDefault() {
        const input = createElement('input', {
            id: 'dateinput',
            className: 'input',
            value: '01.02.3456',
        });
        const inputStatusElem = createElement('div', { id: 'inputStatus' });
        const formStatusElem = createElement('div', { id: 'formStatus' });

        const form = createElement('form', {
            children: [
                input,
                createElement('input', { attrs: { type: 'submit', hidden: '' } }),
            ],
            events: {
                submit: (e) => {
                    e.preventDefault();
                    formStatusElem.textContent = 'Form submit event fired';
                },
            },
        });

        DateInput.create({
            elem: input,
            onInput: (e) => {
                inputStatusElem.textContent = e.target.value;
            },
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                form,
                inputStatusElem,
                formStatusElem,
            ],
        });
    }

    initPlaceholder() {
        const input = createElement('input', {
            id: 'dateInputPh',
            className: 'input',
        });

        DateInput.create({ elem: input, placeholder: 'Input date' });

        this.addSection({
            id: 'placeholder',
            title: 'Placeholder',
            content: input,
        });
    }

    initCreate() {
        this.addSection({
            id: 'create',
            title: 'Create input element',
            content: createElement('div', {
                id: 'createContainer',
                className: 'section-content',
                children: DateInput.create({
                    className: 'input',
                    placeholder: 'Created input element',
                }).elem,
            }),
        });
    }

    initLocales() {
        const items = [
            { id: 'usDateInput', title: 'en-US', locales: ['en-US'] },
            { id: 'koDateInput', title: 'ko-KR', locales: ['ko-KR'] },
            { id: 'ruDateInput', title: 'ru-RU', locales: ['ru-RU'] },
            { id: 'esDateInput', title: 'es', locales: ['es'] },
        ];

        this.addSection({
            id: 'locale',
            title: 'Locales',
            content: [
                LocalesContainer.create({
                    items,
                    renderItem: ({ locales }) => (
                        DateInput.create({
                            className: 'input',
                            locales,
                        }).elem
                    ),
                }).elem,
                createControls(
                    createElement('input', {
                        id: 'testValueInput',
                        className: 'input',
                    }),
                ),
            ],
        });
    }
}

DateInputView.create();
