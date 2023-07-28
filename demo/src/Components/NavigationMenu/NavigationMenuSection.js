import { Component, asArray, createElement } from 'jezvejs';
import { NavigationMenuItem } from './NavigationMenuItem.js';

/* CSS classes */
const SECTION_CLASS = 'nav-menu-section';
const MENU_CLASS = 'nav-menu';

const defaultProps = {
    title: null,
    items: [],
    baseURL: null,
};

/**
 * Navigation menu section
 */
export class NavigationMenuSection extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        const { title, baseURL } = this.props;
        const header = createElement('h2', { props: { textContent: title } });

        const items = asArray(this.props.items);
        const menu = createElement('ul', {
            props: { className: MENU_CLASS },
            children: items.map((item) => (
                NavigationMenuItem.create({ ...item, baseURL }).elem
            )),
        });

        this.elem = createElement('div', {
            props: { className: SECTION_CLASS },
            children: [header, menu],
        });
    }
}
