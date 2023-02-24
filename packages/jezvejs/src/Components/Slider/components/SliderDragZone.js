import { isFunction } from '../../../js/common.js';
import { DragZone } from '../../DragnDrop/DragZone.js';
import { SliderDragAvatar } from './SliderDragAvatar.js';

const defalutProps = {
    mouseMoveThreshold: 0,
    touchMoveTimeout: 0,
    vertical: false,
    isReady: null,
    updatePosition: null,
};

/**
 * X axis drag zone
 */
export class SliderDragZone extends DragZone {
    constructor(props = {}) {
        super({
            ...defalutProps,
            ...props,
        });
    }

    get vertical() {
        return this.props.vertical;
    }

    isReady() {
        return isFunction(this.props.isReady) ? this.props.isReady() : true;
    }

    makeAvatar() {
        if (!this.isReady()) {
            return null;
        }

        return SliderDragAvatar.create({
            dragZone: this,
            elem: this.elem,
        });
    }

    updatePosition(position) {
        if (isFunction(this.props.updatePosition)) {
            this.props.updatePosition(position);
        }
    }
}
