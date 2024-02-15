import { DropTarget } from 'jezvejs/DragnDrop';
import { DefaultDragAvatar } from './DefaultDragAvatar.js';

/**
 * Default drop target
 */
export class DefaultDropTarget extends DropTarget {
    onDragEnd(params) {
        const { avatar, ...rest } = params;
        if (!this.targetElem || !(avatar instanceof DefaultDragAvatar)) {
            avatar.onDragCancel(rest);
            return;
        }

        this.hideHoverIndication();
        const avatarInfo = avatar.getDragInfo(params.e);
        avatar.onDragEnd();

        const elemToMove = avatarInfo.dragZoneElem;
        elemToMove.style.position = '';
        this.elem.appendChild(elemToMove);

        this.targetElem = null;
    }
}
