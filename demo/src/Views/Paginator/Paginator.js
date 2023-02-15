import 'jezvejs/style';
import { ge, onReady } from 'jezvejs';
import { Paginator } from 'jezvejs/Paginator';
import { initNavigation } from '../../app.js';
import './style.scss';

function initSimple() {
    const paginator = Paginator.create({
        pagesCount: 5,
    });

    ge('defaultContainer').appendChild(paginator.elem);
}

function initStyled() {
    const paginator = Paginator.create({
        className: 'styled',
        pagesCount: 10,
        onChange: () => { },
    });

    ge('styledContainer').appendChild(paginator.elem);
}

function initArrows() {
    const paginator = Paginator.create({
        className: 'styled',
        pagesCount: 10,
        arrows: true,
        onChange: () => { },
    });

    ge('arrowsContainer').appendChild(paginator.elem);
}

function initActiveLink() {
    const paginator = Paginator.create({
        pagesCount: 10,
        allowActiveLink: true,
        onChange: () => { },
    });

    ge('activeLinkContainer').appendChild(paginator.elem);
}

function initCustomURL() {
    const paginator = Paginator.create({
        pagesCount: 10,
        url: 'https://test.url/content/',
        pageParam: 'p',
        onChange: () => { },
    });

    ge('customUrlContainer').appendChild(paginator.elem);
}

function initDisabledURL() {
    const paginator = Paginator.create({
        pagesCount: 10,
        url: null,
        onChange: () => { },
    });

    ge('noUrlContainer').appendChild(paginator.elem);
}

function initHandler() {
    const handlerStatus = ge('handler-status');
    const paginator = Paginator.create({
        pagesCount: 10,
        onChange: (page) => {
            handlerStatus.textContent = `Page ${page} selected`;
        },
    });

    ge('handlerContainer').appendChild(paginator.elem);
}

function initPrerendered() {
    Paginator.fromElement(ge('prerenderedPaginator'), {
        url: null,
        breakLimit: 4,
        onChange: () => { },
    });
}

function initSingleItem() {
    const paginatorOn = Paginator.create({
        url: null,
        pagesCount: 1,
        onChange: () => { },
        showSingleItem: true,
    });
    ge('showSingleContainer').appendChild(paginatorOn.elem);

    const paginatorOff = Paginator.create({
        url: null,
        pagesCount: 1,
        onChange: () => { },
        showSingleItem: false,
    });
    ge('hideSingleContainer').appendChild(paginatorOff.elem);
}

onReady(() => {
    initNavigation();

    initSimple();
    initStyled();
    initArrows();
    initActiveLink();
    initCustomURL();
    initDisabledURL();
    initHandler();
    initPrerendered();
    initSingleItem();
});
