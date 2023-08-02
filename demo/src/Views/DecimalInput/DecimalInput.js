import 'jezvejs/style';
import 'jezvejs/style/Input';
import { createElement } from 'jezvejs';
import { Button } from 'jezvejs/Button';
import { DecimalInput } from 'jezvejs/DecimalInput';

import { DemoView } from '../../Application/DemoView.js';

/**
 * DatePicker component demo view
 */
class DecimalInputView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDefault();
        this.initDigitsLimit();
        this.initInteger();
        this.initChangeProps();
        this.initOnlyPositive();
        this.initLeadingZeros();
        this.initCreate();
    }

    initDefault() {
        const input = createElement('input', {
            props: {
                id: 'decInput',
                className: 'input',
            },
        });
        DecimalInput.create({ elem: input });

        const formStatusElem = createElement('div', { props: { id: 'formStatus' } });
        const form = createElement('form', {
            props: { id: 'decForm' },
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

        const controls = createElement('div', {
            props: { className: 'section-controls' },
            children: createElement('input', {
                props: {
                    id: 'testValueInput',
                    className: 'input',
                },
            }),
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                form,
                formStatusElem,
                controls,
            ],
        });
    }

    initDigitsLimit() {
        const input = createElement('input', {
            props: {
                id: 'decInputDigits',
                className: 'input',
            },
        });
        const dd = DecimalInput.create({
            elem: input,
            digits: 3,
        });
        dd.value = 2;

        this.addSection({
            id: 'limit',
            title: 'Limit digits',
            content: input,
        });
    }

    initInteger() {
        const input = createElement('input', {
            props: {
                id: 'decInputInteger',
                className: 'input',
            },
        });
        DecimalInput.create({
            elem: input,
            digits: 0,
        });

        this.addSection({
            id: 'integer',
            title: 'Integer',
            content: input,
        });
    }

    initChangeProps() {
        const input = createElement('input', {
            props: {
                id: 'decInputChange',
                className: 'input',
            },
        });
        const dinput = DecimalInput.create({
            elem: input,
            digits: 2,
        });

        const controls = createElement('div', {
            props: { className: 'section-controls' },
            children: Button.create({
                id: 'changeDigitsBtn',
                className: 'action-btn',
                title: 'Change',
                onClick: () => {
                    dinput.setState((state) => ({
                        ...state,
                        digits: (state.digits === 2) ? 3 : 2,
                    }));
                },
            }).elem,
        });

        this.addSection({
            id: 'changeProps',
            title: 'Change digits after decimal point value',
            content: [input, controls],
        });
    }

    initOnlyPositive() {
        const input = createElement('input', {
            props: {
                id: 'decInputPositive',
                className: 'input',
            },
        });
        DecimalInput.create({
            elem: input,
            allowNegative: false,
        });

        this.addSection({
            id: 'positive',
            title: 'Disable negative values',
            content: input,
        });
    }

    initLeadingZeros() {
        const input = createElement('input', {
            props: {
                id: 'decInputZeros',
                className: 'input',
            },
        });
        DecimalInput.create({
            elem: input,
            allowMultipleLeadingZeros: true,
        });

        this.addSection({
            id: 'leadzero',
            title: 'Multiple leading zeros',
            content: input,
        });
    }

    initCreate() {
        this.addSection({
            id: 'create',
            title: 'Create input element',
            content: createElement('div', {
                props: {
                    id: 'createContainer',
                    className: 'section-content',
                },
                children: DecimalInput.create({
                    className: 'input',
                }).elem,
            }),
        });
    }
}

DecimalInputView.create();
