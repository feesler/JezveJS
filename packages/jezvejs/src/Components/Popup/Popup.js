import { asArray } from '@jezvejs/types';
import {
    ge,
    show,
    createElement,
} from '@jezvejs/dom';
import { setEmptyClick, removeEmptyClick } from '../../emptyClick.js';
import { Component } from '../../Component.js';
import { CloseButton } from '../CloseButton/CloseButton.js';
import { ScrollLock } from '../ScrollLock/ScrollLock.js';

import '../../common.scss';
import './Popup.scss';

/* CSS classes */
const POPUP_CLASS = 'popup';
const CONTAINER_CLASS = 'popup__content';
const WRAPPER_CLASS = 'popup__wrapper';
const MESSAGE_CLASS = 'popup__message';
const HEADER_CLASS = 'popup__header';
const TITLE_CLASS = 'popup__title';
const FOOTER_CLASS = 'popup__footer';
const NO_DIM_CLASS = 'popup_nodim';
const SCROLL_MESSAGE_CLASS = 'popup_scroll-message';

const defaultProps = {
    title: null,
    content: null,
    footer: null,
    visible: false,
    closeButton: false,
    nodim: false,
    scrollMessage: false,
    onClose: null,
    className: null,
};

/** Popup component */
export class Popup extends Component {
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

        // check popup with same id is already exist
        if ('id' in this.props) {
            const elem = ge(this.props.id);
            if (elem) {
                throw new Error(`Element with id ${this.props.id} already exist`);
            }
        }

        this.emptyClickHandler = () => this.close();

        this.init();
    }

    init() {
        this.headerElem = createElement('div', { props: { className: HEADER_CLASS } });
        this.container = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: [
                this.headerElem,
            ],
        });
        this.wrapperElem = createElement('div', {
            props: { className: WRAPPER_CLASS },
            children: this.container,
        });

        this.elem = createElement('div', {
            props: { className: POPUP_CLASS },
            attrs: { hidden: '' },
            children: this.wrapperElem,
        });

        this.setClassNames();
        this.setUserProps();

        this.render(this.state);

        document.body.append(this.elem);
    }

    destroy() {
        this.elem?.remove();
        this.elem = null;
    }

    show(value = true) {
        if (!value) {
            this.hide();
            return;
        }

        if (!this.elem || this.state.visible) {
            return;
        }

        if (this.state.nodim !== true) {
            ScrollLock.lock();
        }
        show(this.elem, true);

        if (this.state.closeOnEmptyClick === true) {
            setTimeout(() => {
                setEmptyClick(this.emptyClickHandler, [this.container]);
            });
        }

        this.setState({ ...this.state, visible: true });
    }

    hide() {
        if (!this.elem || !this.state.visible) {
            return;
        }

        show(this.elem, false);
        if (this.state.nodim !== true) {
            ScrollLock.unlock();
        }

        if (this.state.closeOnEmptyClick === true) {
            removeEmptyClick(this.emptyClickHandler);
        }

        this.setState({ ...this.state, visible: false });
    }

    close() {
        this.hide();

        this.notifyEvent('onClose');
    }

    setTitle(title) {
        if (this.state.title !== title) {
            this.setState({ ...this.state, title });
        }
    }

    setCloseButton(closeButton) {
        if (this.state.closeButton !== closeButton) {
            this.setState({ ...this.state, closeButton });
        }
    }

    setContent(content) {
        if (this.state.content !== content) {
            this.setState({ ...this.state, content });
        }
    }

    setFooter(footer) {
        if (this.state.footer !== footer) {
            this.setState({ ...this.state, footer });
        }
    }

    renderTitle(state, prevState) {
        if (state.title === prevState.title) {
            return;
        }

        if (!state.title) {
            this.titleElem?.remove();
            this.titleElem = null;
            return;
        }

        if (!this.titleElem) {
            this.titleElem = createElement('h1', { props: { className: TITLE_CLASS } });
            this.headerElem.prepend(this.titleElem);
        }

        this.titleElem.replaceChildren(...asArray(state.title));
    }

    renderCloseButton(state, prevState) {
        if (state.closeButton === prevState.closeButton) {
            return;
        }

        if (!state.closeButton) {
            this.closeBtn?.elem?.remove();
            this.closeBtn = null;
            return;
        }

        this.closeBtn = CloseButton.create({
            small: false,
            onClick: () => this.close(),
        });
        this.headerElem.append(this.closeBtn.elem);
    }

    renderHeader(state, prevState) {
        this.renderTitle(state, prevState);
        this.renderCloseButton(state, prevState);
    }

    renderContent(state, prevState) {
        if (state.content === prevState.content) {
            return;
        }

        if (!state.content) {
            this.contentElem?.remove();
            this.contentElem = null;
        }

        if (!this.contentElem) {
            this.contentElem = createElement('div', { props: { className: MESSAGE_CLASS } });
            if (this.headerElem) {
                this.headerElem.after(this.contentElem);
            } else {
                this.container.prepend(this.contentElem);
            }
        }

        if (typeof state.content === 'string') {
            const preparedContent = state.content.replaceAll(/\r?\n/g, '<br>');
            this.contentElem.innerHTML = preparedContent;
        } else {
            this.contentElem.replaceChildren(...asArray(state.content));
        }
    }

    renderFooter(state, prevState) {
        if (state.footer === prevState.footer) {
            return;
        }

        if (!state.footer) {
            this.footerElem?.remove();
            this.footerElem = null;
            return;
        }

        if (!this.footerElem) {
            this.footerElem = createElement('div', { props: { className: FOOTER_CLASS } });
            this.container.append(this.footerElem);
        }

        this.footerElem.replaceChildren(...asArray(state.footer));
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.elem.classList.toggle(NO_DIM_CLASS, state.nodim);
        this.elem.classList.toggle(SCROLL_MESSAGE_CLASS, state.scrollMessage);

        this.renderHeader(state, prevState);
        this.renderContent(state, prevState);
        this.renderFooter(state, prevState);
    }
}
