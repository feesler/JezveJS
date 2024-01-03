import { createElement, enable } from '@jezvejs/dom';
import { Component } from '../../../../Component.js';

import './MenuSeparator.scss';

/* CSS classes */
const SEPARATOR_CLASS = 'menu-separator';

/**
 * Menu list separator component
 */
export class MenuSeparator extends Component {
    static defaultProps = {
        id: null,
        disabled: false,
        hidden: false,
    };

    constructor(props = {}) {
        super({
            ...MenuSeparator.defaultProps,
            ...props,
        });

        this.state = { ...this.props };

        this.init();
        this.render(this.state);
    }

    get id() {
        return this.state.id;
    }

    init() {
        this.elem = createElement('div', { className: SEPARATOR_CLASS });
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.show(!state.hidden);
        enable(this.elem, !state.disabled);
    }
}
