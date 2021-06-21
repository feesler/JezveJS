/* eslint no-unused-vars: "warn" */

/** Main drag and drop class */
export const dragMaster = (function () {
    let dragZone;
    let avatar;
    let dropTarget;
    let downX;
    let downY;
    let touchTimeout = 0;
    let touchMoveReady = false;
    let handlers = null;

    function disableTextSelect() {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
    }

    function enableTextSelect() {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
    }

    /** Set event handlers for document */
    function addTouchEventHandlers() {
        if (!handlers) {
            return;
        }

        document.addEventListener('keydown', handlers.keydown);
        document.addEventListener('touchmove', handlers.touchmove, { passive: false });
        document.addEventListener('touchend', handlers.touchend);
        document.addEventListener('touchcancel', handlers.touchcancel);
        document.addEventListener('dragstart', handlers.dragstart);
        document.body.addEventListener('selectstart', handlers.selectstart);
        disableTextSelect();
    }

    /** Set event handlers for document */
    function addDocumentEventHandlers() {
        if (!handlers) {
            return;
        }

        document.addEventListener('keydown', handlers.keydown);
        document.addEventListener('mousemove', handlers.mousemove);
        document.addEventListener('mouseup', handlers.mouseup);
        document.addEventListener('dragstart', handlers.dragstart);
        document.body.addEventListener('selectstart', handlers.selectstart);
    }

    /** Remove event handler from document */
    function removeTouchEventHandlers() {
        if (!handlers) {
            return;
        }

        document.removeEventListener('keydown', handlers.keydown);
        document.removeEventListener('touchmove', handlers.touchmove);
        document.removeEventListener('touchend', handlers.touchend);
        document.removeEventListener('touchcancel', handlers.touchcancel);
        document.removeEventListener('dragstart', handlers.dragstart);
        document.body.removeEventListener('selectstart', handlers.selectstart);
        enableTextSelect();
    }

    /** Remove event handler from document */
    function removeDocumentEventHandlers() {
        if (!handlers) {
            return;
        }

        document.removeEventListener('keydown', handlers.keydown);
        document.removeEventListener('mousemove', handlers.mousemove);
        document.removeEventListener('mouseup', handlers.mouseup);
        document.removeEventListener('dragstart', handlers.dragstart);
        document.body.removeEventListener('selectstart', handlers.selectstart);
    }

    /** Clean up drag objects */
    function cleanUp() {
        dragZone = null;
        avatar = null;
        dropTarget = null;
    }

    /** Search for drag zone object */
    function findDragZone(e) {
        let elem = e.target;

        while (elem !== document && !elem.dragZone) {
            elem = elem.parentNode;
        }

        return elem.dragZone;
    }

    /** Try to find drop target under mouse cursor */
    function findDropTarget(e) {
        let elem = avatar.getTargetElem();

        while (elem !== document && !elem.dropTarget) {
            elem = elem.parentNode;
        }

        if (!elem.dropTarget) {
            return null;
        }

        return elem.dropTarget;
    }

    function getEventCoordinatesObject(e) {
        if (e.touches) {
            if (e.type === 'touchend' || e.type === 'touchcancel') {
                return e.changedTouches[0];
            }

            return e.touches[0];
        }

        return e;
    }

    function getEventPageCoordinates(e) {
        const coords = getEventCoordinatesObject(e);

        return {
            x: coords.pageX,
            y: coords.pageY,
        };
    }

    function getEventClientCoordinates(e) {
        const coords = getEventCoordinatesObject(e);

        return {
            x: coords.clientX,
            y: coords.clientY,
        };
    }

    function initAvatar(e) {
        if (avatar) {
            return;
        }

        const coords = getEventPageCoordinates(e);
        if (!e.touches) {
            if (Math.abs(downX - coords.x) < 5 && Math.abs(downY - coords.y) < 5) {
                return;
            }
        }

        avatar = dragZone.onDragStart(downX, downY, e);
        if (!avatar) {
            cleanUp();
        }
    }

    function handleMove(e) {
        if (!dragZone) {
            return;
        }

        if (!avatar) {
            initAvatar(e);
        }
        if (!avatar) {
            return;
        }

        avatar.onDragMove(e);

        const newDropTarget = findDropTarget(e);
        if (dropTarget !== newDropTarget) {
            if (dropTarget) {
                dropTarget.onDragLeave(newDropTarget, avatar, e);
            }
            if (newDropTarget) {
                newDropTarget.onDragEnter(dropTarget, avatar, e);
            }
        }

        dropTarget = newDropTarget;
        if (dropTarget) {
            dropTarget.onDragMove(avatar, e);
        }
    }

    /** Document mouse move event handler */
    function mouseMove(e) {
        if (e.touches) {
            if (!touchMoveReady) {
                clearTimeout(touchTimeout);
                touchTimeout = 0;
                return;
            }
            e.preventDefault();
        }

        handleMove(e);
    }

    /** Document mouse up event handler */
    function mouseUp(e) {
        if (touchTimeout) {
            clearTimeout(touchTimeout);
            touchTimeout = 0;
        }

        if (!e.touches) {
            if (e.which !== 1) {
                return false;
            }
        }

        if (avatar) {
            if (dropTarget) {
                dropTarget.onDragEnd(avatar, e);
            } else {
                avatar.onDragCancel();
            }
        }

        cleanUp();
        if (e.touches) {
            removeTouchEventHandlers();
        } else {
            removeDocumentEventHandlers();
        }

        return false;
    }

    /** Keydown event handler */
    function onKey(e) {
        if (e.code === 'Escape') {
            if (avatar) {
                avatar.onDragCancel();
            }

            cleanUp();
            removeDocumentEventHandlers();
        }
    }

    /** Empty function return false */
    function emptyFalse(e) {
        e.preventDefault();
    }

    /** Mouse down on drag object element event handler */
    function mouseDown(e) {
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

        dragZone = findDragZone(e);
        if (!dragZone || !dragZone.isValidDragHandle(e.target)) {
            return;
        }

        const coord = getEventPageCoordinates(e);
        downX = coord.x;
        downY = coord.y;

        if (e.touches) {
            touchMoveReady = false;
            handlers = {
                keydown: onKey,
                touchmove: mouseMove,
                touchend: mouseUp,
                touchcancel: mouseUp,
                dragstart: emptyFalse,
                selectstart: emptyFalse,
            };
            addTouchEventHandlers();

            if (touchTimeout) {
                clearTimeout(touchTimeout);
                touchTimeout = 0;
            }

            const touchStartEvent = e;
            touchTimeout = setTimeout(() => {
                touchMoveReady = true;
                handleMove(touchStartEvent);
            }, 200);
        } else {
            handlers = {
                keydown: onKey,
                mousemove: mouseMove,
                mouseup: mouseUp,
                dragstart: emptyFalse,
                selectstart: emptyFalse,
            };
            addDocumentEventHandlers();
        }
    }

    // Check pointer is mouse
    function isMousePointer(e) {
        if (typeof e.pointerType === 'undefined') {
            return true;
        }

        let pointerType;
        if (typeof e.pointerType === 'string') {
            pointerType = e.pointerType;
        } else if (e.pointerType === 2) { /* IE 10 MSPOINTER_TYPE_TOUCH */
            pointerType = 'touch';
        } else if (e.pointerType === 3) { /* IE 10 MSPOINTER_TYPE_PEN */
            pointerType = 'pen';
        } else if (e.pointerType === 4) { /* IE 10 MSPOINTER_TYPE_MOUSE */
            pointerType = 'mouse';
        }

        return (pointerType === 'mouse');
    }

    return {
        makeDraggable(elem) {
            const el = elem;
            el.addEventListener('mousedown', mouseDown);
            el.addEventListener('touchstart', mouseDown);

            if (typeof el.onpointerdown !== 'undefined') {
                el.onpointerdown = isMousePointer;
            } else {
                el.onmspointerdown = isMousePointer;
            }
        },

        getElementUnderClientXY(elem, clientX, clientY) {
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
        },

        getEventPageCoordinates(e) {
            return getEventPageCoordinates(e);
        },

        getEventClientCoordinates(e) {
            return getEventClientCoordinates(e);
        },
    };
}());
