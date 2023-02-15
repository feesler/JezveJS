import { DropTarget } from 'jezvejs/DragnDrop';
import { XAxisDragAvatar } from './XAxisDragAvatar.js';

/**
 * X axis drop target
 */
export class XAxisDropTarget extends DropTarget {
    onDragEnd(avatar, e) {
        if (!this.targetElem || !(avatar instanceof XAxisDragAvatar)) {
            avatar.onDragCancel(e);
            return;
        }

        this.hideHoverIndication();
        avatar.onDragEnd();

        this.targetElem = null;
    }
}
