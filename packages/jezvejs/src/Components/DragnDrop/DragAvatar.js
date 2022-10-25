import { px } from '../../js/common.js';
import { DragMaster } from './DragMaster.js';

/* eslint no-unused-vars: "warn" */

/**
 * Drag object class constructor
 * @param {DragZone} dragZone - parent DragZone of avatar
 * @param {Element} dragElem - original element related to avatar
 */
export class DragAvatar {
    static create(...args) {
        return new this(...args);
    }

    constructor(props = {}) {
        if (!props?.elem) {
            throw new Error('Invalid element specified');
        }
        if (!props?.dragZone) {
            throw new Error('Invalid drag zone specified');
        }

        this.props = { ...props };

        this.dragZone = this.props.dragZone;
        this.dragZoneElem = this.props.elem;
        this.elem = this.props.elem; // element of avatar
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
        const page = DragMaster.getEventPageCoordinates(e);
        const client = DragMaster.getEventClientCoordinates(e);

        this.elem.style.left = px(page.x - this.shiftX);
        this.elem.style.top = px(page.y - this.shiftY);

        this.currentTargetElem = DragMaster.getElementUnderClientXY(
            this.elem,
            client.x,
            client.y,
        );

        this.scrollDocument(client);
    }

    /** Drop cancel handler */
    onDragCancel(e) { }

    /** Success drop handler */
    onDragEnd() { }
}
