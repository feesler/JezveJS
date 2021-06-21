import { px } from '../../js/common.js';
import { dragMaster } from './index.js';

/* eslint no-unused-vars: "warn" */

/**
 * Drag object class constructor
 * @param {DragZone} dragZone - parent DragZone of avatar
 * @param {Element} dragElem - original element related to avatar
 */
export class DragAvatar {
    constructor(dragZone, dragElem) {
        this.dragZone = dragZone;
        this.dragZoneElem = dragElem;
        this.elem = dragElem; // element of avatar
    }

    /**
     * Initialize drag element and set up position
     * @param {Number} downX - x coordinate of mouse down point
     * @param {Number} downY - y coordinate of mouse down point
     * @param {Event} e - event object
     */
    initFromEvent(downX, downY, e) { }

    /** Return drag information object for DropTarget */
    getDragInfo() {
        return {
            elem: this.elem,
            dragZoneElem: this.dragZoneElem,
            dragZone: this.dragZone,
            mouseShift: {
                x: this.shiftX,
                y: this.shiftY,
            },
        };
    }

    /** Return current deepest element under avatar */
    getTargetElem() {
        return this.currentTargetElem;
    }

    /** Scroll document if needed on drag avatar to top or bottom of screen */
    scrollDocument(coords) {
        const scrollMargin = 30;
        const docElem = document.documentElement;

        if (coords.y > docElem.clientHeight - scrollMargin) {
            if (docElem.scrollTop + docElem.clientHeight === docElem.scrollHeight) {
                return;
            }

            docElem.scrollTop += scrollMargin;
        } else if (coords.y < scrollMargin) {
            if (docElem.scrollTop === 0) {
                return;
            }

            docElem.scrollTop -= scrollMargin;
        }
    }

    /**
     * Move avatag element on mouse move
     * Also save current element under avatar
     * @param {Event} e - event object
     */
    onDragMove(e) {
        const page = dragMaster.getEventPageCoordinates(e);
        const client = dragMaster.getEventClientCoordinates(e);

        this.elem.style.left = px(page.x - this.shiftX);
        this.elem.style.top = px(page.y - this.shiftY);

        this.currentTargetElem = dragMaster.getElementUnderClientXY(
            this.elem,
            client.x,
            client.y,
        );

        this.scrollDocument(client);
    }

    /** Drop fail handler */
    onDragCancel() { }

    /** Success drop handler */
    onDragEnd() { }
}
