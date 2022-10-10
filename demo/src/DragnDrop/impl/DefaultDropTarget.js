import { DropTarget } from 'jezvejs/DropTarget';
import { DefaultDragAvatar } from './DefaultDragAvatar.js';

/**
 * Default drop target
 */
export class DefaultDropTarget extends DropTarget {
    static create(...args) {
        return new DefaultDropTarget(...args);
    }

    onDragEnd(avatar, e) {
        if (!this.targetElem || !(avatar instanceof DefaultDragAvatar)) {
            avatar.onDragCancel();
            return;
        }

        this.hideHoverIndication();
        const avatarInfo = avatar.getDragInfo(e);
        avatar.onDragEnd();

        const elemToMove = avatarInfo.dragZoneElem;
        elemToMove.style.position = '';
        this.elem.appendChild(elemToMove);

        this.targetElem = null;
    }
}
