import { Component } from '../../../../js/Component.js';
import { createElement } from '../../../../js/common.js';

import './MenuSeparator.scss';

/* CSS classes */
const SEPARATOR_CLASS = 'menu-separator';

/**
 * Menu list separator component
 */
export class MenuSeparator extends Component {
    constructor(props = {}) {
        super(props);

        this.state = { ...this.props };

        this.elem = createElement('div', { props: { className: SEPARATOR_CLASS } });
    }

    get id() {
        return this.state.id;
    }
}
