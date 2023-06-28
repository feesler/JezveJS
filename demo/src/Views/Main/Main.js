import 'jezvejs/style';
import { View } from 'jezvejs/View';

import { renderVersion, renderNavigationMenu } from '../../Application/app.js';
import './MainView.scss';

class MainView extends View {
    /**
     * View initialization
     */
    onStart() {
        const navMenu = renderNavigationMenu();
        const menuContainer = document.querySelector('.menu-container');
        menuContainer.append(navMenu);

        renderVersion();
    }
}

MainView.create();
