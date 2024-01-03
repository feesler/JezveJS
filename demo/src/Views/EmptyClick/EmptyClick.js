import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { setEmptyClick, removeEmptyClick } from 'jezvejs';
import { Button } from 'jezvejs/Button';

import { createContainer, createListContent } from '../../Application/utils.js';
import { DemoView } from '../../Components/DemoView/DemoView.js';

import './EmptyClickView.scss';

/**
 * setEmptyClick() and removeEmptyClick() demo view
 */
class EmptyClickView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Empty click test');

        this.initSimple();
        this.initMenu();
    }

    initSimple() {
        const excludedId = 'except';

        const statusEl = createElement('div', { id: 'status' });
        const excludedEl = createElement('div', {
            id: excludedId,
            textContent: 'Not here',
            className: 'excluded-box',
        });

        let count = 0;

        const updateCounter = () => {
            count += 1;
            statusEl.textContent = `Empty clicks: ${count}`;
            removeEmptyClick(updateCounter, excludedId);
            setEmptyClick(updateCounter, excludedId);
        };

        setEmptyClick(updateCounter, excludedId);

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                statusEl,
                excludedEl,
            ],
        });
    }

    initMenu() {
        let openBtn = null;
        const menu = createListContent({
            id: 'menu',
            className: 'test-menu',
        });

        const hideMenu = () => {
            menu.classList.remove('test-menu_open');
            removeEmptyClick(hideMenu);
        };

        const showMenu = () => {
            menu.classList.add('test-menu_open');
            setEmptyClick(hideMenu, [menu, openBtn?.elem]);
        };

        openBtn = Button.create({
            id: 'openbtn',
            className: 'action-btn',
            title: 'Open',
            onClick: () => showMenu(),
        });

        this.addSection({
            id: 'menu',
            title: 'Menu',
            content: createContainer('container', [
                openBtn.elem,
                menu,
            ]),
        });
    }
}

EmptyClickView.create();
