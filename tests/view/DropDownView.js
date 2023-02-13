import {
    query,
    click,
    assert,
    asyncMap,
} from 'jezve-test';
import { DropDown } from 'jezvejs-test';
import { AppView } from './AppView.js';

const dropDownSelectors = {
    inlineDropDown: '#selinp',
    editableInlineDropDown: '#selinp2',
    fullWidthDropDown: '#selinp3',
    halfWidthDropDown: '#selinp4',
    parsedSelDropDown: '#sel0',
    parsedSelSelectedDropDown: '#sel',
    attachedToBlockDropDown: '#box',
    attachedToInlineDropDown: '#inline',
    multiSelDropDown: '#selinp5',
    genMultiSelDropDown: '#selinp6',
    disabledDropDown: '#selinp7',
    filterDropDown: '#selinp8',
    customDropDown: '#selinp10',
    nativeSelDropDown: '#selinp11',
    fullscreenDropDown: '#selinp12',
    dynamicDropDown: '#dynamicSel',
};

const elemSelectors = {
    enableBtn: '#enableBtn',
    enableCustomBtn: '#enableCustomBtn',
    addItemBtn: '#addBtn',
    addDisabledItemBtn: '#addDisBtn',
    addHiddenItemBtn: '#addHiddenBtn',
    delLastItemBtn: '#delBtn',
    delAllItemsBtn: '#delAllBtn',
};

export class DropDownView extends AppView {
    get dynamicDropDown() {
        return this.content.dynamicDropDown;
    }

    async parseContent() {
        const res = {};

        await asyncMap(
            Object.keys(dropDownSelectors),
            async (name) => {
                const selector = dropDownSelectors[name];
                res[name] = await DropDown.createFromChild(this, await query(selector));
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

    async addItem() {
        const expected = this.dynamicDropDown.model.items;
        const newId = expected.length + 1;
        expected.push({
            id: newId.toString(),
            text: `Item ${newId}`,
            selected: false,
            disabled: false,
            hidden: false,
        });

        await this.performAction(() => click(this.content.addItemBtn));
        await this.performAction(() => this.dynamicDropDown.showList());

        const { items } = this.dynamicDropDown.model;
        assert.exactMeet(items, expected);
        return true;
    }

    async addDisabledItem() {
        const expected = this.dynamicDropDown.model.items;
        const newId = expected.length + 1;
        expected.push({
            id: newId.toString(),
            text: `Item ${newId}`,
            selected: false,
            disabled: true,
            hidden: false,
        });

        await this.performAction(() => click(this.content.addDisabledItemBtn));
        await this.performAction(() => this.dynamicDropDown.showList());

        const { items } = this.dynamicDropDown.model;
        assert.exactMeet(items, expected);
        return true;
    }

    async addHiddenItem() {
        const expected = this.dynamicDropDown.model.items;
        const newId = expected.length + 1;
        expected.push({
            id: newId.toString(),
            text: `Item ${newId}`,
            selected: false,
            disabled: true,
            hidden: true,
        });

        await this.performAction(() => click(this.content.addHiddenItemBtn));
        await this.performAction(() => this.dynamicDropDown.showList());

        const { items } = this.dynamicDropDown.model;
        assert.exactMeet(items, expected);
        return true;
    }

    async removeLastItem() {
        const expected = this.dynamicDropDown.model.items;
        expected.splice(expected.length - 1);

        await this.performAction(() => click(this.content.delLastItemBtn));

        const { items } = this.dynamicDropDown.model;
        assert.exactMeet(items, expected);
        return true;
    }

    async removeAllItems() {
        const expected = [];

        await this.performAction(() => click(this.content.delAllItemsBtn));

        const { items } = this.dynamicDropDown.model;
        assert.exactMeet(items, expected);
        return true;
    }
}
