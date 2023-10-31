import {
    TestComponent,
    asyncMap,
    query,
    queryAll,
    click,
    closest,
    evaluate,
    input,
    waitForFunction,
} from 'jezve-test';
import { asArray } from '@jezvejs/types';
import { assert } from '@jezvejs/assert';

export class DropDown extends TestComponent {
    /** Find for closest parent DropDown container of element */
    static async getParentContainer(elem) {
        assert(elem, 'Invalid element');

        return closest(elem, '.dd__container,.dd__container_attached');
    }

    /** Create new instance of DropDown component using any child element of container */
    static async createFromChild(parent, elem) {
        assert(parent && elem, 'Invalid parameters');

        const container = await DropDown.getParentContainer(elem);
        assert(container, 'Container not found');

        return super.create(parent, container);
    }

    async parseContent() {
        const res = await evaluate((elem) => {
            const isContainer = elem.classList.contains('dd__container');
            const isAttached = elem.classList.contains('dd__container_attached');
            if (!isContainer && !isAttached) {
                return null;
            }

            const menuId = elem.dataset.target;
            const isMulti = elem.classList.contains('dd__container_multiple');
            const menu = document.querySelector(`.dd__list[data-parent="${menuId}"]`);
            const isFixedMenu = menu?.classList.contains('dd__list_fixed');
            const menuList = menu?.querySelector(':scope > .menu-list');
            const select = elem.querySelector('select');
            const inputElem = elem.querySelector('input[type="text"]');
            const menuItems = Array.from(menuList?.querySelectorAll('.button-menu-item') ?? []);
            const options = Array.from(select.options);

            const items = (options.length > 0)
                ? options.map((option) => ({
                    id: option.value,
                    text: option.textContent,
                    selected: option.selected,
                    disabled: option.disabled,
                }))
                : menuItems
                    .filter((item) => (!!item && !item.hidden))
                    .map((el) => ({
                        id: el.dataset?.id,
                        text: el.textContent,
                        selected: el.classList.contains('menu-item_selected'),
                        disabled: el.disabled,
                    }));

            const selectedValue = elem.dataset.value;

            const content = {
                menuId,
                isAttached,
                isFixedMenu,
                disabled: elem.hasAttribute('disabled'),
                isMulti,
                editable: elem.classList.contains('dd__editable'),
                value: (isMulti) ? selectedValue.split(',') : selectedValue,
                selectedItems: [],
                items,
                listContainer: { visible: menu && !menu.hidden },
                renderTime: menuList?.dataset.time,
            };

            if (content.editable && inputElem) {
                const { value, placeholder } = inputElem;

                content.inputValue = value;
                content.inputPlaceholder = placeholder;
                content.textValue = (value?.length > 0) ? value : placeholder;
            } else if (!content.isAttached) {
                const statSel = elem.querySelector('.dd__single-selection');
                content.textValue = statSel?.textContent;
            }

            return content;
        }, this.elem);
        assert(res, 'Invalid drop down element');

        // Menu container
        res.listContainer = {
            elem: await query(`.dd__list[data-parent="${res.menuId}"]`),
        };
        res.listPlaceholder = {
            elem: await query(res.listContainer.elem, '.dd__list-placeholder'),
        };

        const btnSelector = (res.isAttached) ? ':scope > *' : '.dd__toggle-btn';
        res.toggleBtn = await query(this.elem, btnSelector);
        assert(res.toggleBtn, 'Select button not found');

        const inputParent = (res.isAttached) ? res.listContainer.elem : this.elem;
        res.inputElem = await query(inputParent, 'input[type="text"]');
        if (!res.isAttached) {
            assert(res.inputElem, 'Input element not found');
        }

        if (res.isMulti) {
            res.clearBtn = await query(this.elem, '.dd__clear-btn');

            const itemsSelector = '.dd__selection > .dd__selection-item';
            const buttonsSelector = `${itemsSelector} .close-btn`;
            let selItemElems;
            let deselectButtons;

            do {
                selItemElems = await queryAll(this.elem, itemsSelector);
                deselectButtons = await queryAll(this.elem, buttonsSelector);
            } while (selItemElems.length !== deselectButtons.length);

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

            res.value = res.selectedItems.map((item) => item.id);
        }

        return res;
    }

    buildModel(cont) {
        const res = {
            isAttached: cont.isAttached,
            disabled: cont.disabled,
            editable: cont.editable,
            textValue: cont.textValue,
            isMulti: cont.isMulti,
            renderTime: cont.renderTime,
            value: structuredClone(cont.value),
        };

        if (cont.items) {
            res.items = structuredClone(cont.items);
        }

        return res;
    }

    get disabled() {
        return this.content.disabled;
    }

    get value() {
        return this.content.value;
    }

    get inputValue() {
        return this.content.inputValue;
    }

    get inputPlaceholder() {
        return this.content.inputPlaceholder;
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

    get listContainer() {
        return this.content.listContainer;
    }

    get renderTime() {
        return this.content.renderTime;
    }

    async waitForList(action) {
        const prevTime = this.model.renderTime;

        await action();

        await waitForFunction(async () => {
            await this.parse();
            return (prevTime !== this.model.renderTime);
        });
    }

    async getListItem(id) {
        const elem = await query(this.listContainer.elem, `.button-menu-item[data-id="${id}"]`);
        if (!elem) {
            return { elem: null };
        }

        const res = await evaluate((el) => ({
            id: el.dataset?.id,
            text: el.textContent,
            selected: el.classList?.contains('menu-item_selected'),
            disabled: el.disabled,
        }), elem);

        res.elem = elem;

        return res;
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
        return asArray(this.value);
    }

    getVisibleItems() {
        return this.content.items.filter((item) => !item.hidden);
    }

    async showList(show = true) {
        assert(!this.content.disabled, 'Component is disabled');

        if (show === this.listContainer.visible) {
            return;
        }

        await this.waitForList(() => click(this.content.toggleBtn));
    }

    async toggleItem(itemId) {
        assert(!this.content.disabled, 'Component is disabled');

        let li = this.getItem(itemId);
        if (!li) {
            await this.showList();
            await this.parse();
        }
        li = this.getItem(itemId);
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

        await this.showList();

        const li = await this.getListItem(itemId);
        assert(li?.elem, 'Item element not found');
        assert(!li.hidden, `List item ${itemId} is hidden`);

        if (li.selected && this.content.isMulti) {
            return;
        }

        await click(li.elem);
    }

    async clearSelection() {
        assert(!this.content.disabled, 'Component is disabled');
        assert(this.content.isMulti, 'Clear selection not available for single select DropDown');
        assert(this.content.clearBtn, 'Clear button not found');

        await click(this.content.clearBtn);
    }

    async deselectItem(itemId) {
        assert(!this.content.disabled, 'Component is disabled');
        assert(this.content.isMulti, 'Deselect item not available for single select DropDown');

        await this.showList();

        const li = await this.getListItem(itemId);
        assert(li?.elem, 'Item element not found');
        assert(!li.hidden, `List item ${itemId} is hidden`);

        if (!li.selected) {
            return;
        }

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

        if (this.attached) {
            await this.showList();
        }

        await input(this.content.inputElem, value);
        await this.parse();
    }
}
