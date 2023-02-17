import { createElement } from '../../../../js/common.js';
import { Component } from '../../../../js/Component.js';
import './style.scss';

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
        this.elem = createElement('span', { props: { className: PLACEHOLDER_CLASS } });
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