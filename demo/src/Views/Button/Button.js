import 'jezvejs/style';
import { ge, onReady } from 'jezvejs';
import { CloseButton } from 'jezvejs/CloseButton';
import { Button } from 'jezvejs/Button';
import { Icon } from 'jezvejs/Icon';
import { initNavigation } from '../../app.js';
import './ButtonView.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initParsed = () => {
    const inputBtn = Button.fromElement(ge('inputBtn'));
    inputBtn.setTitle('Input button');

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
        type: 'submit',
        icon: 'del',
        className: 'circle-icon',
        onClick: () => addEventLog('Del button clicked'),
    });
    ge('dynamicButton').append(noTitleBtn.elem);
};

const initDynamicLink = () => {
    const btn = Button.create({
        type: 'link',
        title: 'Icon link',
        icon: 'del',
    });
    ge('dynamicLink').append(btn.elem);
};

const initStatic = () => {
    const btn = Button.create({
        type: 'static',
        title: 'Static button',
        icon: 'del',
    });
    ge('staticBtn').append(btn.elem);
};

const initBorder = () => {
    const btn = Button.create({
        title: 'Border',
        className: 'btn-border',
    });
    ge('borderBtn').append(btn.elem);
};

const initCustomContent = () => {
    const icon = Icon.create({
        icon: 'del',
        className: 'btn__icon',
    });

    const btn = Button.create({
        title: ['Custom', icon.elem],
    });
    ge('customBtn').append(btn.elem);
};

const initBackground = () => {
    const btn = Button.create({
        title: 'Button title',
        icon: 'calendar-icon',
        className: 'bg-btn',
    });
    ge('backgroundBtn').append(btn.elem);
};

const initFullWidth = () => {
    const btn = Button.create({
        title: 'Button title',
        icon: 'calendar-icon',
        className: 'bg-btn',
    });
    ge('fullwidthContainer').append(btn.elem);
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

    ge('disabledContainer').append(disabledBtn.elem, disabledLink.elem);

    const toggleEnableButtonBtn = Button.fromElement(ge('toggleEnableButtonBtn'), {
        onClick: () => {
            const { enabled } = disabledBtn;
            toggleEnableButtonBtn.setTitle((enabled) ? 'Enable button' : 'Disable button');
            disabledBtn.enable(!enabled);
        },
    });

    const toggleEnableLinkBtn = Button.fromElement(ge('toggleEnableLinkBtn'), {
        onClick: () => {
            const { enabled } = disabledLink;
            toggleEnableLinkBtn.setTitle((enabled) ? 'Enable link' : 'Disable link');
            disabledLink.enable(!enabled);
        },
    });

    const toggleIconBtn = Button.fromElement(ge('toggleIconBtn'), {
        onClick: () => {
            const { icon } = disabledBtn.state;
            toggleIconBtn.setTitle((icon) ? 'Add icon' : 'Remove icon');
            disabledBtn.setIcon((icon) ? null : btnIcon);
        },
    });

    const toggleTitleBtn = Button.fromElement(ge('toggleTitleBtn'), {
        onClick: () => {
            const { title } = disabledBtn.state;
            toggleTitleBtn.setTitle((title) ? 'Add title' : 'Remove title');
            disabledBtn.setTitle((title) ? null : btnTitle);
        },
    });
};

const init = () => {
    initNavigation();

    initParsed();
    initDynamicButton();
    initDynamicLink();
    initStatic();

    initBorder();
    initCustomContent();
    initBackground();
    initFullWidth();
    initCloseBtn();
    initNoTitle();
    initNoIcon();
    initDisabled();
};

onReady(init);
