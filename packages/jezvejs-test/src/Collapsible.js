import {
    TestComponent,
    query,
    hasClass,
    prop,
    click,
    assert,
} from 'jezve-test';

export class Collapsible extends TestComponent {
    async parseContent() {
        assert(this.elem, 'Invalid collapsible element');

        const res = {
            collapsed: !(await hasClass(this.elem, 'collapsible__expanded')),
            headerElem: await query(this.elem, '.collapsible-header'),
            labelElem: await query(this.elem, '.collapsible-header label'),
            contentElem: await query(this.elem, '.collapsible-content'),
        };

        assert(
            res.headerElem
            && res.labelElem
            && res.contentElem,
            'Invalid structure of import rule accordion',
        );

        res.title = await prop(res.labelElem, 'textContent');

        return res;
    }

    isCollapsed() {
        return this.content.collapsed;
    }

    async toggle() {
        await click(this.content.headerElem);
    }
}
