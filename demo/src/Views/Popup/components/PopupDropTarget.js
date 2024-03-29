import { px } from 'jezvejs';
import { getOffset } from '@jezvejs/dom';
import { DropTarget } from 'jezvejs/DragnDrop';
import { PopupDragAvatar } from './PopupDragAvatar.js';

/**
 * Popup drop target
 * Accept only PopupDragAvatar
 */
/* eslint-disable-next-line no-unused-vars */
export class PopupDropTarget extends DropTarget {
    onDragEnd(params) {
        const { avatar, ...rest } = params;
        if (!this.targetElem || !(avatar instanceof PopupDragAvatar)) {
            avatar.onDragCancel(rest);
            return;
        }

        this.hideHoverIndication();

        const avatarInfo = avatar.getDragInfo(params.e);
        avatar.onDragEnd();

        const elemToMove = avatarInfo.dragZoneElem;
        elemToMove.style.position = '';

        const offset = getOffset(this.elem);

        elemToMove.style.left = px(params.e.pageX - avatarInfo.mouseShift.x - offset.left);
        elemToMove.style.top = px(params.e.pageY - avatarInfo.mouseShift.y - offset.top);

        this.elem.appendChild(elemToMove);
        elemToMove.classList.remove('dragging');

        this.targetElem = null;
    }
}
