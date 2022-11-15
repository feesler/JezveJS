import {
    TestComponent,
    assert,
    query,
    prop,
    hasClass,
    click,
} from 'jezve-test';
import { Checkbox } from 'jezvejs-test';

export class LinkMenuItem extends TestComponent {
    async parseContent() {
        assert(this.elem, 'Invalid element');

        const res = {};

        const tagName = await prop(this.elem, 'tagName');
        if (tagName === 'A') {
            res.linkElem = this.elem;
        } else {
            res.linkElem = await query(this.elem, 'a');
        }

        res.titleElem = await query(this.elem, '.link-menu-item__title');
        if (!res.titleElem) {
            res.titleElem = this.elem;
        }
        const title = await prop(res.titleElem, 'textContent');
        res.title = title.trim();

        res.value = await prop(this.elem, 'dataset.value');

        res.isCheckbox = await hasClass(this.elem, 'checkbox');
        if (res.isCheckbox) {
            res.checkbox = await Checkbox.create(this, this.elem);
            res.selected = res.checkbox.checked;
        } else {
            res.selected = await hasClass(this.elem, 'link-menu-item_selected');
        }

        return res;
    }

    get value() {
        return this.content.value;
    }

    get selected() {
        return this.content.selected;
    }

    async toggle() {
        assert(this.content.checkbox, 'Toggle not available');

        await this.content.checkbox.toggle();
    }

    async click() {
        await click(this.content.linkElem);
    }
}
