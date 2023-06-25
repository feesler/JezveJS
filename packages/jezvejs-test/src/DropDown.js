import {
    TestComponent,
    assert,
    asyncMap,
    query,
    queryAll,
    prop,
    isVisible,
    click,
    closest,
    evaluate,
    asArray,
    input,
} from 'jezve-test';

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
        return evaluate((el) => (
            el.classList.contains('dd__container')
            || el.classList.contains('dd__container_attached')
        ), elem);
    }

    async parseContent() {
        const validContainer = await DropDown.isValidContainer(this.elem);
        assert(validContainer, 'Invalid drop down element');

        const res = {
            selectElem: await query(this.elem, 'select'),
            items: [],
            selectedItems: [],
        };

        [
            res.isAttached,
            res.disabled,
            res.isMulti,
            res.editable,
            res.value,
        ] = await evaluate((elem, select) => ([
            elem.classList.contains('dd__container_attached'),
            elem.hasAttribute('disabled'),
            select.hasAttribute('multiple'),
            elem.classList.contains('dd__editable'),
            select.value,
        ]), this.elem, res.selectElem);

        if (res.isAttached) {
            res.toggleBtn = await query(this.elem, ':scope > *');
        } else {
            res.toggleBtn = await query(this.elem, '.dd__toggle-btn');
        }
        assert(res.toggleBtn, 'Select button not found');

        res.inputElem = await query(this.elem, 'input[type="text"]');

        if (!res.isAttached) {
            res.statSel = await query(this.elem, '.dd__single-selection');
            assert(res.statSel, 'Static select element not found');
            assert(res.inputElem, 'Input element not found');
        }

        if (res.editable) {
            const [value, placeholder] = await evaluate((el) => ([
                el?.value,
                el?.placeholder,
            ]), res.inputElem);

            res.textValue = (value?.length > 0) ? value : placeholder;
        } else if (res.statSel) {
            res.textValue = await prop(res.statSel, 'textContent');
        }

        if (res.isMulti) {
            res.clearBtn = await query(this.elem, '.dd__clear-btn');
            assert(res.clearBtn, 'Clear button not found');

            const itemsSelector = '.dd__selection > .dd__selection-item';
            const selItemElems = await queryAll(this.elem, itemsSelector);

            const buttonsSelector = `${itemsSelector} .close-btn`;
            const deselectButtons = await queryAll(this.elem, buttonsSelector);

            assert(selItemElems.length === deselectButtons.length, 'Invalid selection element');

            const selItems = selItemElems.map((elem, ind) => ({
                elem,
                deselectBtn: deselectButtons[ind],
            }));
            res.selectedItems = await asyncMap(selItems, async ({ elem, deselectBtn }) => {
                const item = await evaluate((el) => ({
                    id: el.dataset.id,
                    title: el.textContent.trim(),
                }), elem);
                item.deselectBtn = deselectBtn;

                return item;
            });

            res.value = res.selectedItems;
        }

        const selectOptions = await queryAll(res.selectElem, 'option');
        const optionsData = await asyncMap(selectOptions, (item) => evaluate((elem) => ({
            id: elem.value,
            title: elem.textContent,
            selected: elem.selected,
            disabled: elem.disabled,
        }), item));

        res.listContainer = await query(this.elem, '.dd__list');
        res.noItemsMessage = { elem: await query(this.elem, '.dd__not-found-message') };
        if (!res.listContainer || res.noItemsMessage.elem) {
            return res;
        }

        const listItems = await queryAll(this.elem, '.dd__list li');
        res.items = await asyncMap(listItems, async (elem) => {
            const item = await evaluate((el) => ({
                id: el.dataset.id,
                text: el.textContent,
                hidden: el.hidden,
            }), elem);
            item.elem = elem;

            const option = optionsData.find((opt) => opt.id === item.id);
            if (option) {
                item.id = option.id;
                item.selected = option.selected;
                item.disabled = option.disabled;
            }

            return item;
        });

        return res;
    }

    buildModel(cont) {
        const res = {
            isAttached: cont.isAttached,
            disabled: cont.disabled,
            editable: cont.editable,
            textValue: cont.textValue,
            isMulti: cont.isMulti,
        };

        if (res.isMulti) {
            res.value = cont.value.map((item) => ({
                id: item.id,
                title: item.title,
            }));
        } else {
            res.value = cont.value;
        }

        if (cont.items) {
            res.items = cont.items.map((item) => ({
                id: item.id,
                selected: item.selected,
                disabled: item.disabled,
                hidden: item.hidden,
                text: item.text,
            }));
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

    getVisibleItems() {
        return this.content.items.filter((item) => !item.hidden);
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
        assert(!li.hidden, `List item ${itemId} is hidden`);

        if (li.selected && this.content.isMulti) {
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
        assert(!li.hidden, `List item ${itemId} is hidden`);

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

        const values = asArray(val);
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

    async filter(value) {
        assert(!this.content.disabled, 'Component is disabled');
        assert(this.content.editable, 'Component is not editable');

        await input(this.content.inputElem, value);
    }
}
