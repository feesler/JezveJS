import 'jezvejs/style';
import { Button } from 'jezvejs/Button';
import { Tags } from 'jezvejs/Tags';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createContainer, createControls } from '../../Application/utils.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import './TagsView.scss';

const createItems = (options = {}) => {
    const {
        count = 5,
    } = options;

    const res = [];
    for (let ind = 0; ind < count; ind += 1) {
        const item = {
            id: ind.toString(),
            title: `Item ${ind}`,
        };

        res.push(item);
    }

    return res;
};

/**
 * Tags component demo view
 */
class TagsView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Tags');

        this.initDefault();
        this.initStyled();
        this.initActive();
        this.initCloseable();
        this.initSortable();
        this.initDisabledItem();
        this.initDisabled();
    }

    initDefault() {
        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: createContainer(
                'defaultContainer',
                Tags.create({
                    items: createItems(),
                }).elem,
            ),
        });
    }

    initStyled() {
        this.addSection({
            id: 'styled',
            title: 'Styled',
            content: createContainer(
                'styledContainer',
                Tags.create({
                    className: 'styled',
                    items: createItems(),
                }).elem,
            ),
        });
    }

    initActive() {
        const tags = Tags.create({
            className: 'styled',
            items: createItems(),
            onItemClick: (itemId) => tags.activateItem(itemId),
        });

        this.addSection({
            id: 'active',
            title: 'Active items',
            content: createContainer('activeContainer', tags.elem),
        });
    }

    initCloseable() {
        const logsField = LogsField.create();

        const items = createItems();
        items[3].closeable = false;

        const tags = Tags.create({
            className: 'styled',
            closeable: true,
            items,
            onCloseItem: (id) => logsField.write(`onCloseItem: [${id}]`),
        });

        this.addSection({
            id: 'closeable',
            title: '\'closeable\' option',
            content: [
                createContainer('closeableContainer', tags.elem),
                logsField.elem,
            ],
        });
    }

    initSortable() {
        const items = createItems();

        const tags = Tags.create({
            className: 'styled',
            listMode: 'sort',
            items,
        });
        tags.enableItem('2', false);

        const btn = Button.create({
            id: 'toggleSortModeBtn',
            title: 'Disable sort',
            className: 'action-btn',
            onClick: () => {
                tags.setState((state) => ({
                    ...state,
                    listMode: (state.listMode === 'sort') ? 'list' : 'sort',
                }));

                const title = (tags.state.listMode === 'sort')
                    ? 'Disable sort'
                    : 'Enable sort';
                btn.setTitle(title);
            },
        });

        this.addSection({
            id: 'sortable',
            title: 'Sortable component',
            content: [
                createContainer('sortableContainer', tags.elem),
                createControls(btn.elem),
            ],
        });
    }

    initDisabledItem() {
        const tags = Tags.create({
            className: 'styled',
            items: createItems(),
        });
        tags.enableItem('2', false);

        const btn = Button.create({
            id: 'toggleEnableItemBtn',
            title: 'Enable item',
            className: 'action-btn',
            onClick: () => {
                const item = tags.getItemById('2');
                tags.enableItem('2', item?.disabled);
                btn.setTitle((item.disabled) ? 'Disable item' : 'Enable item');
            },
        });

        this.addSection({
            id: 'disabledItem',
            title: 'Disabled item',
            content: [
                createContainer('disabledItemContainer', tags.elem),
                createControls(btn.elem),
            ],
        });
    }

    initDisabled() {
        const tags = Tags.create({
            disabled: true,
            className: 'styled',
            items: createItems(),
        });

        const btn = Button.create({
            id: 'toggleEnableBtn',
            title: 'Enable',
            className: 'action-btn',
            onClick: () => {
                const { disabled } = tags;
                btn.setTitle((disabled) ? 'Disable' : 'Enable');
                tags.enable(disabled);
            },
        });

        this.addSection({
            id: 'disabled',
            title: 'Disabled component',
            content: [
                createContainer('disabledContainer', tags.elem),
                createControls(btn.elem),
            ],
        });
    }
}

TagsView.create();
