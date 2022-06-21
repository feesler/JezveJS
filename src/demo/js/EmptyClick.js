import { ge, setEmptyClick, onReady } from '../../js/common.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import '../css/emptyclick.css';

let count = 0;

const updateCounter = () => {
    count += 1;
    ge('status').innerHTML = `Empty clicks: ${count}<br>`;
    setEmptyClick(() => updateCounter(), 'except');
};

const initSimple = () => {
    setEmptyClick(() => updateCounter(), 'except');
};

const hideMenu = () => {
    const menu = ge('menu');
    menu.classList.remove('test-menu_open');
};

const showMenu = () => {
    const openBtn = ge('openbtn');
    const menu = ge('menu');
    menu.classList.add('test-menu_open');

    setEmptyClick(() => hideMenu(), [menu, openBtn]);
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
