import 'jezvejs/style';
import { createElement, ge } from 'jezvejs';
import { MenuButton } from 'jezvejs/MenuButton';
import { PopupMenu } from 'jezvejs/PopupMenu';

import { DemoView } from '../../Application/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import './PopupMenuView.scss';

const renderListItem = (id) => (
    createElement('div', {
        props: {
            className: 'list-item',
            dataset: { id },
        },
        children: [
            createElement('span', { props: { textContent: `Item ${id}` } }),
            MenuButton.create().elem,
        ],
    })
);

/**
 * PopupMenu component demio view
 */
class PopupMenuView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDefault();
        this.initAttached();
        this.initClipping();
        this.initList();
    }

    initDefault() {
        const logsField = LogsField.create();
        const btn = MenuButton.create();
        const container = createElement('div', {
            props: { id: 'defaultContainer' },
            children: btn.elem,
        });

        PopupMenu.create({
            id: 'defaultMenu',
            attachTo: btn.elem,
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: [{
                id: 'selectBtnItem',
                icon: 'select',
                title: 'Button item',
                onClick: () => logsField.write('Button item clicked'),
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
                id: 'separator1',
                type: 'separator',
            }, {
                id: 'checkboxItem',
                type: 'checkbox',
                title: 'Checkbox item',
                onClick: (checked) => logsField.write(`Checkbox item toggled: ${checked}`),
            }],
        });

        this.addSection({
            id: 'attach',
            title: 'Attach to button',
            content: [
                container,
                logsField.elem,
            ],
        });
    }

    initAttached() {
        const menu = PopupMenu.create({
            id: 'absPosMenu',
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

        const attachTarget = createElement('div', {
            props: { id: 'attachTarget', className: 'block' },
        });

        this.addSection({
            id: 'absolute',
            title: 'Absolute position',
            description: '+ disabled \'hideOnScroll\' option',
            content: attachTarget,
        });

        menu.attachTo(attachTarget);
    }

    initClipping() {
        const btn = MenuButton.create();
        ge('headerContent').append(btn.elem);

        PopupMenu.create({
            id: 'clippingMenu',
            attachTo: btn.elem,
            items: [{
                id: 'item1',
                icon: 'select',
                title: 'Item 1',
            }, {
                id: 'item2',
                icon: 'search',
                title: 'Item 2',
            }, {
                id: 'item3',
                title: 'Item 3',
            }, {
                id: 'separator1',
                type: 'separator',
            }, {
                id: 'item4',
                title: 'Item 4',
            }],
        });
    }

    onListMenuClick(e, menu) {
        const elem = e.target.closest('.list-item');
        if (!elem) {
            return;
        }
        const btn = elem.querySelector('.menu-btn');
        if (!btn) {
            return;
        }

        menu.attachAndShow(btn);
    }

    initList() {
        const menu = PopupMenu.create({
            id: 'listMenu',
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

        const list = createElement('div', {
            props: { id: 'listContainer', className: 'list' },
            events: { click: (e) => this.onListMenuClick(e, menu) },
        });

        const itemsCount = 20;
        for (let i = 1; i <= itemsCount; i += 1) {
            const itemElem = renderListItem(i);
            list.append(itemElem);
        }

        this.addSection({
            id: 'list',
            title: 'Attach to list item',
            content: list,
        });
    }
}

PopupMenuView.create();
