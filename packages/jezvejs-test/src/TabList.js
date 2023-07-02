import {
    TestComponent,
    query,
    queryAll,
    assert,
    evaluate,
    asyncMap,
} from 'jezve-test';
import { LinkMenu } from './LinkMenu.js';

export class TabList extends TestComponent {
    get tabs() {
        return this.content.tabs;
    }

    get items() {
        return this.content.items;
    }

    get selectedId() {
        return this.content.selectedId;
    }

    get disabled() {
        return this.content.disabled;
    }

    async parseContent() {
        const res = {
            tabs: await LinkMenu.create(this, await query(this.elem, '.tab-list_header')),
            content: { elem: await query(this.elem, '.tab-list__content') },
        };

        assert(res.content.elem, 'Content element not found');

        [
            res.disabled,
        ] = await evaluate((el) => ([
            el.hasAttribute('disabled'),
        ]), this.elem);

        res.items = await asyncMap(
            await queryAll(this.elem, '.tab-list__content-item'),
            (elem) => this.parseTabContent(elem),
        );

        const activeItem = res.items.find((item) => item.active);
        res.selectedId = activeItem?.id ?? null;

        return res;
    }

    async parseTabContent(elem) {
        assert(elem, 'Invalid element');

        const res = { elem };

        [
            res.id,
            res.active,
            res.hidden,
            res.disabled,
        ] = await evaluate((el) => ([
            el.dataset.id,
            !el.hasAttribute('hidden'),
            el.hasAttribute('hidden'),
            el.hasAttribute('disabled'),
        ]), elem);

        return res;
    }

    async selectTabById(value) {
        return this.tabs.selectItemByValue(value);
    }
}
