import {
    isFunction,
    ge,
    setProps,
    re,
    insertAfter,
    prependChild,
    show,
    setEmptyClick,
    removeEmptyClick,
    removeChilds,
    createElement,
    asArray,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import { CloseButton } from '../CloseButton/CloseButton.js';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'popup';
const CONTENT_CLASS = 'popup__content';
const BOX_CLASS = 'popup__content-box';
const WRAPPER_CLASS = 'popup__wrapper';
const MESSAGE_CLASS = 'popup__message';
const HEADER_CLASS = 'popup__header';
const TITLE_CLASS = 'popup__title';
const CONTROLS_CLASS = 'popup__controls';
const SUBMIT_BTN_CLASS = 'btn submit-btn';
const CANCEL_BTN_CLASS = 'btn cancel-btn';
const NO_DIM_CLASS = 'popup_nodim';
const SCROLL_MESSAGE_CLASS = 'popup_scroll-message';

const defaultProps = {
    title: null,
    content: null,
    nodim: false,
    scrollMessage: false,
    onClose: null,
    className: null,
    btn: null,
};

/** Popup component */
export class Popup extends Component {
    constructor(...args) {
        super(...args);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        // check popup with same id is already exist
        if ('id' in this.props) {
            this.elem = ge(this.props.id);
            if (this.elem) {
                throw new Error(`Element with id ${this.props.id} already exist`);
            }
        }
        this.elem = createElement('div', { props: { className: CONTAINER_CLASS } });
        show(this.elem, false);
        if ('id' in this.props) {
            this.elem.id = this.props.id;
        }

        if (this.props.nodim === true) {
            this.elem.classList.add(NO_DIM_CLASS);
        }
        if (this.props.scrollMessage === true) {
            this.elem.classList.add(SCROLL_MESSAGE_CLASS);
        }

        this.emptyClickHandler = () => this.close();

        this.headerElem = createElement('div', { props: { className: HEADER_CLASS } });
        this.messageElem = createElement('div', { props: { className: MESSAGE_CLASS } });
        this.boxElem = createElement('div', {
            props: { className: BOX_CLASS },
            children: [
                this.headerElem,
                this.messageElem,
            ],
        });
        this.contentElem = createElement('div', {
            props: { className: CONTENT_CLASS },
            children: this.boxElem,
        });
        this.wrapperElem = createElement('div', {
            props: { className: WRAPPER_CLASS },
            children: this.contentElem,
        });
        this.elem.append(this.wrapperElem);

        this.setTitle(this.props.title);
        if (!this.setContent(this.props.content)) {
            return false;
        }
        this.setControls(this.props.btn);

        this.setClassNames();

        document.body.append(this.elem);
    }

    destroy() {
        if (this.elem && this.elem.parentNode) {
            this.elem.parentNode.removeChild(this.elem);
        }
        this.elem = null;
    }

    show(val) {
        const toShow = (typeof val === 'undefined') ? true : !!val;
        if (!toShow) {
            this.hide();
            return;
        }

        if (this.props.nodim !== true) {
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            document.body.style.top = `-${this.scrollTop}px`;
            document.body.style.overflow = 'hidden';
            document.body.style.width = '100%';
            document.body.style.height = 'auto';
            document.body.style.position = 'fixed';
        }
        show(this.elem, true);

        if (this.props.closeOnEmptyClick === true) {
            setTimeout(() => {
                setEmptyClick(this.emptyClickHandler, [this.boxElem]);
            });
        }
    }

    hide() {
        if (!this.elem) {
            return;
        }

        show(this.elem, false);
        if (this.props.nodim !== true) {
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

        if (this.props.closeOnEmptyClick === true) {
            removeEmptyClick(this.emptyClickHandler);
        }
    }

    close() {
        this.hide();

        if (isFunction(this.props.onClose)) {
            this.props.onClose();
        }
    }

    // Add close button to the popup
    addCloseButton() {
        if (!this.boxElem || this.closeBtn) {
            return;
        }

        this.closeBtn = CloseButton.create({
            onClick: () => this.close(),
        });
        this.headerElem.append(this.closeBtn.elem);
    }

    // Remove close button
    removeCloseButton() {
        re(this.closeBtn?.elem);
        this.closeBtn = null;
    }

    setContent(content) {
        if (!content) {
            return false;
        }

        if (typeof content === 'string') {
            const preparedContent = content.replaceAll(/\r?\n/g, '<br>');
            this.messageElem.innerHTML = preparedContent;
        } else {
            removeChilds(this.messageElem);
            const elems = asArray(content);
            this.messageElem.append(...elems);
        }

        return true;
    }

    setTitle(title) {
        if (!title) {
            this.removeTitle();
            return;
        }

        if (!this.titleElem) {
            this.titleElem = createElement('h1', { props: { className: TITLE_CLASS } });
            prependChild(this.headerElem, this.titleElem);
        }

        if (typeof title === 'string') {
            this.titleElem.textContent = title;
        } else {
            removeChilds(this.titleElem);
            this.titleElem.append(title);
        }
    }

    removeTitle() {
        re(this.titleElem);
        this.titleElem = null;
    }

    setControls(controls) {
        if (!controls) {
            return false;
        }

        const newHasControls = (
            ('okBtn' in controls && controls.okBtn !== false)
            || ('cancelBtn' in controls && controls.cancelBtn !== false)
        );
        if (newHasControls) {
            if (!this.controlsElem) {
                this.controlsElem = createElement('div', { props: { className: CONTROLS_CLASS } });
            }
        } else {
            re(this.controlsElem);
            this.controlsElem = null;
        }

        if ('okBtn' in controls) {
            if (controls.okBtn === false && this.okBtn) {
                re(this.okBtn);
                this.okBtn = null;
            } else {
                if (!this.okBtn) {
                    this.okBtn = createElement('input', {
                        props: {
                            className: SUBMIT_BTN_CLASS,
                            type: 'button',
                            value: 'ok',
                        },
                    });
                }

                setProps(this.okBtn, controls.okBtn);
            }
        }

        if ('cancelBtn' in controls) {
            if (controls.cancelBtn === false && this.cancelBtn) {
                re(this.cancelBtn);
                this.cancelBtn = null;
            } else {
                if (!this.cancelBtn) {
                    this.cancelBtn = createElement('input', {
                        props: {
                            className: CANCEL_BTN_CLASS,
                            type: 'button',
                            value: 'cancel',
                            onclick: () => this.close(),
                        },
                    });
                }

                setProps(this.cancelBtn, controls.cancelBtn);
            }
        }

        if (newHasControls) {
            if (this.okBtn) {
                this.controlsElem.append(this.okBtn);
            }
            if (this.cancelBtn) {
                this.controlsElem.append(this.cancelBtn);
            }
            insertAfter(this.controlsElem, this.messageElem);
        }

        if (typeof controls.closeBtn !== 'undefined') {
            if (controls.closeBtn === true) {
                this.addCloseButton();
            } else if (controls.closeBtn === false) {
                this.removeCloseButton();
            }
        }

        return true;
    }
}
