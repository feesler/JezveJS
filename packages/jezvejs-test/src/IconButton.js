import {
    TestComponent,
    assert,
    query,
    hasClass,
    click,
    evaluate,
} from 'jezve-test';

export class IconButton extends TestComponent {
    async parseContent() {
        if (!this.elem) {
            return {};
        }

        const validClass = await hasClass(this.elem, 'iconbutton');
        assert(validClass, 'Invalid icon button element');

        const titleElem = await query(this.elem, '.iconbutton__content');
        const subTitleElem = await query(this.elem, '.iconbutton__subtitle');

        return evaluate((elem, title, subtitle) => ({
            tagName: elem.tagName,
            link: elem.href,
            title: (title) ? title.textContent.trim() : null,
            subtitle: (subtitle) ? subtitle.textContent.trim() : null,
            value: elem.dataset.value,
            isCheckbox: elem.classList.contains('checkbox'),
            selected: elem.classList.contains('link-menu-item_selected'),
        }), this.elem, titleElem, subTitleElem);
    }

    get link() {
        return this.content.link;
    }

    get title() {
        return this.content.title;
    }

    get subtitle() {
        return this.content.subtitle;
    }

    async click() {
        return click(this.elem);
    }
}
