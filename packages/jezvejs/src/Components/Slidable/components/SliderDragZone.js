import { isFunction } from '@jezvejs/types';
import { DragZone } from '../../DragnDrop/DragZone.js';
import { SliderDragAvatar } from './SliderDragAvatar.js';

const defalutProps = {
    mouseMoveThreshold: 0,
    touchMoveTimeout: 0,
    vertical: false,
    allowMouse: false,
    allowTouch: true,
    isReady: true,
    updatePosition: null,
};

/**
 * Slider drag zone
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

    get allowMouse() {
        return this.props.allowMouse;
    }

    get allowTouch() {
        return this.props.allowTouch;
    }

    isReady() {
        return isFunction(this.props.isReady) ? this.props.isReady() : true;
    }

    makeAvatar() {
        if (!this.isReady()) {
            return false;
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
