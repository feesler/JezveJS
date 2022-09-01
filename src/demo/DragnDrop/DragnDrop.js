import {
    ge,
    ce,
    onReady,
    Sortable,
} from '../../js/index.js';
import { DefaultDragZone } from './impl/DefaultDragZone.js';
import { DefaultDropTarget } from './impl/DefaultDropTarget.js';
import { OriginalDropTarget } from './impl/OriginalDropTarget.js';
import '../../css/common.scss';
import '../css/app.scss';
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
        oninsertat: onSort,
        selector: '.normal_item',
        placeholderClass: 'item_placeholder',
        group: 'tiles',
    });
};

// Sortable list
const onListSort = (srcElem, destElem) => {
    const listSortOut = ge('listsort_out');
    if (!listSortOut) {
        return;
    }

    if (!srcElem) {
        listSortOut.innerHTML += 'Missing source item<br>';
        return;
    }
    if (!destElem) {
        listSortOut.innerHTML += 'Missing destination item<br>';
        return;
    }

    let srcId;
    let el = srcElem.firstElementChild;
    if (el) {
        srcId = parseInt(el.innerHTML.substr(5), 10);
    }

    let destId;
    el = destElem.firstElementChild;
    if (el) {
        destId = parseInt(el.innerHTML.substr(5), 10);
    }

    listSortOut.innerHTML += `srcId: ${srcId}; destId: ${destId}<br>`;
};

const renderListItem = (title = 'Item') => ce(
    'div',
    { className: 'list_item' },
    ce('span', { textContent: title }),
);

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
    if (!exchOut) {
        return;
    }

    if (!srcElem) {
        exchOut.innerHTML += 'Missing source item<br>';
        return;
    }
    if (!destElem) {
        exchOut.innerHTML += 'Missing destination item<br>';
        return;
    }

    let srcId;
    let el = srcElem.firstElementChild;
    if (el) {
        srcId = parseInt(el.innerHTML.substr(5), 10);
    }

    let destId;
    el = destElem.firstElementChild;
    if (el) {
        destId = parseInt(el.innerHTML.substr(5), 10);
    }

    const destParent = destElem.parentNode.id;

    exchOut.innerHTML += `srcId: ${srcId}; destId: ${destId}; parent: ${destParent}<br>`;
};

const renderDestListItem = (title = 'Item', isPlaceholder = false) => ce(
    'div',
    { className: `list_item ${isPlaceholder ? 'list_item_placeholder' : 'list_item_2'}` },
    ce('span', { textContent: title }),
);

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

/** Sortable table with TBODY per each row */
const initTableEachBody = () => {
    Sortable.create({
        elem: 'table_sortable',
        oninsertat: onSort,
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

const renderListItemWithInput = (title = 'Item') => ce(
    'div',
    { className: 'list_item' },
    [
        ce('span', { textContent: title }),
        ce('input', { type: 'text' }),
    ],
);

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

const renderListItemWithHandle = (title = 'Item') => ce(
    'div',
    { className: 'list_item' },
    [
        ce('div', { className: 'drag-handle' }),
        ce('span', { textContent: title }),
        ce('input', { type: 'text' }),
    ],
);

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
