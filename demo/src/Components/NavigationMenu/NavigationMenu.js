import { Component, createElement } from 'jezvejs';
import { NavigationMenuSection } from './NavigationMenuSection.js';
import './NavigationMenu.scss';

/* CSS classes */
const CONTAINER_CLASS = 'nav-menu-container';

const defaultProps = {
    sections: [],
    baseURL: null,
};

/**
 * Navigation menu
 */
export class NavigationMenu extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        const { sections, baseURL } = this.props;

        const children = sections.map((item) => (
            NavigationMenuSection.create({ ...item, baseURL }).elem
        ));

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children,
        });
    }
}
