import 'jezvejs/style';
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

    const toggleEnableBtn = ge('toggleEnableBtn');
    setEvents(toggleEnableBtn, {
        click: () => {
            const { enabled } = menu;
            toggleEnableBtn.textContent = (enabled) ? 'Enable' : 'Disable';
            menu.enable(!enabled);
        },
    });
};

const init = () => {
    initNavigation();

    initParsed();
    initDynamicSingle();
    initDynamicMultiple();
};

onReady(init);
