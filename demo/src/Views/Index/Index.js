import 'jezvejs/style';
import { createElement, createSVGElement } from '@jezvejs/dom';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import './IndexView.scss';

const LOGO_PATH = 'm16.07 3.744-2.803.8165-.2145.08682-4.205 2.033-1.576.6408-.3659-.9452v-.2599l.3462-.9508h.2599v-.2594h-3.981v.2594h.2599l.3462.9508v.2599l-2.077 5.365v.2599l1.25 1.385h4.425l1.25-1.385v-.2599l-1.518-3.921 1.584-.6439 4.431-1.478.2145-.08682 2.577-1.372-.2015-.4956z';

class IndexView extends DemoView {
    /**
     * Initializes navigation menu
     */
    initNavigation() {
        this.createHeader();

        const navMenu = this.createNavigationMenu();

        this.menuContainer = createElement('div', {
            props: { className: 'menu-container' },
            children: navMenu.elem,
        });

        this.logoHeader = this.createLogoHeader();

        this.mainContainer = createElement('main', {
            children: [this.logoHeader, this.menuContainer],
        });
    }

    /**
     * Initializes content container
     */
    initContainer() {
        this.pageContentWrapper = document.querySelector('.page-content-wrap');
        this.pageContentWrapper.append(this.mainContainer);
    }

    createLogoHeader() {
        return createElement('header', {
            props: { className: 'logo-header' },
            children: [
                createElement('div', {
                    props: { className: 'logo-container' },
                    children: [
                        this.createLogo(),
                        this.createLogoDescription(),
                    ],
                }),
                this.createDescription(),
            ],
        });
    }

    createLogo() {
        return createSVGElement('svg', {
            attrs: {
                class: 'logo',
                width: 128,
                height: 128,
                viewBox: '0 0 16.93 16.93',
            },
            children: createSVGElement('path', {
                attrs: { d: LOGO_PATH },
            }),
        });
    }

    createLogoDescription() {
        return createElement('div', {
            props: { className: 'logo-description' },
            children: [
                createElement('h1', {
                    props: { className: 'logo-title' },
                    children: [
                        'Jezve',
                        createElement('b', { props: { textContent: 'JS' } }),
                    ],
                }),
                createElement('p', {
                    props: {
                        className: 'logo-subtitle',
                        textContent: 'Vanilla JavaScript library',
                    },
                }),
            ],
        });
    }

    createDescription() {
        return createElement('p', {
            props: {
                className: 'description',
                textContent: 'Components and utilities to organize development of pet project.',
            },
        });
    }
}

IndexView.create();
