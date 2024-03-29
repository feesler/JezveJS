import 'jezvejs/style';

import { createElement } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';

import { Sortable } from 'jezvejs/Sortable';
import { SortableListContainer } from 'jezvejs/SortableListContainer';

// Common components
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

// Common icons
import { HeaderMenuIcon } from '../../assets/icons/HeaderMenuIcon.js';

// Local components
import { DefaultDragZone } from './components/DefaultDragZone.js';
import { DefaultDropTarget } from './components/DefaultDropTarget.js';
import { OriginalDropTarget } from './components/OriginalDropTarget.js';
import { ListItem } from './components/ListItem.js';
import { XAxisDropTarget } from './components/XAxisDropTarget.js';
import { XAxisDragZone } from './components/XAxisDragZone.js';

import {
    tableData,
    renderTile,
    renderTilePlaceholder,
    getItemIdByElem,
    renderListItem,
    renderDestListItem,
    renderTreeItem,
    getTreeItemIdByElem,
    getTreeItemParentId,
    getTableRowIdByElem,
    renderTableRow,
    renderTBody,
    renderListItemWithInput,
    renderListItemWithHandle,
} from './helpers.js';
import './DragnDropView.scss';

/**
 * Drag'n'Drop and Sortable utilities demo view
 */
class DragAndDropView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Drag and Drop');

        this.initOriginalAvatar();
        this.initClonedAvatar();

        this.initXAxisAvatar();

        this.initSortable();
        this.initSortableList();
        this.initExchangeable();
        this.initCustomGroups();

        this.initTree();
        this.initTreeExchange();

        this.initTableEachBody();
        this.initTableSingleBody();
        this.initTableNoBody();

        this.initHandles();
        this.initRootOnlyHandle();
        this.initQueryHandles();

        this.initSingleItem();
    }

    initOriginalAvatar() {
        const square = createElement('div', {
            className: 'square abs_pos_square',
        });
        const dropArea = createElement('div', {
            className: 'section-h200 drag-area',
            children: square,
        });

        DefaultDragZone.create({ elem: square, dragOriginal: true });
        OriginalDropTarget.create({ elem: dropArea });

        this.addSection({
            id: 'original',
            title: 'Drag original object',
            description: `Drop target accept only OriginalDragAvatar.
            'mouseMoveThreshold' option is used to limit move distance after mouse pressed to start drag. Default value is 5.
            'touchMoveTimeout' options is used to limit time after touch start to start drag.
            `,
            content: dropArea,
        });
    }

    initClonedAvatar() {
        const square1 = createElement('div', {
            className: 'square', textContent: '1',
        });
        const square2 = createElement('div', {
            className: 'square', textContent: '2',
        });

        const innerDrop1 = createElement('div', {
            className: 'inner-drop',
            children: [square1, square2],
        });
        const innerDrop2 = createElement('div', {
            className: 'inner-drop',
        });

        DefaultDragZone.create({ elem: square1 });
        DefaultDragZone.create({ elem: square2 });
        DefaultDropTarget.create({ elem: innerDrop1 });
        DefaultDropTarget.create({ elem: innerDrop2 });

        this.addSection({
            id: 'copy',
            title: 'Drag copy object',
            description: 'Drag two objects with semitransparent avatars. Drop targets accept only DefaultDragAvatar',
            className: 'row-section',
            content: [innerDrop1, innerDrop2],
        });
    }

    initXAxisAvatar() {
        const slider = createElement('div', {
            className: 'x-axis-slider',
        });
        const dropArea = createElement('div', {
            className: 'x-axis-area',
            children: slider,
        });

        XAxisDragZone.create({ elem: slider });
        XAxisDropTarget.create({ elem: dropArea });

        this.addSection({
            id: 'xAxis',
            title: 'Drag only by X axis',
            description: '\'mouseMoveThreshold\' and \'touchMoveTimeout\' options are set to 0',
            content: createElement('div', {
                className: 'section-h200',
                children: dropArea,
            }),
        });
    }

    initSortable() {
        const sortableContainer = createElement('div', {
            className: 'sortable-tiles',
        });

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
            animated: true,
            vertical: false,
        });

        this.addSection({
            id: 'sortable',
            title: 'Sortable implementation',
            content: sortableContainer,
        });
    }

    /**
     * Sortable list 'sort' event handler
     * @param {*} info
     */
    onListSort(info, logsField) {
        if (!info.elem) {
            logsField.write('Missing source item');
            return;
        }
        if (!info.targetElem) {
            logsField.write('Missing destination item');
            return;
        }

        const srcId = getItemIdByElem(info.elem);
        const destId = getItemIdByElem(info.targetElem);

        logsField.write(`srcId: ${srcId}; destId: ${destId}`);
    }

    initSortableList() {
        const logsField = LogsField.create();

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
            animated: true,
            onItemClick: (id) => logsField?.write(`onItemClick() id: ${id}`),
            onSort: (info) => this.onListSort(info, logsField),
        });

        this.addSection({
            id: 'sortableList',
            title: 'Sortable list',
            content: [sortableList.elem, logsField.elem],
        });
    }

    onExchange(info, logField) {
        if (!info.elem) {
            logField.write('Missing source item');
            return;
        }
        if (!info.targetElem) {
            logField.write('Missing destination item');
            return;
        }

        const isContainer = info.targetElem.matches('.list-area');

        const srcId = getItemIdByElem(info.elem);
        const destId = (isContainer) ? null : getItemIdByElem(info.targetElem);
        const destParent = (isContainer) ? info.targetElem : info.targetElem.parentNode;

        logField.write(`srcId: ${srcId}; destId: ${destId}; parent: ${destParent.id}`);
    }

    initExchangeable() {
        const logsField = LogsField.create();

        const listExch1 = createElement('div', { className: 'list-area' });
        const listExch2 = createElement('div', { className: 'list-area' });

        for (let i = 1; i <= 10; i += 1) {
            const srcItem = renderListItem(`Item ${i}`);
            listExch1.append(srcItem);

            const destItem = renderDestListItem(`Item ${i}`, i === 5);
            listExch2.append(destItem);
        }

        Sortable.create({
            elem: listExch1,
            onSort: (info) => this.onExchange(info, logsField),
            selector: '.list_item',
            placeholderClass: 'list_item_placeholder',
            dragClass: true,
            group: 'exch',
            copyWidth: true,
            animated: true,
            allowSingleItemSort: true,
        });
        Sortable.create({
            elem: listExch2,
            onSort: (info) => this.onExchange(info, logsField),
            selector: '.list_item',
            placeholderClass: 'list_item_placeholder',
            dragClass: 'list_item_drag',
            group: 'exch',
            copyWidth: true,
            animated: true,
            allowSingleItemSort: true,
        });

        this.addSection({
            id: 'exchange',
            title: 'Exchangeable list',
            description: `Example of usage of same group identifier.
                        Left list uses default dragClass option (.drag). Right list use own dragClass.`,
            content: [
                createElement('div', {
                    className: 'exch-lists-container',
                    children: [listExch1, listExch2],
                }),
                logsField.elem,
            ],
        });
    }

    initCustomGroups() {
        const logsField = LogsField.create();

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
            onItemClick: (id) => logsField?.write(`onItemClick() id: ${id}`),
            onSort: (info) => this.onListSort(info, logsField),
        });

        this.addSection({
            id: 'customGroup',
            title: 'Custom groups',
            content: [sortableList.elem, logsField.elem],
        });
    }

    initTree() {
        const logsField = LogsField.create();

        const treeRoot = createElement('div', { className: 'tree' });
        for (let i = 1; i <= 4; i += 1) {
            const childItems = (i < 3) ? [1, 2, 3] : [];
            const content = childItems.map((childId) => renderTreeItem(`Item ${i}.${childId}`));
            const item = renderTreeItem(`Item ${i}`, content);
            treeRoot.append(item);
        }

        Sortable.create({
            elem: treeRoot,
            onSort: (info) => {
                const srdId = getTreeItemIdByElem(info.elem);
                const parentId = getTreeItemParentId(info.elem);
                const prevId = getTreeItemIdByElem(info.targetPos.prev);
                const nextId = getTreeItemIdByElem(info.targetPos.next);

                logsField.write(`srcId: ${srdId}; prev: ${prevId}; next: ${nextId}; parent: ${parentId}`);
            },
            selector: '.tree-item',
            containerSelector: '.tree-item__content',
            placeholderClass: 'tree-item__placeholder',
            dragClass: true,
            group: 'tree',
            copyWidth: true,
            tree: true,
        });

        this.addSection({
            id: 'tree',
            title: 'Tree sort',
            content: [treeRoot, logsField.elem],
        });
    }

    onTreeExchange(info, logField) {
        const srdId = getTreeItemIdByElem(info.elem);
        const parentId = getTreeItemParentId(info.elem);
        const prevId = getTreeItemIdByElem(info.targetPos.prev);
        const nextId = getTreeItemIdByElem(info.targetPos.next);

        logField.write(`srcId: ${srdId}; prev: ${prevId}; next: ${nextId}; parent: ${parentId}`);
    }

    initTreeExchange() {
        const logsField = LogsField.create();

        const treeExch1 = createElement('div', { className: 'tree' });
        for (let i = 1; i <= 4; i += 1) {
            const childItems = (i < 3) ? [1, 2, 3] : [];
            const content = childItems.map((childId) => renderTreeItem(`Item ${i}.${childId}`));
            const item = renderTreeItem(`Item ${i}`, content);
            treeExch1.append(item);
        }

        const treeExch2 = createElement('div', { className: 'tree' });
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
            onSort: (info) => this.onTreeExchange(info, logsField),
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
            onSort: (info) => this.onTreeExchange(info, logsField),
            selector: '.tree-item',
            containerSelector: '.tree-item__content',
            placeholderClass: 'tree-item__placeholder',
            dragClass: true,
            group: 'treeExch',
            copyWidth: true,
            tree: true,
            allowSingleItemSort: true,
        });

        this.addSection({
            id: 'treeExchange',
            title: 'Tree exchange',
            content: [
                createElement('div', {
                    className: 'exch-lists-container',
                    children: [treeExch1, treeExch2],
                }),
                logsField.elem,
            ],
        });
    }

    onTableSort(info, logField) {
        const source = info.elem;
        if (!source) {
            logField.write('Missing source item');
            return;
        }

        const destination = info.targetPos.prev ?? info.targetPos.next;
        if (!destination) {
            logField.write('Missing destination item');
            return;
        }

        const srcId = getTableRowIdByElem(source);
        const destId = getTableRowIdByElem(destination);

        logField.write(`srcId: ${srcId}; destId: ${destId}`);
    }

    /** Sortable table with TBODY per each row */
    initTableEachBody() {
        const logsField = LogsField.create();

        const table = createElement('table', {
            className: 'sortable_tbl',
            children: tableData.map((row) => renderTBody(renderTableRow(row))),
        });

        Sortable.create({
            elem: table,
            onSort: (info) => this.onTableSort(info, logsField),
            selector: 'tbody',
            placeholderClass: 'list_item_placeholder',
            group: 'tbl',
            table: true,
            copyWidth: true,
        });

        this.addSection({
            id: 'table1',
            title: 'Sortable table with TBODY rows',
            content: [table, logsField.elem],
        });
    }

    /** Sortable table with single TBODY for all rows */
    initTableSingleBody() {
        const logsField = LogsField.create();

        const table = createElement('table', {
            className: 'sortable_tbl',
            children: renderTBody(tableData.map((row) => renderTableRow(row))),
        });

        Sortable.create({
            elem: table,
            onSort: (info) => this.onTableSort(info, logsField),
            selector: 'tr',
            placeholderClass: 'list_item_placeholder',
            group: 'tbl2',
            table: true,
            copyWidth: true,
        });

        this.addSection({
            id: 'table2',
            title: 'Sortable table with single TBODY',
            content: [table, logsField.elem],
        });
    }

    /** Sortable table without TBODY */
    initTableNoBody() {
        const logsField = LogsField.create();

        const table = createElement('table', {
            className: 'sortable_tbl',
            children: tableData.map((row) => renderTableRow(row)),
        });

        Sortable.create({
            elem: table,
            onSort: (info) => this.onTableSort(info, logsField),
            selector: 'tr',
            placeholderClass: 'list_item_placeholder',
            group: 'tbl3',
            table: true,
            copyWidth: true,
        });

        this.addSection({
            id: 'table3',
            title: 'Sortable table without TBODY',
            content: [table, logsField.elem],
        });
    }

    /** handles option */
    initHandles() {
        const dragItem1 = createElement('div', {
            className: 'drag_item',
            children: createElement('input', { type: 'text' }),
        });

        DefaultDragZone.create({
            elem: dragItem1,
            dragOriginal: true,
            handles: dragItem1,
        });

        const dragHandle2 = createElement('div', { className: 'drag-handle' });
        const dragItem2 = createElement('div', {
            className: 'drag_item',
            style: { top: '50px' },
            children: [
                createElement('input', { type: 'text' }),
                dragHandle2,
            ],
        });

        DefaultDragZone.create({
            elem: dragItem2,
            dragOriginal: true,
            handles: dragHandle2,
        });

        const dragIcon1 = Button.create({
            type: 'static',
            icon: HeaderMenuIcon(),
            className: 'drag-handle-btn',
        });
        const dragIcon2 = Button.create({
            type: 'static',
            icon: HeaderMenuIcon(),
            className: 'drag-handle-btn red',
        });

        const dragItem3 = createElement('div', {
            className: 'drag_item',
            style: { top: '100px' },
            children: [
                createElement('input', { type: 'text' }),
                dragIcon1.elem,
                dragIcon2.elem,
            ],
        });

        DefaultDragZone.create({
            elem: dragItem3,
            dragOriginal: true,
            handles: [
                { elem: dragIcon1.elem, includeChilds: true },
                { elem: dragIcon2.elem, includeChilds: false },
            ],
        });

        const dropArea = createElement('div', {
            className: 'section-h200 drag-area',
            children: [dragItem1, dragItem2, dragItem3],
        });

        OriginalDropTarget.create({ elem: dropArea });

        this.addSection({
            id: 'handle',
            title: 'Drag handle option',
            content: dropArea,
        });
    }

    /** Sortable with rootOnlyHandle option */
    initRootOnlyHandle() {
        const listArea = createElement('div', { className: 'list-area' });
        for (let i = 1; i <= 10; i += 1) {
            const item = renderListItemWithInput(`Item ${i}`);
            listArea.append(item);
        }

        Sortable.create({
            elem: listArea,
            selector: '.list_item',
            placeholderClass: 'list_item_placeholder',
            group: 'list_root',
            onlyRootHandle: true,
        });

        this.addSection({
            id: 'onlyRootHandle',
            title: 'onlyRootHandle option',
            content: listArea,
        });
    }

    /** Sortable with query handles */
    initQueryHandles() {
        const listArea = createElement('div', { className: 'list-area' });
        for (let i = 1; i <= 10; i += 1) {
            const item = renderListItemWithHandle(`Item ${i}`);
            listArea.append(item);
        }

        Sortable.create({
            elem: listArea,
            selector: '.list_item',
            placeholderClass: 'list_item_placeholder',
            group: 'list_hnd',
            handles: [{ query: '.drag-handle', includeChilds: true }],
        });

        this.addSection({
            id: 'listHandle',
            title: 'Sortable list with drag handle option',
            content: listArea,
        });
    }

    /** Sortable with single item */
    initSingleItem() {
        const list1 = createElement('div', {
            className: 'list-area',
            children: renderListItem('Item 1'),
        });

        Sortable.create({
            elem: list1,
            selector: '.list_item',
            placeholderClass: 'list_item_placeholder',
            group: 'single',
            dragClass: true,
            copyWidth: true,
        });
        this.addSection({
            id: 'single',
            title: 'Sortable with single item',
            content: list1,
        });

        const list2 = createElement('div', {
            className: 'list-area',
            children: renderListItem('Item 1'),
        });
        Sortable.create({
            elem: list2,
            selector: '.list_item',
            placeholderClass: 'list_item_placeholder',
            group: 'singleAllow',
            dragClass: true,
            copyWidth: true,
            allowSingleItemSort: true,
        });

        this.addSection({
            id: 'allowSingleItemSort',
            title: 'allowSingleItemSort option',
            content: list2,
        });
    }
}

DragAndDropView.create();
