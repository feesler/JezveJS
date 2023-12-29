import { asArray } from '@jezvejs/types';
import { createElement } from '@jezvejs/dom';
import { Icon } from 'jezvejs/Icon';

import { TileCardIcon } from './impl/TileCardIcon.js';

export const tableData = [
    [1, 10000, 'some text'],
    [2, 354, 'some text'],
    [3, 850110, 'some long long text'],
    [4, 6000, 'some text'],
    [5, 7860, 'some short text'],
    [6, 4500, 'some text'],
    [7, 200, 'some text'],
];

export const renderTileIcon = () => (
    createElement('span', {
        props: { className: 'sortable-tile__icon-container' },
        children: Icon.create({
            icon: TileCardIcon(),
            className: 'sortable-tile__icon',
        }).elem,
    })
);

export const renderTileTitle = (textContent) => (
    createElement('span', {
        props: { className: 'sortable-tile__title', textContent },
    })
);

export const renderTile = (textContent, withIcon = false) => (
    createElement('div', {
        props: { className: 'sortable-tile' },
        children: [
            renderTileTitle(textContent),
            (withIcon) ? renderTileIcon() : null,
        ],
    })
);

export const renderTilePlaceholder = () => (
    createElement('div', {
        props: { className: 'sortable-tile sortable-tile_placeholder' },
    })
);

export const getItemIdByElem = (elem) => {
    if (!elem) {
        return null;
    }

    const text = elem.textContent.trim();
    return parseInt(text.substr(5), 10);
};

export const renderListItem = (title = 'Item') => (
    createElement('div', {
        props: { className: 'list_item' },
        children: createElement('span', { props: { textContent: title } }),
    })
);

export const renderDestListItem = (title = 'Item', isPlaceholder = false) => (
    createElement('div', {
        props: { className: `list_item ${isPlaceholder ? 'list_item_placeholder' : 'list_item_2'}` },
        children: createElement('span', { props: { textContent: title } }),
    })
);

export const renderTreeItem = (title, content = [], className = []) => (
    createElement('div', {
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
    })
);

export const getTreeItemIdByElem = (elem) => {
    const titleElem = elem?.querySelector(':scope > .tree-item__title');
    if (!titleElem) {
        return null;
    }

    const text = titleElem.textContent.trim();
    return (text.startsWith('Item ')) ? text.substring(5) : text;
};

export const getTreeItemParentId = (elem) => {
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

export const getTableRowIdByElem = (elem) => {
    if (!elem) {
        return null;
    }

    const firstCell = elem.querySelector('tr > td');
    return parseInt(firstCell.textContent, 10);
};

export const renderTableRow = (columns) => (
    createElement('tr', {
        children: asArray(columns).map((textContent) => (
            createElement('td', {
                children: createElement('div', { props: { textContent } }),
            })
        )),
    })
);

export const renderTBody = (children) => (
    createElement('tbody', {
        props: { className: 'tbl_list_item' },
        children,
    })
);

export const renderListItemWithInput = (title = 'Item') => (
    createElement('div', {
        props: { className: 'list_item' },
        children: [
            createElement('span', { props: { textContent: title } }),
            createElement('input', { props: { type: 'text' } }),
        ],
    })
);

export const renderListItemWithHandle = (title = 'Item') => (
    createElement('div', {
        props: { className: 'list_item' },
        children: [
            createElement('div', { props: { className: 'drag-handle' } }),
            createElement('span', { props: { textContent: title } }),
            createElement('input', { props: { type: 'text' } }),
        ],
    })
);
