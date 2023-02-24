import { getOffset } from '../../../js/common.js';
import { DragMaster } from '../../DragnDrop/DragMaster.js';
import { DragAvatar } from '../../DragnDrop/DragAvatar.js';

const ANIMATE_CLASS = 'animate';

/**
 * Drag original element only by x axis
 */
export class SliderDragAvatar extends DragAvatar {
    initFromEvent(downX, downY) {
        this.dragZoneElem = this.dragZone.getElement();
        const elem = this.dragZoneElem;
        this.elem = elem;
        this.elem.classList.remove(ANIMATE_CLASS);

        this.rect = this.dragZoneElem.getBoundingClientRect();
        this.offset = this.dragZoneElem.offsetParent.getBoundingClientRect();

        const offset = getOffset(this.dragZoneElem);
        this.shiftX = downX - offset.left;
        this.shiftY = downY - offset.top;

        this.position = this.getPositionForCoordinates({
            x: downX,
            y: downY,
        });
        this.distance = 0;

        return true;
    }

    getPositionForCoordinates(coords) {
        return (this.dragZone.vertical)
            ? coords.y - this.offset.top - this.shiftY
            : coords.x - this.offset.left - this.shiftX;
    }

    /**
     * Move avatag element on mouse move
     * @param {Event} e - event object
     */
    onDragMove(e) {
        const client = DragMaster.getEventClientCoordinates(e);
        this.currentTargetElem = this.dragZoneElem;

        const position = (this.dragZone.vertical)
            ? client.y - this.offset.top - this.shiftY
            : client.x - this.offset.left - this.shiftX;

        this.distance = this.position - position;
        this.position = position;

        this.dragZone.updatePosition(this.position);
    }
}
