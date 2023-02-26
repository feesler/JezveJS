import { getOffset, minmax, px } from 'jezvejs';
import { DragAvatar, DragMaster } from 'jezvejs/DragnDrop';

/**
 * Drag original element only by x axis
 */
export class XAxisDragAvatar extends DragAvatar {
    initFromEvent(downX) {
        this.dragZoneElem = this.dragZone.getElement();
        const elem = this.dragZoneElem;
        this.elem = elem;

        this.rect = this.dragZoneElem.getBoundingClientRect();
        this.offset = this.dragZoneElem.offsetParent.getBoundingClientRect();

        const offset = getOffset(this.dragZoneElem);
        this.shiftX = downX - offset.left;

        this.origLeft = elem.offsetLeft;

        return true;
    }

    /**
     * Move avatag element on mouse move
     * @param {Event} e - event object
     */
    onDragMove(e) {
        const client = DragMaster.getEventClientCoordinates(e);
        this.currentTargetElem = this.dragZoneElem;

        const x = client.x - this.offset.left - this.shiftX;
        const maxPos = Math.round(this.offset.width - this.rect.width);
        const left = minmax(0, maxPos, x);
        this.elem.style.left = px(left);
    }

    onDragCancel() {
        this.elem.style.left = px(this.origLeft);
    }
}
