import {
    TestComponent,
    query,
    click,
    evaluate,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';

export class LinkMenuItem extends TestComponent {
    async parseContent() {
        assert(this.elem, 'Invalid element');

        let titleElem = await query(this.elem, '.menu-item__content');
        if (!titleElem) {
            titleElem = this.elem;
        }

        const res = await evaluate((elem, title) => ({
            tagName: elem.tagName,
            title: title.textContent.trim(),
            id: elem.dataset.id,
            value: elem.dataset.id,
            disabled: elem.hasAttribute('disabled'),
            hidden: elem.hidden,
            isCheckbox: elem.classList.contains('checkbox-menu-item'),
            selected: elem.classList.contains('menu-item_selected'),
        }), this.elem, titleElem);
        res.linkElem = this.elem;

        return res;
    }

    get title() {
        return this.content.title;
    }

    get value() {
        return this.content.value;
    }

    get selected() {
        return this.content.selected;
    }

    get disabled() {
        return this.content.disabled;
    }

    get hidden() {
        return this.content.hidden;
    }

    assertAvailable() {
        assert(!this.disabled, 'Menu item is disabled');
        assert(!this.hidden, 'Menu item is not visible');
    }

    async toggle() {
        return this.click();
    }

    async click() {
        this.assertAvailable();

        await click(this.content.linkElem);
    }
}
