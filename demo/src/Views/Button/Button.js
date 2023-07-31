import 'jezvejs/style';
import { createElement, ge } from 'jezvejs';
import { CloseButton } from 'jezvejs/CloseButton';
import { Button } from 'jezvejs/Button';
import { Icon } from 'jezvejs/Icon';

import { DemoView } from '../../Application/DemoView.js';
import './ButtonView.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

class ButtonView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initParsed();
        this.initDynamicButton();
        this.initDynamicLink();
        this.initStatic();

        this.initBorder();
        this.initCustomContent();
        this.initBackground();
        this.initFullWidth();
        this.initCloseBtn();
        this.initNoTitle();
        this.initNoIcon();
        this.initDisabled();
    }

    initParsed() {
        const inputBtn = Button.fromElement(ge('inputBtn'));
        inputBtn.setTitle('Input button');

        const createBtn = Button.fromElement(ge('createBtn'));
        const updateBtn = Button.fromElement(ge('updateBtn'));
        const deleteBtn = Button.fromElement(ge('deleteBtn'));

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
        const dynamicBtn = Button.create({
            title: 'Icon button',
            icon: 'update',
            className: 'circle-icon',
            onClick: () => addEventLog('Update button clicked'),
        });

        const noTitleBtn = Button.create({
            type: 'submit',
            icon: 'del',
            className: 'circle-icon',
            onClick: () => addEventLog('Del button clicked'),
        });

        const container = createElement('div', {
            props: { className: 'buttons-list' },
            children: [dynamicBtn.elem, noTitleBtn.elem],
        });

        const logsContainer = createElement('div', {
            props: { className: 'logs-container' },
            children: [
                createElement('label', { props: { textContent: 'Events log' } }),
                createElement('textarea', { props: { id: 'eventsLog' } }),
            ],
        });

        this.addSection({
            id: 'button',
            title: 'Button component',
            content: [container, logsContainer],
        });
    }

    initDynamicLink() {
        const btn = Button.create({
            type: 'link',
            title: 'Icon link',
            icon: 'del',
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
            icon: 'del',
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

    initCustomContent() {
        const icon = Icon.create({
            icon: 'del',
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
            icon: 'calendar-icon',
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
            icon: 'calendar-icon',
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
            icon: 'calendar-icon',
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
        const btnIcon = 'plus';

        const disabledBtn = Button.create({
            title: btnTitle,
            icon: btnIcon,
            enabled: false,
        });
        const disabledLink = Button.create({
            type: 'link',
            url: '#',
            title: 'Disabled link',
            icon: 'update',
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
            title: 'Remove link',
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

        const controls = createElement('div', {
            props: { className: 'section-controls' },
            children: [
                toggleEnableButtonBtn.elem,
                toggleEnableLinkBtn.elem,
                toggleIconBtn.elem,
                toggleTitleBtn.elem,
            ],
        });

        this.addSection({
            id: 'disabled',
            title: 'Disabled component',
            content: [container, controls],
        });
    }
}

ButtonView.create();
