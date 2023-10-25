import { re, getOffset } from '@jezvejs/dom';
import { DragAvatar } from 'jezvejs/DragnDrop';

/**
 * Default drag avatar
 * Clone original element and make it semitransparent
 */
export class DefaultDragAvatar extends DragAvatar {
    /* eslint-disable-next-line no-unused-vars */
    initFromEvent(downX, downY, e) {
        this.dragZoneElem = this.dragZone.getElement();
        const elem = this.dragZoneElem.cloneNode(true);
        this.elem = elem;

        const offset = getOffset(this.dragZoneElem);
        this.shiftX = downX - offset.left;
        this.shiftY = downY - offset.top;

        document.body.appendChild(elem);
        elem.style.zIndex = 9999;
        elem.style.position = 'absolute';
        elem.classList.add('semitransp');

        return true;
    }

    destroy() {
        re(this.elem);
    }

    onDragCancel() {
        this.destroy();
    }

    onDragEnd() {
        this.destroy();
    }
}
