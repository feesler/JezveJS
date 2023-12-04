import { isFunction } from '@jezvejs/types';
import { DragZone } from '../../DragnDrop/DragZone.js';
import { RangeSliderDragAvatar } from './RangeSliderDragAvatar.js';

const availAxis = ['x', 'y'];

const defalutProps = {
    mouseMoveThreshold: 0,
    touchMoveTimeout: 0,
    axis: 'x', // possible values: 'x' or 'y'
    onChange: null,
    onDragStart: null,
    onDragCancel: null,
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

    onDragStart(params) {
        const avatar = super.onDragStart(params);
        if (!avatar) {
            return avatar;
        }

        if (isFunction(this.props.onDragStart)) {
            this.props.onDragStart({ ...params, avatar });
        }

        return avatar;
    }

    onPosChange(pos) {
        if (isFunction(this.props.onChange)) {
            this.props.onChange(pos);
        }
    }

    onDragCancel() {
        if (isFunction(this.props.onDragCancel)) {
            this.props.onDragCancel();
        }
    }

    makeAvatar() {
        return RangeSliderDragAvatar.create({
            dragZone: this,
            elem: this.elem,
        });
    }
}
