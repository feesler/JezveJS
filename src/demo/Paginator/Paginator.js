import {
    ge,
    onReady,
} from '../../js/common.js';
import { Paginator } from '../../Components/Paginator/Paginator.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import './paginator.css';

function initSimple() {
    const paginator = Paginator.create({
        pagesCount: 5,
    });

    ge('simple').appendChild(paginator.elem);
}

function initStyled() {
    const paginator = Paginator.create({
        className: 'styled',
        pagesCount: 10,
        onChange: () => {},
    });

    ge('styled').appendChild(paginator.elem);
}

function initArrows() {
    const paginator = Paginator.create({
        className: 'styled',
        pagesCount: 10,
        arrows: true,
        onChange: () => {},
    });

    ge('arrows').appendChild(paginator.elem);
}

function initActiveLink() {
    const paginator = Paginator.create({
        pagesCount: 10,
        allowActiveLink: true,
        onChange: () => {},
    });

    ge('active-link').appendChild(paginator.elem);
}

function initCustomURL() {
    const paginator = Paginator.create({
        pagesCount: 10,
        url: 'https://test.url/content/',
        pageParam: 'p',
        onChange: () => {},
    });

    ge('custom-url').appendChild(paginator.elem);
}

function initDisabledURL() {
    const paginator = Paginator.create({
        pagesCount: 10,
        url: null,
        onChange: () => {},
    });

    ge('no-url').appendChild(paginator.elem);
}

function initHandler() {
    const handlerStatus = ge('handler-status');
    const paginator = Paginator.create({
        pagesCount: 10,
        onChange: (page) => {
            handlerStatus.textContent = `Page ${page} selected`;
        },
    });

    ge('handler').appendChild(paginator.elem);
}

function initPrerendered() {
    Paginator.fromElement(ge('prerendered'), {
        url: null,
        breakLimit: 4,
        onChange: () => {},
    });
}

function initSingleItem() {
    const paginatorOn = Paginator.create({
        url: null,
        pagesCount: 1,
        onChange: () => {},
        showSingleItem: true,
    });
    ge('single-on').appendChild(paginatorOn.elem);

    const paginatorOff = Paginator.create({
        url: null,
        pagesCount: 1,
        onChange: () => {},
        showSingleItem: false,
    });
    ge('single-off').appendChild(paginatorOff.elem);
}

onReady(() => {
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