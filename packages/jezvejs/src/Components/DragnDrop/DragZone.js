import { asArray, ge, isObject } from '../../js/common.js';
import { DragMaster } from './DragMaster.js';

const defaultProps = {
    handles: null,
    mouseMoveThreshold: 5,
    touchMoveTimeout: 200,
};

/**
 * Drag start zone class
 * Handle drag start event and make avatar
 * @param {Object} props - properties object
 * @param {Element} props.elem - element to create drag zone
 */
export class DragZone {
    static create(...args) {
        return new this(...args);
    }

    constructor(props = {}) {
        if (!props?.elem) {
            throw new Error('Invalid element specified');
        }

        this.elem = props.elem;
        this.elem.dragZone = this;

        this.props = {
            ...defaultProps,
            ...props,
        };

        DragMaster.makeDraggable(this.elem);
    }

    /** Returns mouse move threshold */
    get mouseMoveThreshold() {
        return this.props.mouseMoveThreshold;
    }

    /** Returns touch move timeout */
    get touchMoveTimeout() {
        return this.props.touchMoveTimeout;
    }

    /** Returns element of drag zone */
    getElement() {
        return this.elem;
    }

    /** Returns avatar specific for zone */
    makeAvatar() { }

    /**
     * Drag start handler
     * Return avatar object or false
     * @param {Number} downX - x coordinate of mouse down point
     * @param {Number} downY - y coordinate of mouse down point
     * @param {Event} event - event object
     */
    onDragStart(downX, downY, event) {
        const avatar = this.makeAvatar();

        if (!avatar?.initFromEvent(downX, downY, event)) {
            return false;
        }

        return avatar;
    }

    /**
     * Check specified targer element is valid
     * @param {Element} target - element to check
     */
    isValidDragHandle(target) {
        if (!target) {
            return false;
        }

        // allow to drag using whole drag zone in case no handles is set
        if (!this.props.handles) {
            return true;
        }

        const handles = asArray(this.props.handles);

        return handles.some((hnd) => {
            let elem;
            if (isObject(hnd) && (hnd.elem || hnd.query)) {
                if (hnd.query) {
                    const qres = this.elem.querySelectorAll(hnd.query);
                    elem = Array.from(qres);
                } else if (typeof hnd === 'string') {
                    elem = ge(hnd.elem);
                } else {
                    elem = hnd.elem;
                }
            } else if (typeof hnd === 'string') {
                elem = ge(hnd);
            } else {
                elem = hnd;
            }

            elem = asArray(elem);

            return elem.some((el) => (
                el
                && (
                    el === target
                    || (
                        isObject(hnd)
                        && hnd.includeChilds
                        && el.contains(target)
                    )
                )
            ));
        });
    }
}
