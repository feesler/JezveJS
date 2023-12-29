import 'jezvejs/style';
import { enable } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { InputGroup } from 'jezvejs/InputGroup';

// Icons
import { SmallCloseIcon } from '../../assets/icons/SmallCloseIcon.js';
import { SearchIcon } from '../../assets/icons/SearchIcon.js';

import { createContainer, createControls } from '../../Application/utils.js';
import { DemoView } from '../../Components/DemoView/DemoView.js';

import {
    createInput,
    createText,
    createButton,
    createInnerButton,
    createOuterContainer,
} from './helpers.js';
import './InputGroupView.scss';

/**
 * InputGroup component demo view
 */
class InputGroupView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('InputGroup');

        this.text();
        this.buttons();
        this.multipleInputs();
        this.innerButtons();
        this.inputOuter();
        this.disabled();
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
                    createInnerButton({ icon: SmallCloseIcon() }),
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
                        createInnerButton({ icon: SearchIcon(), className: 'search-btn' }),
                        createInput({ className: 'stretch-input' }),
                        createInnerButton({ icon: SmallCloseIcon() }),
                    ],
                }).elem,
                InputGroup.create({
                    children: [
                        createOuterContainer([
                            createInput({ className: 'stretch-input' }),
                            createInnerButton({ icon: SmallCloseIcon() }),
                        ]),
                        createButton('.00'),
                    ],
                }).elem,
                InputGroup.create({
                    children: [
                        createOuterContainer([
                            createInnerButton({ icon: SearchIcon(), className: 'search-btn' }),
                            createInnerButton({ icon: SmallCloseIcon() }),
                            createInput({ className: 'stretch-input' }),
                        ]),
                        createButton('.00'),
                    ],
                }).elem,
            ],
        });
    }

    disabled() {
        const searchButton = createInnerButton({
            icon: SearchIcon(),
            className: 'search-btn',
            enabled: false,
        });
        const input = createInput({ className: 'stretch-input', disabled: true });
        const closeBtn = createInnerButton({ icon: SmallCloseIcon(), enabled: false });

        const inputGroup = InputGroup.create({
            className: 'input-group__input-outer',
            children: [
                searchButton,
                input,
                closeBtn,
            ],
        });

        const toggleEnableBtn = Button.create({
            id: 'toggleEnableBtn',
            className: 'action-btn',
            title: 'Enable',
            onClick: () => {
                const { disabled } = searchButton;
                toggleEnableBtn.setTitle((disabled) ? 'Disable' : 'Enable');
                enable(inputGroup.elem, disabled);
                enable(searchButton, disabled);
                enable(input, disabled);
                enable(closeBtn, disabled);
            },
        });

        this.addSection({
            id: 'disabled',
            title: 'Disabled',
            content: [
                createContainer('disabledContainer', inputGroup.elem),
                createControls(toggleEnableBtn.elem),
            ],
        });
    }
}

InputGroupView.create();
