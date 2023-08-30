import { createElement } from 'jezvejs';
import { mapItems } from 'jezvejs/Menu';
import { Header } from 'jezvejs/Header';
import { HeaderMenuButton } from 'jezvejs/HeaderMenuButton';
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
        this.initContainer();

        this.sections = {};
    }

    /**
     * Returns new instance of NavigationMenu component
     * @returns {NavigationMenu}
     */
    createNavigationMenu() {
        const baseURL = App.getBaseURL();
        return NavigationMenu.create({
            items: mapItems(App.navigationMenuSections, (item) => ({
                ...item,
                url: `${baseURL}${item.url}`,
            })),
        });
    }

    /**
     * Creates and initializes page header
     */
    createHeader() {
        const hrdButton = HeaderMenuButton.create({
            onClick: () => this.navOffcanvas?.toggle(),
        });

        const baseURL = App.getBaseURL();
        const logoLink = createElement('a', {
            props: {
                className: 'nav-header__logo',
                href: `${baseURL}demo/index.html`,
                textContent: 'JezveJS',
            },
        });

        const versionLabel = createElement('div', {
            props: {
                className: 'nav-header__version',
                textContent: App.getVersion(),
            },
        });

        this.header = Header.create({
            content: [
                hrdButton.elem,
                logoLink,
                versionLabel,
            ],
        });

        const page = document.querySelector('.page-wrapper');
        page.prepend(this.header.elem);
    }

    /**
     * Initializes navigation menu
     */
    initNavigation() {
        const navMenu = this.createNavigationMenu();
        this.navOffcanvas = Offcanvas.create({
            content: navMenu.elem,
        });

        this.createHeader();
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

        if (id in this.sections) {
            throw new Error(`Section '${id}' already exists.`);
        }

        const section = DemoSection.create({
            id,
            title,
            description,
            content,
            className,
        });
        this.container.append(section.elem);

        this.sections[id] = true;

        this.addContentsMenuItem({
            id,
            title,
        });
    }
}
