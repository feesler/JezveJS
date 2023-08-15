import 'jezvejs/style';
import { Menu } from 'jezvejs/Menu';

import { DemoView } from '../../Application/DemoView.js';
import { createContainer } from '../../Application/utils.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import { CheckboxGroupsMenu } from './components/CheckboxGroupsMenu/CheckboxGroupsMenu.js';
import { CollapsibleGroupsMenu } from './components/CollapsibleGroupsMenu/CollapsibleGroupsMenu.js';
import './MenuView.scss';

const initItems = (title, count, startFrom = 1) => {
    const res = [];

    for (let ind = startFrom; ind < startFrom + count - 1; ind += 1) {
        res.push({ id: ind, title: `${title} ${ind}` });
    }

    return res;
};

/**
 * Menu component demio view
 */
class MenuView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDefault();
        this.initHorizontal();
        this.initIcons();
        this.initScroll();
        this.initGroups();
        this.initCheckboxGroups();
        this.initCollapsibleGroups();
        this.initDisabledItem();
    }

    initDefault() {
        const logsField = LogsField.create();

        const menu = Menu.create({
            id: 'defaultMenu',
            beforeContent: true,
            multiple: true,
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: [{
                id: 'selectBtnItem',
                icon: 'select',
                title: 'Button item',
                onClick: () => logsField.write('Button item clicked'),
            }, {
                id: 'separator1',
                type: 'separator',
            }, {
                id: 'linkItem',
                type: 'link',
                title: 'Link item',
                icon: 'search',
                url: '#123',
            }, {
                id: 'noIconItem',
                title: 'No icon item',
            }, {
                id: 'checkboxItem',
                type: 'checkbox',
                title: 'Checkbox item',
                onChange: (checked) => logsField.write(`Checkbox item toggled: ${checked}`),
            }],
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                createContainer('defaultContainer', menu.elem),
                logsField.elem,
            ],
        });
    }

    initHorizontal() {
        const menu = Menu.create({
            id: 'horizontalMenu',
            className: 'horizontal-menu',
            items: [{
                id: 'selectBtnItem',
                title: 'Button item',
            }, {
                id: 'separator1',
                type: 'separator',
            }, {
                id: 'linkItem',
                type: 'link',
                title: 'Link item',
                url: '#123',
            }, {
                id: 'noIconItem',
                title: 'Item 3',
            }],
        });

        this.addSection({
            id: 'horizontal',
            title: 'Horizontal menu',
            content: [
                createContainer('horizontalContainer', menu.elem),
            ],
        });
    }

    initIcons() {
        const logsField = LogsField.create();

        const menu = Menu.create({
            id: 'iconsMenu',
            afterContent: true,
            checkboxSide: 'right',
            multiple: true,
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: [{
                id: 'selectBtnItem',
                iconAfter: 'select',
                title: 'Button item',
                onClick: () => logsField.write('Button item clicked'),
            }, {
                id: 'separator1',
                type: 'separator',
            }, {
                id: 'linkItem',
                type: 'link',
                title: 'Link item',
                iconAfter: 'search',
                url: '#',
            }, {
                id: 'noIconItem',
                title: 'No icon item',
            }, {
                id: 'checkboxItem',
                type: 'checkbox',
                title: 'Checkbox item',
            }],
        });

        this.addSection({
            id: 'icons',
            title: 'Icons',
            content: [
                createContainer('defaultContainer', menu.elem),
                logsField.elem,
            ],
        });
    }

    initScroll() {
        const logsField = LogsField.create();

        const menu = Menu.create({
            id: 'scrollMenu',
            className: 'scroll-menu',
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: initItems('Menu item', 30),
        });

        this.addSection({
            id: 'scroll',
            title: 'Scroll',
            description: 'With keyboard support',
            content: [
                createContainer('scrollContainer', menu.elem),
                logsField.elem,
            ],
        });
    }

    initGroups() {
        const logsField = LogsField.create();

        const menu = Menu.create({
            id: 'groupsMenu',
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: [{
                id: 'noGroupItem1',
                title: 'No group item 1',
            }, {
                id: 'group1',
                type: 'group',
                title: 'Group 1',
                items: [{
                    id: 'groupItem11',
                    title: 'Group 1 item 1',
                }, {
                    id: 'groupItem12',
                    title: 'Group 1 item 2',
                }, {
                    id: 'groupItem13',
                    title: 'Group 1 item 3',
                }],
            }, {
                id: 'noGroupItem2',
                title: 'No group item 2',
            }, {
                id: 'group2',
                type: 'group',
                title: 'Group 2',
                items: [{
                    id: 'groupItem21',
                    title: 'Group 2 item 1',
                }],
            }, {
                id: 'noGroupItem3',
                title: 'No group item 3',
            }],
        });

        this.addSection({
            id: 'groups',
            title: 'Groups',
            content: [
                createContainer('groupsContainer', menu.elem),
                logsField.elem,
            ],
        });
    }

    initCheckboxGroups() {
        const logsField = LogsField.create();

        const menu = CheckboxGroupsMenu.create({
            id: 'checkboxGroupsMenu',
            multiple: true,
            afterContent: true,
            checkboxSide: 'right',
            defaultItemType: 'checkbox',
            className: 'checkbox-groups-menu',
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: [{
                id: 'noGroupItem1',
                title: 'No group item 1',
            }, {
                id: 'group1',
                type: 'group',
                title: 'Group 1',
                items: [{
                    id: 'groupItem11',
                    title: 'Group 1 item 1',
                }, {
                    id: 'groupItem12',
                    title: 'Group 1 item 2',
                    disabled: true,
                }, {
                    id: 'groupItem13',
                    title: 'Group 1 item 3',
                }],
            }, {
                id: 'noGroupItem2',
                title: 'No group item 2',
            }, {
                id: 'group2',
                type: 'group',
                title: 'Group 2',
                disabled: true,
                items: [{
                    id: 'groupItem21',
                    title: 'Group 2 item 1',
                }],
            }, {
                id: 'noGroupItem3',
                title: 'No group item 3',
            }],
        });

        this.addSection({
            id: 'checkboxGroups',
            title: 'Checkbox groups',
            content: [
                createContainer('checkboxGroupsContainer', menu.elem),
                logsField.elem,
            ],
        });
    }

    initCollapsibleGroups() {
        const logsField = LogsField.create();

        const menu = CollapsibleGroupsMenu.create({
            id: 'collapsibleGroupsMenu',
            afterContent: true,
            className: 'collapsible-groups-menu',
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            onGroupHeaderClick: (id) => logsField.write(`Group '${id}' clicked`),
            items: [{
                id: 'noGroupItem1',
                title: 'No group item 1',
            }, {
                id: 'group1',
                type: 'group',
                title: 'Group 1',
                expanded: false,
                items: [{
                    id: 'groupItem11',
                    title: 'Group 1 item 1',
                }, {
                    id: 'groupItem12',
                    title: 'Group 1 item 2',
                }, {
                    id: 'groupItem13',
                    title: 'Group 1 item 3',
                }],
            }, {
                id: 'noGroupItem2',
                title: 'No group item 2',
            }, {
                id: 'group2',
                type: 'group',
                title: 'Group 2',
                expanded: true,
                items: [{
                    id: 'groupItem21',
                    title: 'Group 2 item 1',
                }],
            }, {
                id: 'noGroupItem3',
                title: 'No group item 3',
            }],
        });

        this.addSection({
            id: 'collapsibleGroups',
            title: 'Collapsible groups',
            content: [
                createContainer('collapsibleGroupsContainer', menu.elem),
                logsField.elem,
            ],
        });
    }

    initDisabledItem() {
        const logsField = LogsField.create();

        const menu = Menu.create({
            id: 'defaultMenu',
            beforeContent: true,
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: [{
                id: 'selectBtnItem',
                icon: 'select',
                title: 'Button item',
                onClick: () => logsField.write('Button item clicked'),
            }, {
                id: 'separator1',
                type: 'separator',
            }, {
                id: 'linkItem',
                type: 'link',
                title: 'Link item',
                icon: 'search',
                disabled: true,
                url: '#',
            }, {
                id: 'noIconItem',
                title: 'No icon item',
            }],
        });

        this.addSection({
            id: 'disabledItem',
            title: 'Disabled item',
            content: [
                createContainer('disabledItemContainer', menu.elem),
                logsField.elem,
            ],
        });
    }
}

MenuView.create();
