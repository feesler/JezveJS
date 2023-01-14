import { query, click, assert } from 'jezve-test';
import { DropDown } from 'jezvejs-test';
import { AppView } from './AppView.js';

export class DropDownView extends AppView {
    async parseContent() {
        const res = {};

        res.inlineDropDown = await DropDown.createFromChild(this, await query('#selinp'));
        res.editableInlineDropDown = await DropDown.createFromChild(this, await query('#selinp2'));
        res.fullWidthDropDown = await DropDown.createFromChild(this, await query('#selinp3'));
        res.halfWidthDropDown = await DropDown.createFromChild(this, await query('#selinp4'));

        res.parsedSelDropDown = await DropDown.createFromChild(this, await query('#sel0'));

        res.parsedSelSelectedDropDown = await DropDown.createFromChild(this, await query('#sel'));
        res.attachedToBlockDropDown = await DropDown.createFromChild(this, await query('#box'));
        res.attachedToInlineDropDown = await DropDown.createFromChild(this, await query('#inline'));
        res.multiSelDropDown = await DropDown.createFromChild(this, await query('#selinp5'));

        res.genMultiSelDropDown = await DropDown.createFromChild(this, await query('#selinp6'));

        res.disabledDropDown = await DropDown.createFromChild(this, await query('#selinp7'));
        res.enableBtn = await query('#enableBtn');

        res.filterDropDown = await DropDown.createFromChild(this, await query('#selinp8'));

        res.customDropDown = await DropDown.createFromChild(this, await query('#selinp10'));
        res.nativeSelDropDown = await DropDown.createFromChild(this, await query('#selinp11'));
        res.enableCustomBtn = await query('#enableCustomBtn');

        res.fullscreenDropDown = await DropDown.createFromChild(this, await query('#selinp12'));

        res.dynamicDropDown = await DropDown.createFromChild(this, await query('#dynamicSel'));
        res.addItemBtn = await query('#addBtn');
        res.addDisabledItemBtn = await query('#addDisBtn');
        res.addHiddenItemBtn = await query('#addHiddenBtn');
        res.delLastItemBtn = await query('#delBtn');
        res.delAllItemsBtn = await query('#delAllBtn');

        assert(
            res.inlineDropDown
            && res.editableInlineDropDown
            && res.fullWidthDropDown
            && res.halfWidthDropDown
            && res.parsedSelDropDown
            && res.parsedSelSelectedDropDown
            && res.attachedToBlockDropDown
            && res.attachedToInlineDropDown
            && res.multiSelDropDown
            && res.genMultiSelDropDown
            && res.disabledDropDown
            && res.enableBtn
            && res.filterDropDown
            && res.customDropDown
            && res.nativeSelDropDown
            && res.enableCustomBtn
            && res.fullscreenDropDown
            && res.dynamicDropDown
            && res.addItemBtn
            && res.addDisabledItemBtn
            && res.addHiddenItemBtn
            && res.delLastItemBtn
            && res.delAllItemsBtn,
            'Invalid view',
        );

        return res;
    }

    async addItem() {
        return this.performAction(() => click(this.content.addItemBtn));
    }

    async addDisabledItem() {
        return this.performAction(() => click(this.content.addDisabledItemBtn));
    }

    async addHiddenItem() {
        return this.performAction(() => click(this.content.addHiddenItemBtn));
    }

    async removeLastItem() {
        return this.performAction(() => click(this.content.delLastItemBtn));
    }

    async removeAllItems() {
        return this.performAction(() => click(this.content.delAllItemsBtn));
    }
}
