import { removeEvents, setEvents } from '../../js/common.js';

/** Main drag and drop class */
export class DragMaster {
    static instance = null;

    static getInstance() {
        if (!this.instance) {
            this.instance = new DragMaster();
        }

        return this.instance;
    }

    static getElementUnderClientXY(elem, clientX, clientY) {
        const display = elem.style.getPropertyValue('display');
        const priority = elem.style.getPropertyPriority('display');
        elem.style.setProperty('display', 'none', 'important');

        let target = document.elementFromPoint(clientX, clientY);

        elem.style.setProperty('display', display, priority);

        if (!target || target === document) {
            target = document.body;
        }

        return target;
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

    static makeDraggable(elem) {
        const inst = this.getInstance();
        inst.makeDraggable(elem);
    }

    constructor() {
        this.dragZone = null;
        this.avatar = null;
        this.dropTarget = null;
        this.isTouch = false;
        this.touchTimeout = 0;
        this.touchMoveReady = false;

        this.handlers = {
            keydown: (e) => this.onKey(e),
            start: (e) => this.mouseDown(e),
            move: (e) => this.mouseMove(e),
            end: (e) => this.mouseUp(e),
            cancel: (e) => this.mouseUp(e),
            preventDefault: (e) => e.preventDefault(),
        };

        this.touchEvents = {
            move: 'touchmove',
            end: 'touchend',
            cancel: 'touchcancel',
        };

        this.mouseEvents = {
            move: 'mousemove',
            end: 'mouseup',
        };
    }

    makeDraggable(elem) {
        if (!elem) {
            throw new Error('Invalid element');
        }

        setEvents(elem, {
            mousedown: this.handlers.start,
            touchstart: this.handlers.start,
        });
    }

    /** Returns true if event is valid to start drag */
    isValidStartEvent(e) {
        return (
            (e.type === 'touchstart' && e.touches?.length === 1)
            || (e.type === 'mousedown' && e.which === 1)
        );
    }

    disableTextSelect() {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
    }

    enableTextSelect() {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
    }

    /** Returns event handlers object except 'move' and 'selectstart' */
    getEventHandlers() {
        const { move, end, cancel } = (this.isTouch) ? this.touchEvents : this.mouseEvents;
        const events = {
            keydown: this.handlers.keydown,
            [move]: {
                listener: this.handlers.move,
                options: { passive: false },
            },
            [end]: this.handlers.end,
            dragstart: this.handlers.preventDefault,
        };
        if (cancel) {
            events[cancel] = this.handlers.cancel;
        }

        return events;
    }

    /** Sets event handlers */
    setupHandlers() {
        const events = this.getEventHandlers();
        setEvents(document, events);
        setEvents(document.body, { selectstart: this.handlers.preventDefault });

        if (this.isTouch) {
            this.disableTextSelect();
        }
    }

    /** Removes event handlers */
    removeHandlers() {
        const events = this.getEventHandlers();
        removeEvents(document, events);
        removeEvents(document.body, { selectstart: this.handlers.preventDefault });

        if (this.isTouch) {
            this.enableTextSelect();
        }
    }

    /** Clean up drag objects */
    cleanUp() {
        this.dragZone = null;
        this.avatar = null;
        this.dropTarget = null;
    }

    /** Sets touch move timeout */
    initTouchMove(e) {
        this.resetMoveTimeout();

        this.touchMoveReady = (this.dragZone.touchMoveTimeout <= 0);
        if (this.touchMoveReady) {
            this.handleMove(e);
            return;
        }

        this.touchTimeout = setTimeout(() => {
            this.touchMoveReady = true;
            this.handleMove(e);
        }, this.dragZone.touchMoveTimeout);
    }

    /** Clears touch move timeout */
    resetMoveTimeout() {
        if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
            this.touchTimeout = 0;
        }
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
    findDropTarget() {
        let elem = this.avatar.getTargetElem();
        while (elem !== document && !elem.dropTarget) {
            elem = elem.parentNode;
        }

        return elem.dropTarget ?? null;
    }

    initAvatar(e) {
        if (this.avatar) {
            return;
        }

        if (!this.isTouch) {
            const coords = DragMaster.getEventPageCoordinates(e);
            const { mouseMoveThreshold } = this.dragZone;
            if (
                Math.abs(this.downX - coords.x) < mouseMoveThreshold
                && Math.abs(this.downY - coords.y) < mouseMoveThreshold
            ) {
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
        if (this.isTouch) {
            if (!this.touchMoveReady) {
                this.resetMoveTimeout();
                return;
            }

            if (e.cancelable) {
                e.preventDefault();
            }
        }

        this.handleMove(e);
    }

    /** Document mouse up event handler */
    mouseUp(e) {
        if (!this.isTouch && e.which !== 1) {
            return;
        }

        this.resetMoveTimeout();

        if (this.avatar) {
            if (this.dropTarget) {
                this.dropTarget.onDragEnd(this.avatar, e);
            } else {
                this.avatar.onDragCancel(e);
            }
        }

        this.cleanUp();
        this.removeHandlers();
    }

    /** Keydown event handler */
    onKey(e) {
        if (e.code === 'Escape') {
            if (this.avatar) {
                this.avatar.onDragCancel(e);
            }

            this.cleanUp();
            this.removeHandlers();
        }
    }

    /** Mouse down on drag object element event handler */
    mouseDown(e) {
        if (!this.isValidStartEvent(e)) {
            return;
        }

        this.isTouch = e.type === 'touchstart';

        this.dragZone = this.findDragZone(e);
        if (!this.dragZone?.isValidDragHandle(e.target)) {
            return;
        }

        const coord = DragMaster.getEventPageCoordinates(e);
        this.downX = coord.x;
        this.downY = coord.y;

        this.setupHandlers();

        if (this.isTouch) {
            this.initTouchMove(e);
        }
    }
}
