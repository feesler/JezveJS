import 'jezvejs/style';
import { ge } from '@jezvejs/dom';
import { Paginator } from 'jezvejs/Paginator';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import './PaginatorView.scss';

/**
 * Paginator component demo view
 */
class PaginatorView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initSimple();
        this.initStyled();
        this.initArrows();
        this.initActiveLink();
        this.initCustomURL();
        this.initDisabledURL();
        this.initCallbacks();
        this.initPrerendered();
        this.showSingleItem();
        this.hideSingleItem();
    }

    initSimple() {
        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: Paginator.create({
                id: 'defaultPaginator',
                pagesCount: 5,
            }).elem,
        });
    }

    initStyled() {
        this.addSection({
            id: 'styled',
            title: 'Styled',
            content: Paginator.create({
                id: 'styledPaginator',
                className: 'styled',
                pagesCount: 6,
                onChange: () => { },
            }).elem,
        });
    }

    initArrows() {
        this.addSection({
            id: 'arrows',
            title: 'Arrows',
            content: Paginator.create({
                id: 'arrowsPaginator',
                className: 'styled',
                pagesCount: 10,
                arrows: true,
                onChange: () => { },
            }).elem,
        });
    }

    initActiveLink() {
        this.addSection({
            id: 'activeLink',
            title: 'Allow active link',
            content: Paginator.create({
                id: 'activeLinkPaginator',
                pagesCount: 10,
                allowActiveLink: true,
                onChange: () => { },
            }).elem,
        });
    }

    initCustomURL() {
        this.addSection({
            id: 'customUrl',
            title: 'Custom URL and page parameter',
            content: Paginator.create({
                id: 'customUrlPaginator',
                pagesCount: 10,
                url: 'https://test.url/content/',
                pageParam: 'p',
                onChange: () => { },
            }).elem,
        });
    }

    initDisabledURL() {
        this.addSection({
            id: 'noUrl',
            title: 'No URL',
            content: Paginator.create({
                id: 'noUrlPaginator',
                pagesCount: 10,
                url: null,
                onChange: () => { },
            }).elem,
        });
    }

    initCallbacks() {
        const logsField = LogsField.create();

        this.addSection({
            id: 'callbacks',
            title: 'Callbacks',
            content: [
                Paginator.create({
                    id: 'callbacksPaginator',
                    pagesCount: 10,
                    onChange: (page) => logsField.write(`Page ${page} selected`),
                }).elem,
                logsField.elem,
            ],
        });
    }

    initPrerendered() {
        this.addSection({
            id: 'parse',
            title: 'Parse component',
            content: Paginator.fromElement(ge('prerenderedPaginator'), {
                url: null,
                breakLimit: 4,
                onChange: () => { },
            }).elem,
        });
    }

    showSingleItem() {
        this.addSection({
            id: 'showSingleItem',
            title: 'showSingleItem: true',
            content: Paginator.create({
                id: 'showSinglePaginator',
                url: null,
                pagesCount: 1,
                onChange: () => { },
                showSingleItem: true,
            }).elem,
        });
    }

    hideSingleItem() {
        this.addSection({
            id: 'hideSingleItem',
            title: 'showSingleItem: false',
            content: Paginator.create({
                id: 'hideSinglePaginator',
                url: null,
                pagesCount: 1,
                onChange: () => { },
                showSingleItem: false,
            }).elem,
        });
    }
}

PaginatorView.create();
