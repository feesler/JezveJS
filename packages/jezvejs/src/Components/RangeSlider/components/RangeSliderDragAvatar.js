import { getOffset } from '@jezvejs/dom';
import { minmax } from '../../../common.js';
import { DragAvatar } from '../../DragnDrop/DragAvatar.js';
import { DragMaster } from '../../DragnDrop/DragMaster.js';

/**
 * Drag original element only by selected axis
 */
export class RangeSliderDragAvatar extends DragAvatar {
    initFromEvent(downX, downY) {
        this.dragZoneElem = this.dragZone.getElement();
        const elem = this.dragZoneElem;
        this.elem = elem;

        this.rect = this.dragZoneElem.getBoundingClientRect();
        this.offset = this.dragZoneElem.offsetParent.getBoundingClientRect();

        const offset = getOffset(this.dragZoneElem);
        if (this.dragZone.axis === 'x') {
            this.shiftX = downX - offset.left;
            this.maxPos = Math.round(this.offset.width - this.rect.width);
        } else {
            this.shiftY = downY - offset.top;
            this.maxPos = Math.round(this.offset.height - this.rect.height);
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
        const pos = (this.dragZone.axis === 'x')
            ? (client.x - this.offset.left - this.shiftX)
            : (client.y - this.offset.top - this.shiftY);

        this.dragZone.onPosChange(minmax(0, this.maxPos, pos));
    }

    onDragCancel() {
        this.dragZone.onDragCancel();
    }
}
