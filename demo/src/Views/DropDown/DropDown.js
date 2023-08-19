import 'jezvejs/style';
import {
    isObject,
    ge,
    setEvents,
    show,
    enable,
    isVisible,
    asArray,
    createElement,
} from 'jezvejs';
import { Button } from 'jezvejs/Button';
import { DropDown } from 'jezvejs/DropDown';
import { Popup } from 'jezvejs/Popup';
import { Tags } from 'jezvejs/Tags';

import { DemoView } from '../../Application/DemoView.js';
import { createButtons, createControls } from '../../Application/utils.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import { BlueBox } from './components/BlueBox/BlueBox.js';
import { CustomListItem } from './components/CustomListItem/CustomListItem.js';
import { CustomSelectionItem } from './components/CustomSelectionItem/CustomSelectionItem.js';
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
    button.textContent = (dropDown.disabled) ? 'Enable' : 'Disable';
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

/**
 * DropDown component demo view
 */
class DropDownView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.inline();
        this.fullWidth();
        this.callbacks();
        this.fixedMenu();

        this.parseSingleNoSelection();
        this.parseSingleWithSelection();

        this.parseDisabledOptions();
        this.parseOptGroups();
        this.dynamicOptGroups();

        this.createUnattached();
        this.attachToBlockElement();
        this.attachToInlineElement();

        this.clippingTest();

        this.parseMultipleSelect();
        this.dynamicMultipleSelect();

        this.parseDisabledSingleSelect();
        this.parseDisabledMultiSelect();

        this.singleSelectFilter();
        this.multiSelectFilter();
        this.groupsSelectFilter();
        this.showMultipleSelection();
        this.showClearButton();
        this.showToggleButton();
        this.allowCreate();
        this.attachedFilter();
        this.attachedFilterMulti();

        this.customRender();

        this.parseNativeSelect();
        this.createNativeSelect();
        this.multiNativeSelect();

        this.fullScreen();

        this.dynamicAddRemoveItems();

        this.popupOverflow();
    }

    inline() {
        const input1 = createElement('input', { props: { id: 'selinp', type: 'text' } });
        const input2 = createElement('input', { props: { id: 'selinp2', type: 'text' } });
        const container = createElement('div', {
            props: { className: 'inline-container' },
            children: [input1, input2],
        });

        DropDown.create({
            elem: input1,
            className: 'dd__container_no-shrink',
            placeholder: 'Select item',
            data: initItems('Item', 10),
        });

        DropDown.create({
            elem: input2,
            className: 'dd__container_ellipsis',
            placeholder: 'Select item 2',
            data: initItems('Long item test Lorem ipsum dolor sit amet', 10),
        });

        this.addSection({
            id: 'inline',
            title: 'Inline',
            content: container,
        });
    }

    fullWidth() {
        const input = createElement('input', { props: { id: 'selinp3', type: 'text' } });
        const container = createElement('div', {
            props: { className: 'allwidth' },
            children: input,
        });

        DropDown.create({
            elem: input,
            className: 'dd_stretch',
            placeholder: 'Select item 3',
            data: initItems('Item', 10),
        });

        this.addSection({
            id: 'stretch',
            title: 'Stretch',
            content: container,
        });
    }

    callbacks() {
        const logsField = LogsField.create();

        const input = createElement('input', { props: { id: 'selinp4', type: 'text' } });
        const container = createElement('div', {
            props: { className: 'allwidth halfwidth' },
            children: [input, logsField.elem],
        });

        DropDown.create({
            elem: input,
            className: 'dd_stretch',
            placeholder: 'Select item 4',
            data: initItems('Item', 10),
            onItemSelect(selection) {
                logsField.write(`itemselect: ${formatObject(selection)}`);
            },
            onChange(selection) {
                logsField.write(`change: ${formatObject(selection)}`);
            },
        });

        this.addSection({
            id: 'callbacks',
            title: 'Callbacks',
            content: container,
        });
    }

    fixedMenu() {
        this.addSection({
            id: 'fixed',
            title: 'Fixed menu',
            content: DropDown.create({
                fixedMenu: true,
                data: initItems('Item', 50),
            }).elem,
        });
    }

    parseSingleNoSelection() {
        this.addSection({
            id: 'parse',
            title: 'Parse select without selection',
            content: DropDown.create({
                elem: 'sel0',
                placeholder: 'Select item 5',
            }).elem,
        });
    }

    parseSingleWithSelection() {
        this.addSection({
            id: 'selected',
            title: 'Parse select with selected option',
            content: DropDown.create({
                elem: 'sel',
                placeholder: 'Select item 5',
            }).elem,
        });
    }

    // Disabled options support
    parseDisabledOptions() {
        this.addSection({
            id: 'disabledOption',
            title: 'Disabled option',
            content: DropDown.create({
                elem: 'disabledopt',
            }).elem,
        });
    }

    // Option groups support
    parseOptGroups() {
        this.addSection({
            id: 'groups',
            title: 'Option groups',
            content: DropDown.create({
                elem: 'optgroupssel',
            }).elem,
        });
    }

    // Dynamic groups create
    dynamicOptGroups() {
        const input = createElement('input', { props: { id: 'optgroupsdyn', type: 'text' } });
        const dropDown = DropDown.create({
            elem: input,
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

        this.addSection({
            id: 'createGroups',
            title: 'Create groups',
            content: dropDown.elem,
        });
    }

    // Create drop down without host element in DOM
    createUnattached() {
        this.addSection({
            id: 'noHost',
            title: 'Create without host element',
            content: DropDown.create({
                data: initItems('Item', 10),
            }).elem,
        });
    }

    // Attach drop down to block element
    attachToBlockElement() {
        const box = BlueBox.create({ id: 'box' });

        this.addSection({
            id: 'attach',
            title: 'Attach to block element',
            content: box.elem,
        });

        DropDown.create({
            elem: box.elem,
            listAttach: true,
            isValidToggleTarget: (elem) => !elem.closest('.close-btn'),
            data: initItems('Long Item Lorem Lorem', 10),
        });
    }

    // Attach drop down to inline element
    attachToInlineElement() {
        const inlineTarget = createElement('span', {
            props: {
                id: 'inlineTarget',
                className: 'link-inline',
                textContent: 'click',
            },
        });
        const text = createElement('div', {
            children: [
                document.createTextNode('Lorem ipsum dolor sit, amet consectetur '),
                inlineTarget,
                document.createTextNode(' adipisicing elit. Aut consequatur iure repellat'),
            ],
        });

        DropDown.create({
            elem: inlineTarget,
            className: 'dd_inline',
            listAttach: true,
            data: initItems('Long Item Lorem Lorem ', 10),
        });

        this.addSection({
            id: 'attachInline',
            title: 'Attach to inline element',
            content: text,
        });
    }

    // Clipping test
    clippingTest() {
        const dropDown = DropDown.create({ elem: 'clipped' });

        this.addSection({
            id: 'clipping',
            title: 'Clipping test',
            content: createElement('div', {
                props: { className: 'offset-parent' },
                children: createElement('div', {
                    props: { className: 'clipper' },
                    children: dropDown.elem,
                }),
            }),
        });
    }

    // Multiple select drop down
    parseMultipleSelect() {
        const logsField = LogsField.create();

        const dropDown = DropDown.create({
            elem: 'selinp5',
            className: 'dd_stretch',
            placeholder: 'Multi select control',
            onItemSelect(selection) {
                logsField.write(`itemselect: ${formatObject(selection)}`);
            },
            onChange(selection) {
                logsField.write(`change: ${formatObject(selection)}`);
            },
        });

        this.addSection({
            id: 'parseMultiple',
            title: 'Parse multiple select',
            content: [dropDown.elem, logsField.elem],
        });
    }

    // Generated multiple select drop down
    dynamicMultipleSelect() {
        const logsField = LogsField.create();

        const input = createElement('input', { props: { id: 'selinp6', type: 'text' } });
        const genDropDown = DropDown.create({
            elem: input,
            className: 'dd_stretch',
            placeholder: 'Multi select control',
            multiple: true,
            data: initItems('Multi select', 10).map((item) => ({
                ...item,
                disabled: (item.id === 3),
            })),
            onItemSelect(selection) {
                logsField.write(`itemselect: ${formatObject(selection)}`);
            },
            onChange(selection) {
                logsField.write(`change: ${formatObject(selection)}`);
            },
        });

        const controls = createControls(
            Button.create({
                title: 'Toggle enable item 3',
                className: 'action-btn',
                onClick: () => {
                    const item = genDropDown.getItem('3');
                    genDropDown.enableItem('3', item.disabled);
                },
            }).elem,
        );

        this.addSection({
            id: 'createMultiple',
            title: 'Create multiple select',
            content: [genDropDown.elem, controls, logsField.elem],
        });
    }

    // Disabled single select drop down
    parseDisabledSingleSelect() {
        const dropDown = DropDown.create({
            elem: 'selinp7single',
            className: 'dd_stretch',
            disabled: true,
            placeholder: 'Multi select control',
        });

        const controls = createControls(
            Button.create({
                title: 'Enable',
                className: 'action-btn',
                onClick: (e) => toggleEnable(e, dropDown),
            }).elem,
        );

        this.addSection({
            id: 'disabled',
            title: 'Disabled single select',
            content: [dropDown.elem, controls],
        });
    }

    // Disabled multiple select drop down
    parseDisabledMultiSelect() {
        const dropDown = DropDown.create({
            elem: 'selinp7',
            className: 'dd_stretch',
            disabled: true,
            placeholder: 'Multi select control',
        });

        const controls = createControls(
            Button.create({
                id: 'enableBtn',
                title: 'Enable',
                className: 'action-btn',
                onClick: (e) => toggleEnable(e, dropDown),
            }).elem,
        );

        this.addSection({
            id: 'disabledMultiple',
            title: 'Disabled multiple select',
            content: [dropDown.elem, controls],
        });
    }

    // Built-in items filter with single select
    singleSelectFilter() {
        const input = createElement('input', {
            attrs: {
                id: 'selinp8',
                type: 'text',
                disabled: '',
            },
        });

        const dropDown = DropDown.create({
            elem: input,
            enableFilter: true,
            placeholder: 'Type to filter',
            data: initItems('Filter item', 100),
        });

        const controls = createButtons([{
            id: 'enableFilterBtn',
            title: 'Enable',
            className: 'action-btn',
            onClick: (e) => toggleEnable(e, dropDown),
        }, {
            id: 'setInvalidSingleSelectionBtn',
            title: 'Change selection',
            className: 'action-btn',
            onClick: () => {
                const selected = dropDown.getSelectionData();
                const newItem = dropDown.items.find((item) => item.id !== selected.id);
                dropDown.setSelection(newItem.id);
            },
        }, {
            id: 'setSelectionSingleBtn',
            title: 'Set invalid selection',
            className: 'action-btn',
            onClick: () => dropDown.setSelection([]),
        }]);

        this.addSection({
            id: 'filter',
            title: 'Filter with single select',
            content: [dropDown.elem, controls],
        });
    }

    // Built-in items filter with multiple select
    multiSelectFilter() {
        const input = createElement('input', {
            attrs: {
                id: 'multiSelFilterInp',
                type: 'text',
                disabled: '',
            },
        });
        const dropDown = DropDown.create({
            elem: input,
            enableFilter: true,
            noResultsMessage: 'Nothing found',
            multiple: true,
            placeholder: 'Type to filter',
            data: initItems('Filter item', 100),
        });

        const controls = createButtons([{
            id: 'enableMultiFilterBtn',
            title: 'Enable',
            className: 'action-btn',
            onClick: (e) => toggleEnable(e, dropDown),
        }, {
            id: 'setSelectionMultiBtn',
            title: 'Change selection',
            className: 'action-btn',
            onClick: () => {
                const [first, second] = dropDown.items;

                const selection = dropDown.items.filter((_, ind) => (
                    (first.selected && ((ind % 2) === 1))
                    || (!first.selected && !second.selected && ((ind % 2) === 0))
                )).map((item) => item.id);

                dropDown.setSelection(selection);
            },
        }]);

        this.addSection({
            id: 'filterMultiple',
            title: 'Filter with multiple select',
            content: [dropDown.elem, controls],
        });
    }

    // Built-in items filter with multiple select
    groupsSelectFilter() {
        const input = createElement('input', { props: { id: 'groupFilterInp', type: 'text' } });
        const dropDown = DropDown.create({
            elem: input,
            enableFilter: true,
            openOnFocus: true,
            noResultsMessage: 'Nothing found',
            multiple: true,
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

        this.addSection({
            id: 'filterGroups',
            title: 'Filter with groups',
            description: '+ \'openOnFocus\' option',
            content: dropDown.elem,
        });
    }

    // 'showMultipleSelection' option
    showMultipleSelection() {
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
            multiple: true,
            placeholder: 'Type to filter',
            data: initItems('Filter item', 20),
            onItemSelect: renderTags,
            onChange: renderTags,
        });

        this.addSection({
            id: 'showMultipleSelection',
            title: '\'showMultipleSelection\' option',
            className: 'multi-line-section',
            content: [tags.elem, dropDown.elem],
        });
    }

    // 'showClearButton' option
    showClearButton() {
        const dropDown = DropDown.create({
            enableFilter: true,
            showClearButton: false,
            noResultsMessage: 'Nothing found',
            multiple: true,
            placeholder: 'Type to filter',
            data: initItems('Item', 20),
        });

        this.addSection({
            id: 'showClearButton',
            title: '\'showClearButton\' option',
            content: dropDown.elem,
        });
    }

    // 'showToggleButton' option
    showToggleButton() {
        const dropDown = DropDown.create({
            enableFilter: true,
            showToggleButton: false,
            noResultsMessage: 'Nothing found',
            multiple: true,
            placeholder: 'Type to filter',
            data: initItems('Item', 20),
        });

        this.addSection({
            id: 'showToggleButton',
            title: '\'showToggleButton\' option',
            content: dropDown.elem,
        });
    }

    // 'allowCreate' option
    allowCreate() {
        const dropDown = DropDown.create({
            enableFilter: true,
            allowCreate: true,
            addItemMessage: (title) => `Add item: '${title}'`,
            multiple: true,
            placeholder: 'Type to filter',
            data: initItems('Item', 20),
        });

        this.addSection({
            id: 'allowCreate',
            title: '\'allowCreate\' option',
            content: dropDown.elem,
        });
    }

    // Built-in items filter with single select
    attachedFilter() {
        const box = BlueBox.create({ id: 'boxFilter' });

        this.addSection({
            id: 'filterAttached',
            title: 'Filter attached to block element',
            description: '+ \'useSingleSelectionAsPlaceholder\' option',
            content: box.elem,
        });

        DropDown.create({
            elem: box.elem,
            listAttach: true,
            enableFilter: true,
            noResultsMessage: 'Nothing found',
            placeholder: 'Type to filter',
            useSingleSelectionAsPlaceholder: false,
            data: initItems('Filter item', 100),
        });
    }

    // Built-in items filter with multiple select
    attachedFilterMulti() {
        const box = BlueBox.create({ id: 'boxFilterMulti' });

        this.addSection({
            id: 'filterAttachedMulti',
            title: 'Filter with multiple select attached',
            content: box.elem,
        });

        DropDown.create({
            elem: box.elem,
            listAttach: true,
            enableFilter: true,
            noResultsMessage: 'Nothing found',
            multiple: true,
            placeholder: 'Type to filter',
            data: initItems('Filter item', 100),
        });
    }

    // Custom render drop down
    customRender() {
        const logsField = LogsField.create();

        const dropDown = DropDown.create({
            elem: 'selinp10',
            className: 'dd__custom dd_stretch',
            placeholder: 'Multi select control',
            multiple: true,
            onItemSelect(selection) {
                logsField.write(`itemselect: ${formatObject(selection)}`);
            },
            onChange(selection) {
                logsField.write(`change: ${formatObject(selection)}`);
            },
            components: {
                ListItem: CustomListItem,
                Checkbox: CustomListItem,
                MultiSelectionItem: CustomSelectionItem,
            },
        });

        const controls = createButtons([{
            id: 'enableCustomBtn',
            title: 'Disable',
            className: 'action-btn',
            onClick: (e) => toggleEnable(e, dropDown),
        }]);

        this.addSection({
            id: 'custom',
            title: 'Custom render',
            content: [dropDown.elem, controls, logsField.elem],
        });
    }

    parseNativeSelect() {
        this.addSection({
            id: 'useNativeSelect',
            title: 'Parse with useNativeSelect option',
            content: DropDown.create({
                elem: 'selinp11single',
                placeholder: 'Use native select',
                useNativeSelect: true,
            }).elem,
        });
    }

    createNativeSelect() {
        this.addSection({
            id: 'createUseNative',
            title: 'Create with useNativeSelect option',
            content: DropDown.create({
                elem: createElement('input', { props: { id: 'nativeGenerated', type: 'text' } }),
                placeholder: 'Use native select',
                useNativeSelect: true,
                data: initItems('Item', 5),
            }).elem,
        });
    }

    multiNativeSelect() {
        this.addSection({
            id: 'useNativeMultiple',
            title: 'useNativeSelect option with multiple select',
            content: DropDown.create({
                elem: 'selinp11',
                placeholder: 'Use native select',
                useNativeSelect: true,
            }).elem,
        });
    }

    fullScreen() {
        this.addSection({
            id: 'fullScreen',
            title: 'fullScreen option',
            content: DropDown.create({
                elem: 'selinp12',
                placeholder: 'Full screen',
                fullScreen: true,
            }).elem,
        });
    }

    // Dynamic add/remove items
    dynamicAddRemoveItems() {
        const select = createElement('select', { props: { id: 'dynamicSel' } });
        const dropDown = DropDown.create({
            elem: select,
            placeholder: 'Dynamic Drop Down',
            multiple: true,
        });

        const controls = createButtons([{
            id: 'addBtn',
            title: 'Add item',
            className: 'action-btn',
            onClick: () => {
                const itemId = dropDown.items.length + 1;
                dropDown.addItem({
                    id: itemId,
                    title: `Item ${itemId}`,
                });
            },
        }, {
            id: 'addDisBtn',
            title: 'Add disabled item',
            className: 'action-btn',
            onClick: () => {
                const itemId = dropDown.items.length + 1;
                dropDown.addItem({
                    id: itemId,
                    title: `Item ${itemId}`,
                    disabled: true,
                });
            },
        }, {
            id: 'addHiddenBtn',
            title: 'Add hidden item',
            className: 'action-btn',
            onClick: () => {
                const itemId = dropDown.items.length + 1;
                dropDown.addItem({
                    id: itemId,
                    title: `Item ${itemId}`,
                    disabled: true,
                    hidden: true,
                });
            },
        }, {
            id: 'delBtn',
            title: 'Remove last item',
            className: 'action-btn',
            onClick: () => {
                const itemsCount = dropDown.items.length;
                if (!itemsCount) {
                    return;
                }

                const item = dropDown.items[itemsCount - 1];
                dropDown.removeItem(item.id);
            },
        }, {
            id: 'delAllBtn',
            title: 'Remove all items',
            className: 'action-btn',
            onClick: () => dropDown.removeAll(),
        }]);

        this.addSection({
            id: 'methods',
            title: 'Methods',
            content: [dropDown.elem, controls],
        });
    }

    onPopupAction(action) {
        if (!this.popup || !action) {
            return;
        }

        const { classList } = this.popup.elem;
        const alignActions = ['top', 'center', 'bottom'];

        if (alignActions.includes(action)) {
            classList.toggle('top-popup', action === 'top');
            classList.toggle('bottom-popup', action === 'bottom');
        }

        if (action === 'scroll') {
            classList.toggle('popup_scroll-message');
        }

        if (action === 'size') {
            classList.toggle('scroll-inside');
        }

        if (action === 'relparent') {
            classList.toggle('relative-wrapper');
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

        const scrollMessage = classList.contains('popup_scroll-message');
        const scrollInside = classList.contains('scroll-inside');

        const scrollPopupMessageBtn = ge('scrollPopupMessageBtn');
        enable(scrollPopupMessageBtn, !scrollInside);
        scrollPopupMessageBtn.textContent = (scrollMessage)
            ? 'Scroll whole popup'
            : 'Scroll only content';

        const popupSizeBtn = ge('popupSizeBtn');
        popupSizeBtn.textContent = (scrollInside)
            ? 'Scroll popup'
            : 'Scroll inside content';
    }

    createPopup() {
        if (this.popup) {
            return;
        }

        const dropDown = DropDown.create({
            enableFilter: true,
            placeholder: 'Select item',
            data: initItems('Popup item', 50),
        });
        ge('popupDropDownContainer').append(dropDown.elem);

        const popupContent = ge('popupContent');
        this.popup = Popup.create({
            id: 'dropDownPopup',
            title: 'Popup',
            content: popupContent,
            closeButton: true,
        });
        show(popupContent, true);

        setEvents(ge('popupControls'), {
            click: (e) => this.onPopupAction(e?.target?.dataset?.action),
        });
    }

    showPopup() {
        this.createPopup();

        this.popup.show();
    }

    // DropDown inside Popup
    popupOverflow() {
        this.addSection({
            id: 'popup',
            title: 'DropDown inside popup',
            content: createButtons({
                id: 'popupBtn',
                title: 'Show popup',
                className: 'action-btn',
                onClick: () => this.showPopup(),
            }),
        });
    }
}

DropDownView.create();
