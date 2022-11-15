import {
    TestComponent,
    assert,
    query,
    prop,
    hasClass,
    click,
} from 'jezve-test';

export class IconButton extends TestComponent {
    async parseContent() {
        if (!this.elem) {
            return {};
        }

        const validClass = await hasClass(this.elem, 'iconbutton');
        assert(validClass, 'Invalid icon button element');

        const res = {};

        const tagName = await prop(this.elem, 'tagName');
        if (tagName === 'A') {
            res.link = await prop(this.elem, 'href');
        }

        res.titleElem = await query(this.elem, '.iconbutton__content');
        const titleInner = await query(res.titleElem, ':scope > *');
        assert(titleInner, 'Title element not found');
        res.title = await prop(titleInner, 'textContent');

        // Subtitle is optional
        res.subTitleElem = await query(res.titleElem, '.iconbutton__subtitle');
        if (res.subTitleElem) {
            res.subtitle = await prop(res.subTitleElem, 'textContent');
        } else {
            res.subtitle = null;
        }

        return res;
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
