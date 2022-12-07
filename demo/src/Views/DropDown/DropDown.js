import 'jezvejs/style';
import {
    isObject,
    ge,
    setEvents,
    onReady,
    show,
} from 'jezvejs';
import { DropDown } from 'jezvejs/DropDown';
import { Popup } from 'jezvejs/Popup';
import { initNavigation } from '../../app.js';
import { CustomListItem } from './impl/CustomListItem.js';
import { CustomSelectionItem } from './impl/CustomSelectionItem.js';
import './style.scss';

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
        onitemselect(selection) {
            logTo('log-single', `itemselect: ${formatObject(selection)}`);
        },
        onchange(selection) {
            logTo('log-single', `change: ${formatObject(selection)}`);
        },
    });
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
    const groupsDropDown = DropDown.create({
        elem: 'optgroupsdyn',
        className: 'dd__styled-group',
    });
    const visibleGroup = groupsDropDown.addGroup('Visible');
    const visibleGroupItems = initItems('Visible item', 3);
    visibleGroupItems.forEach(
        (item) => groupsDropDown.addItem({ ...item, group: visibleGroup }),
    );

    const hiddenGroup = groupsDropDown.addGroup('Hidden');
    const hiddenGroupItems = initItems('Hidden item', 3);
    hiddenGroupItems.forEach(
        (item) => groupsDropDown.addItem({ ...item, id: item.id + 3, group: hiddenGroup }),
    );

    groupsDropDown.addItem({ id: 3, title: 'Visible item 3', group: visibleGroup });
    groupsDropDown.addItem({ id: 6, title: 'Hidden item 3', group: hiddenGroup });
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
    DropDown.create({
        elem: 'box',
        listAttach: true,
        data: initItems('Long Item Lorem Lorem', 10),
    });
};

// Attach drop down to inline element
const attachToInlineElement = () => {
    DropDown.create({
        elem: 'inline',
        className: 'link_inline_cont',
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
        onitemselect(selection) {
            logTo('log-multi', `itemselect: ${formatObject(selection)}`);
        },
        onchange(selection) {
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
        onitemselect(selection) {
            logTo('log-genmulti', `itemselect: ${formatObject(selection)}`);
        },
        multi: true,
        onchange(selection) {
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

    const enableOptionBtn = ge('enableOptionBtn');
    enableOptionBtn.addEventListener('click', () => {
        const item = genDropDown.getItem('3');
        genDropDown.enableItem('3', item.disabled);
    });
};

// Disabled single select drop down
const parseDisabledSingleSelect = () => {
    const disabledSingleDropDown = DropDown.create({
        elem: 'selinp7single',
        className: 'dd_stretch',
        disabled: true,
        placeholder: 'Multi select control',
    });

    const enableBtn = ge('enableSingleBtn');
    enableBtn.addEventListener('click', (e) => toggleEnable(e, disabledSingleDropDown));
};

// Disabled multiple select drop down
const parseDisabledMultiSelect = () => {
    const disabledDropDown = DropDown.create({
        elem: 'selinp7',
        className: 'dd_stretch',
        disabled: true,
        placeholder: 'Multi select control',
    });

    const enableBtn = ge('enableBtn');
    enableBtn.addEventListener('click', (e) => toggleEnable(e, disabledDropDown));
};

// Built-in items filter with single select
const singleSelectFilter = () => {
    const dropDown = DropDown.create({
        elem: 'selinp8',
        enableFilter: true,
        placeholder: 'Type to filter',
        data: initItems('Filter item', 100),
    });

    const enableBtn = ge('enableFilterBtn');
    enableBtn.addEventListener('click', (e) => toggleEnable(e, dropDown));
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

    const enableBtn = ge('enableMultiFilterBtn');
    enableBtn.addEventListener('click', (e) => toggleEnable(e, dropDown));
};

// Built-in items filter with multiple select
const groupsSelectFilter = () => {
    const dropDown = DropDown.create({
        elem: 'groupFilterInp',
        enableFilter: true,
        noResultsMessage: 'Nothing found',
        multi: true,
        placeholder: 'Type to filter',
    });

    const group10 = dropDown.addGroup('1 - 9');
    initItems('Item', 9).forEach(
        (item) => dropDown.addItem({ ...item, group: group10 }),
    );
    const group20 = dropDown.addGroup('10 - 19');
    initItems('Item', 10, 10).forEach(
        (item) => dropDown.addItem({ ...item, group: group20 }),
    );
    const group30 = dropDown.addGroup('20 - 29');
    initItems('Item', 10, 20).forEach(
        (item) => dropDown.addItem({ ...item, group: group30 }),
    );
};

// Built-in items filter with multiple select
const attachedFilter = () => {
    DropDown.create({
        elem: 'boxFilter',
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
    const customDropDown = DropDown.create({
        elem: 'selinp10',
        className: 'dd__custom dd_stretch',
        placeholder: 'Multi select control',
        onitemselect(selection) {
            logTo('log-custom', `itemselect: ${formatObject(selection)}`);
        },
        onchange(selection) {
            logTo('log-custom', `change: ${formatObject(selection)}`);
        },
        components: { ListItem: CustomListItem, MultiSelectionItem: CustomSelectionItem },
    });

    const enableBtn = ge('enableBtn2');
    enableBtn.addEventListener('click', (e) => toggleEnable(e, customDropDown));
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
    const dynamicDropDown = DropDown.create({
        elem: 'dynamicSel',
        placeholder: 'Dynamic Drop Down',
        multi: true,
    });

    const addBtn = ge('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const itemId = dynamicDropDown.items.length + 1;
            dynamicDropDown.addItem({
                id: itemId,
                title: `Item ${itemId}`,
            });
        });
    }

    const addDisabledBtn = ge('addDisBtn');
    addDisabledBtn.addEventListener('click', () => {
        const itemId = dynamicDropDown.items.length + 1;
        dynamicDropDown.addItem({
            id: itemId,
            title: `Item ${itemId}`,
            disabled: true,
        });
    });

    const addHiddenBtn = ge('addHiddenBtn');
    addHiddenBtn.addEventListener('click', () => {
        const itemId = dynamicDropDown.items.length + 1;
        dynamicDropDown.addItem({
            id: itemId,
            title: `Item ${itemId}`,
            disabled: true,
            hidden: true,
        });
    });

    const delBtn = ge('delBtn');
    delBtn.addEventListener('click', () => {
        const itemsCount = dynamicDropDown.items.length;
        if (!itemsCount) {
            return;
        }

        const item = dynamicDropDown.items[itemsCount - 1];
        dynamicDropDown.removeItem(item.id);
    });

    const delAllBtn = ge('delAllBtn');
    if (delAllBtn) {
        delAllBtn.addEventListener('click', () => {
            dynamicDropDown.removeAll();
        });
    }
};

let popup = null;

const setPopupAlign = (align) => {
    if (!popup) {
        return;
    }

    popup.elem.classList.toggle('top-popup', align === 'top');
    popup.elem.classList.toggle('bottom-popup', align === 'bottom');
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

    setEvents(ge('popupControls'), {
        click: (e) => setPopupAlign(e?.target?.dataset?.align),
    });

    const popupContent = ge('popupContent');
    popup = Popup.create({
        id: 'popup',
        title: 'Popup',
        content: popupContent,
        btn: {
            closeBtn: true,
        },
    });
    show(popupContent, true);
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

const init = () => {
    initNavigation();

    initStandardInline();
    initStandardStretch();

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
    attachedFilter();

    customRender();
    useNativeSelect();
    fullScreen();

    dynamicAddRemoveItems();

    popupOverflow();
};

onReady(init);
