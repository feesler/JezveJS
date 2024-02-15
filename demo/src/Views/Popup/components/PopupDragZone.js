import { DragZone } from 'jezvejs/DragnDrop';
import { PopupDragAvatar } from './PopupDragAvatar.js';

/** Draggable popup implementation */
export class PopupDragZone extends DragZone {
    makeAvatar() {
        return PopupDragAvatar.create({ dragZone: this, elem: this.elem });
    }
}
