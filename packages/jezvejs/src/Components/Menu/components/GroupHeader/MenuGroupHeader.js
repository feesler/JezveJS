import { createElement } from '@jezvejs/dom';
import { Component } from '../../../../Component.js';

import './MenuGroupHeader.scss';

/* CSS classes */
const HEADER_CLASS = 'menu-group__header';

const defaultProps = {
    title: null,
};

/**
 * Menu group header component
 */
export class MenuGroupHeader extends Component {
    static get className() {
        return HEADER_CLASS;
    }

    static get selector() {
        return `.${HEADER_CLASS}`;
    }

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = { ...this.props };

        this.init();
        this.postInit();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('div', {
            props: { className: HEADER_CLASS },
        });
    }

    postInit() {
        this.setClassNames();
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.elem.textContent = state.title ?? '';
    }
}
