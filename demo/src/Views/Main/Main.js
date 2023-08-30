import 'jezvejs/style';

import { DemoView } from '../../Application/DemoView.js';
import './MainView.scss';

class MainView extends DemoView {
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

MainView.create();
