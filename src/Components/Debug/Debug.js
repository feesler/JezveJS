import { createElement, re } from '../../js/common.js';
import '../../css/common.scss';
import './debug.scss';

export class Debug {
    constructor() {
        this.contobj = null;
        this.dbgdiv = null;
    }

    /** Clear debug window */
    clearDebug() {
        if (this.dbgdiv) {
            this.dbgdiv.innerHTML = '';
        }
    }

    /** Close debug window */
    closeDebug() {
        if (this.contobj) {
            re(this.contobj);
            this.dbgdiv = null;
            this.contobj = null;
        }
    }

    /** Write text into debug window */
    log(a) {
        if (this.dbgdiv && a) {
            this.dbgdiv.innerHTML += `${a}<br>`;
            this.dbgdiv.scrollTop = this.dbgdiv.scrollHeight;
        }
    }

    create(props = {}) {
        // Container
        if (this.contobj) {
            return;
        }
        this.contobj = createElement('div', { props: { className: 'debug' } });
        if (!this.contobj) {
            return;
        }

        const posOpt = props.position || 'bottom left';

        this.contobj.classList.add.apply(null, posOpt.split(' '));

        // Debug log window
        const logElem = createElement('div', { props: { className: 'log' } });
        this.dbgdiv = this.contobj.append(logElem);

        // Container of controls
        this.contobj.append(createElement('div', {
            props: { className: 'controls' },
            children: [
                createElement('input', {
                    props: { type: 'button', value: 'Clear' },
                    events: { click: () => this.clearDebug() },
                }),
                createElement('input', {
                    props: { type: 'button', value: 'Close' },
                    events: { click: () => this.closeDebug() },
                }),
            ],
        }));

        document.body.append(this.contobj);
    }

    addControl(text, callback) {
        if (!this.contobj || !this.contobj.firstElementChild) {
            return;
        }

        const controls = this.contobj.firstElementChild.nextElementSibling;
        if (!controls) {
            return;
        }

        controls.append(createElement('input', {
            props: { type: 'button', value: text },
            events: { click: callback },
        }));
    }

    addInfo(text) {
        const controls = this.contobj?.firstElementChild?.nextElementSibling;
        if (!controls) {
            return;
        }

        controls.append(createElement('span', { props: { innerHTML: text } }));
    }
}
