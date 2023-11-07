import { isFunction } from '@jezvejs/types';
import { DragZone } from '../../DragnDrop/DragZone.js';
import { RangeSliderDragAvatar } from './RangeSliderDragAvatar.js';

const availAxis = ['x', 'y'];

const defalutProps = {
    mouseMoveThreshold: 0,
    touchMoveTimeout: 0,
    axis: 'x', // possible values: 'x' or 'y'
    onChange: null,
};

/**
 * Range slider drag zone
 */
export class RangeSliderDragZone extends DragZone {
    constructor(props = {}) {
        super({
            ...defalutProps,
            ...props,
        });

        if (!availAxis.includes(this.props.axis)) {
            throw new Error('Invalid axis value');
        }
    }

    get axis() {
        return this.props.axis;
    }

    onPosChange(pos) {
        if (isFunction(this.props.onChange)) {
            this.props.onChange(pos);
        }
    }

    makeAvatar() {
        return RangeSliderDragAvatar.create({
            dragZone: this,
            elem: this.elem,
        });
    }
}
