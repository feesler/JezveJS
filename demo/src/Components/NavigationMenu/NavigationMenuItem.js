import { Component, createElement } from 'jezvejs';

/* CSS classes */
const LINK_CLASS = 'nav-menu-link';

const defaultProps = {
    title: null,
    url: null,
    baseURL: null,
};

/**
 * Navigation menu list item
 */
export class NavigationMenuItem extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        const { title, url, baseURL } = this.props;

        this.elem = createElement('li', {
            children: createElement('a', {
                props: {
                    href: `${baseURL}${url}`,
                    className: LINK_CLASS,
                    textContent: title,
                },
            }),
        });
    }
}
