import {
    TestComponent,
    query,
    click,
    evaluate,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';

export class Collapsible extends TestComponent {
    async parseContent() {
        const res = {
            header: { elem: await query(this.elem, '.collapsible-header') },
            content: { elem: await query(this.elem, '.collapsible-content') },
        };

        assert(res.content.elem, 'Invalid structure of Collapsible component');

        [
            res.collapsed,
            res.animationInProgress,
        ] = await evaluate((elem) => ([
            !elem.classList.contains('collapsible__expanded'),
            elem.classList.contains('collapsible_animated'),
        ]), this.elem);

        return res;
    }

    get collapsed() {
        return this.content.collapsed;
    }

    get animationInProgress() {
        return this.content.animationInProgress;
    }

    async toggle() {
        assert(this.content.header.elem, 'Header element not found');
        await click(this.content.header.elem);
    }
}
