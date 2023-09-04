import 'jezvejs/style';
import 'jezvejs/style/Button';
import {
    ge,
    setEmptyClick,
    removeEmptyClick,
    setEvents,
} from 'jezvejs';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import './EmptyClickView.scss';

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
    setEvents(ge('openbtn'), { click: () => showMenu() });
};

class EmptyClickView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        initSimple();
        initMenu();
    }
}

EmptyClickView.create();
