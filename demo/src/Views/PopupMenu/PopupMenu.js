import 'jezvejs/style';
import { createElement, enable } from '@jezvejs/dom';
import { MenuButton } from 'jezvejs/MenuButton';
import { PopupMenu } from 'jezvejs/PopupMenu';

import { createContainer } from '../../Application/utils.js';

// Icons
import { SelectIcon } from '../../assets/icons/SelectIcon.js';
import { SearchIcon } from '../../assets/icons/SearchIcon.js';
import { GlyphIcon } from '../../assets/icons/GlyphIcon.js';

// Common components
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import {
    renderListItem,
    getDefaultItems,
} from './helpers.js';

import './PopupMenuView.scss';

/**
 * PopupMenu component demo view
 */
class PopupMenuView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('PopupMenu');

        this.initDefault();
        this.initToggleOnClick();
        this.initHideOnSelect();
        this.initNested();
        this.initAttached();
        this.initClipping();
        this.initList();
    }

    initDefault() {
        const logsField = LogsField.create();
        const btn = MenuButton.create();
        const container = createElement('div', {
            id: 'defaultContainer',
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
            description: 'With disabled \'toggleOnClick\' option default handler toggling menu by click will not be added to the host element.',
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
            id: 'hideOnSelectContainer',
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

    get1stLevelChildMenu(logsField) {
        const menu = PopupMenu.create({
            id: 'childMenu1stLevel',
            multiple: true,
            position: 'right-start',
            preventNavigation: true,
            onItemClick: (id) => {
                logsField.write(`Item '${id}' clicked`);
            },
            items: [{
                id: 'item1',
                icon: SelectIcon(),
                title: 'Child item 1',
            }, {
                id: 'item2',
                icon: SearchIcon(),
                title: 'Child item 2',
            }, {
                id: 'item3',
                title: 'Child item 3',
            }, {
                id: 'separator1',
                type: 'separator',
            }, {
                id: 'item4',
                title: 'Child item 4',
                icon: GlyphIcon(),
                iconAlign: 'right',
                submenuParent: true,
                onClick: () => {
                    const childMenuProps = this.get2ndLevelChildMenuProps(logsField);
                    menu.createChildMenu('item4', childMenuProps);
                },
            }],
        });

        return menu;
    }

    get2ndLevelChildMenuProps(logsField) {
        return {
            id: 'childMenu2ndLevel',
            multiple: true,
            position: 'right-start',
            preventNavigation: true,
            onItemClick: (id) => {
                logsField.write(`Item '${id}' clicked`);
            },
            items: [{
                id: 'item1',
                icon: SelectIcon(),
                title: 'Child item 1',
            }, {
                id: 'item2',
                icon: SearchIcon(),
                title: 'Child item 2',
            }, {
                id: 'item3',
                title: 'Child item 3',
            }, {
                id: 'separator1',
                type: 'separator',
            }, {
                id: 'item4',
                title: 'Child item 4',
            }],
        };
    }

    initNested() {
        const logsField = LogsField.create();
        const btn = MenuButton.create();
        const container = createElement('div', {
            id: 'nestedContainer',
            children: btn.elem,
        });

        const items = getDefaultItems(logsField);
        items.push({
            id: 'nestedParentItem1',
            title: 'Nested menu 1',
            icon: GlyphIcon(),
            iconAlign: 'right',
            submenuParent: true,
        }, {
            id: 'nestedParentItem2',
            title: 'Nested menu 2',
            icon: GlyphIcon(),
            iconAlign: 'right',
            submenuParent: true,
        });

        const menu = PopupMenu.create({
            id: 'nestedParentMenu',
            attachTo: btn.elem,
            multiple: true,
            hideOnSelect: true,
            preventNavigation: true,
            items,
            onItemClick: (id) => {
                logsField.write(`Item '${id}' clicked`);

                if (id === 'nestedParentItem1') {
                    menu.createChildMenu(id, this.get1stLevelChildMenu(logsField));
                } else if (id === 'nestedParentItem2') {
                    menu.createChildMenu(id, this.get2ndLevelChildMenuProps(logsField));
                }
            },
        });

        this.addSection({
            id: 'nested',
            title: 'Nested menus',
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
                icon: SelectIcon(),
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
            id: 'attachTarget', className: 'block',
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
            className: 'nav-header__content',
            children: btn.elem,
        });
        this.header.elem.append(headerContent);

        PopupMenu.create({
            id: 'clippingMenu',
            attachTo: btn.elem,
            items: [{
                id: 'item1',
                icon: SelectIcon(),
                title: 'Item 1',
            }, {
                id: 'item2',
                icon: SearchIcon(),
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
            icon: SelectIcon(),
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
            id: 'listContainer',
            className: 'list',
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
            description: 'Popup menu should be opened on click by menu button of disabled list item.',
            content: list,
        });
    }
}

PopupMenuView.create();
