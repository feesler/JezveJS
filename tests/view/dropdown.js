import { DropDown } from './component/dropdown.js';
import { AppView } from './AppView.js';

export class DropDownView extends AppView {
    async parseContent() {
        const res = {};

        res.inlineDropDown = await DropDown.createFromChild(this, await this.query('#selinp'));
        res.editableInlineDropDown = await DropDown.createFromChild(this, await this.query('#selinp2'));
        res.fullWidthDropDown = await DropDown.createFromChild(this, await this.query('#selinp3'));
        res.halfWidthDropDown = await DropDown.createFromChild(this, await this.query('#selinp4'));

        res.parsedSelDropDown = await DropDown.createFromChild(this, await this.query('#sel0'));

        res.parsedSelSelectedDropDown = await DropDown.createFromChild(this, await this.query('#sel'));
        res.attachedToBlockDropDown = await DropDown.createFromChild(this, await this.query('#box'));
        res.attachedToInlineDropDown = await DropDown.createFromChild(this, await this.query('#inline'));
        res.multiSelDropDown = await DropDown.createFromChild(this, await this.query('#selinp5'));

        res.genMultiSelDropDown = await DropDown.createFromChild(this, await this.query('#selinp6'));

        res.disabledDropDown = await DropDown.createFromChild(this, await this.query('#selinp7'));
        res.enableBtn = await this.query('#enableBtn');

        res.filterDropDown = await DropDown.createFromChild(this, await this.query('#selinp8'));

        res.customDropDown = await DropDown.createFromChild(this, await this.query('#selinp10'));
        res.nativeSelDropDown = await DropDown.createFromChild(this, await this.query('#selinp11'));
        res.enableBtn2 = await this.query('#enableBtn2');

        res.fullscreenDropDown = await DropDown.createFromChild(this, await this.query('#selinp12'));

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
