import { ge, setEvents } from 'jezvejs';
import { View } from 'jezvejs/View';
import { Offcanvas } from 'jezvejs/Offcanvas';

import * as App from './app.js';
import { NavigationMenu } from '../Components/NavigationMenu/NavigationMenu.js';

/**
 * Demo view base class
 */
export class DemoView extends View {
    /**
     * View pre initialization handler
     */
    preStart() {
        this.initNavigation();
        this.renderVersion();
    }

    /**
     * Returns new instance of NavigationMenu component
     * @returns NavigationMenu
     */
    createNavigationMenu() {
        return NavigationMenu.create({
            sections: App.navigationMenuSections,
            baseURL: App.getBaseURL(),
        });
    }

    /**
     * Initializes navigation menu
     */
    initNavigation() {
        const navMenu = this.createNavigationMenu();
        const offcanvas = Offcanvas.create({
            content: navMenu.elem,
        });

        const navToggleBtn = document.querySelector('.nav-header .nav-toggle-btn');
        setEvents(navToggleBtn, { click: () => offcanvas.toggle() });
    }

    /**
     * Renders version of library from package data
     */
    renderVersion() {
        const version = ge('version');
        version.textContent = App.getVersion();
    }
}
