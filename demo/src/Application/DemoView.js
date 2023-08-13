import { createElement, ge, setEvents } from 'jezvejs';
import { View } from 'jezvejs/View';
import { Offcanvas } from 'jezvejs/Offcanvas';

import * as App from './app.js';
import { NavigationMenu } from '../Components/NavigationMenu/NavigationMenu.js';
import { TableOfContents } from '../Components/TableOfContents/TableOfContents.js';
import { DemoSection } from '../Components/DemoSection/DemoSection.js';

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
        this.initContainer();
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
     * Initializes content container
     */
    initContainer() {
        this.container = document.querySelector('.content-container');
    }

    /**
     * Initializes table of contents menu
     */
    initTableOfContents() {
        if (this.tocMenu) {
            return;
        }

        this.tocMenu = TableOfContents.create();

        const mainHeader = document.querySelector('.page-content-wrap h1');
        mainHeader.after(this.tocMenu.elem);
    }

    addSectionsGroup(options = {}) {
        const {
            title = null,
            items = [],
        } = options;

        const header = createElement('h1', { props: { textContent: title } });
        this.container.append(header);

        this.initTableOfContents();

        const groupId = this.tocMenu.generateGroupId();
        this.tocMenu.setState((menuState) => ({
            ...menuState,
            items: [
                ...menuState.items,
                {
                    id: groupId,
                    type: 'group',
                    title,
                    items,
                },
            ],
        }));
    }

    addContentsMenuItem(options = {}) {
        const {
            id = null,
            title = null,
        } = options;

        if (!title || !id) {
            throw new Error('Invalid section data');
        }

        this.initTableOfContents();

        const groupId = this.tocMenu.generateGroupId();
        this.tocMenu.setState((menuState) => {
            const newState = {
                ...menuState,
                items: [...menuState.items],
            };
            const { items } = newState;

            if (items.length === 0) {
                items.push({
                    id: groupId,
                    type: 'group',
                    items: [],
                });
            }
            const lastSection = items[items.length - 1];
            lastSection.items.push({
                id,
                title,
                url: `#${id}`,
            });

            return newState;
        });
    }

    addSection(options = {}) {
        const {
            id,
            title,
            description,
            content,
            className = null,
        } = options;

        const section = DemoSection.create({
            id,
            title,
            description,
            content,
            className,
        });
        this.container.append(section.elem);

        this.addContentsMenuItem({
            id,
            title,
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
