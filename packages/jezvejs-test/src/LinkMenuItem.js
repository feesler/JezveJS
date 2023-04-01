import {
    TestComponent,
    assert,
    query,
    click,
    evaluate,
} from 'jezve-test';
import { Checkbox } from 'jezvejs-test';

export class LinkMenuItem extends TestComponent {
    async parseContent() {
        assert(this.elem, 'Invalid element');

        let titleElem = await query(this.elem, '.link-menu-item__title');
        if (!titleElem) {
            titleElem = this.elem;
        }

        const res = await evaluate((elem, title) => ({
            tagName: elem.tagName,
            title: title.textContent.trim(),
            value: elem.dataset.value,
            disabled: elem.hasAttribute('disabled'),
            hidden: elem.hidden,
            isCheckbox: elem.classList.contains('checkbox'),
            selected: elem.classList.contains('link-menu-item_selected'),
        }), this.elem, titleElem);
        if (res.tagName === 'A') {
            res.linkElem = this.elem;
        } else {
            res.linkElem = await query(this.elem, 'a');
        }

        if (res.isCheckbox) {
            res.checkbox = await Checkbox.create(this, this.elem);
            res.selected = res.checkbox.checked;
        }

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
        assert(this.content.checkbox, 'Toggle not available');
        this.assertAvailable();

        await this.content.checkbox.toggle();
    }

    async click() {
        this.assertAvailable();

        await click(this.content.linkElem);
    }
}
