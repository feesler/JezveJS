import { ge, isObject } from '../../js/common.js';
import { DragMaster } from './DragMaster.js';

const defaultProps = {
    handles: null,
};

/**
 * Drag start zone class
 * Handle drag start event and make avatar
 * @param {Object} props - properties object
 * @param {Element} props.elem - element to create drag zone
 */
export class DragZone {
    static create(...args) {
        return new DragZone(...args);
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

    /** Return element of drag zone */
    getElement() {
        return this.elem;
    }

    /** Return avatar specific for zone */
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

        if (!avatar.initFromEvent(downX, downY, event)) {
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

        const hnds = this.props.handles;
        const handles = Array.isArray(hnds) ? hnds : [hnds];

        return handles.some((hnd) => {
            let elem;
            if (isObject(hnd) && (hnd.elem || hnd.query)) {
                if (hnd.query) {
                    const qres = this.elem.querySelectorAll(hnd.query);
                    elem = Array.from(qres);
                } else {
                    elem = ge(hnd.elem);
                }
            } else {
                elem = ge(hnd);
            }

            if (!Array.isArray(elem)) {
                elem = [elem];
            }

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