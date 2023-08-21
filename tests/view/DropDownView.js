import {
    query,
    click,
    assert,
    asyncMap,
    waitForFunction,
} from 'jezve-test';
import { DropDown } from 'jezvejs-test';
import { AppView } from './AppView.js';

const dropDownSelectors = {
    inlineDropDown: '#selinp',
    editableInlineDropDown: '#selinp2',
    fullWidthDropDown: '#selinp3',
    halfWidthDropDown: '#selinp4',
    fixedMenuDropDown: '#fixedInp',
    parsedSelDropDown: '#sel0',
    parsedSelSelectedDropDown: '#sel',
    attachedToBlockDropDown: '#box',
    attachedToInlineDropDown: '#inlineTarget',
    multiSelDropDown: '#selinp5',
    genMultiSelDropDown: '#selinp6',
    disabledDropDown: '#selinp7',
    filterDropDown: '#selinp8',
    multiFilterDropDown: '#multiSelFilterInp',
    groupsFilterDropDown: '#groupFilterInp',
    attachedFilter: '#boxFilter',
    attachedFilterMultiple: '#boxFilterMulti',
    customDropDown: '#selinp10',
    nativeSelDropDown: '#selinp11',
    fullscreenDropDown: '#selinp12',
    dynamicDropDown: '#dynamicSel',
};

const elemSelectors = {
    enableBtn: '#enableBtn',
    enableCustomBtn: '#enableCustomBtn',
    enableFilterBtn: '#enableFilterBtn',
    enableMultiFilterBtn: '#enableMultiFilterBtn',
    addItemBtn: '#addBtn',
    addDisabledItemBtn: '#addDisBtn',
    addHiddenItemBtn: '#addHiddenBtn',
    delLastItemBtn: '#delBtn',
    delAllItemsBtn: '#delAllBtn',
};

export class DropDownView extends AppView {
    lastId = 0;

    dynItems = [];

    get dynamicDropDown() {
        return this.content.dynamicDropDown;
    }

    async parseContent() {
        const res = {};

        await asyncMap(
            Object.keys(dropDownSelectors),
            async (name) => {
                const selector = dropDownSelectors[name];
                const elem = await query(selector);
                assert(elem, `Element '${name}' not found`);
                res[name] = await DropDown.createFromChild(this, elem);
                assert(res[name], `Failed to initialize component '${name}'`);
            },
        );

        await asyncMap(
            Object.keys(elemSelectors),
            async (name) => {
                const selector = elemSelectors[name];
                res[name] = await query(selector);
                assert(res[name], `Element '${name}' not found`);
            },
        );

        return res;
    }

    getComponentByName(name) {
        assert(this.content[name], `Component ${name} not found`);
        return this.content[name];
    }

    async toggleItem(name, value) {
        let dropdown = this.getComponentByName(name);
        const origSelected = dropdown.getSelectedValues();
        let expSelected;

        if (dropdown.multiple) {
            // Deselect if already selected
            if (origSelected.includes(value)) {
                expSelected = origSelected.filter((item) => item !== value);
            } else {
                expSelected = [...origSelected, value];
            }
        } else {
            expSelected = [value];
        }

        await this.performAction(() => dropdown.toggleItem(value));
        dropdown = this.getComponentByName(name);

        const selected = dropdown.getSelectedValues();
        assert.exactMeet(selected, expSelected);
        return true;
    }

    async deselectByTag(name, value) {
        let dropdown = this.getComponentByName(name);
        const origSelected = dropdown.getSelectedValues();
        assert(origSelected.includes(value), `Item ${value} not found`);

        const expSelected = origSelected.filter((item) => item !== value);

        await this.performAction(() => dropdown.deselectItemByTag(value));
        dropdown = this.getComponentByName(name);

        const selected = dropdown.getSelectedValues();
        assert.exactMeet(selected, expSelected);
        return true;
    }

    async clearSelection(name) {
        let dropdown = this.getComponentByName(name);
        const origSelected = dropdown.getSelectedValues();
        assert(origSelected.length > 0, 'Nothing selected');

        const expSelected = [];

        await this.performAction(() => dropdown.clearSelection());
        dropdown = this.getComponentByName(name);

        const selected = dropdown.getSelectedValues();
        assert.exactMeet(selected, expSelected);
        return true;
    }

    async toggleEnableFilter() {
        const expected = {
            filterDropDown: {
                visible: true,
                disabled: !this.content.filterDropDown.disabled,
            },
        };

        await this.performAction(() => click(this.content.enableFilterBtn));

        return this.checkState(expected);
    }

    async toggleEnableMultiFilter() {
        const expected = {
            multiFilterDropDown: {
                visible: true,
                disabled: !this.content.multiFilterDropDown.disabled,
            },
        };

        await this.performAction(() => click(this.content.enableMultiFilterBtn));

        return this.checkState(expected);
    }

    async waitForFilter(name, value) {
        await this.parse();
        const dropdown = this.getComponentByName(name);

        const prevTime = dropdown.renderTime;
        await dropdown.filter(value);

        await waitForFunction(async () => {
            await this.parse();
            const component = this.getComponentByName(name);
            return (
                prevTime !== component.renderTime
                && (
                    (value === '' && component.inputValue === component.inputPlaceholder)
                    || component.inputValue === value
                )
            );
        });

        await this.parse();
    }

    async filter(name, value) {
        let dropdown = this.getComponentByName(name);

        if (dropdown.attached) {
            await dropdown.showList();
            await this.parse();
            dropdown = this.getComponentByName(name);
        }

        if (
            dropdown.inputValue !== ''
            && dropdown.inputValue !== dropdown.inputPlaceholder
        ) {
            await this.waitForFilter(name, '');
            dropdown = this.getComponentByName(name);
        }

        const lValue = value.toLowerCase();
        const expVisible = dropdown.items.filter((item) => (
            item.text.toLowerCase().includes(lValue)
        ));

        const expected = {
            [name]: {
                visible: true,
                listPlaceholder: {
                    visible: expVisible.length === 0,
                },
            },
        };

        await this.waitForFilter(name, value);
        dropdown = this.getComponentByName(name);

        const visible = dropdown.getVisibleItems();
        assert.exactMeet(visible, expVisible);

        return this.checkState(expected);
    }

    async addItem() {
        this.lastId += 1;
        this.dynItems.push({
            id: this.lastId.toString(),
            text: `Item ${this.lastId}`,
            selected: false,
            disabled: false,
            hidden: false,
        });
        const expected = this.dynItems.filter((item) => !item.hidden);

        await this.performAction(() => click(this.content.addItemBtn));
        await this.performAction(() => this.dynamicDropDown.showList());

        const { items } = this.dynamicDropDown.model;
        assert.exactMeet(items, expected);
        return true;
    }

    async addDisabledItem() {
        this.lastId += 1;
        this.dynItems.push({
            id: this.lastId.toString(),
            text: `Item ${this.lastId}`,
            selected: false,
            disabled: true,
            hidden: false,
        });
        const expected = this.dynItems.filter((item) => !item.hidden);

        await this.performAction(() => click(this.content.addDisabledItemBtn));
        await this.performAction(() => this.dynamicDropDown.showList());

        const { items } = this.dynamicDropDown.model;
        assert.exactMeet(items, expected);
        return true;
    }

    async addHiddenItem() {
        this.lastId += 1;
        this.dynItems.push({
            id: this.lastId.toString(),
            text: `Item ${this.lastId}`,
            selected: false,
            disabled: true,
            hidden: true,
        });
        const expected = this.dynItems.filter((item) => !item.hidden);

        await this.performAction(() => click(this.content.addHiddenItemBtn));
        await this.performAction(() => this.dynamicDropDown.showList());

        const { items } = this.dynamicDropDown.model;
        assert.exactMeet(items, expected);
        return true;
    }

    async removeLastItem() {
        this.lastId -= 1;
        this.dynItems.splice(this.dynItems.length - 1);
        const expected = this.dynItems.filter((item) => !item.hidden);

        await this.performAction(() => click(this.content.delLastItemBtn));

        const { items } = this.dynamicDropDown.model;
        assert.exactMeet(items, expected);
        return true;
    }

    async removeAllItems() {
        this.lastId = 0;
        this.dynItems = [];
        const expected = [];

        await this.performAction(() => click(this.content.delAllItemsBtn));

        const { items } = this.dynamicDropDown.model;
        assert.exactMeet(items, expected);
        return true;
    }
}
