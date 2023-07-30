import 'jezvejs/style';
import { ge } from 'jezvejs';
import { Paginator } from 'jezvejs/Paginator';

import { DemoView } from '../../Application/DemoView.js';
import './PaginatorView.scss';

const initSimple = () => {
    const paginator = Paginator.create({
        id: 'defaultPaginator',
        pagesCount: 5,
    });

    ge('defaultContainer').appendChild(paginator.elem);
};

const initStyled = () => {
    const paginator = Paginator.create({
        id: 'styledPaginator',
        className: 'styled',
        pagesCount: 10,
        onChange: () => { },
    });

    ge('styledContainer').appendChild(paginator.elem);
};

const initArrows = () => {
    const paginator = Paginator.create({
        id: 'arrowsPaginator',
        className: 'styled',
        pagesCount: 10,
        arrows: true,
        onChange: () => { },
    });

    ge('arrowsContainer').appendChild(paginator.elem);
};

const initActiveLink = () => {
    const paginator = Paginator.create({
        id: 'activeLinkPaginator',
        pagesCount: 10,
        allowActiveLink: true,
        onChange: () => { },
    });

    ge('activeLinkContainer').appendChild(paginator.elem);
};

const initCustomURL = () => {
    const paginator = Paginator.create({
        id: 'customUrlPaginator',
        pagesCount: 10,
        url: 'https://test.url/content/',
        pageParam: 'p',
        onChange: () => { },
    });

    ge('customUrlContainer').appendChild(paginator.elem);
};

const initDisabledURL = () => {
    const paginator = Paginator.create({
        id: 'noUrlPaginator',
        pagesCount: 10,
        url: null,
        onChange: () => { },
    });

    ge('noUrlContainer').appendChild(paginator.elem);
};

const initCallbacks = () => {
    const handlerStatus = ge('handlerStatus');
    const paginator = Paginator.create({
        id: 'callbacksPaginator',
        pagesCount: 10,
        onChange: (page) => {
            handlerStatus.textContent = `Page ${page} selected`;
        },
    });

    ge('handlerContainer').appendChild(paginator.elem);
};

const initPrerendered = () => {
    Paginator.fromElement(ge('prerenderedPaginator'), {
        url: null,
        breakLimit: 4,
        onChange: () => { },
    });
};

const initSingleItem = () => {
    const paginatorOn = Paginator.create({
        id: 'showSinglePaginator',
        url: null,
        pagesCount: 1,
        onChange: () => { },
        showSingleItem: true,
    });
    ge('showSingleContainer').appendChild(paginatorOn.elem);

    const paginatorOff = Paginator.create({
        id: 'hideSinglePaginator',
        url: null,
        pagesCount: 1,
        onChange: () => { },
        showSingleItem: false,
    });
    ge('hideSingleContainer').appendChild(paginatorOff.elem);
};

class PaginatorView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initTableOfContents();
        this.addTableOfContentsItem({ title: 'Default settings', url: 'default' });
        this.addTableOfContentsItem({ title: 'Styled', url: 'styled' });
        this.addTableOfContentsItem({ title: 'Arrows', url: 'arrows' });
        this.addTableOfContentsItem({ title: 'Allow active link', url: 'activeLink' });
        this.addTableOfContentsItem({ title: 'Custom URL and page parameter', url: 'customUrl' });
        this.addTableOfContentsItem({ title: 'No URL', url: 'noUrl' });
        this.addTableOfContentsItem({ title: 'Callbacks', url: 'callbacks' });
        this.addTableOfContentsItem({ title: 'Parse component', url: 'parse' });
        this.addTableOfContentsItem({ title: 'showSingleItem: true', url: 'showSingleItem' });
        this.addTableOfContentsItem({ title: 'showSingleItem: false', url: 'hideSingleItem' });

        initSimple();
        initStyled();
        initArrows();
        initActiveLink();
        initCustomURL();
        initDisabledURL();
        initCallbacks();
        initPrerendered();
        initSingleItem();
    }
}

PaginatorView.create();
