import {
    TestComponent,
    assert,
    queryAll,
    hasClass,
    asyncMap,
} from 'jezve-test';
import { PopupMenuItem } from './PopupMenuItem.js';

export class PopupMenu extends TestComponent {
    async parseContent() {
        const validClass = await hasClass(this.elem, 'popup-menu-list');
        assert(validClass, 'Unexpected stucture of popup menu');

        const itemElems = await queryAll(this.elem, '.popup-menu-item');
        const res = {
            items: await asyncMap(itemElems, (elem) => PopupMenuItem.create(this, elem)),
        };

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
