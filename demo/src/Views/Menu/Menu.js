import 'jezvejs/style';
import { Menu } from 'jezvejs/Menu';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createContainer } from '../../Application/utils.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import { CheckboxGroupsMenu } from './components/CheckboxGroups/CheckboxGroupsMenu.js';
import { CollapsibleGroupsMenu } from './components/CollapsibleGroups/CollapsibleGroupsMenu.js';
import { CustomMenuHeader } from './components/CustomHeader/CustomMenuHeader.js';
import { CustomMenuFooter } from './components/CustomFooter/CustomMenuFooter.js';
import { LoadingPlaceholder } from './components/LoadingPlaceholder/LoadingPlaceholder.js';
import './MenuView.scss';

const defaultItems = [{
    id: 'selectBtnItem',
    icon: 'select',
    title: 'Button item',
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
    selected: true,
}];

const horizontalItems = [{
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
}];

const groupItems = [{
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
}];

const initItems = (title, count, startFrom = 1) => {
    const res = [];

    for (let ind = startFrom; ind < startFrom + count; ind += 1) {
        res.push({ id: ind, title: `${title} ${ind}` });
    }

    return res;
};

/**
 * Menu component demo view
 */
class MenuView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDefault();
        this.initHorizontal();
        this.initIconsAlign();
        this.initCheckboxAlign();
        this.initHeaderFooter();
        this.initListPlaceholder();
        this.initScroll();
        this.initFocusOnHover();
        this.initGroups();
        this.initCheckboxGroups();
        this.initCollapsibleGroups();
        this.initDisabledItem();
    }

    initDefault() {
        const logsField = LogsField.create();

        const items = structuredClone(defaultItems);
        items[0].onClick = () => logsField.write('Button item clicked');

        const menu = Menu.create({
            id: 'defaultMenu',
            multiple: true,
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items,
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
        this.addSection({
            id: 'horizontal',
            title: 'Horizontal menu',
            content: createContainer(
                'horizontalContainer',
                Menu.create({
                    id: 'horizontalMenu',
                    className: 'horizontal-menu',
                    items: structuredClone(horizontalItems),
                }).elem,
            ),
        });
    }

    initIconsAlign() {
        const items = structuredClone(defaultItems);
        items[2].iconAlign = 'left';

        this.addSection({
            id: 'iconsAlign',
            title: 'Icons alignment',
            content: createContainer(
                'iconsAlignContainer',
                Menu.create({
                    id: 'iconsAlignMenu',
                    iconAlign: 'right',
                    multiple: true,
                    items,
                }).elem,
            ),
        });
    }

    initCheckboxAlign() {
        const items = structuredClone(defaultItems);
        items.push({
            id: 'leftCheckboxItem',
            type: 'checkbox',
            title: 'Checkbox item',
            checkboxSide: 'left',
            selected: true,
        });

        this.addSection({
            id: 'checkboxAlign',
            title: 'Checkbox alignment',
            content: createContainer(
                'checkboxAlignContainer',
                Menu.create({
                    id: 'checkboxAlignMenu',
                    checkboxSide: 'right',
                    multiple: true,
                    items,
                }).elem,
            ),
        });
    }

    initHeaderFooter() {
        const menu = Menu.create({
            id: 'headerFooterMenu',
            className: 'scroll-menu',
            items: initItems('Menu item', 5),
            header: {
                title: 'Custom header',
            },
            footer: {
                title: 'Custom footer',
            },
            components: {
                Header: CustomMenuHeader,
                Footer: CustomMenuFooter,
            },
        });

        this.addSection({
            id: 'headerFooter',
            title: 'Header and Footer',
            content: [
                createContainer('headerFooterContainer', menu.elem),
            ],
        });
    }

    initListPlaceholder() {
        const menu = Menu.create({
            id: 'listPlaceholderMenu',
            items: [],
            className: 'placeholder-menu',
            getPlaceholderProps: () => ({ title: 'Loading...' }),
            components: {
                ListPlaceholder: LoadingPlaceholder,
            },
        });

        this.addSection({
            id: 'listPlaceholder',
            title: 'List placeholder',
            content: [
                createContainer('listPlaceholderContainer', menu.elem),
            ],
        });
    }

    initScroll() {
        const logsField = LogsField.create();

        const menu = Menu.create({
            id: 'scrollMenu',
            className: 'scroll-menu',
            tabThrough: false,
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: initItems('Menu item', 30),
        });

        this.addSection({
            id: 'scroll',
            title: 'Scroll',
            description: 'With disabled \'tabThrough\' option',
            content: [
                createContainer('scrollContainer', menu.elem),
                logsField.elem,
            ],
        });
    }

    initFocusOnHover() {
        this.addSection({
            id: 'focusOnHover',
            title: '\'focusItemOnHover\' option',
            description: 'This demo shows disabled \'focusItemOnHover\' option. Default is enabled.',
            content: createContainer(
                'focusOnHoverContainer',
                Menu.create({
                    id: 'focusOnHoverMenu',
                    focusItemOnHover: false,
                    className: 'horizontal-menu',
                    items: initItems('Menu item', 4),
                }).elem,
            ),
        });
    }

    initGroups() {
        const logsField = LogsField.create();

        const menu = Menu.create({
            id: 'groupsMenu',
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items: structuredClone(groupItems),
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

        const items = structuredClone(groupItems);
        items[1].items[1].disabled = true;
        items[3].disabled = true;

        const menu = CheckboxGroupsMenu.create({
            id: 'checkboxGroupsMenu',
            multiple: true,
            checkboxSide: 'right',
            defaultItemType: 'checkbox',
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items,
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

        const items = structuredClone(groupItems);
        items[1].expanded = false;
        items[3].expanded = true;

        const menu = CollapsibleGroupsMenu.create({
            id: 'collapsibleGroupsMenu',
            className: 'collapsible-groups-menu',
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            onGroupHeaderClick: (id) => logsField.write(`Group '${id}' clicked`),
            items,
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

        const items = structuredClone(defaultItems);
        items[2].disabled = true;

        const menu = Menu.create({
            id: 'disabledItemMenu',
            multiple: true,
            onItemClick: (id) => logsField.write(`Item '${id}' clicked`),
            items,
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
