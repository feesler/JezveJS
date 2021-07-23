import {
    ge,
    onReady,
} from '../../js/common.js';
import { Paginator } from '../../Components/Paginator/Paginator.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import '../css/paginator.css';

function initSimple() {
    const paginator = new Paginator({
        pagesCount: 10,
    });

    ge('simple').appendChild(paginator.elem);
}

function initStyled() {
    const paginator = new Paginator({
        className: 'styled',
        pagesCount: 10,
    });

    ge('styled').appendChild(paginator.elem);
}

function initActiveLink() {
    const paginator = new Paginator({
        pagesCount: 10,
        allowActiveLink: true,
    });

    ge('active-link').appendChild(paginator.elem);
}

function initCustomURL() {
    const paginator = new Paginator({
        pagesCount: 10,
        url: 'https://test.url/content/',
        pageParam: 'p',
    });

    ge('custom-url').appendChild(paginator.elem);
}

function initDisabledURL() {
    const paginator = new Paginator({
        pagesCount: 10,
        url: null,
    });

    ge('no-url').appendChild(paginator.elem);
}

function initHandler() {
    const handlerStatus = ge('handler-status');
    const paginator = new Paginator({
        pagesCount: 10,
        onChange: (page) => {
            handlerStatus.textContent = `Page ${page} selected`;
        },
    });

    ge('handler').appendChild(paginator.elem);
}

onReady(() => {
    initSimple();
    initStyled();
    initActiveLink();
    initCustomURL();
    initDisabledURL();
    initHandler();
});
