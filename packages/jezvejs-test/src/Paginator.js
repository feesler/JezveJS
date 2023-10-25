import {
    TestComponent,
    queryAll,
    hasClass,
    click,
    asyncMap,
    evaluate,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';

export class Paginator extends TestComponent {
    async parseContent() {
        const res = {
            items: [],
            activeItem: null,
        };

        const validClass = await hasClass(this.elem, 'paginator');
        assert(validClass, 'Unexpected stucture of paginator control');

        const elems = await queryAll(this.elem, '.paginator-item');
        const items = await asyncMap(elems, async (elem) => {
            const item = await evaluate((el) => ({
                isArrow: el.classList.contains('paginator-arrow'),
                isActive: el.classList.contains('paginator-item__active'),
                title: el.textContent.trim(),
                tagName: el.tagName,
                link: el.href,
            }), elem);

            item.elem = elem;
            item.linkElem = (item.tagName === 'A') ? elem : null;
            if (!item.isArrow) {
                item.num = parseInt(item.title, 10);
            }

            return item;
        });

        let ellipsisBefore = false;
        let prevPageItem = null;
        items.forEach((item) => {
            if (item.isArrow) {
                return;
            }

            /*
            Check ellipsis is between two page number items:
            - ellipsis can't be first item
            - ellipsis can't follow after ellipsis
            */
            if (item.title === '...') {
                assert(
                    res.items.length > 0 && !ellipsisBefore && prevPageItem,
                    'Unexpected placement of paginator ellipsis',
                );

                ellipsisBefore = true;
                return;
            }

            assert(
                item.title && !Number.isNaN(item.num) && item.num >= 1,
                `Unexpected title of paginator item: '${item.title}'`,
            );

            /*
            Check correctnes of order:
            - First item must always be 1
            - Following items must be greater than previous
            - Sequential items must increase only by 1
             */
            assert(
                !(
                    (!res.items.length && item.num !== 1)
                    || (res.items.length && (!prevPageItem || item.num <= prevPageItem.num))
                    || (res.items.length && !ellipsisBefore && item.num !== prevPageItem.num + 1)
                ),
                'Unexpected order of paginator item',
            );

            const resItem = {
                ...item,
                ind: res.items.length,
            };

            if (item.isActive) {
                assert(!res.activeItem, 'More than one active paginator item');

                res.activeItem = resItem;
                res.active = resItem.num;
            }

            res.items.push(resItem);
            prevPageItem = resItem;
            ellipsisBefore = false;
        });

        // Check ellipsis is not the last item
        assert(!ellipsisBefore, 'Unexpected placement of paginator ellipsis');

        // Check active item present is paginator is visible(2 or more pages)
        if (res.items.length > 0) {
            assert(res.activeItem, 'Active paginator item not found');
        }

        if (res.items.length) {
            res.pages = res.items[res.items.length - 1].num;
        } else {
            res.pages = 1;
            res.active = 1;
        }

        return res;
    }

    get pages() {
        return this.content.pages;
    }

    get active() {
        return this.content.active;
    }

    get activeItem() {
        return this.content.activeItem;
    }

    get items() {
        return this.content.items;
    }

    isFirstPage() {
        return (!this.activeItem || this.activeItem.ind === 0);
    }

    isLastPage() {
        return (
            !this.activeItem
            || this.activeItem.ind === this.items.length - 1
        );
    }

    async goToFirstPage() {
        if (!this.items.length) {
            return;
        }

        const item = this.items[0];
        if (item.isActive) {
            return;
        }

        await click(item.linkElem);
    }

    async goToPrevPage() {
        if (this.isFirstPage()) {
            return;
        }

        const item = this.items[this.activeItem.ind - 1];
        if (item.isActive) {
            return;
        }

        await click(item.linkElem);
    }

    async goToNextPage() {
        if (this.isLastPage()) {
            return;
        }

        const item = this.items[this.activeItem.ind + 1];
        if (item.isActive) {
            return;
        }

        await click(item.linkElem);
    }

    async goToLastPage() {
        if (!this.items.length) {
            return;
        }

        const item = this.items[this.items.length - 1];
        if (item.isActive) {
            return;
        }

        await click(item.linkElem);
    }
}
