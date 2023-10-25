import {
    TestComponent,
    queryAll,
    hasClass,
    hasAttr,
    asyncMap,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { asArray } from '@jezvejs/types';
import { LinkMenuItem } from './LinkMenuItem.js';

export class LinkMenu extends TestComponent {
    async parseContent() {
        const validClass = await hasClass(this.elem, 'link-menu');
        assert(validClass, 'Unexpected stucture of link menu');

        const itemElems = await queryAll(this.elem, '.menu-item');
        const res = {
            multiple: await hasAttr(this.elem, 'multiple'),
            items: await asyncMap(itemElems, (elem) => LinkMenuItem.create(this, elem)),
        };

        const selected = this.getSelectedValues(res);
        if (res.multiple) {
            res.value = selected;
        } else {
            res.value = (selected.length > 0) ? selected[0] : null;
        }

        return res;
    }

    get value() {
        return this.content.value;
    }

    get items() {
        return this.content.items;
    }

    getItemValue(item) {
        assert(item, 'Invalid item');

        return item.value;
    }

    getSelectedItems(cont = this.content) {
        return cont.items.filter((item) => item.selected);
    }

    getSelectedValues(cont = this.content) {
        assert.isArray(cont.items);

        return cont.items.filter((item) => (
            typeof item.value !== 'undefined'
            && item.value !== null
            && item.selected
        )).map((item) => this.getItemValue(item));
    }

    isSameSelected(value) {
        const data = asArray(value).map((item) => item.toString());
        const selected = this.getSelectedValues();

        if (selected.length !== data.length) {
            return false;
        }

        if (data.some((item) => !selected.includes(item))) {
            return false;
        }
        if (selected.some((item) => !data.includes(item))) {
            return false;
        }

        return true;
    }

    findItemByValue(value) {
        const str = value.toString();
        return this.items.find((item) => item.value === str);
    }

    async selectItemByIndex(index) {
        assert.arrayIndex(this.items, index);
        const item = this.items[index];

        await item.click();
    }

    async selectItemByValue(value) {
        const item = this.findItemByValue(value);
        assert(item, `Item '${value}' not found`);

        await item.click();
    }

    async select(value) {
        await this.selectItemByValue(value);
    }

    async toggle(value) {
        const item = this.findItemByValue(value);
        assert(item, `Item '${value}' not found`);

        await item.toggle();
    }
}
