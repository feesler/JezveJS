import { createElement } from '@jezvejs/dom';
import { Component } from '../../../../../Component.js';
import './Placeholder.scss';

/* CSS classes */
const PLACEHOLDER_CLASS = 'dd__placeholder';

const defaultProps = {
    placeholder: '',
};

export class DropDownPlaceholder extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = { ...this.props };

        this.init();
    }

    init() {
        this.elem = createElement('span', { className: PLACEHOLDER_CLASS });
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        const placeholder = state.placeholder ?? '';
        this.elem.textContent = placeholder;
        this.elem.title = placeholder;
    }
}
