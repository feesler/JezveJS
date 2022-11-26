import {
    TestComponent,
    query,
    click,
    assert,
    evaluate,
} from 'jezve-test';

export class Collapsible extends TestComponent {
    async parseContent() {
        assert(this.elem, 'Invalid collapsible element');

        const labelElem = await query(this.elem, '.collapsible-header label');

        const res = await evaluate((elem, label) => ({
            collapsed: !elem.classList.contains('collapsible__expanded'),
            title: label.textContent,
        }), this.elem, labelElem);

        res.labelElem = labelElem;
        res.headerElem = await query(this.elem, '.collapsible-header');
        res.contentElem = await query(this.elem, '.collapsible-content');

        assert(
            res.headerElem
            && res.labelElem
            && res.contentElem,
            'Invalid structure of Collapsible component',
        );

        return res;
    }

    isCollapsed() {
        return this.content.collapsed;
    }

    async toggle() {
        await click(this.content.headerElem);
    }
}
