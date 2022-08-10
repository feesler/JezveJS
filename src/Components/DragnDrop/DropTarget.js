/* eslint no-unused-vars: "warn" */

/**
 * Drop target class constructor
 * @param {Object} props - properties object
 * @param {Element} props.elem - element to create drop target at
 */
export class DropTarget {
    static create(...args) {
        return new DropTarget(...args);
    }

    constructor(props = {}) {
        this.props = { ...props };

        this.elem = this.props.elem;
        this.elem.dropTarget = this;
        this.targetElem = null; // target element under avatar
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
