import { Component } from 'jezvejs';
import { createElement } from '@jezvejs/dom';

import './LoadingPlaceholder.scss';

/* CSS classes */
const PLACEHOLDER_CLASS = 'loading-placeholder';

const defaultProps = {
    title: 'Loading...',
};

/**
 * Loading placeholder component for Menu
 */
export class LoadingPlaceholder extends Component {
    constructor(props) {
        super({
            ...defaultProps,
            ...(props ?? {}),
        });

        this.state = { ...this.props };

        this.init();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('div', {
            className: PLACEHOLDER_CLASS,
        });
    }

    render(state) {
        this.elem.textContent = state?.title ?? '';
    }
}
