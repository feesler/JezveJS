import { Component } from '../../js/Component.js';
import {
    addChilds,
    createElement,
    getClassName,
    removeChilds,
} from '../../js/common.js';

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
            removeChilds(this.elem);
            addChilds(this.elem, state.content);
        }
    }
}
