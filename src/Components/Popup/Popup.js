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
import '../../css/common.css';
import './popup.css';

const CLOSE_ICON = 'M 1.1415,2.4266 5.7838,7 1.1415,11.5356 2.4644,12.8585 7,8.2162 11.5734,12.8585 12.8585,11.5356 8.2162,7 12.8585,2.4266 11.5734,1.1415 7,5.7838 2.4644,1.1415 Z';

/**
 * Popup component constructor
 * @param {Object} params:
 * @param {String} params.id - identifier of element will be created for popup
 * @param {boolean} params.nodim - option to not dim background on popup appear
 * @param {Function} params.onclose - popup close event handler
 * @param {String|String[]} params.additional - list of additional CSS classes for popup
 * @param {String} params.title - title of popup
 * @param {Object} params.btn:
 * @param {Object|false} params.btn.okBtn - properties object. Remove if false
 * @param {Object|false} params.btn.cancelBtn - properties object. Remove if false
 * @param {Object|false} params.btn.closeBtn - properties object. Remove if false
 */
export class Popup extends Component {
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
        this.elem = ce('div', { className: 'popup' });
        show(this.elem, false);
        if ('id' in this.props) {
            this.elem.id = this.props.id;
        }

        if (this.props.nodim === true) {
            this.elem.classList.add('nodim');
        }

        this.emptyClickHandler = () => this.close();
        this.onCloseHandler = (isFunction(this.props.onclose)) ? this.props.onclose : null;

        if (!this.setContent(this.props.content)) {
            return false;
        }

        this.boxElem = ce('div', { className: 'popup__content-box' });
        this.contentElem = ce('div', { className: 'popup__content' }, this.boxElem);
        this.wrapperElem = ce('div', { className: 'popup__wrapper' }, this.contentElem);
        this.scrollerElem = ce('div', { className: 'popup__scroller' }, this.wrapperElem);

        if (Array.isArray(this.props.additional)
            || typeof this.props.additional === 'string') {
            const addClassNames = Array.isArray(this.props.additional)
                ? this.props.additional
                : this.props.additional.split(' ');

            addClassNames.forEach(function (cl) {
                this.contentElem.classList.add(cl);
            }, this);
        }

        prependChild(this.boxElem, this.messageElem);
        this.setTitle(this.props.title);
        this.setControls(this.props.btn);
        this.contentElem.appendChild(this.boxElem);
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

        this.closeBtn = ce(
            'button',
            { className: 'close-btn', type: 'button' },
            svg('svg', {}, svg('path', { d: CLOSE_ICON })),
            { click: this.close.bind(this) },
        );
        this.boxElem.appendChild(this.closeBtn);
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

        let newMessageObj;
        if (typeof content === 'string') {
            newMessageObj = ce(
                'div',
                { className: 'popup__message' },
                ce('div', { innerHTML: content }),
            );
        } else {
            newMessageObj = content;
        }

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
            this.titleElem = ce('h1', { className: 'popup__title' });
            prependChild(this.boxElem, this.titleElem);
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
                this.controlsElem = ce('div', { className: 'popup__controls' });
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
                        className: 'btn submit-btn',
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
                        className: 'btn cancel-btn',
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

    /** Static alias for Popup constructor */
    static create(props) {
        try {
            return new Popup(props);
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}
