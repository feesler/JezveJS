import { DragMaster } from '../../DragnDrop/DragMaster.js';
import { DragAvatar } from '../../DragnDrop/DragAvatar.js';

/**
 * Slider drag avatar
 */
export class SliderDragAvatar extends DragAvatar {
    initFromEvent({ downX, downY, e }) {
        const { allowMouse, allowTouch } = this.dragZone;
        const isTouch = !!e.touches;
        if (
            (isTouch && !allowTouch)
            || (!isTouch && !allowMouse)
        ) {
            return false;
        }

        const coord = DragMaster.getEventPageCoordinates(e);

        this.dragZoneElem = this.dragZone.getElement();
        const elem = this.dragZoneElem;
        this.elem = elem;

        this.rect = this.dragZoneElem.getBoundingClientRect();
        this.offset = {
            left: this.dragZoneElem.offsetLeft,
            top: this.dragZoneElem.offsetTop,
        };

        this.startPoint = { x: downX, y: downY };
        this.moved = false;
        this.shiftX = coord.x - this.offset.left;
        this.shiftY = coord.y - this.offset.top;

        this.position = this.getPositionForCoordinates(coord);
        this.origPosition = this.position;
        this.totalDistance = 0;
        this.distance = 0;
        this.lastTime = e.timeStamp;
        this.velocity = 0;

        return true;
    }

    getPositionForCoordinates(coords) {
        return (this.dragZone.vertical)
            ? (coords.y - this.shiftY)
            : (coords.x - this.shiftX);
    }

    isValidDragStartAngle(pointA, pointB) {
        const dx = pointA.x - pointB.x;
        const dy = pointA.y - pointB.y;
        if (dx === 0 && dy === 0) {
            return false;
        }

        const angle = Math.abs(Math.atan2(dy, -dx) / Math.PI) * 180;
        return (this.dragZone.vertical)
            ? (angle > 45 && angle < 135)
            : ((angle >= 0 && angle < 45) || (angle > 135 && angle <= 180));
    }

    /**
     * Move avatag element on mouse move
     * @param {Event} e - event object
     */
    onDragMove(e) {
        const coord = DragMaster.getEventPageCoordinates(e);
        const dx = this.startPoint.x - coord.x;
        const dy = this.startPoint.y - coord.y;
        if (dx === 0 && dy === 0) {
            return;
        }

        // On first move check angle
        if (!this.moved) {
            if (!this.isValidDragStartAngle(this.startPoint, coord)) {
                DragMaster.getInstance().cancelDrag(e);
                return;
            }

            this.moved = true;
        }

        this.currentTargetElem = this.dragZoneElem;

        const position = this.getPositionForCoordinates(coord);
        const distance = this.position - position;
        this.position = position;

        const duration = e.timeStamp - this.lastTime;
        this.lastTime = e.timeStamp;

        this.velocity = (duration === 0) ? 0 : ((this.distance - distance) / duration);
        this.distance = distance;

        this.totalDistance = this.origPosition - this.position;
        if (Math.abs(this.totalDistance) > 0) {
            this.dragZone.updatePosition(this.position);
        }
    }

    onDragCancel() {
        if (Math.abs(this.totalDistance) > 0) {
            this.dragZone.updatePosition(this.origPosition);
        }
    }
}
