import { isFunction } from '../../../js/common.js';
import { DragZone } from '../../DragnDrop/DragZone.js';
import { SliderDragAvatar } from './SliderDragAvatar.js';

const defalutProps = {
    mouseMoveThreshold: 0,
    touchMoveTimeout: 0,
    vertical: false,
    slideByMouse: false,
    slideByTouch: true,
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

    get slideByMouse() {
        return this.props.slideByMouse;
    }

    get slideByTouch() {
        return this.props.slideByTouch;
    }

    makeAvatar() {
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
