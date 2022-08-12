import {
    isFunction,
    ge,
    ce,
    svg,
    addChilds,
    setParam,
    re,
    insertAfter,
    insertBefore,
    prependChild,
    show,
    setEmptyClick,
    removeEmptyClick,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'popup';
const CONTENT_CLASS = 'popup__content';
const BOX_CLASS = 'popup__content-box';
const WRAPPER_CLASS = 'popup__wrapper';
const SCROLLER_CLASS = 'popup__scroller';
const CLOSE_BTN_CLASS = 'close-btn';
const CLOSE_ICON_CLASS = 'close-btn__icon';
const NO_DIM_CLASS = 'nodim';
const MESSAGE_CLASS = 'popup__message';
const HEADER_CLASS = 'popup__header';
const TITLE_CLASS = 'popup__title';
const CONTROLS_CLASS = 'popup__controls';
const SUBMIT_BTN_CLASS = 'btn submit-btn';
const CANCEL_BTN_CLASS = 'btn cancel-btn';

/* Icons */
const CLOSE_ICON = 'M 1.1415,2.4266 5.7838,7 1.1415,11.5356 2.4644,12.8585 7,8.2162 11.5734,12.8585 12.8585,11.5356 8.2162,7 12.8585,2.4266 11.5734,1.1415 7,5.7838 2.4644,1.1415 Z';

/**
 * Popup component constructor
 * @param {Object} params:
 * @param {String} params.id - identifier of element will be created for popup
 * @param {boolean} params.nodim - option to not dim background on popup appear
 * @param {Function} params.onclose - popup close event handler
 * @param {String|String[]} params.className - list of additional CSS classes for popup
 * @param {String} params.title - title of popup
 * @param {Object} params.btn:
 * @param {Object|false} params.btn.okBtn - properties object. Remove if false
 * @param {Object|false} params.btn.cancelBtn - properties object. Remove if false
 * @param {Object|false} params.btn.closeBtn - properties object. Remove if false
 */
export class Popup extends Component {
    static create(props) {
        return new Popup(props);
    }

    constructor(...args) {
        super(...args);

        if (!this.props) {
            return false;
        }

        // check popup with same id is already exist
        if ('id' in this.props) {
            this.elem = ge(this.props.id);
            if (this.elem) {
                throw new Error(`Element with id ${this.props.id} already exist`);
            }
        }
        this.elem = ce('div', { className: CONTAINER_CLASS });
        show(this.elem, false);
        if ('id' in this.props) {
            this.elem.id = this.props.id;
        }

        if (this.props.nodim === true) {
            this.elem.classList.add(NO_DIM_CLASS);
        }

        this.emptyClickHandler = () => this.close();
        this.onCloseHandler = (isFunction(this.props.onclose)) ? this.props.onclose : null;

        if (!this.setContent(this.props.content)) {
            return false;
        }

        this.boxElem = ce('div', { className: BOX_CLASS });
        this.contentElem = ce('div', { className: CONTENT_CLASS }, this.boxElem);
        this.wrapperElem = ce('div', { className: WRAPPER_CLASS }, this.contentElem);
        this.scrollerElem = ce('div', { className: SCROLLER_CLASS }, this.wrapperElem);

        this.setClassNames();

        this.headerElem = ce('div', { className: HEADER_CLASS });

        prependChild(this.boxElem, this.messageElem);
        prependChild(this.boxElem, this.headerElem);
        this.setTitle(this.props.title);
        this.setControls(this.props.btn);
        show(this.messageElem, true);

        this.elem.appendChild(this.scrollerElem);

        document.body.appendChild(this.elem);
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

        document.body.style.overflow = 'hidden';
        document.documentElement.scrollTop = 0;
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
        document.body.style.overflow = '';

        if (this.props.closeOnEmptyClick === true) {
            removeEmptyClick(this.emptyClickHandler);
        }
    }

    close() {
        this.hide();

        if (isFunction(this.onCloseHandler)) {
            this.onCloseHandler();
        }
    }

    // Add close button to the popup
    addCloseButton() {
        if (!this.boxElem || this.closeBtn) {
            return;
        }

        const icon = svg(
            'svg',
            { class: CLOSE_ICON_CLASS, viewBox: '0,0,14,14' },
            svg('path', { d: CLOSE_ICON }),
        );

        this.closeBtn = ce(
            'button',
            { className: CLOSE_BTN_CLASS, type: 'button' },
            icon,
            { click: () => this.close() },
        );
        this.headerElem.append(this.closeBtn);
    }

    // Remove close button
    removeCloseButton() {
        re(this.closeBtn);
        this.closeBtn = null;
    }

    setContent(content) {
        if (!content) {
            return false;
        }

        const newMessageObj = (typeof content === 'string')
            ? ce(
                'div',
                { className: MESSAGE_CLASS },
                ce('div', { innerHTML: content }),
            )
            : content;

        if (this.messageElem) {
            insertBefore(newMessageObj, this.messageElem);
            re(this.messageElem);
        }

        this.messageElem = newMessageObj;

        return true;
    }

    setTitle(title) {
        if (!title) {
            return;
        }

        if (!this.titleElem) {
            this.titleElem = ce('h1', { className: TITLE_CLASS });
            prependChild(this.headerElem, this.titleElem);
        }

        this.titleElem.textContent = title;
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
                this.controlsElem = ce('div', { className: CONTROLS_CLASS });
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
                    this.okBtn = ce('input', {
                        className: SUBMIT_BTN_CLASS,
                        type: 'button',
                        value: 'ok',
                    });
                }

                setParam(this.okBtn, controls.okBtn);
            }
        }

        if ('cancelBtn' in controls) {
            if (controls.cancelBtn === false && this.cancelBtn) {
                re(this.cancelBtn);
                this.cancelBtn = null;
            } else {
                if (!this.cancelBtn) {
                    this.cancelBtn = ce('input', {
                        className: CANCEL_BTN_CLASS,
                        type: 'button',
                        value: 'cancel',
                        onclick: this.close.bind(this),
                    });
                }

                setParam(this.cancelBtn, controls.cancelBtn);
            }
        }

        if (newHasControls) {
            addChilds(this.controlsElem, [this.okBtn, this.cancelBtn]);
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
