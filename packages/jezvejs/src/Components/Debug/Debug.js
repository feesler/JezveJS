import { isFunction } from '@jezvejs/types';
import { createElement } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
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
        this.logElem = createElement('div', { props: { className: 'log' } });

        this.controls = createElement('div', {
            props: { className: 'controls' },
            children: [
                createElement('input', {
                    props: { type: 'button', value: 'Clear' },
                    events: { click: () => this.clear() },
                }),
                createElement('input', {
                    props: { type: 'button', value: 'Close' },
                    events: { click: () => this.close() },
                }),
            ],
        });

        this.elem = createElement('div', {
            props: { className: 'debug' },
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

        const message = createElement('div', { props: { textContent } });
        this.logElem.append(message);
        this.logElem.scrollTop = this.logElem.scrollHeight;
    }

    addControl(text, callback) {
        if (!text || !isFunction(callback)) {
            return null;
        }

        const control = createElement('input', {
            props: { type: 'button', value: text },
            events: { click: callback },
        });
        this.controls.append(control);
        return control;
    }

    addInfo(textContent) {
        const info = createElement('span', { props: { textContent } });
        this.controls.append(info);
        return info;
    }
}
