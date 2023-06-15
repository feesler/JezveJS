import {
    TestComponent,
    assert,
    click,
    evaluate,
} from 'jezve-test';

export class PopupMenuItem extends TestComponent {
    async parseContent() {
        assert(this.elem, 'Invalid element');

        return evaluate((el) => {
            const content = {
                id: el.id,
                tagName: el.tagName,
                disabled: el.hasAttribute('disabled'),
                hidden: el.hidden,
                isCheckbox: el.classList.contains('checkbox'),
            };

            const linkEl = (el.tagName === 'A') ? el : el.querySelector('a');
            content.isLink = !!linkEl;
            if (content.isLink) {
                content.link = linkEl.href;
            }

            if (content.isCheckbox) {
                content.checked = el.querySelector('input[type="checkbox"]')?.checked;
                content.title = el.querySelector('.checkbox__label')?.textContent;
            } else {
                content.title = el.querySelector('.btn__content')?.textContent ?? el.textContent;
            }

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
        await click(this.content.linkElem);
    }
}
