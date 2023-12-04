import { isFunction } from '@jezvejs/types';
import { DropTarget } from '../../DragnDrop/DropTarget.js';
import { SliderDragAvatar } from './SliderDragAvatar.js';

const defaultProps = {
    onDragEnd: null,
};

/**
 * Slider drop target
 */
export class SliderDropTarget extends DropTarget {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });
    }

    onDragEnd(params) {
        const { avatar, ...rest } = params;
        if (!this.targetElem || !(avatar instanceof SliderDragAvatar)) {
            avatar.onDragCancel(rest);
            return;
        }

        const { position, totalDistance, velocity } = avatar;
        avatar.onDragEnd();

        if (Math.abs(totalDistance) > 0 && isFunction(this.props.onDragEnd)) {
            this.props.onDragEnd(position, totalDistance, velocity);
        }

        this.targetElem = null;
    }
}
