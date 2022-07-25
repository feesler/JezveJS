import {
    getOffset,
    px,
    DragMaster,
    DropTarget,
} from '../../../js/index.js';
import { OriginalDragAvatar } from './OriginalDragAvatar.js';

/**
 * Original drop target
 * Accept only OriginalDragAvatar
 */
export class OriginalDropTarget extends DropTarget {
    onDragEnd(avatar, e) {
        if (!this.targetElem || !(avatar instanceof OriginalDragAvatar)) {
            avatar.onDragCancel();
            return;
        }

        this.hideHoverIndication();

        const avatarInfo = avatar.getDragInfo(e);
        avatar.onDragEnd();

        const elemToMove = avatarInfo.dragZoneElem;
        elemToMove.style.position = '';

        const offset = getOffset(this.elem);

        const page = DragMaster.getEventPageCoordinates(e);
        elemToMove.style.left = px(page.x - avatarInfo.mouseShift.x - offset.left);
        elemToMove.style.top = px(page.y - avatarInfo.mouseShift.y - offset.top);

        this.elem.appendChild(elemToMove);

        this.targetElem = null;
    }
}
