import { DropTarget } from 'jezvejs/DragnDrop';
import { XAxisDragAvatar } from './XAxisDragAvatar.js';

/**
 * X axis drop target
 */
export class XAxisDropTarget extends DropTarget {
    onDragEnd(params) {
        const { avatar, ...rest } = params;
        if (!this.targetElem || !(avatar instanceof XAxisDragAvatar)) {
            avatar.onDragCancel(rest);
            return;
        }

        this.hideHoverIndication();
        avatar.onDragEnd();

        this.targetElem = null;
    }
}
