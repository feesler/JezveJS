import 'jezvejs/style';
import { ge, setEvents, onReady } from 'jezvejs';
import { IconButton } from 'jezvejs/IconButton';
import { initNavigation } from '../../app.js';
import './style.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initParsed = () => {
    IconButton.fromElement(ge('createBtn'));
    IconButton.fromElement(ge('updateBtn'));
};

const initDynamicButton = () => {
    const dynamicBtn = IconButton.create({
        title: 'Icon button',
        icon: 'update',
        className: 'circle-icon',
        onClick: () => addEventLog('Update button clicked'),
    });
    ge('dynamicButton').append(dynamicBtn.elem);

    const noTitleBtn = IconButton.create({
        icon: 'del',
        className: 'circle-icon',
        onClick: () => addEventLog('Del button clicked'),
    });
    ge('dynamicButton').append(noTitleBtn.elem);
};

const initDynamicLink = () => {
    const dynamicLink = IconButton.create({
        type: 'link',
        title: 'Icon link',
        icon: 'del',
    });
    ge('dynamicLink').append(dynamicLink.elem);
};

const initSubtitle = () => {
    const subtitleBtn = IconButton.create({
        title: 'Button title',
        subtitle: 'Subtitle',
        icon: 'calendar-icon',
        className: 'bg-btn',
    });
    ge('subtitle').append(subtitleBtn.elem);
};

const initNoIcon = () => {
    const noIconBtn = IconButton.create({
        title: 'No icon',
    });
    ge('noIcon').append(noIconBtn.elem);
};

const initDisabled = () => {
    const disabledBtn = IconButton.create({
        title: 'Disabled button',
        icon: 'plus',
        enabled: false,
    });
    const disabledLink = IconButton.create({
        type: 'link',
        url: '#disabled',
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
    initSubtitle();
    initNoIcon();
    initDisabled();
};

onReady(init);
