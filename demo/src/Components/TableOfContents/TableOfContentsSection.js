import { Component, asArray, createElement } from 'jezvejs';
import { TableOfContentsMenuItem } from './TableOfContentsMenuItem.js';

/* CSS classes */
const SECTION_CLASS = 'toc-list-section';
const MENU_CLASS = 'nav-menu';

const defaultProps = {
    title: null,
    items: [],
};

/**
 * Table of contents menu section
 */
export class TableOfContentsSection extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        const { title } = this.props;

        const children = [];
        if (typeof title === 'string' && title.length > 0) {
            const header = createElement('header', { props: { textContent: title } });
            children.push(header);
        }

        const items = asArray(this.props.items);
        const menu = createElement('ul', {
            props: { className: MENU_CLASS },
            children: items.map((item) => (
                TableOfContentsMenuItem.create({ ...item }).elem
            )),
        });
        children.push(menu);

        this.elem = createElement('div', {
            props: { className: SECTION_CLASS },
            children,
        });
    }
}
