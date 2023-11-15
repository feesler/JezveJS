import { isFunction } from '@jezvejs/types';
import {
    createElement,
    enable,
    re,
} from '@jezvejs/dom';
import { Component } from '../../Component.js';
import { CloseButton } from '../CloseButton/CloseButton.js';
import './Tag.scss';

/* CSS classes */
const TAG_CLASS = 'tag';
const TITLE_CLASS = 'tag__title';
const DEL_BTN_CLASS = 'tag__close-btn';
const ACTIVE_CLASS = 'tag_active';
const PLACEHOLDER_CLASS = 'tag_placeholder';
const SORT_MODE_CLASS = 'tag_sort';

const defaultProps = {
    active: false,
    disabled: false,
    closeable: false,
    listMode: 'list',
    onClose: null,
};

export class Tag extends Component {
    static get className() {
        return TAG_CLASS;
    }

    static get selector() {
        return `.${this.className}`;
    }

    static get sortSelector() {
        return `.${SORT_MODE_CLASS}`;
    }

    static get buttonClass() {
        return DEL_BTN_CLASS;
    }

    static get placeholderClass() {
        return PLACEHOLDER_CLASS;
    }

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        if (typeof this.props.id === 'undefined' || this.props.id === null) {
            throw new Error('Invalid id');
        }

        this.state = {
            ...this.props,
            id: this.props.id.toString(),
        };

        this.init();
        this.render(this.state);
    }

    get id() {
        return this.state.id;
    }

    init() {
        this.titleElem = createElement('span', { props: { className: TITLE_CLASS } });

        this.elem = createElement('span', {
            props: { className: TAG_CLASS },
            children: [this.titleElem],
        });

        this.setClassNames();
    }

    createCloseButton() {
        return CloseButton.create({
            className: DEL_BTN_CLASS,
            tabIndex: -1,
            onClick: (e) => this.onClose(e),
        });
    }

    onClose(e) {
        if (isFunction(this.state.onClose)) {
            this.state.onClose(e);
        }
    }

    activate(value = true) {
        if (this.state.active === !!value) {
            return;
        }

        this.setState({
            ...this.state,
            active: !!value,
        });
    }

    enable(value = true) {
        if (this.state.disabled === !value) {
            return;
        }

        this.setState({
            ...this.state,
            disabled: !value,
        });
    }

    renderCloseButton(state, prevState) {
        if (
            state.closeable === prevState?.closeable
            && state.disabled === prevState?.disabled
        ) {
            return;
        }

        if (state.closeable) {
            if (!this.closeButton) {
                this.closeButton = this.createCloseButton();
                this.elem.append(this.closeButton.elem);
            }

            this.closeButton.enable(!state.disabled);
        } else {
            re(this.closeButton);
            this.closeButton = null;
        }
    }

    render(state, prevState) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.titleElem.textContent = state.title;

        this.renderCloseButton(state, prevState);

        this.elem.classList.toggle(ACTIVE_CLASS, state.active);
        this.elem.classList.toggle(SORT_MODE_CLASS, state.listMode === 'sort');

        enable(this.elem, !state.disabled);
    }
}
