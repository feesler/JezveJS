import { DragZone } from 'jezvejs/DragnDrop';
import { XAxisDragAvatar } from './XAxisDragAvatar.js';

/**
 * X axis drag zone
 */
export class XAxisDragZone extends DragZone {
    makeAvatar() {
        return XAxisDragAvatar.create({
            dragZone: this,
            elem: this.elem,
        });
    }
}
