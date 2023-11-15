import { createSVGElement } from '@jezvejs/dom';
import { Component } from '../../Component.js';

const defaultProps = {
    icon: null,
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

        this.render(this.state);
    }

    renderUseIcon(state) {
        const icon = state?.icon ?? '';
        if (typeof icon !== 'string') {
            return;
        }

        if (!this.useElem) {
            this.useElem = createSVGElement('use');
            const elem = createSVGElement('svg', { children: this.useElem });
            this.setElement(elem);
        }

        this.useElem.href.baseVal = `#${icon}`;
    }

    renderElementIcon(state) {
        if (!(state.icon instanceof Element)) {
            return;
        }
        if (this.elem && !this.useElem) {
            return;
        }

        const elem = state.icon.cloneNode(true);
        this.setElement(elem);
        this.useElem = null;
    }

    /** Set icon */
    setIcon(icon) {
        if (
            typeof icon !== 'string'
            && !(icon instanceof Element)
        ) {
            throw new Error('Invalid icon specified');
        }

        if (this.state.icon === icon) {
            return;
        }

        this.setState({ ...this.state, icon });
    }

    /** Render component */
    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalild state');
        }

        if (state.icon === prevState.icon) {
            return;
        }

        const icon = state.icon ?? '';
        if (typeof icon === 'string') {
            this.renderUseIcon(state);
        } else if (icon instanceof Element) {
            this.renderElementIcon(state);
        }

        this.setClassNames();
        this.setUserProps();
    }
}
