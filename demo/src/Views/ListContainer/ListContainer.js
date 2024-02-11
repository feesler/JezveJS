import 'jezvejs/style';
import { ListContainer } from 'jezvejs/ListContainer';

// Common components
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createButtons, createContainer } from '../../Application/utils.js';

// Local components
import { ListItem } from './components/ListItem/ListItem.js';
import { ListPlaceholder } from './components/ListPlaceholder/ListPlaceholder.js';

import './ListContainerView.scss';

/** CSS classes */
const LIST_CLASS = 'list';

/**
 * ListContainer component demo view
 */
class ListContainerView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('ListContainer');

        this.initDefault();
        this.initPlaceholder();
    }

    getButtonsForList(list, prefix) {
        return [{
            id: `${prefix}AddItemBtn`,
            title: 'Add item',
            onClick: () => list.setState((listState) => ({
                ...listState,
                items: [
                    ...listState.items,
                    {
                        id: `${listState.items.length + 1}`,
                        title: `Item ${listState.items.length + 1}`,
                    },
                ],
            })),
        }, {
            id: `${prefix}DelItemBtn`,
            title: 'Delete item',
            onClick: () => list.setState((listState) => ({
                ...listState,
                items: listState.items.filter((_, index) => (index < listState.items.length - 1)),
            })),
        }];
    }

    initDefault() {
        const list = ListContainer.create({
            ItemComponent: ListItem,
            itemSelector: ListItem.selector,
            className: LIST_CLASS,
            items: [
                { id: '1', title: 'Item 1' },
                { id: '2', title: 'Item 2' },
            ],
        });

        const buttons = this.getButtonsForList(list, 'default');

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                createContainer('defaultContainer', list.elem),
                createButtons(buttons),
            ],
        });
    }

    initPlaceholder() {
        const list = ListContainer.create({
            ItemComponent: ListItem,
            itemSelector: ListItem.selector,
            PlaceholderComponent: ListPlaceholder,
            className: LIST_CLASS,
            getPlaceholderProps: () => ({
                content: 'No items',
            }),
        });

        const buttons = this.getButtonsForList(list, 'placeholder');

        this.addSection({
            id: 'placeholder',
            title: 'Placeholder',
            content: [
                createContainer('placeholderContainer', list.elem),
                createButtons(buttons),
            ],
        });
    }
}

ListContainerView.create();
