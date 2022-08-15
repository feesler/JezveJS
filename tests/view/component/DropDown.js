import {
    TestComponent,
    assert,
    query,
    queryAll,
    hasClass,
    prop,
    isVisible,
    click,
    closest,
} from 'jezve-test';
import { asyncMap } from '../../common.js';

export class DropDown extends TestComponent {
    /** Find for closest parent DropDown container of element */
    static async getParentContainer(elem) {
        assert(elem, 'Invalid element');

        let container = await closest(elem, '.dd__container');
        if (!container) {
            container = await closest(elem, '.dd__container_attached');
        }

        return container;
    }

    /** Create new instance of DropDown component using any child element of container */
    static async createFromChild(parent, elem) {
        assert(parent && elem, 'Invalid parameters');

        const container = await DropDown.getParentContainer(elem);
        assert(container, 'Container not found');

        return super.create(parent, container);
    }

    static async isValidContainer(elem) {
        const validClass = await hasClass(elem, 'dd__container');
        const validAttachedClass = await hasClass(elem, 'dd__container_attached');
        return validClass || validAttachedClass;
    }

    async parseContent() {
        const validContainer = await DropDown.isValidContainer(this.elem);
        assert(validContainer, 'Invalid drop down element');

        const res = {};

        res.isAttached = await hasClass(this.elem, 'dd__container_attached');
        if (res.isAttached) {
            res.toggleBtn = await query(this.elem, ':scope > *');
        } else {
            res.toggleBtn = await query(this.elem, '.dd__toggle-btn');
        }
        assert(res.toggleBtn, 'Select button not found');

        res.disabled = await hasClass(this.elem, 'dd__container_disabled');

        if (!res.isAttached) {
            res.statSel = await query(this.elem, '.dd__single-selection');
            assert(res.statSel, 'Static select element not found');
            res.inputElem = await query(this.elem, 'input[type="text"]');
            assert(res.inputElem, 'Input element not found');

            res.editable = await isVisible(res.inputElem);
            if (res.editable) {
                res.textValue = await prop(res.inputElem, 'value');
            } else {
                res.textValue = await prop(res.statSel, 'textContent');
            }
        }

        res.selectElem = await query(this.elem, 'select');
        res.isMulti = await prop(res.selectElem, 'multiple');
        if (res.isMulti) {
            res.clearBtn = await query(this.elem, '.dd__clear-btn');
            assert(res.clearBtn, 'Clear button not found');

            const selItemElems = await queryAll(this.elem, '.dd__selection > .dd__selection-item');
            res.selectedItems = await asyncMap(selItemElems, async (el) => {
                const deselectBtn = await query(el, '.dd__del-selection-item-btn');

                let title = await prop(el, 'textContent');
                const ind = title.indexOf('×');
                if (ind !== -1) {
                    title = title.substr(0, ind);
                }

                const id = await prop(el, 'dataset.id');

                return { id, title, deselectBtn };
            });

            res.value = res.selectedItems;
        } else {
            res.value = await prop(res.selectElem, 'value');
        }

        const selectOptions = await queryAll(res.selectElem, 'option');
        const optionsData = await asyncMap(selectOptions, async (item) => ({
            id: await prop(item, 'value'),
            title: await prop(item, 'textContent'),
            selected: await prop(item, 'selected'),
            disabled: await prop(item, 'disabled'),
        }));

        res.listContainer = await query(this.elem, '.dd__list');
        if (res.listContainer) {
            const listItems = await queryAll(this.elem, '.dd__list li');
            res.items = await asyncMap(listItems, async (item) => {
                const listItem = {
                    text: await prop(item, 'textContent'),
                    hidden: await prop(item, 'hidden'),
                    elem: item,
                };

                const option = optionsData.find((opt) => opt.title === listItem.text);
                if (option) {
                    listItem.id = option.id;
                    listItem.selected = option.selected;
                    listItem.disabled = option.disabled;
                }

                return listItem;
            });
        }

        return res;
    }

    get disabled() {
        return this.content.disabled;
    }

    get value() {
        return this.content.value;
    }

    get textValue() {
        return this.content.textValue;
    }

    get attached() {
        return this.content.isAttached;
    }

    get multiple() {
        return this.content.isMulti;
    }

    get items() {
        return this.content.items;
    }

    getItem(itemId) {
        const strId = itemId.toString();

        return this.content.items.find((item) => item.id === strId);
    }

    getSelectedItem(itemId) {
        const strId = itemId.toString();

        return this.content.selectedItems.find((item) => item.id === strId);
    }

    getSelectedItems() {
        return this.content.items.filter((item) => item.selected);
    }

    getSelectedValues() {
        return this.getSelectedItems().map((item) => item.id);
    }

    async showList(show = true) {
        assert(!this.content.disabled, 'Component is disabled');

        const listVisible = await isVisible(this.content.listContainer);
        if (show === listVisible) {
            return;
        }

        await click(this.content.toggleBtn);
    }

    async toggleItem(itemId) {
        assert(!this.content.disabled, 'Component is disabled');

        const li = this.getItem(itemId);
        assert(li, `List item ${itemId} not found`);

        if (li.selected) {
            if (this.content.isMulti) {
                await this.deselectItem(itemId);
            }
        } else {
            await this.selectItem(itemId);
        }

        await this.parse();
    }

    async selectItem(itemId) {
        assert(!this.content.disabled, 'Component is disabled');

        const li = this.getItem(itemId);
        assert(li, `List item ${itemId} not found`);

        if (li.selected) {
            return;
        }

        await this.showList();
        await click(li.elem);
    }

    async clearSelection() {
        assert(!this.content.disabled, 'Component is disabled');
        assert(this.content.isMulti, 'Clear selection not available for single select DropDown');

        await click(this.content.clearBtn);
    }

    async deselectItem(itemId) {
        assert(!this.content.disabled, 'Component is disabled');
        assert(this.content.isMulti, 'Deselect item not available for single select DropDown');

        const li = this.getItem(itemId);
        assert(li, `List item ${itemId} not found`);

        if (!li.selected) {
            return;
        }

        await this.showList();
        await click(li.elem);
    }

    async deselectItemByTag(itemId) {
        assert(!this.content.disabled, 'Component is disabled');
        assert(this.content.isMulti, 'Deselect item not available for single select DropDown');

        const selItem = this.getSelectedItem(itemId);
        assert(selItem, `Selected item ${itemId} not found`);

        await click(selItem.deselectBtn);
        await this.parse();
    }

    async setSelection(val) {
        assert(!this.content.disabled, 'Component is disabled');

        const values = Array.isArray(val) ? val : [val];
        if (values.length > 1) {
            assert(this.content.isMulti, 'Select multiple items not available for single select DropDown');
        }

        if (this.content.isMulti) {
            await this.clearSelection();
            await this.parse();

            for (const value of values) {
                await this.selectItem(value);
            }

            await this.showList(false);
        } else {
            await this.selectItem(values[0]);
        }
    }

    async deselectAll() {
        assert(!this.content.disabled, 'Component is disabled');
        assert(this.content.isMulti, 'Deselect items not available for single select DropDown');

        const selectedValues = this.getSelectedValues();
        for (const value of selectedValues) {
            await this.deselectItem(value);
        }

        await this.showList(false);
    }
}
