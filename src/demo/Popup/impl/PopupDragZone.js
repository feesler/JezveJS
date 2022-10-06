import { DragZone } from '../../../Components/DragnDrop/DragZone.js';
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
