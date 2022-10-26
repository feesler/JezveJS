import { getOffset, px } from 'jezvejs';
import { DropTarget } from 'jezvejs/DropTarget';
import { PopupDragAvatar } from './PopupDragAvatar.js';

/**
 * Popup drop target
 * Accept only PopupDragAvatar
 */
/* eslint-disable-next-line no-unused-vars */
export class PopupDropTarget extends DropTarget {
    onDragEnd(avatar, e) {
        if (!this.targetElem || !(avatar instanceof PopupDragAvatar)) {
            avatar.onDragCancel(e);
            return;
        }

        this.hideHoverIndication();

        const avatarInfo = avatar.getDragInfo(e);
        avatar.onDragEnd();

        const elemToMove = avatarInfo.dragZoneElem;
        elemToMove.style.position = '';

        const offset = getOffset(this.elem);

        elemToMove.style.left = px(e.pageX - avatarInfo.mouseShift.x - offset.left);
        elemToMove.style.top = px(e.pageY - avatarInfo.mouseShift.y - offset.top);

        this.elem.appendChild(elemToMove);
        elemToMove.classList.remove('dragging');

        this.targetElem = null;
    }
}
