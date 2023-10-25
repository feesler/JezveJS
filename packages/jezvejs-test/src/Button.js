import {
    TestComponent,
    query,
    hasClass,
    click,
    evaluate,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';

export class Button extends TestComponent {
    async parseContent() {
        if (!this.elem) {
            return {};
        }

        const validClass = await hasClass(this.elem, 'btn');
        assert(validClass, 'Invalid icon button element');

        let titleElem = await query(this.elem, '.btn__content');
        if (!titleElem) {
            titleElem = this.elem;
        }

        return evaluate((elem, titleEl) => ({
            tagName: elem.tagName,
            link: elem.href,
            title: (titleEl) ? titleEl.textContent.trim() : null,
            value: elem.dataset.value,
            isCheckbox: elem.classList.contains('checkbox'),
            selected: elem.classList.contains('link-menu-item_selected'),
        }), this.elem, titleElem);
    }

    get link() {
        return this.content.link;
    }

    get title() {
        return this.content.title;
    }

    async click() {
        return click(this.elem);
    }
}
