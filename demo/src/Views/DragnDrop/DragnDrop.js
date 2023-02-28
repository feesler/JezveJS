import 'jezvejs/style';
import {
    ge,
    createElement,
    onReady,
    asArray,
} from 'jezvejs';
import { Sortable } from 'jezvejs/Sortable';
import { Icon } from 'jezvejs/Icon';
import { DefaultDragZone } from './impl/DefaultDragZone.js';
import { DefaultDropTarget } from './impl/DefaultDropTarget.js';
import { OriginalDropTarget } from './impl/OriginalDropTarget.js';
import { initNavigation } from '../../app.js';
import { XAxisDropTarget } from './impl/XAxisDropTarget.js';
import { XAxisDragZone } from './impl/XAxisDragZone.js';
import './style.scss';

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
        onInsertAt: () => { },
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
const onListSort = (srcElem, destElem) => {
    const listSortLog = ge('listSortLog');

    if (!srcElem) {
        logTo(listSortLog, 'Missing source item');
        return;
    }
    if (!destElem) {
        logTo(listSortLog, 'Missing destination item');
        return;
    }

    const srcId = getItemIdByElem(srcElem);
    const destId = getItemIdByElem(destElem);

    logTo(listSortLog, `srcId: ${srcId}; destId: ${destId}`);
};

const renderListItem = (title = 'Item') => createElement('div', {
    props: { className: 'list_item' },
    children: createElement('span', { props: { textContent: title } }),
});

const initSortableList = () => {
    const listSortable = ge('list_sortable');
    for (let i = 1; i <= 10; i += 1) {
        const item = renderListItem(`Item ${i}`);
        listSortable.append(item);
    }

    Sortable.create({
        elem: 'list_sortable',
        onInsertAt: onListSort,
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        copyWidth: true,
        group: 'list',
    });
};

// Exchangable lists
const onExchange = (srcElem, destElem) => {
    const exchangeLog = ge('exchangeLog');

    if (!srcElem) {
        logTo(exchangeLog, 'Missing source item');
        return;
    }
    if (!destElem) {
        logTo(exchangeLog, 'Missing destination item');
        return;
    }

    const isContainer = destElem.matches('.list-area');

    const srcId = getItemIdByElem(srcElem);
    const destId = (isContainer) ? null : getItemIdByElem(destElem);
    const destParent = (isContainer) ? destElem : destElem.parentNode;

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
        onInsertAt: onExchange,
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        dragClass: true,
        group: 'exch',
        copyWidth: true,
        allowSingleItemSort: true,
    });
    Sortable.create({
        elem: 'list_exch_2',
        onInsertAt: onExchange,
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        dragClass: 'list_item_drag',
        group: 'exch',
        copyWidth: true,
        allowSingleItemSort: true,
    });
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

const onTreeSort = (srcElem, destElem, newPos) => {
    const srdId = getTreeItemIdByElem(srcElem);
    const parentId = getTreeItemParentId(srcElem);
    const prevId = getTreeItemIdByElem(newPos.prev);
    const nextId = getTreeItemIdByElem(newPos.next);

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
        onInsertAt: onTreeSort,
        selector: '.tree-item',
        containerSelector: '.tree-item__content',
        placeholderClass: 'tree-item__placeholder',
        dragClass: true,
        group: 'tree',
        copyWidth: true,
        tree: true,
    });
};

const onTreeExchange = (srcElem, destElem, newPos) => {
    const srdId = getTreeItemIdByElem(srcElem);
    const parentId = getTreeItemParentId(srcElem);
    const prevId = getTreeItemIdByElem(newPos.prev);
    const nextId = getTreeItemIdByElem(newPos.next);

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
        onInsertAt: onTreeExchange,
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
        onInsertAt: onTreeExchange,
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
        onInsertAt: onTableSort,
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
        onInsertAt: () => { },
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
        onInsertAt: () => { },
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

const init = () => {
    initNavigation();

    initOriginalAvatar();
    initClonedAvatar();

    initXAxisAvatar();

    initSortable();
    initSortableList();
    initExchangable();

    initTree();
    initTreeExchange();

    initTableEachBody();
    initTableSingleBody();
    initTableNoBody();

    initHandles();
    initRootOnlyHandle();
    initQueryHandles();

    initSingleItem();
};

onReady(init);
