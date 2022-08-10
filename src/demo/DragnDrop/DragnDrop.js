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
import '../css/common.scss';
import '../css/app.scss';
import './style.scss';

/* eslint-disable-next-line no-unused-vars */
function onSort(srcElem, destElem) {
}

function onListSort(srcElem, destElem) {
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
}

function onExchange(srcElem, destElem) {
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
}

function init() {
    this.defDragZone = new DefaultDragZone(ge('sq1'), { dragOriginal: true });
    this.origDragZone = new OriginalDropTarget(ge('drop_area1'));

    this.defDragZone2 = new DefaultDragZone(ge('sq2'));
    this.defDragZone3 = new DefaultDragZone(ge('sq3'));
    this.defDrop1 = new DefaultDropTarget(ge('inner_drop1'));
    this.defDrop2 = new DefaultDropTarget(ge('inner_drop2'));

    // Sortable
    this.simpleSortable = new Sortable({
        container: 'sortable_container',
        oninsertat: onSort,
        selector: '.normal_item',
        placeholderClass: 'item_placeholder',
        group: 'tiles',
    });

    // Sortable list
    let listSortable = ge('list_sortable');
    for (let i = 1; i <= 10; i += 1) {
        const item = ce(
            'div',
            { className: 'list_item' },
            ce('span', { innerHTML: `Item ${i}` }),
        );
        listSortable.appendChild(item);
    }

    this.listSort = new Sortable({
        container: 'list_sortable',
        oninsertat: onListSort,
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        copyWidth: true,
        group: 'list',
    });

    // Exchangable lists
    const listExch1 = ge('list_exch_1');
    const listExch2 = ge('list_exch_2');
    for (let i = 1; i <= 10; i += 1) {
        let item = ce('div', { className: 'list_item' }, ce('span', { innerHTML: `Item ${i}` }));
        listExch1.appendChild(item);

        item = ce(
            'div',
            { className: `list_item ${(i === 5) ? 'list_item_placeholder' : 'list_item_2'}` },
            ce('span', { innerHTML: `Item ${i}` }),
        );
        listExch2.appendChild(item);
    }

    this.listExch1 = new Sortable({
        container: 'list_exch_1',
        oninsertat: onExchange,
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        dragClass: true,
        group: 'exch',
        copyWidth: true,
    });
    this.listExch2 = new Sortable({
        container: 'list_exch_2',
        oninsertat: onExchange,
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        dragClass: 'list_item_drag',
        group: 'exch',
    });

    // Sortable table with TBODY per each row
    this.eachBodyTbl = new Sortable({
        container: 'table_sortable',
        oninsertat: onSort,
        selector: 'tbody',
        placeholderClass: 'list_item_placeholder',
        group: 'tbl',
        table: true,
        copyWidth: true,
    });
    // Sortable table with single TBODY for all rows
    this.singleBodyTbl = new Sortable({
        container: 'table_sortable_2',
        oninsertat: onSort,
        selector: 'tr',
        placeholderClass: 'list_item_placeholder',
        group: 'tbl2',
        table: true,
        copyWidth: true,
    });

    // Sortable table without TBODY
    this.noBodyTbl = new Sortable({
        container: 'table_sortable_3',
        oninsertat: onSort,
        selector: 'tr',
        placeholderClass: 'list_item_placeholder',
        group: 'tbl3',
        table: true,
        copyWidth: true,
    });

    // drag handle option
    this.handleZone1 = new DefaultDragZone(ge('di1'), { dragOriginal: true, handles: 'di1' });
    this.handleZone2 = new DefaultDragZone(ge('di2'), {
        dragOriginal: true,
        handles: ['dh2_1', { elem: 'dh2_2' }],
    });
    this.handleZone3 = new DefaultDragZone(ge('di3'), {
        dragOriginal: true,
        handles: [
            { elem: 'dh3_1', includeChilds: true },
            { elem: 'dh3_2', includeChilds: false },
        ],
    });
    this.origDrop = new OriginalDropTarget(ge('drop_area2'));

    // Sortable with rootOnlyHandle option
    listSortable = ge('sortable_roothnd');
    for (let i = 1; i <= 10; i += 1) {
        const item = ce(
            'div',
            { className: 'list_item' },
            [
                ce('span', { textContent: `Item ${i}` }),
                ce('input', { type: 'text' }),
            ],
        );
        listSortable.appendChild(item);
    }

    this.onlyRoot = new Sortable({
        container: 'sortable_roothnd',
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        group: 'list_root',
        onlyRootHandle: true,
    });

    // Sortable with query handles
    listSortable = ge('sortable_hnd');
    for (let i = 1; i <= 10; i += 1) {
        const item = ce(
            'div',
            { className: 'list_item' },
            [
                ce('div', { className: 'drag_handle' }),
                ce('span', { textContent: `Item ${i}` }),
                ce('input', { type: 'text' }),
            ],
        );
        listSortable.appendChild(item);
    }

    this.queryHandles = new Sortable({
        container: 'sortable_hnd',
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        group: 'list_hnd',
        handles: [{ query: '.drag_handle', includeChilds: true }],
    });

    this.singleItem = new Sortable({
        container: 'singleItemSortable',
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        group: 'single',
        dragClass: true,
        copyWidth: true,
    });
    this.singleItemAllow = new Sortable({
        container: 'singleItemSortableAllow',
        selector: '.list_item',
        placeholderClass: 'list_item_placeholder',
        group: 'singleAllow',
        dragClass: true,
        copyWidth: true,
        allowSingleItemSort: true,
    });
}

onReady(init);
