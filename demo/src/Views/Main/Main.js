import 'jezvejs/style';
import { View } from 'jezvejs/View';

import { renderVersion, navigationMenuSections, getBaseURL } from '../../Application/app.js';
import { NavigationMenu } from '../../Components/NavigationMenu/NavigationMenu.js';
import './MainView.scss';

class MainView extends View {
    /**
     * View initialization
     */
    onStart() {
        const navMenu = NavigationMenu.create({
            sections: navigationMenuSections,
            baseURL: getBaseURL(),
        });

        const menuContainer = document.querySelector('.menu-container');
        menuContainer.append(navMenu.elem);

        renderVersion();
    }
}

MainView.create();
