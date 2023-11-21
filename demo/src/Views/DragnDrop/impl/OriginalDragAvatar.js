import { px } from 'jezvejs';
import { getOffset } from '@jezvejs/dom';
import { DragAvatar } from 'jezvejs/DragnDrop';

/**
 * Original drag avatar
 * Drag original element instead of clone
 * @param {*} dragZone
 * @param {*} dragElem
 */
export class OriginalDragAvatar extends DragAvatar {
    /* eslint-disable-next-line no-unused-vars */
    initFromEvent(downX, downY, e) {
        this.dragZoneElem = this.dragZone.getElement();
        const elem = this.dragZoneElem;
        this.elem = elem;

        const offset = getOffset(this.dragZoneElem);
        this.shiftX = downX - offset.left;
        this.shiftY = downY - offset.top;

        this.parentElem = elem.parentNode;
        this.origLeft = elem.offsetLeft;
        this.origTop = elem.offsetTop;

        document.body.appendChild(elem);
        elem.style.zIndex = 9999;
        elem.style.position = 'absolute';

        return true;
    }

    destroy() {
        this.elem?.remove();
    }

    onDragCancel() {
        this.parentElem.appendChild(this.elem);
        this.elem.style.position = '';
        this.elem.style.zIndex = '';
        this.elem.style.left = px(this.origLeft);
        this.elem.style.top = px(this.origTop);
    }

    onDragEnd() {
        this.destroy();
    }
}
