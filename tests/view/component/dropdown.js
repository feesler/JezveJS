import { TestComponent } from 'jezve-test';
import { asyncMap } from '../../common.js';

export class DropDown extends TestComponent {
    /** Find for closest parent DropDown container of element */
    static async getParentContainer(env, elem) {
        if (!elem) {
            throw new Error('Invalid element');
        }

        let container = await env.closest(elem, '.dd__container');
        if (!container) {
            container = await env.closest(elem, '.dd__container_attached');
        }

        return container;
    }

    /** Create new instance of DropDown component using any child element of container */
    static async createFromChild(parent, elem) {
        if (!parent || !elem) {
            throw new Error('Invalid parameters');
        }

        const container = await DropDown.getParentContainer(parent.environment, elem);
        if (!container) {
            throw new Error('Container not found');
        }

        return super.create(parent, container);
    }

    async parse() {
        if (
            !this.elem
            || (!await this.hasClass(this.elem, 'dd__container')
                && !await this.hasClass(this.elem, 'dd__container_attached'))
        ) {
            throw new Error('Invalid drop down element');
        }

        this.isAttached = await this.hasClass(this.elem, 'dd__container_attached');
        if (this.isAttached) {
            this.selectBtn = await this.query(this.elem, ':scope > *');
        } else {
            this.selectBtn = await this.query(this.elem, '.dd__toggle-btn');
        }
        if (!this.selectBtn) {
            throw new Error('Select button not found');
        }

        this.disabled = await this.hasClass(this.elem, 'dd__container_disabled');

        if (!this.isAttached) {
            this.statSel = await this.query(this.elem, '.dd__single-selection');
            if (!this.statSel) {
                throw new Error('Static select element not found');
            }
            this.inputElem = await this.query(this.elem, 'input[type="text"]');
            if (!this.inputElem) {
                throw new Error('Input element not found');
            }

            this.editable = await this.isVisible(this.inputElem);
            if (this.editable) {
                this.textValue = await this.prop(this.inputElem, 'value');
            } else {
                this.textValue = await this.prop(this.statSel, 'textContent');
            }
        }

        this.selectElem = await this.query(this.elem, 'select');
        this.isMulti = await this.prop(this.selectElem, 'multiple');
        if (this.isMulti) {
            const selItemElems = await this.queryAll(this.elem, '.dd__selection > .dd__selection-item');
            this.selectedItems = await asyncMap(selItemElems, async (el) => {
                const deselectBtn = await this.query(el, '.dd__del-selection-item-btn');

                let title = await this.prop(el, 'textContent');
                const ind = title.indexOf('×');
                if (ind !== -1) {
                    title = title.substr(0, ind);
                }

                const id = await this.prop(el, 'dataset.id');

                return { id, title, deselectBtn };
            });

            this.value = this.selectedItems;
        } else {
            this.value = await this.prop(this.selectElem, 'value');
        }

        const selectOptions = await this.queryAll(this.selectElem, 'option');
        const optionsData = await asyncMap(selectOptions, async (item) => ({
            id: await this.prop(item, 'value'),
            title: await this.prop(item, 'textContent'),
            selected: await this.prop(item, 'selected'),
        }));

        this.listContainer = await this.query(this.elem, '.dd__list');
        if (this.listContainer) {
            const listItems = await this.queryAll(this.elem, '.dd__list li > div');
            this.items = await asyncMap(listItems, async (item) => {
                const res = {
                    text: await this.prop(item, 'textContent'),
                    elem: item,
                };

                const option = optionsData.find((opt) => opt.title === res.text);
                if (option) {
                    res.id = option.id;
                    res.selected = option.selected;
                }

                return res;
            });
        }
    }

    getItem(itemId) {
        const strId = itemId.toString();

        return this.items.find((item) => item.id === strId);
    }

    getSelectedItem(itemId) {
        const strId = itemId.toString();

        return this.selectedItems.find((item) => item.id === strId);
    }

    async showList(show = true) {
        const listVisible = await this.isVisible(this.listContainer);
        if (show === listVisible) {
            return;
        }

        await this.click(this.selectBtn);
    }

    async toggleItem(itemId) {
        const li = this.getItem(itemId);
        if (!li) {
            throw new Error(`List item ${itemId} not found`);
        }

        if (li.selected) {
            if (this.isMulti) {
                await this.deselectItem(itemId);
            }
        } else {
            await this.selectItem(itemId);
        }

        await this.parse();
    }

    async selectItem(itemId) {
        const li = this.getItem(itemId);
        if (!li) {
            throw new Error(`List item ${itemId} not found`);
        }

        if (li.selected) {
            return;
        }

        await this.showList();
        await this.click(li.elem);
    }

    async deselectItem(itemId) {
        if (!this.isMulti) {
            throw new Error('Deselect item not available for single select DropDown');
        }

        const li = this.getItem(itemId);
        if (!li) {
            throw new Error(`List item ${itemId} not found`);
        }

        if (!li.selected) {
            return;
        }

        await this.showList();
        await this.click(li.elem);
    }

    async deselectItemByTag(itemId) {
        if (!this.isMulti) {
            throw new Error('Deselect item not available for single select DropDown');
        }

        const selItem = this.getSelectedItem(itemId);
        if (!selItem) {
            throw new Error(`Selected item ${itemId} not found`);
        }

        await this.click(selItem.deselectBtn);
        await this.parse();
    }

    async setSelection(val) {
        const values = Array.isArray(val) ? val : [val];

        if (values.length > 1 && !this.isMulti) {
            throw new Error('Select multiple items not available for single select DropDown');
        }

        if (this.isMulti) {
            const selectedValues = this.getSelectedValues();
            for (const value of selectedValues) {
                if (!values.includes(value)) {
                    await this.deselectItem(value);
                }
            }

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
        if (!this.isMulti) {
            throw new Error('Deselect items not available for single select DropDown');
        }

        const selectedValues = this.getSelectedValues();
        for (const value of selectedValues) {
            await this.deselectItem(value);
        }

        await this.showList(false);
    }

    getSelectedItems() {
        return this.items.filter((item) => item.selected);
    }

    getSelectedValues() {
        return this.getSelectedItems().map((item) => item.id);
    }
}
