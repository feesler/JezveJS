import {
    isFunction,
    comparePosition,
    insertAfter,
    insertBefore,
} from '../../js/common.js';
import { DropTarget } from '../DragnDrop/DropTarget.js';
import { SortableDragAvatar } from './SortableDragAvatar.js';

/* eslint-disable no-bitwise, no-unused-vars */

const defaultProps = {
    group: null,
};

// Sortable drop target
export class SortableDropTarget extends DropTarget {
    constructor(...args) {
        super(...args);

        this.props = {
            ...defaultProps,
            ...this.props,
        };
    }

    getTargetElem(avatar, event) {
        let el = avatar.getTargetElem();
        const dragInfo = avatar.getDragInfo();
        const itemSelector = dragInfo.dragZone.getItemSelector();
        const phItemClass = dragInfo.dragZone.getPlaceholder();
        const root = dragInfo.dragZone.getElement();

        while (el && el !== root) {
            if ((isFunction(el.matches) && el.matches(itemSelector))
                || (el.classList && el.classList.contains(phItemClass))) {
                return el;
            }

            el = el.parentNode;
        }

        return null;
    }

    onDragMove(avatar, event) {
        const newTargetElem = this.getTargetElem(avatar, event);
        if (this.targetElem === newTargetElem) {
            return;
        }

        this.hideHoverIndication(avatar);
        this.targetElem = newTargetElem;
        this.showHoverIndication(avatar);

        const dragInfo = avatar.getDragInfo();
        if (
            !this.targetElem
            || !(avatar instanceof SortableDragAvatar)
            || (dragInfo.dragZone.getGroup() !== this.props.group)
        ) {
            return;
        }

        const nodeCmp = comparePosition(this.targetElem, dragInfo.dragZoneElem);
        if (!nodeCmp) {
            return;
        }

        // check drop target is already a placeholder
        if (this.targetElem.classList.contains(dragInfo.dragZone.getPlaceholder())) {
            const pos = avatar.getSortPosition();
            // swap drag zone with drop target
            if (nodeCmp & 2) {
                insertAfter(dragInfo.dragZoneElem, this.targetElem);
            } else if (nodeCmp & 4) {
                insertBefore(dragInfo.dragZoneElem, this.targetElem);
            }

            if (this.targetElem !== pos.prev && this.targetElem !== pos.next) {
                if (pos.prev) {
                    insertAfter(this.targetElem, pos.prev);
                } else {
                    insertBefore(this.targetElem, pos.next);
                }
            }
        } else if (dragInfo.dragZoneElem.parentNode !== this.targetElem.parentNode) {
            insertBefore(dragInfo.dragZoneElem, this.targetElem);
        } else if (nodeCmp & 2) {
            /* drag zone element is after current drop target */
            insertAfter(dragInfo.dragZoneElem, this.targetElem);
        } else if (nodeCmp & 4) {
            /* drag zone element is before current drop target */
            insertBefore(dragInfo.dragZoneElem, this.targetElem);
        }

        avatar.saveSortTarget(this);
    }

    onDragEnd(avatar, e) {
        if (!this.targetElem || !(avatar instanceof SortableDragAvatar)) {
            avatar.onDragCancel(e);
            return;
        }

        this.hideHoverIndication();

        this.applySort(avatar, e);

        this.targetElem = null;
    }

    onDragCancel(avatar, e) {
        if (e?.type === 'keydown') {
            this.cancelSort(avatar, e);
        } else {
            this.applySort(avatar, e);
        }
    }

    applySort(avatar, e) {
        const avatarInfo = avatar.getDragInfo(e);
        avatar.onDragEnd();

        if (!avatarInfo.sortTarget) {
            return;
        }

        const newPos = avatar.getSortPosition();
        if (avatarInfo.initialPos.prev !== newPos.prev
            && avatarInfo.initialPos.next !== newPos.next) {
            avatarInfo.dragZone.onInsertAt(avatarInfo.dragZoneElem, avatarInfo.sortTarget);
        }
    }

    cancelSort(avatar, e) {
        const avatarInfo = avatar.getDragInfo(e);
        avatar.onDragEnd();

        const { initialPos, dragZoneElem } = avatarInfo;
        if (initialPos.prev) {
            insertAfter(dragZoneElem, initialPos.prev);
        } else {
            insertBefore(dragZoneElem, initialPos.next);
        }
    }
}
