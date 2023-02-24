import { isFunction } from '../../../js/common.js';
import { DropTarget } from '../../DragnDrop/DropTarget.js';
import { SliderDragAvatar } from './SliderDragAvatar.js';

const defaultProps = {
    onDragEnd: null,
};

/**
 * X axis drop target
 */
export class SliderDropTarget extends DropTarget {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });
    }

    onDragEnd(avatar, e) {
        if (!this.targetElem || !(avatar instanceof SliderDragAvatar)) {
            avatar.onDragCancel(e);
            return;
        }

        const { position, distance } = avatar;
        avatar.onDragEnd();

        if (isFunction(this.props.onDragEnd)) {
            this.props.onDragEnd(position, distance);
        }

        this.targetElem = null;
    }
}
