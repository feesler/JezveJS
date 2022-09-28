import {
    assert,
    query,
    prop,
} from 'jezve-test';
import { Paginator } from './component/Paginator.js';
import { AppView } from './AppView.js';

const paginatorsList = [
    'simplePaginator',
    'styledPaginator',
    'arrowsPaginator',
    'activeLinkPaginator',
    'customURLPaginator',
    'noURLPaginator',
    'handlerPaginator',
    'prerenderedPaginator',
    'singleOnPaginator',
    'singleOffPaginator',
];

export class PaginatorView extends AppView {
    async parseContent() {
        const res = {};

        res.simplePaginator = await Paginator.create(this, await query('#simple .paginator'));
        res.styledPaginator = await Paginator.create(this, await query('#styled .paginator'));
        res.arrowsPaginator = await Paginator.create(this, await query('#arrows .paginator'));
        res.activeLinkPaginator = await Paginator.create(this, await query('#active-link .paginator'));
        res.customURLPaginator = await Paginator.create(this, await query('#custom-url .paginator'));
        res.noURLPaginator = await Paginator.create(this, await query('#no-url .paginator'));
        res.handlerPaginator = await Paginator.create(this, await query('#handler .paginator'));
        res.handlerStatus = { elem: await query('#handler-status') };
        res.prerenderedPaginator = await Paginator.create(this, await query('#prerendered'));
        res.singleOnPaginator = await Paginator.create(this, await query('#single-on .paginator'));
        res.singleOffPaginator = await Paginator.create(this, await query('#single-off .paginator'));

        for (const name of paginatorsList) {
            assert(res[name], `Invalid paginator ${name}`);
        }

        assert(res.handlerStatus.elem, 'Failed to parse view');

        res.handlerStatus.value = await prop(res.handlerStatus.elem, 'textContent');

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

        for (const name of paginatorsList) {
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

        for (const name of paginatorsList) {
            res[name] = this.getPaginatorExpectedState(model[name]);
        }

        const handlerPage = model.handlerPaginator.page;
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
