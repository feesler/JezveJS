import {
    ge,
    setEmptyClick,
    removeEmptyClick,
    onReady,
} from '../../js/index.js';
import '../../css/common.scss';
import '../css/common.scss';
import '../css/app.scss';
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
    initSimple();
    initMenu();
}

onReady(init);
