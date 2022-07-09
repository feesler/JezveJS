import { query } from 'jezve-test';
import { DropDown } from './component/DropDown.js';
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
        res.enableBtn2 = await query('#enableBtn2');

        res.fullscreenDropDown = await DropDown.createFromChild(this, await query('#selinp12'));

        if (
            !res.inlineDropDown
            || !res.editableInlineDropDown
            || !res.fullWidthDropDown
            || !res.halfWidthDropDown
            || !res.parsedSelDropDown
            || !res.parsedSelSelectedDropDown
            || !res.attachedToBlockDropDown
            || !res.attachedToInlineDropDown
            || !res.multiSelDropDown
            || !res.genMultiSelDropDown
            || !res.disabledDropDown
            || !res.enableBtn
            || !res.filterDropDown
            || !res.customDropDown
            || !res.nativeSelDropDown
            || !res.enableBtn2
            || !res.fullscreenDropDown
        ) {
            throw new Error('Invalid view');
        }

        return res;
    }
}
