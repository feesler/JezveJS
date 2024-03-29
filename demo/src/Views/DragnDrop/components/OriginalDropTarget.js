import { px } from 'jezvejs';
import { getOffset } from '@jezvejs/dom';
import { DragMaster, DropTarget } from 'jezvejs/DragnDrop';
import { OriginalDragAvatar } from './OriginalDragAvatar.js';

/**
 * Original drop target
 * Accept only OriginalDragAvatar
 */
export class OriginalDropTarget extends DropTarget {
    onDragEnd(params) {
        const { avatar, ...rest } = params;
        if (!this.targetElem || !(avatar instanceof OriginalDragAvatar)) {
            avatar.onDragCancel(rest);
            return;
        }

        this.hideHoverIndication();

        const avatarInfo = avatar.getDragInfo(params.e);
        avatar.onDragEnd();

        const elemToMove = avatarInfo.dragZoneElem;
        elemToMove.style.position = '';
        elemToMove.style.zIndex = '';

        const offset = getOffset(this.elem);
        const border = {
            top: this.elem.clientTop,
            left: this.elem.clientLeft,
        };

        const page = DragMaster.getEventPageCoordinates(params.e);
        elemToMove.style.left = px(page.x - avatarInfo.mouseShift.x - offset.left - border.left);
        elemToMove.style.top = px(page.y - avatarInfo.mouseShift.y - offset.top - border.top);

        this.elem.appendChild(elemToMove);

        this.targetElem = null;
    }
}
