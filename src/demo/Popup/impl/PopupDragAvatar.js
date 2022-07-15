import { re, getOffset, px } from '../../../js/index.js';
import { DragAvatar } from '../../../Components/DragnDrop/DragAvatar.js';

/**
 * Popup drag avatar
 * Drag original element instead of clone
 */
export class PopupDragAvatar extends DragAvatar {
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
        elem.classList.add('dragging');

        return true;
    }

    destroy() {
        re(this.elem);
    }

    onDragCancel() {
        this.parentElem.appendChild(this.elem);
        this.elem.style.position = '';
        this.elem.style.left = px(this.origLeft);
        this.elem.style.top = px(this.origTop);
        this.elem.classList.remove('dragging');
    }

    onDragEnd() {
        this.destroy();
    }
}
