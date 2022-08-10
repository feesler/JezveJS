import { DragZone } from '../../../js/index.js';
import { DefaultDragAvatar } from './DefaultDragAvatar.js';
import { OriginalDragAvatar } from './OriginalDragAvatar.js';

/**
 * Default drag zone
 */
export class DefaultDragZone extends DragZone {
    static create(...args) {
        return new DefaultDragZone(...args);
    }

    makeAvatar() {
        if (this.params && this.params.dragOriginal === true) {
            return new OriginalDragAvatar(this, this.elem);
        }

        return new DefaultDragAvatar(this, this.elem);
    }
}
