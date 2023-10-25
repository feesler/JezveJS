import 'jezvejs/style';
import { createElement, enable } from '@jezvejs/dom';
import { MenuButton } from 'jezvejs/MenuButton';
import { PopupMenu } from 'jezvejs/PopupMenu';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import './PopupMenuView.scss';
import { createContainer } from '../../Application/utils.js';

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

const getDefaultItems = (logsField) => ([{
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
}]);

/**
 * PopupMenu component demio view
 */
class PopupMenuView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDefault();
        this.initToggleOnClick();
        this.initHideOnSelect();
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
            multiple: true,
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: getDefaultItems(logsField),
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

    initToggleOnClick() {
        const logsField = LogsField.create();
        let menu = null;

        const btn = MenuButton.create({
            onClick: () => menu.showMenu(),
        });

        menu = PopupMenu.create({
            id: 'toggleOnClickMenu',
            attachTo: btn.elem,
            multiple: true,
            toggleOnClick: false,
            preventNavigation: true,
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: getDefaultItems(logsField),
        });

        this.addSection({
            id: 'toggleOnClick',
            title: '\'toggleOnClick\' option',
            description: 'With disabled \'toggleOnClick\' option menu will not be opened/closed by click on host element.',
            content: [
                createContainer('toggleOnClickContainer', btn.elem),
                logsField.elem,
            ],
        });
    }

    initHideOnSelect() {
        const logsField = LogsField.create();
        const btn = MenuButton.create();
        const container = createElement('div', {
            props: { id: 'hideOnSelectContainer' },
            children: btn.elem,
        });

        PopupMenu.create({
            id: 'hideOnSelectMenu',
            attachTo: btn.elem,
            multiple: true,
            hideOnSelect: false,
            preventNavigation: true,
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: getDefaultItems(logsField),
        });

        this.addSection({
            id: 'hideOnSelect',
            title: '\'hideOnSelect\' option',
            description: 'With disabled \'hideOnSelect\' option popup will stay open after selecting the menu item.',
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
        const headerContent = createElement('div', {
            props: { className: 'nav-header__content' },
            children: btn.elem,
        });
        this.header.elem.append(headerContent);

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
        const titleElem = elem.querySelector(':scope > span');
        const title = titleElem?.textContent;

        menu.setItems([{
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
        }, {
            id: 'separator2',
            type: 'separator',
        }, {
            id: 'updateItemBtn',
            type: 'link',
            url: '#123',
            title: `Edit '${title}' ...`,
        }]);

        menu.attachAndShow(btn);
    }

    initList() {
        const menu = PopupMenu.create({
            id: 'listMenu',
            fixed: false,
            preventNavigation: true,
            onItemClick: () => menu.hideMenu(),
            onClose: () => menu.hideMenu(),
        });

        const list = createElement('div', {
            props: { id: 'listContainer', className: 'list' },
            events: { click: (e) => this.onListMenuClick(e, menu) },
        });

        const itemsCount = 20;
        for (let i = 1; i <= itemsCount; i += 1) {
            const itemElem = renderListItem(i);
            if (i === 2) {
                enable(itemElem, false);
            }
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
