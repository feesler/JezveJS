import { DragZone } from 'jezvejs/DragZone';
import { PopupDragAvatar } from './PopupDragAvatar.js';

/** Draggable popup implementation */
export class PopupDragZone extends DragZone {
    static create(...args) {
        return new PopupDragZone(...args);
    }

    makeAvatar() {
        return PopupDragAvatar.create({ dragZone: this, elem: this.elem });
    }
}
