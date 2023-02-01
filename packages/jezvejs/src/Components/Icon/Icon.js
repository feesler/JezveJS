import { createSVGElement } from '../../js/common.js';
import { Component } from '../../js/Component.js';

const defaultProps = {
    icon: undefined,
    id: undefined,
};

/**
 * Icon component
 */
export class Icon extends Component {
    static userProps = {
        elem: ['id'],
    };

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        this.init();
    }

    init() {
        this.useElem = createSVGElement('use');
        this.elem = createSVGElement('svg', { children: this.useElem });

        this.setClassNames();
        this.setUserProps();
        this.render(this.state);
    }

    /** Set icon */
    setIcon(icon) {
        if (icon && typeof icon !== 'string') {
            throw new Error('Invalid icon specified');
        }

        if (this.state.icon === icon) {
            return;
        }

        this.setState({ ...this.state, icon });
    }

    /** Render component */
    render(state) {
        if (!state) {
            throw new Error('Invalild state');
        }

        this.useElem.href.baseVal = (typeof state.icon === 'string')
            ? `#${state.icon}`
            : '';
    }
}
