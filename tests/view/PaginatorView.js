import {
    assert,
    query,
    prop,
    asyncMap,
} from 'jezve-test';
import { Paginator } from 'jezvejs-test';
import { AppView } from './AppView.js';

const paginatorIds = [
    'defaultPaginator',
    'styledPaginator',
    'arrowsPaginator',
    'activeLinkPaginator',
    'customUrlPaginator',
    'noUrlPaginator',
    'callbacksPaginator',
    'prerenderedPaginator',
    'showSinglePaginator',
    'hideSinglePaginator',
];

export class PaginatorView extends AppView {
    async parseContent() {
        const res = {};

        await asyncMap(paginatorIds, async (id) => {
            res[id] = await Paginator.create(this, await query(`#${id}`));
            assert(res[id], `Failed to initialize component '${id}'`);
        });

        res.handlerStatus = { elem: await query('#callbacksPaginator + .logs-container textarea') };
        assert(res.handlerStatus.elem, 'Failed to parse view');
        res.handlerStatus.value = await prop(res.handlerStatus.elem, 'value');

        return res;
    }

    buildPaginatorModel(paginator) {
        const res = {
            page: paginator.active,
            pages: paginator.pages,
        };

        return res;
    }

    buildModel(cont) {
        const res = {
            handlerStatus: cont.handlerStatus.value,
        };

        for (const name of paginatorIds) {
            res[name] = this.buildPaginatorModel(cont[name]);
        }

        return res;
    }

    getPaginatorExpectedState(model) {
        const res = {
            active: model.page,
            pages: model.pages,
        };

        return res;
    }

    getExpectedState(model = this.model) {
        const res = {};

        for (const name of paginatorIds) {
            res[name] = this.getPaginatorExpectedState(model[name]);
        }

        const handlerPage = model.callbacksPaginator.page;
        if (handlerPage !== 1 || model.handlerStatus !== '') {
            res.handlerStatus = `Page ${handlerPage} selected`;
        }

        return res;
    }

    async goToFirstPage(name) {
        assert(name in this.content, `Invalid paginator name: ${name}`);

        const paginator = this.content[name];
        assert(!paginator.isFirstPage(), 'Already on first page');

        this.model[name].page = 1;
        const expected = this.getExpectedState();

        await this.performAction(() => paginator.goToFirstPage());

        return this.checkState(expected);
    }

    async goToLastPage(name) {
        assert(name in this.content, `Invalid paginator name: ${name}`);

        const paginator = this.content[name];
        assert(!paginator.isLastPage(), 'Already on last page');

        this.model[name].page = this.model[name].pages;
        const expected = this.getExpectedState();

        await this.performAction(() => paginator.goToLastPage());

        return this.checkState(expected);
    }

    async goToNextPage(name) {
        assert(name in this.content, `Invalid paginator name: ${name}`);

        const paginator = this.content[name];
        assert(!paginator.isLastPage(), 'Already on last page');

        this.model[name].page += 1;
        const expected = this.getExpectedState();

        await this.performAction(() => paginator.goToNextPage());

        return this.checkState(expected);
    }

    async goToPrevPage(name) {
        assert(name in this.content, `Invalid paginator name: ${name}`);

        const paginator = this.content[name];
        assert(!paginator.isFirstPage(), 'Already on first page');

        this.model[name].page -= 1;
        const expected = this.getExpectedState();

        await this.performAction(() => paginator.goToPrevPage());

        return this.checkState(expected);
    }
}
