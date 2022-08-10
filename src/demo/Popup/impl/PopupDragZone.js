import { DragZone } from '../../../js/index.js';
import { PopupDragAvatar } from './PopupDragAvatar.js';

/** Draggable popup implementation */
export class PopupDragZone extends DragZone {
    static create(...args) {
        return new PopupDragZone(...args);
    }

    makeAvatar() {
        return new PopupDragAvatar(this, this.elem);
    }
}
