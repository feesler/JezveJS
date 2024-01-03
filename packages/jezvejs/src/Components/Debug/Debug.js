import { isFunction } from '@jezvejs/types';
import { createElement } from '@jezvejs/dom';
import { Component } from '../../Component.js';
import '../../common.scss';
import './Debug.scss';

const defaultProps = {
    className: 'bottom left',
};

export class Debug extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        this.logElem = createElement('div', { className: 'log' });

        this.controls = createElement('div', {
            className: 'controls',
            children: [
                createElement('input', {
                    type: 'button',
                    value: 'Clear',
                    events: { click: () => this.clear() },
                }),
                createElement('input', {
                    type: 'button',
                    value: 'Close',
                    events: { click: () => this.close() },
                }),
            ],
        });

        this.elem = createElement('div', {
            className: 'debug',
            children: [this.logElem, this.controls],
        });

        this.setClassNames();
        document.body.append(this.elem);
    }

    /** Clear debug window */
    clear() {
        this.logElem.innerHTML = '';
    }

    /** Close debug window */
    close() {
        this.show(false);
    }

    /** Write text into debug window */
    log(textContent) {
        if (typeof textContent !== 'string') {
            return;
        }

        const message = createElement('div', { textContent });
        this.logElem.append(message);
        this.logElem.scrollTop = this.logElem.scrollHeight;
    }

    addControl(text, callback) {
        if (!text || !isFunction(callback)) {
            return null;
        }

        const control = createElement('input', {
            type: 'button',
            value: text,
            events: { click: callback },
        });
        this.controls.append(control);
        return control;
    }

    addInfo(textContent) {
        const info = createElement('span', { textContent });
        this.controls.append(info);
        return info;
    }
}
