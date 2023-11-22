import { asArray } from '@jezvejs/types';
import { createElement, getClassName } from '@jezvejs/dom';
import { Component } from '../../Component.js';

import './Header.scss';

/* CSS classes */
const HEADER_CLASS = 'header';

const defaultProps = {
    content: null,
};

/**
 * Page header component
 */
export class Header extends Component {
    static userProps = {
        elem: ['id'],
    };

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(HEADER_CLASS, props.className),
        });

        this.state = {
            ...this.props,
        };

        this.init();
        this.postInit();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('header');
    }

    postInit() {
        this.setClassNames();
        this.setUserProps();
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (state.content !== prevState?.content) {
            this.elem.replaceChildren(...asArray(state.content));
        }
    }
}
