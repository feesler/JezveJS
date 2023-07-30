import 'jezvejs/style';
import {
    isObject,
    ge,
    setEvents,
    show,
    enable,
    isVisible,
    asArray,
} from 'jezvejs';
import { CloseButton } from 'jezvejs/CloseButton';
import { DropDown } from 'jezvejs/DropDown';
import { Popup } from 'jezvejs/Popup';
import { Tags } from 'jezvejs/Tags';

import { DemoView } from '../../Application/DemoView.js';
import { CustomListItem } from './impl/CustomListItem.js';
import { CustomSelectionItem } from './impl/CustomSelectionItem.js';
import './DropDownView.scss';

const initItems = (title, count, startFrom = 1) => {
    const res = [];

    for (let ind = startFrom; ind < startFrom + count - 1; ind += 1) {
        res.push({ id: ind, title: `${title} ${ind}` });
    }

    return res;
};

/** Test enable\disable feature */
const toggleEnable = (e, dropDown) => {
    const button = e.target;

    dropDown.enable(dropDown.disabled);
    button.value = (dropDown.disabled) ? 'Enable' : 'Disable';
};

const formatObject = (value) => {
    let entries;

    if (Array.isArray(value)) {
        entries = value.map((entry) => formatObject(entry));

        return `[${entries.join(', ')}]`;
    }

    if (isObject(value)) {
        entries = Object.keys(value).map((key) => `${key}: ${value[key]}`);

        return `{ ${entries.join(', ')} }`;
    }

    return value.toString();
};

const logTo = (target, value) => {
    const elem = (typeof target === 'string') ? ge(target) : target;
    if (!elem) {
        return;
    }

    elem.value += `${value}\r\n`;
};

// Standard inline drop down
const initStandardInline = () => {
    DropDown.create({
        elem: 'selinp',
        className: 'dd__container_no-shrink',
        placeholder: 'Select item',
        data: initItems('Item', 10),
    });

    DropDown.create({
        elem: 'selinp2',
        className: 'dd__container_ellipsis',
        placeholder: 'Select item 2',
        data: initItems('Long item test Lorem ipsum dolor sit amet', 10),
    });
};

// Stretch drop downs
const initStandardStretch = () => {
    // Stretch drop down 100% width
    DropDown.create({
        elem: 'selinp3',
        className: 'dd_stretch',
        placeholder: 'Select item 3',
        data: initItems('Item', 10),
    });

    // Stretch drop down 50% width
    DropDown.create({
        elem: 'selinp4',
        className: 'dd_stretch',
        placeholder: 'Select item 4',
        data: initItems('Item', 10),
        onItemSelect(selection) {
            logTo('log-single', `itemselect: ${formatObject(selection)}`);
        },
        onChange(selection) {
            logTo('log-single', `change: ${formatObject(selection)}`);
        },
    });
};

// Fixed menu
const initFixed = () => {
    const dropDown = DropDown.create({
        fixedMenu: true,
        data: initItems('Item', 50),
    });
    const container = ge('fixedContainer');
    container.append(dropDown.elem);
};

// Parse select element (with no default selection)
const initParseSingleNoSelection = () => {
    DropDown.create({
        elem: 'sel0',
        placeholder: 'Select item 5',
    });
};

// Parse select element (with selected option support)
const initParseSingleWithSelection = () => {
    DropDown.create({
        elem: 'sel',
        placeholder: 'Select item 5',
    });
};

// Disabled options support
const initParseDisabledOptions = () => {
    DropDown.create({
        elem: 'disabledopt',
    });
};

// Option groups support
const initParseOptGroups = () => {
    DropDown.create({
        elem: 'optgroupssel',
    });
};

// Dynamic groups create
const dynamicOptGroups = () => {
    const dropDown = DropDown.create({
        elem: 'optgroupsdyn',
        className: 'dd__styled-group',
    });
    const visibleGroup = dropDown.addGroup({ id: 'grVisible', title: 'Visible' });
    const visibleGroupItems = initItems('Visible item', 3);
    visibleGroupItems.forEach(
        (item) => dropDown.addItem({ ...item, group: visibleGroup }),
    );

    const hiddenGroup = dropDown.addGroup({ title: 'Hidden' });
    const hiddenGroupItems = initItems('Hidden item', 3);
    hiddenGroupItems.forEach(
        (item) => dropDown.addItem({ ...item, id: item.id + 3, group: hiddenGroup }),
    );

    const group1 = dropDown.getGroupById('grVisible');
    dropDown.addItem({ id: 3, title: 'Visible item 3', group: group1 });

    const group2 = dropDown.getGroupById(hiddenGroup.id);
    dropDown.addItem({ id: 6, title: 'Hidden item 3', group: group2 });
};

// Create drop down without host element in DOM
const createUnattached = () => {
    const dropDown = DropDown.create({
        data: initItems('Item', 10),
    });

    const unattachedSection = ge('unattachedSection');
    unattachedSection.append(dropDown.elem);
};

// Attach drop down to block element
const attachToBlockElement = () => {
    const btn = CloseButton.create();
    const box = ge('box');
    box.append(btn.elem);

    DropDown.create({
        elem: box,
        listAttach: true,
        isValidToggleTarget: (elem) => !elem.closest('.close-btn'),
        data: initItems('Long Item Lorem Lorem', 10),
    });
};

// Attach drop down to inline element
const attachToInlineElement = () => {
    DropDown.create({
        elem: 'inlineTarget',
        className: 'dd_inline',
        listAttach: true,
        data: initItems('Long Item Lorem Lorem ', 10),
    });
};

// Clipping test
const clippingTest = () => {
    DropDown.create({ elem: 'clipped' });
};

// Multiple select drop down
const parseMultipleSelect = () => {
    DropDown.create({
        elem: 'selinp5',
        className: 'dd_stretch',
        placeholder: 'Multi select control',
        onItemSelect(selection) {
            logTo('log-multi', `itemselect: ${formatObject(selection)}`);
        },
        onChange(selection) {
            logTo('log-multi', `change: ${formatObject(selection)}`);
        },
    });
};

// Generated multiple select drop down
const dynamicMultipleSelect = () => {
    const genDropDown = DropDown.create({
        elem: 'selinp6',
        className: 'dd_stretch',
        placeholder: 'Multi select control',
        onItemSelect(selection) {
            logTo('log-genmulti', `itemselect: ${formatObject(selection)}`);
        },
        multi: true,
        onChange(selection) {
            logTo('log-genmulti', `change: ${formatObject(selection)}`);
        },
    });
    const genData = initItems('Multi select', 10);
    genData.forEach((item) => {
        const props = { ...item };

        if (item.id === 3) {
            props.disabled = true;
        }

        genDropDown.addItem(props);
    });

    setEvents(ge('enableOptionBtn'), {
        click: () => {
            const item = genDropDown.getItem('3');
            genDropDown.enableItem('3', item.disabled);
        },
    });
};

// Disabled single select drop down
const parseDisabledSingleSelect = () => {
    const dropDown = DropDown.create({
        elem: 'selinp7single',
        className: 'dd_stretch',
        disabled: true,
        placeholder: 'Multi select control',
    });

    setEvents(ge('enableSingleBtn'), { click: (e) => toggleEnable(e, dropDown) });
};

// Disabled multiple select drop down
const parseDisabledMultiSelect = () => {
    const dropDown = DropDown.create({
        elem: 'selinp7',
        className: 'dd_stretch',
        disabled: true,
        placeholder: 'Multi select control',
    });

    setEvents(ge('enableBtn'), { click: (e) => toggleEnable(e, dropDown) });
};

// Built-in items filter with single select
const singleSelectFilter = () => {
    const dropDown = DropDown.create({
        elem: 'selinp8',
        enableFilter: true,
        placeholder: 'Type to filter',
        data: initItems('Filter item', 100),
    });

    setEvents(ge('enableFilterBtn'), { click: (e) => toggleEnable(e, dropDown) });

    setEvents(ge('setSelectionSingleBtn'), {
        click: () => {
            const selected = dropDown.getSelectionData();
            const newItem = dropDown.items.find((item) => item.id !== selected.id);
            dropDown.setSelection(newItem.id);
        },
    });

    setEvents(ge('setInvalidSingleSelectionBtn'), {
        click: () => dropDown.setSelection([]),
    });
};

// Built-in items filter with multiple select
const multiSelectFilter = () => {
    const dropDown = DropDown.create({
        elem: 'multiSelFilterInp',
        enableFilter: true,
        noResultsMessage: 'Nothing found',
        multi: true,
        placeholder: 'Type to filter',
        data: initItems('Filter item', 100),
    });

    setEvents(ge('enableMultiFilterBtn'), { click: (e) => toggleEnable(e, dropDown) });

    setEvents(ge('setSelectionMultiBtn'), {
        click: () => {
            const [first, second] = dropDown.items;

            const selection = dropDown.items.filter((_, ind) => (
                (first.selected && ((ind % 2) === 1))
                || (!first.selected && !second.selected && ((ind % 2) === 0))
            )).map((item) => item.id);

            dropDown.setSelection(selection);
        },
    });
};

// Built-in items filter with multiple select
const groupsSelectFilter = () => {
    const dropDown = DropDown.create({
        elem: 'groupFilterInp',
        enableFilter: true,
        openOnFocus: true,
        noResultsMessage: 'Nothing found',
        multi: true,
        placeholder: 'Type to filter',
    });

    const group10 = dropDown.addGroup({ title: '1 - 9' });
    initItems('Item', 9).forEach(
        (item) => dropDown.addItem({ ...item, group: group10 }),
    );
    const group20 = dropDown.addGroup({ title: '10 - 19' });
    initItems('Item', 10, 10).forEach(
        (item) => dropDown.addItem({ ...item, group: group20 }),
    );
    const group30 = dropDown.addGroup({ title: '20 - 29' });
    initItems('Item', 10, 20).forEach(
        (item) => dropDown.addItem({ ...item, group: group30 }),
    );
};

// 'showMultipleSelection' option
const showMultipleSelection = () => {
    let dropDown = null;
    let tags = null;

    const renderTags = (selection) => (
        tags.setState((tagsState) => ({
            ...tagsState,
            items: asArray(selection).map((selItem) => ({
                id: selItem.id,
                title: selItem.value,
            })),
        }))
    );

    tags = Tags.create({
        closeable: true,
        onCloseItem: (itemId) => dropDown.deselectItem(itemId),
    });

    dropDown = DropDown.create({
        enableFilter: true,
        showMultipleSelection: false,
        noResultsMessage: 'Nothing found',
        multi: true,
        placeholder: 'Type to filter',
        data: initItems('Filter item', 20),
        onItemSelect: renderTags,
        onChange: renderTags,
    });

    ge('showMultipleContainer').append(tags.elem, dropDown.elem);
};

// 'showClearButton' option
const showClearButton = () => {
    const dropDown = DropDown.create({
        enableFilter: true,
        showClearButton: false,
        noResultsMessage: 'Nothing found',
        multi: true,
        placeholder: 'Type to filter',
        data: initItems('Item', 20),
    });

    ge('showClearContainer').append(dropDown.elem);
};

// 'showToggleButton' option
const showToggleButton = () => {
    const dropDown = DropDown.create({
        enableFilter: true,
        showToggleButton: false,
        noResultsMessage: 'Nothing found',
        multi: true,
        placeholder: 'Type to filter',
        data: initItems('Item', 20),
    });

    ge('showToggleContainer').append(dropDown.elem);
};

// 'allowCreate' option
const allowCreate = () => {
    const dropDown = DropDown.create({
        enableFilter: true,
        allowCreate: true,
        addItemMessage: (title) => `Add item: '${title}'`,
        multi: true,
        placeholder: 'Type to filter',
        data: initItems('Item', 20),
    });

    ge('allowCreateContainer').append(dropDown.elem);
};

// Built-in items filter with single select
const attachedFilter = () => {
    const btn = CloseButton.create();
    const box = ge('boxFilter');
    box.append(btn.elem);

    DropDown.create({
        elem: box,
        listAttach: true,
        enableFilter: true,
        noResultsMessage: 'Nothing found',
        placeholder: 'Type to filter',
        useSingleSelectionAsPlaceholder: false,
        data: initItems('Filter item', 100),
    });
};

// Built-in items filter with multiple select
const attachedFilterMulti = () => {
    const btn = CloseButton.create();
    const box = ge('boxFilterMulti');
    box.append(btn.elem);

    DropDown.create({
        elem: box,
        listAttach: true,
        enableFilter: true,
        noResultsMessage: 'Nothing found',
        multi: true,
        placeholder: 'Type to filter',
        data: initItems('Filter item', 100),
    });
};

// Custom render drop down
const customRender = () => {
    const dropDown = DropDown.create({
        elem: 'selinp10',
        className: 'dd__custom dd_stretch',
        placeholder: 'Multi select control',
        onItemSelect(selection) {
            logTo('log-custom', `itemselect: ${formatObject(selection)}`);
        },
        onChange(selection) {
            logTo('log-custom', `change: ${formatObject(selection)}`);
        },
        components: { ListItem: CustomListItem, MultiSelectionItem: CustomSelectionItem },
    });

    setEvents(ge('enableCustomBtn'), { click: (e) => toggleEnable(e, dropDown) });
};

// useNativeSelect drop down
const useNativeSelect = () => {
    // Single select
    DropDown.create({
        elem: 'selinp11single',
        placeholder: 'Use native select',
        useNativeSelect: true,
    });
    // Dynamic single select
    DropDown.create({
        elem: 'nativeGenerated',
        placeholder: 'Use native select',
        useNativeSelect: true,
        data: initItems('Item', 5),
    });
    // Multiple select
    DropDown.create({
        elem: 'selinp11',
        placeholder: 'Use native select',
        useNativeSelect: true,
    });
};

// Full screen drop down
const fullScreen = () => {
    DropDown.create({
        elem: 'selinp12',
        placeholder: 'Full screen',
        fullScreen: true,
    });
};

// Dynamic add/remove items
const dynamicAddRemoveItems = () => {
    const dropDown = DropDown.create({
        elem: 'dynamicSel',
        placeholder: 'Dynamic Drop Down',
        multi: true,
    });

    setEvents(ge('addBtn'), {
        click: () => {
            const itemId = dropDown.items.length + 1;
            dropDown.addItem({
                id: itemId,
                title: `Item ${itemId}`,
            });
        },
    });

    setEvents(ge('addDisBtn'), {
        click: () => {
            const itemId = dropDown.items.length + 1;
            dropDown.addItem({
                id: itemId,
                title: `Item ${itemId}`,
                disabled: true,
            });
        },
    });

    setEvents(ge('addHiddenBtn'), {
        click: () => {
            const itemId = dropDown.items.length + 1;
            dropDown.addItem({
                id: itemId,
                title: `Item ${itemId}`,
                disabled: true,
                hidden: true,
            });
        },
    });

    setEvents(ge('delBtn'), {
        click: () => {
            const itemsCount = dropDown.items.length;
            if (!itemsCount) {
                return;
            }

            const item = dropDown.items[itemsCount - 1];
            dropDown.removeItem(item.id);
        },
    });

    setEvents(ge('delAllBtn'), { click: () => dropDown.removeAll() });
};

let popup = null;

const onPopupAction = (action) => {
    if (!popup || !action) {
        return;
    }

    const alignActions = ['top', 'center', 'bottom'];

    if (alignActions.includes(action)) {
        popup.elem.classList.toggle('top-popup', action === 'top');
        popup.elem.classList.toggle('bottom-popup', action === 'bottom');
    }

    if (action === 'scroll') {
        popup.elem.classList.toggle('popup_scroll-message');
    }

    if (action === 'size') {
        popup.elem.classList.toggle('scroll-inside');
    }

    if (action === 'relparent') {
        popup.elem.classList.toggle('relative-wrapper');
    }

    if (action === 'placeholder') {
        const bottomPlaceholder = ge('bottomPlaceholder');
        const visible = isVisible(bottomPlaceholder);
        show(bottomPlaceholder, !visible);

        const togglePlaceholderBtn = ge('togglePlaceholderBtn');
        togglePlaceholderBtn.textContent = (visible)
            ? 'Show bottom placeholder'
            : 'Hide bottom placeholder';
    }

    const scrollMessage = popup.elem.classList.contains('popup_scroll-message');
    const scrollInside = popup.elem.classList.contains('scroll-inside');

    const scrollPopupMessageBtn = ge('scrollPopupMessageBtn');
    enable(scrollPopupMessageBtn, !scrollInside);
    scrollPopupMessageBtn.textContent = (scrollMessage)
        ? 'Scroll whole popup'
        : 'Scroll only content';

    const popupSizeBtn = ge('popupSizeBtn');
    popupSizeBtn.textContent = (scrollInside)
        ? 'Scroll popup'
        : 'Scroll inside content';
};

const createPopup = () => {
    if (popup) {
        return;
    }

    const dropDown = DropDown.create({
        enableFilter: true,
        placeholder: 'Select item',
        data: initItems('Popup item', 50),
    });
    ge('popupDropDownContainer').append(dropDown.elem);

    const popupContent = ge('popupContent');
    popup = Popup.create({
        id: 'dropDownPopup',
        title: 'Popup',
        content: popupContent,
        closeButton: true,
    });
    show(popupContent, true);

    setEvents(ge('popupControls'), {
        click: (e) => onPopupAction(e?.target?.dataset?.action),
    });
};

const showPopup = () => {
    createPopup();

    popup.show();
};

// DropDown inside Popup
const popupOverflow = () => {
    const popupBtn = ge('popupBtn');
    setEvents(popupBtn, { click: () => showPopup() });
};

class DropDownView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initTableOfContents();
        this.addTableOfContentsItem({ title: 'Inline', url: 'inline' });
        this.addTableOfContentsItem({ title: 'Stretch', url: 'stretch' });
        this.addTableOfContentsItem({ title: 'Fixed menu', url: 'fixed' });
        this.addTableOfContentsItem({ title: 'Callbacks', url: 'callbacks' });
        this.addTableOfContentsItem({ title: 'Parse select without selection', url: 'parse' });
        this.addTableOfContentsItem({ title: 'Parse select with selected option', url: 'selected' });
        this.addTableOfContentsItem({ title: 'Disabled option', url: 'disabledOption' });
        this.addTableOfContentsItem({ title: 'Option groups', url: 'groups' });
        this.addTableOfContentsItem({ title: 'Create groups', url: 'createGroups' });
        this.addTableOfContentsItem({ title: 'Create without host element', url: 'noHost' });
        this.addTableOfContentsItem({ title: 'Attach to block element', url: 'attach' });
        this.addTableOfContentsItem({ title: 'Attach to inline element', url: 'attachInline' });
        this.addTableOfContentsItem({ title: 'Clipping test', url: 'clipping' });
        this.addTableOfContentsItem({ title: 'Parse multiple select', url: 'parseMultiple' });
        this.addTableOfContentsItem({ title: 'Create multiple select', url: 'createMultiple' });
        this.addTableOfContentsItem({ title: 'Disabled single select', url: 'disabled' });
        this.addTableOfContentsItem({ title: 'Disabled multiple select', url: 'disabledMultiple' });
        this.addTableOfContentsItem({ title: 'Filter with single select', url: 'filter' });
        this.addTableOfContentsItem({ title: 'Filter with multiple select', url: 'filterMultiple' });
        this.addTableOfContentsItem({ title: 'Filter with groups', url: 'filterGroups' });
        this.addTableOfContentsItem({ title: '\'showMultipleSelection\' option', url: 'showMultipleSelection' });
        this.addTableOfContentsItem({ title: '\'showClearButton\' option', url: 'showClearButton' });
        this.addTableOfContentsItem({ title: '\'showToggleButton\' option', url: 'showToggleButton' });
        this.addTableOfContentsItem({ title: '\'allowCreate\' option', url: 'allowCreate' });
        this.addTableOfContentsItem({ title: 'Filter attached to block element', url: 'filterAttached' });
        this.addTableOfContentsItem({ title: 'Filter with multiple select attached', url: 'filterAttachedMulti' });
        this.addTableOfContentsItem({ title: 'Custom render', url: 'custom' });
        this.addTableOfContentsItem({ title: 'Parse with useNativeSelect option', url: 'useNativeSelect' });
        this.addTableOfContentsItem({ title: 'Create with useNativeSelect option', url: 'createUseNative' });
        this.addTableOfContentsItem({ title: 'useNativeSelect option with multiple select', url: 'useNativeMultiple' });
        this.addTableOfContentsItem({ title: 'fullScreen option', url: 'fullScreen' });
        this.addTableOfContentsItem({ title: 'Methods', url: 'methods' });
        this.addTableOfContentsItem({ title: 'DropDown inside popup', url: 'popup' });

        initStandardInline();
        initStandardStretch();
        initFixed();

        initParseSingleNoSelection();
        initParseSingleWithSelection();

        initParseDisabledOptions();
        initParseOptGroups();
        dynamicOptGroups();

        createUnattached();
        attachToBlockElement();
        attachToInlineElement();

        clippingTest();

        parseMultipleSelect();
        dynamicMultipleSelect();

        parseDisabledSingleSelect();
        parseDisabledMultiSelect();

        singleSelectFilter();
        multiSelectFilter();
        groupsSelectFilter();
        showMultipleSelection();
        showClearButton();
        showToggleButton();
        allowCreate();
        attachedFilter();
        attachedFilterMulti();

        customRender();
        useNativeSelect();
        fullScreen();

        dynamicAddRemoveItems();

        popupOverflow();
    }
}

DropDownView.create();
