import { getOffset } from '@jezvejs/dom';
import { DragMaster } from '../../DragnDrop/DragMaster.js';
import { DragAvatar } from '../../DragnDrop/DragAvatar.js';

/**
 * Slider drag avatar
 */
export class SliderDragAvatar extends DragAvatar {
    initFromEvent(downX, downY, e) {
        const { allowMouse, allowTouch } = this.dragZone;
        const isTouch = !!e.touches;
        if (
            (isTouch && !allowTouch)
            || (!isTouch && !allowMouse)
        ) {
            return false;
        }

        this.dragZoneElem = this.dragZone.getElement();
        const elem = this.dragZoneElem;
        this.elem = elem;

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
        this.lastTime = e.timeStamp;
        this.velocity = 0;

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
        const coord = DragMaster.getEventPageCoordinates(e);
        this.currentTargetElem = this.dragZoneElem;

        const position = this.getPositionForCoordinates(coord);
        const distance = this.position - position;
        this.position = position;

        const duration = e.timeStamp - this.lastTime;
        this.lastTime = e.timeStamp;

        this.velocity = (duration === 0) ? 0 : ((this.distance - distance) / duration);
        this.distance = distance;

        if (Math.abs(distance) > 0) {
            this.dragZone.updatePosition(this.position);
        }
    }
}
