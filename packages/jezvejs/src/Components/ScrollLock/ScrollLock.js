/**
 * Document scroll lock helper class
 */
export class ScrollLock {
    static locked = false;

    static scrollTop = null;

    static lock() {
        if (this.locked) {
            return;
        }

        this.locked = true;

        const scrollElem = document.scrollingElement || document.body;
        this.scrollTop = scrollElem.scrollTop;

        const { style } = document.body;
        style.top = `-${this.scrollTop}px`;
        style.overflow = 'hidden';
        style.width = '100%';
        style.height = 'auto';
        style.position = 'fixed';
    }

    static unlock() {
        if (!this.locked) {
            return;
        }

        this.locked = false;

        const { style } = document.body;
        style.top = '';
        style.overflow = '';
        style.width = '';
        style.height = '';
        style.position = '';

        const scrollOptionsAvailable = 'scrollBehavior' in document.documentElement.style;
        if (scrollOptionsAvailable) {
            window.scrollTo({
                top: this.scrollTop,
                behavior: 'instant',
            });
        } else {
            window.scrollTo(0, this.scrollTop);
        }

        this.scrollTop = null;
    }

    static toggle() {
        if (this.locked) {
            this.unlock();
        } else {
            this.lock();
        }
    }
}
