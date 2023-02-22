import { DragZone } from 'jezvejs/DragnDrop';
import { XAxisDragAvatar } from './XAxisDragAvatar.js';

const defalutProps = {
    mouseMoveThreshold: 0,
    touchMoveTimeout: 0,
};

/**
 * X axis drag zone
 */
export class XAxisDragZone extends DragZone {
    constructor(props = {}) {
        super({
            ...defalutProps,
            ...props,
        });
    }

    makeAvatar() {
        return XAxisDragAvatar.create({
            dragZone: this,
            elem: this.elem,
        });
    }
}
