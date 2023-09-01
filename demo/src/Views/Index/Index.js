import 'jezvejs/style';

import { DemoView } from '../../Application/DemoView.js';
import './IndexView.scss';

class IndexView extends DemoView {
    /**
     * Initializes navigation menu
     */
    initNavigation() {
        this.createHeader();

        const navMenu = this.createNavigationMenu();

        const menuContainer = document.querySelector('.menu-container');
        menuContainer.append(navMenu.elem);
    }
}

IndexView.create();
