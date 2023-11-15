import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { Header } from 'jezvejs/Header';
import { HeaderMenuButton } from 'jezvejs/HeaderMenuButton';
import { MenuButton } from 'jezvejs/MenuButton';

import * as App from '../../Application/app.js';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import './HeaderView.scss';

const createHeaderContainer = (id, children) => createElement('div', {
    props: { id, className: 'header-container' },
    children,
});

/**
 * Header component demo view
 */
class HeaderView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDefault();
    }

    initDefault() {
        const baseURL = App.getBaseURL();
        const logoLink = createElement('a', {
            props: {
                className: 'nav-header__logo',
                href: baseURL.toString(),
                textContent: 'Header component',
            },
        });

        const header = Header.create({
            content: [
                HeaderMenuButton.create().elem,
                logoLink,
                MenuButton.create().elem,
            ],
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: createHeaderContainer('defaultContainer', header.elem),
        });
    }

    initStyled() {
        const header = Header.create({
            className: 'styled bold',
        });

        this.addSection({
            id: 'styled',
            title: 'Styled',
            content: createHeaderContainer('styledContainer', header.elem),
        });
    }
}

HeaderView.create();
