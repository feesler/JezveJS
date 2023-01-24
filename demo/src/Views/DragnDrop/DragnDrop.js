import 'jezvejs/style';
import {
    ge,
    createElement,
    onReady,
    asArray,
} from 'jezvejs';
import { Sortable } from 'jezvejs/Sortable';
import { DefaultDragZone } from './impl/DefaultDragZone.js';
import { DefaultDropTarget } from './impl/DefaultDropTarget.js';
import { OriginalDropTarget } from './impl/OriginalDropTarget.js';
import { initNavigation } from '../../app.js';
import './style.scss';

/* eslint-disable-next-line no-unused-vars */
function onSort(srcElem, destElem) {
}

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

const initSortable = () => {
    Sortable.create({
        elem: 'sortable_container',
        onInsertAt: onSort,
        selector: '.normal_item',
        placeholderClass: 'item_placeholder',
        group: 'tiles',
    });
};

const writeLog = (elem, text) => {
    elem?.append(createElement('div', { props: { textContent: text } }));
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
    const listSortOut = ge('listsort_out');

    if (!srcElem) {
        writeLog(listSortOut, 'Missing source item');
        return;
    }
    if (!destElem) {
        writeLog(listSortOut, 'Missing destination item');
        return;
    }

    const srcId = getItemIdByElem(srcElem);
    const destId = getItemIdByElem(destElem);
    writeLog(listSortOut, `srcId: ${srcId}; destId: ${destId}`);
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
    const exchOut = ge('exch_out');

    if (!srcElem) {
        writeLog(exchOut, 'Missing source item');
        return;
    }
    if (!destElem) {
        writeLog(exchOut, 'Missing destination item');
        return;
    }

    const srcId = getItemIdByElem(srcElem);
    const destId = getItemIdByElem(destElem);
    const destParent = destElem.parentNode.id;

    writeLog(exchOut, `srcId: ${srcId}; destId: ${destId}; parent: ${destParent}`);
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
    const titleElem = elem?.querySelector('.tree-item__title');
    if (!titleElem) {
        return null;
    }

    const text = titleElem.textContent.trim();
    return (text.startsWith('Item ')) ? text.substring(5) : text;
};

const onTreeSort = (srcElem, destElem) => {
    const srdId = getTreeItemIdByElem(srcElem);
    const destId = getTreeItemIdByElem(destElem);

    writeLog(ge('treeLog'), `srcId: ${srdId}; destId: ${destId}`);
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
        onInsertAt: onTreeSort,
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
        onInsertAt: onTreeSort,
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
    const logElem = ge('table-log');

    if (!srcElem) {
        writeLog(logElem, 'Missing source item');
        return;
    }
    if (!destElem) {
        writeLog(logElem, 'Missing destination item');
        return;
    }

    const srcId = getTableRowIdByElem(srcElem);
    const destId = getTableRowIdByElem(destElem);

    writeLog(logElem, `srcId: ${srcId}; destId: ${destId}`);
};

/** Sortable table with TBODY per each row */
const initTableEachBody = () => {
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
    Sortable.create({
        elem: 'table_sortable_2',
        onInsertAt: onSort,
        selector: 'tr',
        placeholderClass: 'list_item_placeholder',
        group: 'tbl2',
        table: true,
        copyWidth: true,
    });
};

/** Sortable table without TBODY */
const initTableNoBody = () => {
    Sortable.create({
        elem: 'table_sortable_3',
        onInsertAt: onSort,
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
