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

        this.elem = createElement('div', { props: { className: SEPARATOR_CLASS } });
    }

    get id() {
        return this.state.id;
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.show(!state.hidden);
        enable(this.elem, !state.disabled);
    }
}
