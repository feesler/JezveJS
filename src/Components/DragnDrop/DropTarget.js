/* eslint no-unused-vars: "warn" */

/**
 * Drop target class constructor
 * @param {Element} elem - element to create drop target at
 * @param {Object} params - properties object
 */
export class DropTarget {
    constructor(elem, params) {
        this.elem = elem;
        this.elem.dropTarget = this;
        this.targetElem = null; // target element under avatar
        this.params = params;
    }

    /**
     * Return target element under avatar
     * @param {DragAvatar} avatar - avatar object
     * @param {Event} e - event object
     */
    getTargetElem(avatar, e) {
        return this.elem;
    }

    /** Hide hover indication of current drop target */
    hideHoverIndication(avatar) { }

    /** Show hover indication of current drop target */
    showHoverIndication(avatar) { }

    /**
     * Avatar move event handler
     * @param {DragAvatar} avatar - drag avatar object
     * @param {Event} e - event object
     */
    onDragMove(avatar, e) {
        const newTargetElem = this.getTargetElem(avatar, e);

        if (this.targetElem !== newTargetElem) {
            this.hideHoverIndication(avatar);
            this.targetElem = newTargetElem;
            this.showHoverIndication(avatar);
        }
    }

    /**
     * Drag end event handler
     * Should get avatar.getDragInfo() and check possibility of drop
     * Call avatar.onDragEnd() or avatar.onDragCancel()
     * After all process this._targetElem must be nulled
     * @param {DragAvatar} avatar - drag avatar object
     * @param {Event} e - event object
     */
    onDragEnd(avatar, e) {
        this.hideHoverIndication(avatar);
        this.targetElem = null;
    }

    /** Avatar enter to target event handler */
    onDragEnter(fromDropTarget, avatar, event) { }

    /** Avatar leave form target event handler */
    onDragLeave(toDropTarget, avatar, event) {
        this.hideHoverIndication();
        this.targetElem = null;
    }
}
