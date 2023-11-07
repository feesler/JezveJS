import { DropTarget } from '../../DragnDrop/DropTarget.js';
import { RangeSliderDragAvatar } from './RangeSliderDragAvatar.js';

/**
 * X axis drop target
 */
export class RangeSliderDropTarget extends DropTarget {
    onDragEnd(avatar, e) {
        if (!this.targetElem || !(avatar instanceof RangeSliderDragAvatar)) {
            avatar.onDragCancel(e);
            return;
        }

        this.hideHoverIndication();
        avatar.onDragEnd();

        this.targetElem = null;
    }
}
