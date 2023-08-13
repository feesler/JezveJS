import { getClassName } from 'jezvejs';
import { Menu } from 'jezvejs/Menu';

import './NavigationMenu.scss';

/* CSS classes */
const CONTAINER_CLASS = 'nav-menu-container';

const defaultProps = {
};

/**
 * Navigation menu
 */
export class NavigationMenu extends Menu {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(CONTAINER_CLASS, props.className),
            defaultItemType: 'link',
            beforeContent: false,
            afterContent: false,
        });
    }
}
