import 'jezvejs/style';
import { ge, createElement, getClassName } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { Input } from 'jezvejs/Input';
import { InputGroup } from 'jezvejs/InputGroup';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import './InputGroupView.scss';

const createInput = (props = {}) => (
    Input.create({
        ...props,
        className: getClassName('input-group__input', props.className),
    }).elem
);

const createText = (textContent) => createElement('div', {
    props: {
        className: 'input-group__text',
        textContent,
    },
});

const createButton = (textContent) => (
    Button.create({
        className: 'input-group__btn',
        title: createElement('div', {
            props: {
                className: 'input-group__btn-title',
                textContent,
            },
        }),
    }).elem
);

const createInnerButton = (props = {}) => (
    Button.create({
        ...props,
        className: getClassName('input-group__inner-btn', props.className),
    }).elem
);

const createOuterContainer = (children) => createElement('div', {
    props: { className: 'input-group__input-outer' },
    children,
});

/**
 * InputGroup component demo view
 */
class InputGroupView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.text();
        this.buttons();
        this.multipleInputs();
        this.innerButtons();
        this.inputOuter();
        this.disabled();
        this.parse();
    }

    text() {
        this.addSection({
            id: 'text',
            title: 'Input group with text',
            content: [
                InputGroup.create({
                    children: [
                        createInput({
                            className: 'stretch-input amount-input',
                            placeholder: 'Input value',
                        }),
                        createText('.00'),
                    ],
                }).elem,
                InputGroup.create({
                    children: [
                        createText('$'),
                        createInput({
                            className: 'stretch-input amount-input',
                            placeholder: 'Input value',
                            value: '1000',
                        }),
                    ],
                }).elem,
                InputGroup.create({
                    children: [
                        createText('$'),
                        createInput({
                            className: 'stretch-input amount-input',
                        }),
                        createText('.00'),
                    ],
                }).elem,
                InputGroup.create({
                    children: [
                        createText('€'),
                        createText('$'),
                        createInput({
                            className: 'stretch-input amount-input',
                        }),
                        createText('.00'),
                        createText('$'),
                    ],
                }).elem,
            ],
        });
    }

    buttons() {
        this.addSection({
            id: 'button',
            title: 'Input group with button',
            content: [
                InputGroup.create({
                    children: [
                        createInput({
                            className: 'stretch-input amount-input',
                            placeholder: 'Input value',
                        }),
                        createButton('.00'),
                    ],
                }).elem,
                InputGroup.create({
                    children: [
                        createButton('$'),
                        createInput({
                            className: 'stretch-input amount-input',
                            placeholder: 'Input value',
                            value: '1000',
                        }),
                    ],
                }).elem,
                InputGroup.create({
                    children: [
                        createButton('$'),
                        createInput({
                            className: 'stretch-input amount-input',
                        }),
                        createButton('.00'),
                    ],
                }).elem,
                InputGroup.create({
                    children: [
                        createButton('€'),
                        createButton('$'),
                        createInput({
                            className: 'stretch-input amount-input',
                        }),
                        createButton('.00'),
                        createButton('$'),
                    ],
                }).elem,
            ],
        });
    }

    multipleInputs() {
        this.addSection({
            id: 'multipleInputs',
            title: 'Multiple inputs',
            content: InputGroup.create({
                children: [
                    createInput({
                        className: 'stretch-input',
                        placeholder: 'Start',
                    }),
                    createText('-'),
                    createInput({
                        className: 'stretch-input',
                        placeholder: 'End',
                    }),
                    createButton('Submit'),
                ],
            }).elem,
        });
    }

    innerButtons() {
        this.addSection({
            id: 'innerButton',
            title: 'Inner buttons',
            content: InputGroup.create({
                children: [
                    createInput({
                        className: 'stretch-input',
                        placeholder: 'Start',
                    }),
                    createInnerButton({ icon: 'close-icon' }),
                    createButton('.00'),
                ],
            }).elem,
        });
    }

    inputOuter() {
        this.addSection({
            id: 'outerContainer',
            title: 'Input outer container',
            content: [
                InputGroup.create({
                    className: 'input-group__input-outer',
                    children: [
                        createInnerButton({ icon: 'search', className: 'search-btn' }),
                        createInput({ className: 'stretch-input' }),
                        createInnerButton({ icon: 'close-icon' }),
                    ],
                }).elem,
                InputGroup.create({
                    children: [
                        createOuterContainer([
                            createInput({ className: 'stretch-input' }),
                            createInnerButton({ icon: 'close-icon' }),
                        ]),
                        createButton('.00'),
                    ],
                }).elem,
                InputGroup.create({
                    children: [
                        createOuterContainer([
                            createInnerButton({ icon: 'search', className: 'search-btn' }),
                            createInnerButton({ icon: 'close-icon' }),
                            createInput({ className: 'stretch-input' }),
                        ]),
                        createButton('.00'),
                    ],
                }).elem,
            ],
        });
    }

    disabled() {
        this.addSection({
            id: 'disabled',
            title: 'Disabled',
            content: [
                InputGroup.create({
                    className: 'input-group__input-outer',
                    children: [
                        createInnerButton({ icon: 'search', className: 'search-btn', enabled: false }),
                        createInput({ className: 'stretch-input', disabled: true }),
                        createInnerButton({ icon: 'close-icon', enabled: false }),
                    ],
                }).elem,
            ],
        });
    }

    parse() {
        this.addSection({
            id: 'parse',
            title: 'Parse component from DOM',
            content: [
                InputGroup.fromElement(ge('parseTarget')).elem,
            ],
        });
    }
}

InputGroupView.create();
