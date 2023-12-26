import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { CloseButton } from 'jezvejs/CloseButton';
import { Button } from 'jezvejs/Button';
import { Icon } from 'jezvejs/Icon';

import { createControls } from '../../Application/utils.js';

// Icons
import { PlusIcon } from '../../assets/icons/PlusIcon.js';
import { UpdateIcon } from '../../assets/icons/UpdateIcon.js';
import { DeleteIcon } from '../../assets/icons/DeleteIcon.js';
import { CalendarIcon } from '../../assets/icons/CalendarIcon.js';

// Common components
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import './ButtonView.scss';

/**
 * Button component demo view
 */
class ButtonView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Button');

        this.initParsed();
        this.initDynamicButton();
        this.initDynamicLink();
        this.initStatic();

        this.initBorder();
        this.initIconAlign();
        this.initCustomContent();
        this.initBackground();
        this.initFullWidth();
        this.initCloseBtn();
        this.initNoTitle();
        this.initNoIcon();
        this.initDisabled();
    }

    initParsed() {
        // Parse INPUT element
        const inputElem = createElement('input', {
            props: {
                id: 'inputBtn',
                className: 'btn',
                type: 'button',
                value: 'Input',
            },
        });

        const inputBtn = Button.fromElement(inputElem);
        inputBtn.setTitle('Input button');

        // Parse BUTTON element
        const createBtnElem = createElement('button', {
            props: {
                id: 'createBtn',
                className: 'btn',
                type: 'button',
            },
            children: [
                PlusIcon({ class: 'btn__icon' }),
                createElement('span', {
                    props: {
                        className: 'btn__content',
                        textContent: 'Create',
                    },
                }),
            ],
        });
        const createBtn = Button.fromElement(createBtnElem);

        // Check icon update after parse
        const updateBtnElem = createElement('button', {
            props: {
                id: 'updateBtn',
                className: 'btn',
                type: 'button',
                textContent: 'Update',
            },
        });
        const updateBtn = Button.fromElement(updateBtnElem);
        updateBtn.setIcon(UpdateIcon());

        // Parse DIV element
        const deleteBtnElem = createElement('button', {
            props: {
                id: 'deleteBtn',
                className: 'btn',
                type: 'button',
            },
            children: [
                DeleteIcon({ class: 'btn__icon' }),
                createElement('span', {
                    props: {
                        className: 'btn__content',
                        textContent: 'Delete',
                    },
                }),
            ],
        });
        const deleteBtn = Button.fromElement(deleteBtnElem);

        const container = createElement('div', {
            props: { className: 'buttons-list' },
            children: [
                inputBtn.elem,
                createBtn.elem,
                updateBtn.elem,
                deleteBtn.elem,
            ],
        });

        this.addSection({
            id: 'parse',
            title: 'Parse component from DOM',
            content: container,
        });
    }

    initDynamicButton() {
        const logsField = LogsField.create();

        const dynamicBtn = Button.create({
            title: 'Icon button',
            tooltip: 'Custom tooltip',
            icon: UpdateIcon(),
            className: 'circle-icon',
            onClick: () => logsField?.write('Update button clicked'),
        });

        const noTitleBtn = Button.create({
            type: 'submit',
            icon: DeleteIcon(),
            tooltip: 'No title button',
            className: 'circle-icon',
            onClick: () => logsField?.write('Del button clicked'),
        });

        const container = createElement('div', {
            props: { className: 'buttons-list' },
            children: [dynamicBtn.elem, noTitleBtn.elem],
        });

        this.addSection({
            id: 'button',
            title: 'Button component',
            content: [container, logsField.elem],
        });
    }

    initDynamicLink() {
        const btn = Button.create({
            type: 'link',
            title: 'Icon link',
            icon: DeleteIcon(),
        });

        this.addSection({
            id: 'link',
            title: 'Link component',
            content: createElement('div', { children: btn.elem }),
        });
    }

    initStatic() {
        const btn = Button.create({
            type: 'static',
            title: 'Static button',
            icon: DeleteIcon(),
        });

        this.addSection({
            id: 'static',
            title: 'Static component',
            content: createElement('div', { children: btn.elem }),
        });
    }

    initBorder() {
        const btn = Button.create({
            title: 'Border',
            className: 'btn-border',
        });

        this.addSection({
            id: 'border',
            title: 'Styled border',
            content: createElement('div', { children: btn.elem }),
        });
    }

    initIconAlign() {
        const btn = Button.create({
            icon: DeleteIcon(),
            iconAlign: 'right',
            title: 'Border',
            className: 'btn-border',
        });

        this.addSection({
            id: 'iconAlign',
            title: 'Icon alignment',
            description: '\'iconAlign\' option with available values: \'left\' and \'right\'. Default is \'left\'.',
            content: createElement('div', { children: btn.elem }),
        });
    }

    initCustomContent() {
        const icon = Icon.create({
            icon: DeleteIcon(),
            className: 'btn__icon',
        });
        const btn = Button.create({
            title: ['Custom', icon.elem],
        });

        this.addSection({
            id: 'custom',
            title: 'Custom content',
            content: createElement('div', { children: btn.elem }),
        });
    }

    initBackground() {
        const btn = Button.create({
            title: 'Button title',
            icon: CalendarIcon(),
            className: 'bg-btn',
        });

        this.addSection({
            id: 'background',
            title: 'Styled background',
            content: createElement('div', { children: btn.elem }),
        });
    }

    initFullWidth() {
        const btn = Button.create({
            title: 'Button title',
            icon: CalendarIcon(),
            className: 'bg-btn',
        });

        const container = createElement('div', {
            props: { className: 'fullwidth-container' },
            children: btn.elem,
        });

        this.addSection({
            id: 'fullwidth',
            title: 'Full width',
            content: container,
        });
    }

    initCloseBtn() {
        const btn = CloseButton.create({ small: false });
        const btnSmall = CloseButton.create();

        const container = createElement('div', {
            props: { className: 'buttons-list' },
            children: [btn.elem, btnSmall.elem],
        });

        this.addSection({
            id: 'close',
            title: 'Close button',
            content: container,
        });
    }

    initNoTitle() {
        const btn = Button.create({
            icon: CalendarIcon(),
        });

        const container = createElement('div', {
            props: { className: 'buttons-list' },
            children: btn.elem,
        });

        this.addSection({
            id: 'notitle',
            title: 'No title',
            content: container,
        });
    }

    initNoIcon() {
        const noIconBtn = Button.create({
            title: 'No icon',
        });

        const container = createElement('div', {
            props: { className: 'buttons-list' },
            children: [noIconBtn.elem],
        });

        this.addSection({
            id: 'noicon',
            title: 'No icon',
            content: container,
        });
    }

    initDisabled() {
        const btnTitle = 'Disabled button';
        const btnIcon = PlusIcon();

        const disabledBtn = Button.create({
            title: btnTitle,
            icon: btnIcon,
            enabled: false,
        });
        const disabledLink = Button.create({
            type: 'link',
            url: '#',
            title: 'Disabled link',
            icon: UpdateIcon(),
            enabled: false,
        });

        const container = createElement('div', {
            props: { className: 'buttons-list' },
            children: [disabledBtn.elem, disabledLink.elem],
        });

        // Controls
        const toggleEnableButtonBtn = Button.create({
            title: 'Enable button',
            className: 'action-btn',
            onClick: () => {
                const { enabled } = disabledBtn;
                toggleEnableButtonBtn.setTitle((enabled) ? 'Enable button' : 'Disable button');
                disabledBtn.enable(!enabled);
            },
        });

        const toggleEnableLinkBtn = Button.create({
            title: 'Enable link',
            className: 'action-btn',
            onClick: () => {
                const { enabled } = disabledLink;
                toggleEnableLinkBtn.setTitle((enabled) ? 'Enable link' : 'Disable link');
                disabledLink.enable(!enabled);
            },
        });

        const toggleIconBtn = Button.create({
            title: 'Remove icon',
            className: 'action-btn',
            onClick: () => {
                const { icon } = disabledBtn.state;
                toggleIconBtn.setTitle((icon) ? 'Add icon' : 'Remove icon');
                disabledBtn.setIcon((icon) ? null : btnIcon);
            },
        });

        const toggleTitleBtn = Button.create({
            title: 'Remove title',
            className: 'action-btn',
            onClick: () => {
                const { title } = disabledBtn.state;
                toggleTitleBtn.setTitle((title) ? 'Add title' : 'Remove title');
                disabledBtn.setTitle((title) ? null : btnTitle);
            },
        });

        const controls = createControls([
            toggleEnableButtonBtn.elem,
            toggleEnableLinkBtn.elem,
            toggleIconBtn.elem,
            toggleTitleBtn.elem,
        ]);

        this.addSection({
            id: 'disabled',
            title: 'Disabled component',
            content: [container, controls],
        });
    }
}

ButtonView.create();
