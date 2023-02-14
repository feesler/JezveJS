import 'jezvejs/style';
import 'jezvejs/style/Button';
import {
    ge,
    setEmptyClick,
    removeEmptyClick,
    onReady,
} from 'jezvejs';
import { initNavigation } from '../../app.js';
import './style.scss';

let count = 0;

const updateCounter = () => {
    count += 1;
    ge('status').innerHTML = `Empty clicks: ${count}<br>`;
    removeEmptyClick(updateCounter, 'except');
    setEmptyClick(updateCounter, 'except');
};

const initSimple = () => {
    setEmptyClick(updateCounter, 'except');
};

const hideMenu = () => {
    const menu = ge('menu');
    menu.classList.remove('test-menu_open');
    removeEmptyClick(hideMenu);
};

const showMenu = () => {
    const openBtn = ge('openbtn');
    const menu = ge('menu');
    menu.classList.add('test-menu_open');

    setEmptyClick(hideMenu, [menu, openBtn]);
};

const initMenu = () => {
    const openBtn = ge('openbtn');
    openBtn.addEventListener('click', () => showMenu());
};

function init() {
    initNavigation();

    initSimple();
    initMenu();
}

onReady(init);
