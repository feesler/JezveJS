import 'jezvejs/style';
import {
    ge,
    createElement,
    asArray,
} from 'jezvejs';
import { Sortable } from 'jezvejs/Sortable';
import { SortableListContainer } from 'jezvejs/SortableListContainer';
import { Icon } from 'jezvejs/Icon';

import { DemoView } from '../../Application/DemoView.js';
import { DefaultDragZone } from './impl/DefaultDragZone.js';
import { DefaultDropTarget } from './impl/DefaultDropTarget.js';
import { OriginalDropTarget } from './impl/OriginalDropTarget.js';
import { ListItem } from './impl/ListItem.js';
import { XAxisDropTarget } from './impl/XAxisDropTarget.js';
import { XAxisDragZone } from './impl/XAxisDragZone.js';
import './DragnDropView.scss';

const logTo = (target, value) => {
    const elem = (typeof target === 'string') ? ge(target) : target;
    if (!elem) {
        return;
    }

    elem.value += `${value}\r\n`;
};

const initOriginalAvatar = () => {
    DefaultDragZone.create({ elem: ge('sq1'), dragOriginal: true });
    OriginalDropTarget.create({ elem: ge('drop_area1') });
};

const initClonedAvatar = () => {
    DefaultDragZone.create({ elem: ge('sq2') });
    DefaultDragZone.create({ elem: ge('sq3') });
    DefaultDropTarget.create({ elem: ge('inner_drop1') });
    DefaultDropTarget.create({ elem: ge('inner_drop2') });
};

const initXAxisAvatar = () => {
    XAxisDragZone.create({ elem: ge('xAxisSlider') });
    XAxisDropTarget.create({ elem: ge('xAxisArea') });
};

const renderTileIcon = () => createElement('span', {
    props: { className: 'sortable-tile__icon-container' },
    children: Icon.create({
        icon: 'tile-purse',
        className: 'sortable-tile__icon',
    }).elem,
});

const renderTileTitle = (textContent) => createElement('span', {
    props: { className: 'sortable-tile__title', textContent },
});

const renderTile = (textContent, withIcon = false) => createElement('div', {
    props: { className: 'sortable-tile' },
    children: [
        renderTileTitle(textContent),
        (withIcon) ? renderTileIcon() : null,
    ],
});

const renderTilePlaceholder = () => createElement('div', {
    props: { className: 'sortable-tile sortable-tile_placeholder' },
});

const initSortable = () => {
    const sortableContainer = ge('sortableContainer');

    for (let i = 1; i <= 6; i += 1) {
        const item = (i === 2)
            ? renderTilePlaceholder()
            : renderTile(`Item ${i}`, i === 3);
        sortableContainer.append(item);
    }

    Sortable.create({
        elem: sortableContainer,
        selector: '.sortable-tile',
        placeholderClass: 'sortable-tile_placeholder',
        group: 'tiles',
    });
};

const getItemIdByElem = (elem) => {
    if (!elem) {
        return null;
    }

    const text = elem.textContent.trim();
    return parseInt(text.substr(5), 10);
};

// Sortable list
const onItemClick = (id) => {
    const listSortLog = ge('listSortLog');

    logTo(listSortLog, `onItemClick() id: ${id}`);
};

// Sortable list
const onListSort = (info) => {
    const listSortLog = ge('listSortLog');

    if (!info.elem) {
        logTo(listSortLog, 'Missing source item');
        return;
    }
    if (!info.targetElem) {
        logTo(listSortLog, 'Missing destination item');
        return;
    }

    const srcId = getItemIdByElem(info.elem);
    const destId = getItemIdByElem(info.targetElem);

    logTo(listSortLog, `srcId: ${srcId}; destId: ${destId}`);
};

const renderListItem = (title = 'Item') => createElement('div', {
    props: { className: 'list_item' },
    children: createElement('span', { props: { textContent: title } }),
});

const initSortableList = () => {
    const items = [];
    for (let i = 1; i <= 10; i += 1) {
        items.push({ id: i, title: `Item ${i}` });
    }

    const sortableList = SortableListContainer.create({
        ItemComponent: ListItem,
        items,
        getItemProps: (item) => ({ ...item }),
        className: 'list-area',
        itemSelector: ListItem.selector,
        itemSortSelector: ListItem.sortSelector,
        sortModeClass: 'list-area_sort',
        placeholderClass: 'list_item_placeholder',
        listMode: 'sort',
        sortGroup: 'list',
        onItemClick: (id, e) => onItemClick(id, e),
        onSort: (id, pos) => onListSort(id, pos),
    });

    const listContainer = ge('list_sortable');
    listContainer.prepend(sortableList.elem);
};

// Exchangable lists
const onExchange = (info) => {
    const exchangeLog = ge('exchangeLog');

    if (!info.elem) {
        logTo(exchangeLog, 'Missing source item');
        return;
    }
    if (!info.targetElem) {
        logTo(exchangeLog, 'Missing destination item');
        return;
    }

    const isContainer = info.targetElem.matches('.list-area');

    const srcId = getItemIdByElem(info.elem);
    const destId = (isContainer) ? null : getItemIdByElem(info.targetElem);
    const destParent = (isContainer) ? info.targetElem : info.targetElem.parentNode;

    logTo(exchangeLog, `srcId: ${srcId}; destId: ${destId}; parent: ${destParent.id}`);
};

const renderDestListItem = (title = 'Item', isPlaceholder = false) => createElement('div', {
    props: { className: `list_item ${isPlaceholder ? 'list_item_placeholder' : 'list_item_2'}` },
    children: createElement('span', { props: { textContent: title } }),
});

const initExchangable = () => {
    const listExch1 = ge('list_exch_1');
    const listExch2 = ge('list_exch_2');
    for (let i = 1; i <= 10; i += 1) {
        const srcItem = renderListItem(`Item ${i}`);
        listExch1.append(srcItem);

        const destItem = renderDestListItem(`Item ${i}`, i === 5);
        listExch2.append(destItem);
    }

    Sortable.create({
        elem: 'list_exch_1',
        onSort: onExchange,
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        dragClass: true,
        group: 'exch',
        copyWidth: true,
        allowSingleItemSort: true,
    });
    Sortable.create({
        elem: 'list_exch_2',
        onSort: onExchange,
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        dragClass: 'list_item_drag',
        group: 'exch',
        copyWidth: true,
        allowSingleItemSort: true,
    });
};

const initCustomGroups = () => {
    const items = [];
    for (let i = 1; i <= 10; i += 1) {
        items.push({
            id: i,
            title: `Item ${i}`,
            className: (i <= 5) ? null : 'list_item_2',
            group: (i <= 5) ? 'group1' : 'group2',
        });
    }

    const sortableList = SortableListContainer.create({
        ItemComponent: ListItem,
        items,
        getItemProps: (item) => ({ ...item }),
        className: 'list-area',
        itemSelector: ListItem.selector,
        itemSortSelector: ListItem.sortSelector,
        sortModeClass: 'list-area_sort',
        placeholderClass: 'list_item_placeholder',
        listMode: 'sort',
        sortGroup: (elem) => elem?.dataset.group,
        onItemClick: (id, e) => onItemClick(id, e),
        onSort: (id, pos) => onListSort(id, pos),
    });

    const listContainer = ge('customGroupsList');
    listContainer.prepend(sortableList.elem);
};

const renderTreeItem = (title, content = [], className = []) => createElement('div', {
    props: { className: ['tree-item', ...asArray(className)].join(' ') },
    children: [
        createElement('div', {
            props: { className: 'tree-item__title' },
            children: createElement('span', { props: { textContent: title } }),
        }),
        createElement('div', {
            props: { className: 'tree-item__content' },
            children: content,
        }),
    ],
});

const getTreeItemIdByElem = (elem) => {
    const titleElem = elem?.querySelector(':scope > .tree-item__title');
    if (!titleElem) {
        return null;
    }

    const text = titleElem.textContent.trim();
    return (text.startsWith('Item ')) ? text.substring(5) : text;
};

const getTreeItemParentId = (elem) => {
    if (!elem?.parentNode) {
        return null;
    }

    const parentItem = elem.parentNode.closest('.tree-item');
    if (parentItem) {
        return getTreeItemIdByElem(parentItem);
    }

    const tree = elem.closest('.tree');
    return tree?.id ?? null;
};

const onTreeSort = (info) => {
    const srdId = getTreeItemIdByElem(info.elem);
    const parentId = getTreeItemParentId(info.elem);
    const prevId = getTreeItemIdByElem(info.targetPos.prev);
    const nextId = getTreeItemIdByElem(info.targetPos.next);

    logTo(ge('treeLog'), `srcId: ${srdId}; prev: ${prevId}; next: ${nextId}; parent: ${parentId}`);
};

const initTree = () => {
    const treeRoot = ge('treeRoot');
    for (let i = 1; i <= 4; i += 1) {
        const childItems = (i < 3) ? [1, 2, 3] : [];
        const content = childItems.map((childId) => renderTreeItem(`Item ${i}.${childId}`));
        const item = renderTreeItem(`Item ${i}`, content);
        treeRoot.append(item);
    }

    Sortable.create({
        elem: treeRoot,
        onSort: onTreeSort,
        selector: '.tree-item',
        containerSelector: '.tree-item__content',
        placeholderClass: 'tree-item__placeholder',
        dragClass: true,
        group: 'tree',
        copyWidth: true,
        tree: true,
    });
};

const onTreeExchange = (info) => {
    const srdId = getTreeItemIdByElem(info.elem);
    const parentId = getTreeItemParentId(info.elem);
    const prevId = getTreeItemIdByElem(info.targetPos.prev);
    const nextId = getTreeItemIdByElem(info.targetPos.next);

    logTo('treeExchLog', `srcId: ${srdId}; prev: ${prevId}; next: ${nextId}; parent: ${parentId}`);
};

const initTreeExchange = () => {
    const treeExch1 = ge('treeExch1');
    for (let i = 1; i <= 4; i += 1) {
        const childItems = (i < 3) ? [1, 2, 3] : [];
        const content = childItems.map((childId) => renderTreeItem(`Item ${i}.${childId}`));
        const item = renderTreeItem(`Item ${i}`, content);
        treeExch1.append(item);
    }

    const treeExch2 = ge('treeExch2');
    for (let i = 1; i <= 4; i += 1) {
        const childItems = (i > 3) ? [1, 2] : [];
        const content = childItems.map((childId) => (
            renderTreeItem(`Item ${i}.${childId}`, [], 'tree-item-2')
        ));
        const item = renderTreeItem(`Item ${i}`, content, 'tree-item-2');
        treeExch2.append(item);
    }

    Sortable.create({
        elem: treeExch1,
        onSort: onTreeExchange,
        selector: '.tree-item',
        containerSelector: '.tree-item__content',
        placeholderClass: 'tree-item__placeholder',
        dragClass: true,
        group: 'treeExch',
        copyWidth: true,
        tree: true,
        allowSingleItemSort: true,
    });

    Sortable.create({
        elem: treeExch2,
        onSort: onTreeExchange,
        selector: '.tree-item',
        containerSelector: '.tree-item__content',
        placeholderClass: 'tree-item__placeholder',
        dragClass: true,
        group: 'treeExch',
        copyWidth: true,
        tree: true,
        allowSingleItemSort: true,
    });
};

const getTableRowIdByElem = (elem) => {
    if (!elem) {
        return null;
    }

    const firstCell = elem.querySelector('tr > td');
    return parseInt(firstCell.textContent, 10);
};

// Sortable list
const onTableSort = (srcElem, destElem) => {
    const tableLog = ge('tableLog');

    if (!srcElem) {
        logTo(tableLog, 'Missing source item');
        return;
    }
    if (!destElem) {
        logTo(tableLog, 'Missing destination item');
        return;
    }

    const srcId = getTableRowIdByElem(srcElem);
    const destId = getTableRowIdByElem(destElem);

    logTo(tableLog, `srcId: ${srcId}; destId: ${destId}`);
};

const renderTableRow = (columns) => createElement('tr', {
    children: asArray(columns).map((textContent) => (
        createElement('td', {
            children: createElement('div', { props: { textContent } }),
        })
    )),
});

const renderTBody = (children) => createElement('tbody', {
    props: { className: 'tbl_list_item' },
    children,
});

const tableData = [
    [1, 10000, 'some text'],
    [2, 354, 'some text'],
    [3, 850110, 'some long long text'],
    [4, 6000, 'some text'],
    [5, 7860, 'some short text'],
    [6, 4500, 'some text'],
    [7, 200, 'some text'],
];

/** Sortable table with TBODY per each row */
const initTableEachBody = () => {
    const table = ge('table_sortable');
    const rows = tableData.map((row) => renderTBody(renderTableRow(row)));
    table.append(...rows);

    Sortable.create({
        elem: 'table_sortable',
        onSort: onTableSort,
        selector: 'tbody',
        placeholderClass: 'list_item_placeholder',
        group: 'tbl',
        table: true,
        copyWidth: true,
    });
};

/** Sortable table with single TBODY for all rows */
const initTableSingleBody = () => {
    const table = ge('table_sortable_2');
    const rows = tableData.map((row) => renderTableRow(row));
    table.append(renderTBody(rows));

    Sortable.create({
        elem: 'table_sortable_2',
        onSort: () => { },
        selector: 'tr',
        placeholderClass: 'list_item_placeholder',
        group: 'tbl2',
        table: true,
        copyWidth: true,
    });
};

/** Sortable table without TBODY */
const initTableNoBody = () => {
    const table = ge('table_sortable_3');
    const rows = tableData.map((row) => renderTableRow(row));
    table.append(...rows);

    Sortable.create({
        elem: 'table_sortable_3',
        onSort: () => { },
        selector: 'tr',
        placeholderClass: 'list_item_placeholder',
        group: 'tbl3',
        table: true,
        copyWidth: true,
    });
};

/** handles option */
const initHandles = () => {
    DefaultDragZone.create({
        elem: ge('di1'),
        dragOriginal: true,
        handles: 'di1',
    });
    DefaultDragZone.create({
        elem: ge('di2'),
        dragOriginal: true,
        handles: 'dh2_1',
    });
    DefaultDragZone.create({
        elem: ge('di3'),
        dragOriginal: true,
        handles: [
            { elem: 'dh3_1', includeChilds: true },
            { elem: 'dh3_2', includeChilds: false },
        ],
    });
    OriginalDropTarget.create({ elem: ge('drop_area2') });
};

const renderListItemWithInput = (title = 'Item') => createElement('div', {
    props: { className: 'list_item' },
    children: [
        createElement('span', { props: { textContent: title } }),
        createElement('input', { props: { type: 'text' } }),
    ],
});

/** Sortable with rootOnlyHandle option */
const initRootOnlyHandle = () => {
    const listSortable = ge('sortable_roothnd');
    for (let i = 1; i <= 10; i += 1) {
        const item = renderListItemWithInput(`Item ${i}`);
        listSortable.append(item);
    }

    Sortable.create({
        elem: 'sortable_roothnd',
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        group: 'list_root',
        onlyRootHandle: true,
    });
};

const renderListItemWithHandle = (title = 'Item') => createElement('div', {
    props: { className: 'list_item' },
    children: [
        createElement('div', { props: { className: 'drag-handle' } }),
        createElement('span', { props: { textContent: title } }),
        createElement('input', { props: { type: 'text' } }),
    ],
});

/** Sortable with query handles */
const initQueryHandles = () => {
    const listSortable = ge('sortable_hnd');
    for (let i = 1; i <= 10; i += 1) {
        const item = renderListItemWithHandle(`Item ${i}`);
        listSortable.append(item);
    }

    Sortable.create({
        elem: 'sortable_hnd',
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        group: 'list_hnd',
        handles: [{ query: '.drag-handle', includeChilds: true }],
    });
};

/** Sortable with single item */
const initSingleItem = () => {
    Sortable.create({
        elem: 'singleItemSortable',
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        group: 'single',
        dragClass: true,
        copyWidth: true,
    });
    Sortable.create({
        elem: 'singleItemSortableAllow',
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        group: 'singleAllow',
        dragClass: true,
        copyWidth: true,
        allowSingleItemSort: true,
    });
};

class DragAndDropView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.addContentsMenuItem({ title: 'Drag original object', url: 'original' });
        this.addContentsMenuItem({ title: 'Drag copy object', url: 'copy' });
        this.addContentsMenuItem({ title: 'Drag only by X axis', url: 'xAxis' });
        this.addContentsMenuItem({ title: 'Sortable implementation', url: 'sortable' });
        this.addContentsMenuItem({ title: 'Sortable list', url: 'sortableList' });
        this.addContentsMenuItem({ title: 'Exchangable list', url: 'exchange' });
        this.addContentsMenuItem({ title: 'Custom groups', url: 'customGroup' });
        this.addContentsMenuItem({ title: 'Tree sort', url: 'tree' });
        this.addContentsMenuItem({ title: 'Tree exchange', url: 'treeExchange' });
        this.addContentsMenuItem({ title: 'Sortable table with TBODY rows', url: 'table1' });
        this.addContentsMenuItem({ title: 'Sortable table with single TBODY', url: 'table2' });
        this.addContentsMenuItem({ title: 'Sortable table without TBODY', url: 'table3' });
        this.addContentsMenuItem({ title: 'Drag handle option', url: 'handle' });
        this.addContentsMenuItem({ title: 'onlyRootHandle option', url: 'onlyRootHandle' });
        this.addContentsMenuItem({ title: 'Sortable list with drag handle option', url: 'listHandle' });
        this.addContentsMenuItem({ title: 'Sortable with single item', url: 'single' });
        this.addContentsMenuItem({ title: 'allowSingleItemSort option', url: 'allowSingleItemSort' });

        initOriginalAvatar();
        initClonedAvatar();

        initXAxisAvatar();

        initSortable();
        initSortableList();
        initExchangable();
        initCustomGroups();

        initTree();
        initTreeExchange();

        initTableEachBody();
        initTableSingleBody();
        initTableNoBody();

        initHandles();
        initRootOnlyHandle();
        initQueryHandles();

        initSingleItem();
    }
}

DragAndDropView.create();
