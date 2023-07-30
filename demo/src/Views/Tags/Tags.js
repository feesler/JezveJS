import 'jezvejs/style';
import 'jezvejs/style/Button';
import { ge, setEvents } from 'jezvejs';
import { Tags } from 'jezvejs/Tags';

import { DemoView } from '../../Application/DemoView.js';
import './TagsView.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

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

const initDefault = () => {
    const tags = Tags.create({
        items: createItems(),
    });

    const container = ge('defaultContainer');
    container.append(tags.elem);
};

const initStyled = () => {
    const tags = Tags.create({
        className: 'styled',
        items: createItems(),
    });

    const container = ge('styledContainer');
    container.append(tags.elem);
};

const initActive = () => {
    const tags = Tags.create({
        className: 'styled',
        items: createItems(),
        onItemClick: (itemId) => tags.activateItem(itemId),
    });

    const container = ge('activeContainer');
    container.append(tags.elem);
};

const initCloseable = () => {
    const items = createItems();
    items[3].closeable = false;

    const tags = Tags.create({
        className: 'styled',
        closeable: true,
        items,
        onCloseItem: (id) => addEventLog(`onCloseItem: [${id}]`),
    });

    const container = ge('closeableContainer');
    container.append(tags.elem);
};

const initSortable = () => {
    const items = createItems();

    const tags = Tags.create({
        className: 'styled',
        listMode: 'sort',
        items,
    });
    tags.enableItem('2', false);

    const container = ge('sortableContainer');
    container.append(tags.elem);

    const btn = ge('toggleSortModeBtn');
    setEvents(btn, {
        click: () => {
            tags.setState((state) => ({
                ...state,
                listMode: (state.listMode === 'sort') ? 'list' : 'sort',
            }));
            btn.textContent = (tags.state.listMode === 'sort')
                ? 'Disable sort'
                : 'Enable sort';
        },
    });
};

const initDisabledItem = () => {
    const tags = Tags.create({
        className: 'styled',
        items: createItems(),
    });
    tags.enableItem('2', false);

    const container = ge('disabledItemContainer');
    container.append(tags.elem);

    const btn = ge('toggleEnableItemBtn');
    setEvents(btn, {
        click: () => {
            const item = tags.getItemById('2');
            tags.enableItem('2', item?.disabled);
        },
    });
};

const initDisabled = () => {
    const tags = Tags.create({
        disabled: true,
        className: 'styled',
        items: createItems(),
    });

    const container = ge('disabledContainer');
    container.append(tags.elem);

    const btn = ge('toggleEnableBtn');
    setEvents(btn, {
        click: () => {
            const { disabled } = tags;
            btn.textContent = (disabled) ? 'Disable' : 'Enable';
            tags.enable(disabled);
        },
    });
};

class TagsView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initTableOfContents();
        this.addTableOfContentsItem({ title: 'Default settings', url: 'default' });
        this.addTableOfContentsItem({ title: 'Styled', url: 'styled' });
        this.addTableOfContentsItem({ title: 'Active items', url: 'active' });
        this.addTableOfContentsItem({ title: '\'closeable\' option', url: 'closeable' });
        this.addTableOfContentsItem({ title: 'Sortable component', url: 'sortable' });
        this.addTableOfContentsItem({ title: 'Disabled item', url: 'disabledItem' });
        this.addTableOfContentsItem({ title: 'Disabled component', url: 'disabled' });

        initDefault();
        initStyled();
        initActive();
        initCloseable();
        initSortable();
        initDisabledItem();
        initDisabled();
    }
}

TagsView.create();
