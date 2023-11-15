import { getOffset } from '@jezvejs/dom';
import { minmax, px } from '../../../common.js';
import { DragAvatar } from '../../DragnDrop/DragAvatar.js';
import { DragMaster } from '../../DragnDrop/DragMaster.js';

/**
 * Drag original element only by x axis
 */
export class RangeSliderDragAvatar extends DragAvatar {
    initFromEvent(downX, downY) {
        this.dragZoneElem = this.dragZone.getElement();
        const elem = this.dragZoneElem;
        this.elem = elem;

        this.rect = this.dragZoneElem.getBoundingClientRect();
        this.offset = this.dragZoneElem.offsetParent.getBoundingClientRect();

        const offset = getOffset(this.dragZoneElem);
        const { axis } = this.dragZone;
        if (axis === 'x') {
            this.shiftX = downX - offset.left;
            this.origLeft = elem.offsetLeft;
        } else if (axis === 'y') {
            this.shiftY = downY - offset.top;
            this.origTop = elem.offsetTop;
        }

        return true;
    }

    /**
     * Move avatag element on mouse move
     * @param {Event} e - event object
     */
    onDragMove(e) {
        const client = DragMaster.getEventClientCoordinates(e);
        this.currentTargetElem = this.dragZoneElem;
        const { axis } = this.dragZone;
        let pos;
        let maxPos;

        if (axis === 'x') {
            const x = client.x - this.offset.left - this.shiftX;
            maxPos = Math.round(this.offset.width - this.rect.width);
            pos = minmax(0, maxPos, x);
        } else if (axis === 'y') {
            const y = client.y - this.offset.top - this.shiftY;
            maxPos = Math.round(this.offset.height - this.rect.height);
            pos = minmax(0, maxPos, y);
        }

        this.dragZone.onPosChange(pos, maxPos);
    }

    onDragCancel() {
        const { axis } = this.dragZone;
        if (axis === 'x') {
            this.elem.style.left = px(this.origLeft);
        } else if (axis === 'y') {
            this.elem.style.top = px(this.origTop);
        }
    }
}
