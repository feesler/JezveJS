import 'jezvejs/style';
import 'jezvejs/style/Button';
import {
    asArray,
    ge,
    onReady,
    setEvents,
} from 'jezvejs';
import { LinkMenu } from 'jezvejs/LinkMenu';
import { initNavigation } from '../../app.js';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initParsed = () => {
    LinkMenu.fromElement(ge('parsed'), {
        itemParam: 'type',
        onChange: (sel) => addEventLog(`Selected: [${asArray(sel).join()}]`),
    });
};

const initDynamicSingle = () => {
    const menu = LinkMenu.create({
        itemParam: 'action',
        items: [
            { icon: 'plus', title: 'Create', value: 'create' },
            { icon: 'update', title: 'Update', value: 'update' },
            { icon: 'del', title: 'Delete', value: 'delete' },
        ],
    });

    ge('dynamic').append(menu.elem);
};

const initDynamicMultiple = () => {
    const menu = LinkMenu.create({
        itemParam: 'action',
        allowActiveLink: true,
        multiple: true,
        items: [
            { title: 'Clear' },
            { title: 'Create', value: 'create' },
            { title: 'Update', value: 'update' },
            { title: 'Delete', value: 'delete' },
        ],
    });

    ge('dynamicMulti').append(menu.elem);
};

const initButtonsType = () => {
    const menu = LinkMenu.create({
        type: 'buttons',
        multiple: true,
        items: [
            { title: 'Create', value: 'create' },
            { title: 'Update', value: 'update' },
            { title: 'Delete', value: 'delete' },
        ],
    });

    ge('buttonTypeContainer').append(menu.elem);
};

const initDisabledItem = () => {
    const menu = LinkMenu.create({
        itemParam: 'action',
        multiple: true,
        items: [
            { title: 'Clear' },
            { title: 'Create', value: 'create' },
            { title: 'Update', value: 'update' },
            { title: 'Delete', value: 'delete', disabled: true },
        ],
    });

    ge('disabledItemContainer').append(menu.elem);

    const btn = ge('toggleEnableItemBtn');
    setEvents(btn, {
        click: () => {
            const item = menu.getItemByValue('delete');
            btn.textContent = (item.disabled) ? 'Disable item' : 'Enable item';
            menu.enableItem('delete', item.disabled);
        },
    });
};

const initHiddenItem = () => {
    const menu = LinkMenu.create({
        itemParam: 'action',
        multiple: true,
        items: [
            { title: 'Clear' },
            { title: 'Create', value: 'create' },
            { title: 'Update', value: 'update' },
            { title: 'Delete', value: 'delete' },
        ],
    });

    ge('hiddenItemContainer').append(menu.elem);

    const btn = ge('toggleShowItemBtn');
    setEvents(btn, {
        click: () => {
            const item = menu.getItemByValue('delete');
            btn.textContent = (item.hidden) ? 'Hide item' : 'Show item';
            menu.showItem('delete', !!item.hidden);
        },
    });
};

const initDisabledComponent = () => {
    const menu = LinkMenu.create({
        itemParam: 'action',
        multiple: true,
        disabled: true,
        items: [
            { title: 'Clear' },
            { title: 'Create', value: 'create' },
            { title: 'Update', value: 'update' },
            { title: 'Delete', value: 'delete', disabled: true },
        ],
    });

    ge('disabledContainer').append(menu.elem);

    const btn = ge('toggleEnableBtn');
    setEvents(btn, {
        click: () => {
            const { enabled } = menu;
            btn.textContent = (enabled) ? 'Enable' : 'Disable';
            menu.enable(!enabled);
        },
    });
};

const init = () => {
    initNavigation();

    initParsed();
    initDynamicSingle();
    initDynamicMultiple();
    initButtonsType();
    initDisabledItem();
    initHiddenItem();
    initDisabledComponent();
};

onReady(init);
