import {
    TestComponent,
    click,
    evaluate,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';

export class PopupMenuItem extends TestComponent {
    async parseContent() {
        assert(this.elem, 'Invalid element');

        return evaluate((el) => {
            const content = {
                id: el.dataset.id,
                tagName: el.tagName,
                disabled: el.hasAttribute('disabled'),
                hidden: el.hidden,
                isCheckbox: el.classList.contains('checkbox-menu-item'),
            };

            const linkEl = (el.tagName === 'A') ? el : el.querySelector('a');
            content.isLink = !!linkEl;
            if (content.isLink) {
                content.link = linkEl.href;
            }

            if (content.isCheckbox) {
                content.checked = el.classList.contains('menu-item_selected');
            }

            content.title = el.querySelector('.menu-item__content')?.textContent ?? el.textContent;
            content.title = content.title?.trim() ?? '';

            return content;
        }, this.elem);
    }

    get id() {
        return this.content.id;
    }

    get title() {
        return this.content.title;
    }

    get isLink() {
        return this.content.isLink;
    }

    get link() {
        return this.content.link;
    }

    get isCheckbox() {
        return this.content.isCheckbox;
    }

    get checked() {
        return this.content.checked;
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

    async click() {
        this.assertAvailable();
        await click(this.elem);
    }
}
