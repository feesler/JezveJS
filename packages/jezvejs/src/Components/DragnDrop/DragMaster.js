/* eslint no-unused-vars: "warn" */

/** Main drag and drop class */
export class DragMaster {
    static instance = null;

    static getInstance() {
        if (!this.instance) {
            this.instance = new DragMaster();
        }

        return this.instance;
    }

    constructor() {
        this.dragZone = null;
        this.avatar = null;
        this.dropTarget = null;
        this.touchTimeout = 0;
        this.touchMoveReady = false;
        this.handlers = null;
    }

    disableTextSelect() {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
    }

    enableTextSelect() {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
    }

    /** Set event handlers for document */
    addTouchEventHandlers() {
        if (!this.handlers) {
            return;
        }

        document.addEventListener('keydown', this.handlers.keydown);
        document.addEventListener('touchmove', this.handlers.touchmove, { passive: false });
        document.addEventListener('touchend', this.handlers.touchend);
        document.addEventListener('touchcancel', this.handlers.touchcancel);
        document.addEventListener('dragstart', this.handlers.dragstart);
        document.body.addEventListener('selectstart', this.handlers.selectstart);
        this.disableTextSelect();
    }

    /** Set event handlers for document */
    addDocumentEventHandlers() {
        if (!this.handlers) {
            return;
        }

        document.addEventListener('keydown', this.handlers.keydown);
        document.addEventListener('mousemove', this.handlers.mousemove);
        document.addEventListener('mouseup', this.handlers.mouseup);
        document.addEventListener('dragstart', this.handlers.dragstart);
        document.body.addEventListener('selectstart', this.handlers.selectstart);
    }

    /** Remove event handler from document */
    removeTouchEventHandlers() {
        if (!this.handlers) {
            return;
        }

        document.removeEventListener('keydown', this.handlers.keydown);
        document.removeEventListener('touchmove', this.handlers.touchmove);
        document.removeEventListener('touchend', this.handlers.touchend);
        document.removeEventListener('touchcancel', this.handlers.touchcancel);
        document.removeEventListener('dragstart', this.handlers.dragstart);
        document.body.removeEventListener('selectstart', this.handlers.selectstart);
        this.enableTextSelect();
    }

    /** Remove event handler from document */
    removeDocumentEventHandlers() {
        if (!this.handlers) {
            return;
        }

        document.removeEventListener('keydown', this.handlers.keydown);
        document.removeEventListener('mousemove', this.handlers.mousemove);
        document.removeEventListener('mouseup', this.handlers.mouseup);
        document.removeEventListener('dragstart', this.handlers.dragstart);
        document.body.removeEventListener('selectstart', this.handlers.selectstart);
    }

    /** Clean up drag objects */
    cleanUp() {
        this.dragZone = null;
        this.avatar = null;
        this.dropTarget = null;
    }

    /** Search for drag zone object */
    findDragZone(e) {
        let elem = e.target;

        while (elem !== document && !elem.dragZone) {
            elem = elem.parentNode;
        }

        return elem.dragZone;
    }

    /** Try to find drop target under mouse cursor */
    findDropTarget(e) {
        let elem = this.avatar.getTargetElem();

        while (elem !== document && !elem.dropTarget) {
            elem = elem.parentNode;
        }

        if (!elem.dropTarget) {
            return null;
        }

        return elem.dropTarget;
    }

    static getEventCoordinatesObject(e) {
        if (e.touches) {
            if (e.type === 'touchend' || e.type === 'touchcancel') {
                return e.changedTouches[0];
            }

            return e.touches[0];
        }

        return e;
    }

    static getEventPageCoordinates(e) {
        const coords = this.getEventCoordinatesObject(e);

        return {
            x: coords.pageX,
            y: coords.pageY,
        };
    }

    static getEventClientCoordinates(e) {
        const coords = this.getEventCoordinatesObject(e);

        return {
            x: coords.clientX,
            y: coords.clientY,
        };
    }

    initAvatar(e) {
        if (this.avatar) {
            return;
        }

        const coords = DragMaster.getEventPageCoordinates(e);
        if (!e.touches) {
            if (Math.abs(this.downX - coords.x) < 5 && Math.abs(this.downY - coords.y) < 5) {
                return;
            }
        }

        this.avatar = this.dragZone.onDragStart(this.downX, this.downY, e);
        if (!this.avatar) {
            this.cleanUp();
        }
    }

    handleMove(e) {
        if (!this.dragZone) {
            return;
        }

        if (!this.avatar) {
            this.initAvatar(e);
        }
        if (!this.avatar) {
            return;
        }

        this.avatar.onDragMove(e);

        const newDropTarget = this.findDropTarget(e);
        if (this.dropTarget !== newDropTarget) {
            if (this.dropTarget) {
                this.dropTarget.onDragLeave(newDropTarget, this.avatar, e);
            }
            if (newDropTarget) {
                newDropTarget.onDragEnter(this.dropTarget, this.avatar, e);
            }
        }

        this.dropTarget = newDropTarget;
        if (this.dropTarget) {
            this.dropTarget.onDragMove(this.avatar, e);
        }
    }

    /** Document mouse move event handler */
    mouseMove(e) {
        if (e.touches) {
            if (!this.touchMoveReady) {
                clearTimeout(this.touchTimeout);
                this.touchTimeout = 0;
                return;
            }
            e.preventDefault();
        }

        this.handleMove(e);
    }

    /** Document mouse up event handler */
    mouseUp(e) {
        if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
            this.touchTimeout = 0;
        }

        if (!e.touches) {
            if (e.which !== 1) {
                return false;
            }
        }

        if (this.avatar) {
            if (this.dropTarget) {
                this.dropTarget.onDragEnd(this.avatar, e);
            } else {
                this.avatar.onDragCancel(e);
            }
        }

        this.cleanUp();
        if (e.touches) {
            this.removeTouchEventHandlers();
        } else {
            this.removeDocumentEventHandlers();
        }

        return false;
    }

    /** Keydown event handler */
    onKey(e) {
        if (e.code === 'Escape') {
            if (this.avatar) {
                this.avatar.onDragCancel(e);
            }

            this.cleanUp();
            this.removeDocumentEventHandlers();
        }
    }

    /** Empty function return false */
    emptyFalse(e) {
        e.preventDefault();
    }

    /** Mouse down on drag object element event handler */
    mouseDown(e) {
        if (e.touches) {
            if (e.touches.length > 1) {
                return;
            }
        } else if (e.type === 'mousedown') {
            if (e.which !== 1) {
                return;
            }
        } else {
            return;
        }

        this.dragZone = this.findDragZone(e);
        if (!this.dragZone || !this.dragZone.isValidDragHandle(e.target)) {
            return;
        }

        const coord = DragMaster.getEventPageCoordinates(e);
        this.downX = coord.x;
        this.downY = coord.y;

        if (e.touches) {
            this.touchMoveReady = false;
            this.handlers = {
                keydown: (ev) => this.onKey(ev),
                touchmove: (ev) => this.mouseMove(ev),
                touchend: (ev) => this.mouseUp(ev),
                touchcancel: (ev) => this.mouseUp(ev),
                dragstart: (ev) => this.emptyFalse(ev),
                selectstart: (ev) => this.emptyFalse(ev),
            };
            this.addTouchEventHandlers();

            if (this.touchTimeout) {
                clearTimeout(this.touchTimeout);
                this.touchTimeout = 0;
            }

            const touchStartEvent = e;
            this.touchTimeout = setTimeout(() => {
                this.touchMoveReady = true;
                this.handleMove(touchStartEvent);
            }, 200);
        } else {
            this.handlers = {
                keydown: (ev) => this.onKey(ev),
                mousemove: (ev) => this.mouseMove(ev),
                mouseup: (ev) => this.mouseUp(ev),
                dragstart: (ev) => this.emptyFalse(ev),
                selectstart: (ev) => this.emptyFalse(ev),
            };
            this.addDocumentEventHandlers();
        }
    }

    static makeDraggable(elem) {
        const el = elem;

        const inst = this.getInstance();
        el.addEventListener('mousedown', (e) => inst.mouseDown(e));
        el.addEventListener('touchstart', (e) => inst.mouseDown(e));
    }

    static getElementUnderClientXY(elem, clientX, clientY) {
        const el = elem;
        const quirks = !elem.style.getPropertyValue; // IE < 9

        let display;
        let priority;
        if (quirks) {
            display = el.style.cssText;
            el.style.cssText += 'display: none!important';
        } else {
            display = el.style.getPropertyValue('display');
            priority = el.style.getPropertyPriority('display');
            el.style.setProperty('display', 'none', 'important');
        }

        let target = document.elementFromPoint(clientX, clientY);

        if (quirks) {
            el.style.cssText = display;
        } else {
            el.style.setProperty('display', display, priority);
        }

        if (!target || target === document) {
            target = document.body;
        }

        return target;
    }
}
