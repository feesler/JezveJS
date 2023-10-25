import {
    TestComponent,
    queryAll,
    hasClass,
    asyncMap,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { PopupMenuItem } from './PopupMenuItem.js';

export class PopupMenu extends TestComponent {
    async parseContent() {
        const validClass = await hasClass(this.elem, 'popup-menu-list');
        assert(validClass, 'Unexpected stucture of popup menu');

        const res = {};

        const itemElems = await queryAll(this.elem, '.menu-item');
        res.items = await asyncMap(itemElems, async (elem) => {
            const item = await PopupMenuItem.create(this, elem);
            if (item?.id) {
                res[item.id] = item;
            }

            return item;
        });

        return res;
    }

    get items() {
        return this.content.items;
    }

    get visible() {
        return this.content.visible;
    }

    findItemById(id) {
        const strId = id.toString();
        return this.items.find((item) => item.id.toString() === strId);
    }

    async selectItemByIndex(index) {
        assert.arrayIndex(this.items, index);
        const item = this.items[index];

        await item.click();
    }

    async selectItemById(id) {
        const item = this.findItemById(id);
        assert(item, `Item '${id}' not found`);

        await item.click();
    }

    async select(value) {
        await this.selectItemById(value);
    }

    async toggle(value) {
        return this.select(value);
    }
}
