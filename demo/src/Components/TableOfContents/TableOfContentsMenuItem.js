import { Component, createElement } from 'jezvejs';

/* CSS classes */
const LINK_CLASS = 'toc-menu-link';

const defaultProps = {
    title: null,
    url: null,
};

/**
 * Navigation menu list item
 */
export class TableOfContentsMenuItem extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        const { title, url } = this.props;

        this.elem = createElement('li', {
            children: createElement('a', {
                props: {
                    href: `#${url}`,
                    className: LINK_CLASS,
                    textContent: title,
                },
            }),
        });
    }
}
