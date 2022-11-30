import 'jezvejs/style';
import { ge, onReady } from 'jezvejs';
import { PopupMenu } from 'jezvejs/PopupMenu';
import { initNavigation } from '../../app.js';
import './style.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initDefault = () => {
    const menu = PopupMenu.create({
        id: 'listMenu',
        items: [{
            icon: 'select',
            title: 'Button item',
            subtitle: 'With subtitle',
            onClick: () => addEventLog('Button item clicked'),
        }, {
            type: 'link',
            title: 'Link item',
            icon: 'search',
            url: '#',
            onClick: () => addEventLog('Link item clicked'),
        }, {
            title: 'No icon item',
            onClick: () => addEventLog('No icon item clicked'),
        }, {
            type: 'separator',
        }, {
            type: 'checkbox',
            title: 'Checkbox item',
            onChange: () => addEventLog('Checkbox item clicked'),
        }],
    });
    ge('default').append(menu.elem);
};

const initAttached = () => {
    const menu = PopupMenu.create({
        id: 'contextMenu',
        attached: true,
        hideOnScroll: false,
        fixed: false,
        items: [{
            id: 'selectModeBtn',
            icon: 'select',
            title: 'Select',
        }, {
            id: 'separator1',
            type: 'separator',
        }, {
            id: 'selectAllBtn',
            title: 'Select all',
        }],
    });

    menu.attachTo(ge('attached'));
};

const init = () => {
    initNavigation();

    initDefault();
    initAttached();
};

onReady(init);
