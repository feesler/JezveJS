import 'jezvejs/style';
import { createElement } from 'jezvejs';
import { Button } from 'jezvejs/Button';
import { TabList } from 'jezvejs/TabList';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createContainer, createControls } from '../../Application/utils.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import './TabListView.scss';

const renderContent = (value) => createElement('div', {
    props: {
        textContent: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit aliquam aperiam sapiente libero rerum reiciendis quas est? (${value})`,
    },
});

const renderListItem = (textContent) => createElement('div', {
    props: { textContent },
});

const renderArrayContent = () => Array(5).fill('Item').map((item, index) => renderListItem(`${item} ${index}`));

const getItems = (disableLast = false) => ([{
    id: 1,
    title: 'First',
    value: 1,
    content: renderContent(1),
}, {
    id: 2,
    title: 'Second',
    value: 2,
    content: renderContent(2),
}, {
    id: 'str',
    title: 'Array content',
    value: 'str',
    content: renderArrayContent(),
    disabled: disableLast,
}]);

/**
 * TabList component demo view
 */
class TabListView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDefault();
        this.initStyled();
        this.initHiddenItem();
        this.initDisabledItem();
        this.initDisabled();
    }

    initDefault() {
        const logsField = LogsField.create();

        const tabList = TabList.create({
            items: getItems(),
            onChange: (sel) => logsField.write(`Selected: [${sel.id}]`),
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                createContainer('defaultContainer', tabList.elem),
                logsField.elem,
            ],
        });
    }

    initStyled() {
        const tabList = TabList.create({
            className: 'styled bold',
            items: getItems(),
        });

        this.addSection({
            id: 'styled',
            title: 'Styled',
            content: createContainer('styledContainer', tabList.elem),
        });
    }

    initHiddenItem() {
        const items = getItems(true);
        items[1].hidden = true;

        const tabList = TabList.create({
            className: 'styled',
            items,
        });

        const btn = Button.create({
            id: 'toggleShowItemBtn',
            title: 'Show item',
            className: 'action-btn',
            onClick: () => {
                const item = tabList.getItem(2);
                btn.setTitle((item.hidden) ? 'Hide item' : 'Show item');
                tabList.showItem(2, item.hidden);
            },
        });

        this.addSection({
            id: 'hiddenItem',
            title: 'Hidden item',
            content: [
                createContainer('hiddenItemContainer', tabList.elem),
                createControls(btn.elem),
            ],
        });
    }

    initDisabledItem() {
        const tabList = TabList.create({
            className: 'styled',
            items: getItems(true),
        });

        const btn = Button.create({
            id: 'toggleEnableItemBtn',
            title: 'Enable item',
            className: 'action-btn',
            onClick: () => {
                const item = tabList.getItem('str');
                btn.setTitle((item.disabled) ? 'Disable item' : 'Enable item');
                tabList.enableItem('str', item.disabled);
            },
        });

        this.addSection({
            id: 'disabledItem',
            title: 'Disabled item',
            content: [
                createContainer('disabledItemContainer', tabList.elem),
                createControls(btn.elem),
            ],
        });
    }

    initDisabled() {
        const tabList = TabList.create({
            disabled: true,
            className: 'styled',
            items: getItems(),
        });

        const btn = Button.create({
            id: 'toggleEnableBtn',
            title: 'Enable',
            className: 'action-btn',
            onClick: () => {
                const { disabled } = tabList;
                btn.setTitle((disabled) ? 'Disable' : 'Enable');
                tabList.enable(disabled);
            },
        });

        this.addSection({
            id: 'disabled',
            title: 'Disabled component',
            content: [
                createContainer('disabledContainer', tabList.elem),
                createControls(btn.elem),
            ],
        });
    }
}

TabListView.create();
