import {
    ge,
    createElement,
    onReady,
    Sortable,
} from '../../js/index.js';
import { DefaultDragZone } from './impl/DefaultDragZone.js';
import { DefaultDropTarget } from './impl/DefaultDropTarget.js';
import { OriginalDropTarget } from './impl/OriginalDropTarget.js';
import '../../css/common.scss';
import '../common/app.scss';
import './style.scss';
import { initNavigation } from '../common/app.js';

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
        oninsertat: onSort,
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
        oninsertat: onListSort,
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
        oninsertat: onExchange,
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        dragClass: true,
        group: 'exch',
        copyWidth: true,
    });
    Sortable.create({
        elem: 'list_exch_2',
        oninsertat: onExchange,
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        dragClass: 'list_item_drag',
        group: 'exch',
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
        oninsertat: onTableSort,
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
        oninsertat: onSort,
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
        oninsertat: onSort,
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

    initTableEachBody();
    initTableSingleBody();
    initTableNoBody();

    initHandles();
    initRootOnlyHandle();
    initQueryHandles();

    initSingleItem();
};

onReady(init);
