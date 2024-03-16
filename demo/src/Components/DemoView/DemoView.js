import { createElement } from '@jezvejs/dom';
import { mapItems } from 'jezvejs/Menu';
import { Header } from 'jezvejs/Header';
import { HeaderMenuButton } from 'jezvejs/HeaderMenuButton';
import { View } from 'jezvejs/View';
import { Offcanvas } from 'jezvejs/Offcanvas';

import * as App from '../../Application/app.js';
import { NavigationMenu } from '../NavigationMenu/NavigationMenu.js';
import { TableOfContents } from '../TableOfContents/TableOfContents.js';
import { DemoSection } from '../DemoSection/DemoSection.js';

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
            className: 'nav-header__logo',
            href: baseURL.toString(),
            textContent: 'JezveJS',
        });

        const versionLabel = createElement('div', {
            className: 'nav-header__version',
            textContent: App.getVersion(),
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
            className: 'navigation',
        });

        this.createHeader();
    }

    /**
     * Initializes content container
     */
    initContainer() {
        this.pageContentWrapper = document.querySelector('.page-content-wrap');

        this.container = createElement('div', {
            className: 'content-container',
        });
        this.pageContentWrapper.append(this.container);
    }

    setMainHeading(title) {
        this.mainHeader = createElement('h1', {
            textContent: title,
        });

        this.pageContentWrapper.prepend(this.mainHeader);

        document.title = `JezveJS | ${title}`;
    }

    /**
     * Initializes table of contents menu
     */
    initTableOfContents() {
        if (this.tocMenu) {
            return;
        }

        this.tocMenu = TableOfContents.create();

        if (this.mainHeader) {
            this.mainHeader.after(this.tocMenu.elem);
        } else {
            this.pageContentWrapper.prepend(this.tocMenu.elem);
        }
    }

    addSectionsGroup(options = {}) {
        const {
            title = null,
            items = [],
        } = options;

        const header = createElement('h1', { textContent: title });
        this.container.append(header);

        this.initTableOfContents();

        this.tocMenu.addItem({
            id: this.tocMenu.generateGroupId(),
            type: 'group',
            title,
            items,
        });
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

        if (this.tocMenu.items.length === 0) {
            this.tocMenu.addItem({
                id: this.tocMenu.generateGroupId(),
                type: 'group',
                items: [],
            });
        }

        const { items } = this.tocMenu;
        const lastItem = items[items.length - 1];
        if (lastItem.type !== 'group') {
            throw new Error('Invalid type of item: group is expected');
        }

        this.tocMenu.addItem({
            id,
            title,
            url: `#${id}`,
            group: lastItem.id,
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
