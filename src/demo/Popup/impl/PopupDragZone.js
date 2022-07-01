import { DragZone } from '../../../Components/DragnDrop/DragZone.js';
import { PopupDragAvatar } from './PopupDragAvatar.js';

/** Draggable popup implementation */
export class PopupDragZone extends DragZone {
    makeAvatar() {
        return new PopupDragAvatar(this, this.elem);
    }
}
