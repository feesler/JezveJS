import { DropTarget } from '../../DragnDrop/DropTarget.js';
import { RangeSliderDragAvatar } from './RangeSliderDragAvatar.js';

/**
 * X axis drop target
 */
export class RangeSliderDropTarget extends DropTarget {
    onDragEnd(params) {
        const { avatar, ...rest } = params;
        if (!this.targetElem || !(avatar instanceof RangeSliderDragAvatar)) {
            avatar.onDragCancel(rest);
            return;
        }

        this.hideHoverIndication();
        avatar.onDragEnd();

        this.targetElem = null;
    }
}
