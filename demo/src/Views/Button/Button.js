import 'jezvejs/style';
import { ge, setEvents, onReady } from 'jezvejs';
import { CloseButton } from 'jezvejs/CloseButton';
import { Button } from 'jezvejs/Button';
import { initNavigation } from '../../app.js';
import './style.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initParsed = () => {
    Button.fromElement(ge('createBtn'));
    Button.fromElement(ge('updateBtn'));
    Button.fromElement(ge('deleteBtn'));
};

const initDynamicButton = () => {
    const dynamicBtn = Button.create({
        title: 'Icon button',
        icon: 'update',
        className: 'circle-icon',
        onClick: () => addEventLog('Update button clicked'),
    });
    ge('dynamicButton').append(dynamicBtn.elem);

    const noTitleBtn = Button.create({
        icon: 'del',
        className: 'circle-icon',
        onClick: () => addEventLog('Del button clicked'),
    });
    ge('dynamicButton').append(noTitleBtn.elem);
};

const initDynamicLink = () => {
    const dynamicLink = Button.create({
        type: 'link',
        title: 'Icon link',
        icon: 'del',
    });
    ge('dynamicLink').append(dynamicLink.elem);
};

const initStatic = () => {
    const dynamicLink = Button.create({
        type: 'static',
        title: 'Static button',
        icon: 'del',
    });
    ge('staticBtn').append(dynamicLink.elem);
};

const initBackground = () => {
    const btn = Button.create({
        title: 'Button title',
        icon: 'calendar-icon',
        className: 'bg-btn',
    });
    ge('backgroundBtn').append(btn.elem);
};

const initCloseBtn = () => {
    const btn = CloseButton.create();
    ge('closeBtn').append(btn.elem);
};

const initNoTitle = () => {
    const btn = Button.create({
        icon: 'calendar-icon',
    });
    ge('noTitleBtn').append(btn.elem);
};

const initNoIcon = () => {
    const noIconBtn = Button.create({
        title: 'No icon',
    });
    ge('noIconBtn').append(noIconBtn.elem);
};

const initDisabled = () => {
    const disabledBtn = Button.create({
        title: 'Disabled button',
        icon: 'plus',
        enabled: false,
    });
    const disabledLink = Button.create({
        type: 'link',
        url: '#',
        title: 'Disabled link',
        icon: 'update',
        enabled: false,
    });

    ge('disabledContainer').append(disabledBtn.elem, disabledLink.elem);

    const toggleEnableButtonBtn = ge('toggleEnableButtonBtn');
    setEvents(toggleEnableButtonBtn, {
        click: () => {
            const { enabled } = disabledBtn;
            toggleEnableButtonBtn.textContent = (enabled) ? 'Enable button' : 'Disable button';
            disabledBtn.enable(!enabled);
        },
    });

    const toggleEnableLinkBtn = ge('toggleEnableLinkBtn');
    setEvents(toggleEnableLinkBtn, {
        click: () => {
            const { enabled } = disabledLink;
            toggleEnableLinkBtn.textContent = (enabled) ? 'Enable link' : 'Disable link';
            disabledLink.enable(!enabled);
        },
    });
};

const init = () => {
    initNavigation();

    initParsed();
    initDynamicButton();
    initDynamicLink();
    initStatic();
    initBackground();
    initCloseBtn();
    initNoTitle();
    initNoIcon();
    initDisabled();
};

onReady(init);
