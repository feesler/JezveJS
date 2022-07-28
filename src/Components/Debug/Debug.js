import { ce, re } from '../../js/common.js';
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
        this.contobj = ce('div', { className: 'debug' });
        if (!this.contobj) {
            return;
        }

        const posOpt = props.position || 'bottom left';

        this.contobj.classList.add.apply(null, posOpt.split(' '));

        // Debug log window
        this.dbgdiv = this.contobj.appendChild(ce('div', { className: 'log' }));

        // Container of controls
        this.contobj.appendChild(ce('div', { className: 'controls' }, [
            ce('input', { type: 'button', value: 'Clear', onclick: () => this.clearDebug() }),
            ce('input', { type: 'button', value: 'Close', onclick: () => this.closeDebug() }),
        ]));

        document.body.appendChild(this.contobj);
    }

    addControl(text, callback) {
        if (!this.contobj || !this.contobj.firstElementChild) {
            return;
        }

        const controls = this.contobj.firstElementChild.nextElementSibling;
        if (!controls) {
            return;
        }

        controls.appendChild(ce('input', { type: 'button', value: text, onclick: callback }));
    }

    addInfo(text) {
        if (!this.contobj || !this.contobj.firstElementChild) {
            return;
        }

        const controls = this.contobj.firstElementChild.nextElementSibling;
        if (!controls) {
            return;
        }

        controls.appendChild(ce('span', { innerHTML: text }));
    }
}
