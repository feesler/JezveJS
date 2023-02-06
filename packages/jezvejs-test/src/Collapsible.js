import {
    TestComponent,
    query,
    click,
    assert,
    evaluate,
} from 'jezve-test';

export class Collapsible extends TestComponent {
    async parseContent() {
        const res = {
            header: { elem: await query(this.elem, '.collapsible-header') },
            content: { elem: await query(this.elem, '.collapsible-content') },
        };

        assert(res.content.elem, 'Invalid structure of Collapsible component');

        [
            res.collapsed,
        ] = await evaluate((elem) => ([
            !elem.classList.contains('collapsible__expanded'),
        ]), this.elem);

        return res;
    }

    get collapsed() {
        return this.content.collapsed;
    }

    async toggle() {
        assert(this.content.header.elem, 'Header element not found');
        await click(this.content.header.elem);
    }
}
