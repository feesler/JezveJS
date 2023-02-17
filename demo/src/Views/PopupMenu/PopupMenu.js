import 'jezvejs/style';
import { createElement, ge, onReady } from 'jezvejs';
import { MenuButton } from 'jezvejs/MenuButton';
import { PopupMenu } from 'jezvejs/PopupMenu';
import { initNavigation } from '../../app.js';
import './style.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initDefault = () => {
    const btn = MenuButton.create();
    ge('defaultContainer').append(btn.elem);

    PopupMenu.create({
        id: 'listMenu',
        attachTo: btn.elem,
        onItemClick: (id) => addEventLog(`Item '${id}' clicked`),
        items: [{
            id: 'selectBtnItem',
            icon: 'select',
            title: 'Button item',
            onClick: () => addEventLog('Button item clicked'),
        }, {
            id: 'linkItem',
            type: 'link',
            title: 'Link item',
            icon: 'search',
            url: '#',
        }, {
            id: 'noIconItem',
            title: 'No icon item',
        }, {
            type: 'separator',
        }, {
            id: 'checkboxItem',
            type: 'checkbox',
            title: 'Checkbox item',
            onChange: (checked) => addEventLog(`Checkbox item toggled: ${checked}`),
        }],
    });
};

const initAttached = () => {
    const menu = PopupMenu.create({
        id: 'contextMenu',
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

    menu.attachTo(ge('attachTarget'));
};

const initClipping = () => {
    const btn = MenuButton.create();
    ge('headerContent').append(btn.elem);

    PopupMenu.create({
        id: 'clipingMenu',
        attachTo: btn.elem,
        items: [{
            icon: 'select',
            title: 'Item 1',
        }, {
            icon: 'search',
            title: 'Item 2',
        }, {
            title: 'Item 3',
        }, {
            type: 'separator',
        }, {
            title: 'Item 4',
        }],
    });
};

const onListMenuClick = (e, menu) => {
    const elem = e.target.closest('.list-item');
    if (!elem) {
        return;
    }
    const btn = elem.querySelector('.menu-btn');
    if (!btn) {
        return;
    }

    menu.attachAndShow(btn);
};

const renderListItem = (id, menu) => (
    createElement('div', {
        props: {
            className: 'list-item',
            dataset: { id },
        },
        children: [
            createElement('span', { props: { textContent: `Item ${id}` } }),
            MenuButton.create({ onClick: (e) => onListMenuClick(e, menu) }).elem,
        ],
    })
);

const initList = () => {
    const menu = PopupMenu.create({
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
        }, {
            id: 'deselectAllBtn',
            title: 'Clear selection',
        }],
    });

    const list = ge('listContainer');
    const itemsCount = 20;
    for (let i = 1; i <= itemsCount; i += 1) {
        const itemElem = renderListItem(i, menu);
        list.append(itemElem);
    }
};

const init = () => {
    initNavigation();

    initDefault();
    initAttached();
    initClipping();
    initList();
};

onReady(init);
