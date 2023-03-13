import {
    isFunction,
    ge,
    re,
    insertAfter,
    show,
    setEmptyClick,
    removeEmptyClick,
    removeChilds,
    createElement,
    addChilds,
} from '../../js/common.js';
import '../../css/common.scss';
import { Component } from '../../js/Component.js';
import { CloseButton } from '../CloseButton/CloseButton.js';
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
        re(this.elem);
        this.elem = null;
    }

    show(value = true) {
        if (!value) {
            this.hide();
            return;
        }

        if (this.state.nodim !== true) {
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            document.body.style.top = `-${this.scrollTop}px`;
            document.body.style.overflow = 'hidden';
            document.body.style.width = '100%';
            document.body.style.height = 'auto';
            document.body.style.position = 'fixed';
        }
        show(this.elem, true);

        if (this.state.closeOnEmptyClick === true) {
            setTimeout(() => {
                setEmptyClick(this.emptyClickHandler, [this.container]);
            });
        }
    }

    hide() {
        if (!this.elem) {
            return;
        }

        show(this.elem, false);
        if (this.state.nodim !== true) {
            document.body.style.top = '';
            document.body.style.overflow = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.position = '';

            const scrollOptionsAvailable = 'scrollBehavior' in document.documentElement.style;
            if (scrollOptionsAvailable) {
                window.scrollTo({
                    top: this.scrollTop,
                    behavior: 'instant',
                });
            } else {
                window.scrollTo(0, this.scrollTop);
            }
        }

        if (this.state.closeOnEmptyClick === true) {
            removeEmptyClick(this.emptyClickHandler);
        }
    }

    close() {
        this.hide();

        if (isFunction(this.props.onClose)) {
            this.props.onClose();
        }
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
            re(this.titleElem);
            this.titleElem = null;
            return;
        }

        if (!this.titleElem) {
            this.titleElem = createElement('h1', { props: { className: TITLE_CLASS } });
            this.headerElem.prepend(this.titleElem);
        }

        removeChilds(this.titleElem);
        if (typeof state.title === 'string') {
            this.titleElem.textContent = state.title;
        } else {
            addChilds(this.titleElem, state.title);
        }
    }

    renderCloseButton(state, prevState) {
        if (state.closeButton === prevState.closeButton) {
            return;
        }

        if (!state.closeButton) {
            re(this.closeBtn?.elem);
            this.closeBtn = null;
            return;
        }

        this.closeBtn = CloseButton.create({
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
            re(this.contentElem);
            this.contentElem = null;
        }

        if (!this.contentElem) {
            this.contentElem = createElement('div', { props: { className: MESSAGE_CLASS } });
            if (this.headerElem) {
                insertAfter(this.contentElem, this.headerElem);
            } else {
                this.container.prepend(this.contentElem);
            }
        }

        removeChilds(this.contentElem);
        if (typeof state.content === 'string') {
            const preparedContent = state.content.replaceAll(/\r?\n/g, '<br>');
            this.contentElem.innerHTML = preparedContent;
        } else {
            addChilds(this.contentElem, state.content);
        }
    }

    renderFooter(state, prevState) {
        if (state.footer === prevState.footer) {
            return;
        }

        if (!state.footer) {
            re(this.footerElem);
            this.footerElem = null;
            return;
        }

        if (!this.footerElem) {
            this.footerElem = createElement('div', { props: { className: FOOTER_CLASS } });
            this.container.append(this.footerElem);
        }

        removeChilds(this.footerElem);
        if (typeof state.footer === 'string') {
            this.footerElem.textContent = state.footer;
        } else {
            addChilds(this.footerElem, state.footer);
        }
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
