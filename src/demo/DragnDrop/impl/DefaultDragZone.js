import { DragZone } from '../../../Components/DragnDrop/DragZone.js';
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
        const avatarProps = {
            dragZone: this,
            elem: this.elem,
        };

        if (this.props.dragOriginal === true) {
            return new OriginalDragAvatar(avatarProps);
        }

        return DefaultDragAvatar.create(avatarProps);
    }
}
