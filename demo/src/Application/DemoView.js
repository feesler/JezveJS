import { ge, setEvents } from 'jezvejs';
import { View } from 'jezvejs/View';
import { Offcanvas } from 'jezvejs/Offcanvas';

import * as App from './app.js';
import { NavigationMenu } from '../Components/NavigationMenu/NavigationMenu.js';
import { TableOfContents } from '../Components/TableOfContents/TableOfContents.js';

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
     * Initializes table of contents menu
     */
    initTableOfContents() {
        this.tocMenu = TableOfContents.create();

        const mainHeader = document.querySelector('.page-content-wrap h1');
        mainHeader.after(this.tocMenu.elem);
    }

    addTableOfContentsSection(options = {}) {
        const {
            title = null,
            items = [],
        } = options;

        this.tocMenu.setState((menuState) => ({
            ...menuState,
            sections: [...menuState.sections, { title, items }],
        }));
    }

    addTableOfContentsItem(options = {}) {
        const {
            title = null,
            url = null,
        } = options;

        if (!title || !url) {
            throw new Error('Invalid section data');
        }

        this.tocMenu.setState((menuState) => {
            const newState = {
                ...menuState,
            };

            if (newState.sections.length === 0) {
                newState.sections.push({ items: [] });
            }
            const lastSection = newState.sections[newState.sections.length - 1];
            lastSection.items.push({ title, url });

            return newState;
        });
    }

    /**
     * Renders version of library from package data
     */
    renderVersion() {
        const version = ge('version');
        version.textContent = App.getVersion();
    }
}
