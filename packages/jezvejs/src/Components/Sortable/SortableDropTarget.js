import {
    comparePosition,
    insertAfter,
    insertBefore,
    hasFlag,
} from '../../js/common.js';
import { DropTarget } from '../DragnDrop/DropTarget.js';
import { SortableDragAvatar } from './SortableDragAvatar.js';

/* eslint-disable no-bitwise, no-unused-vars */

const defaultProps = {
    group: null,
    tree: false,
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
        const containerSelector = dragInfo.dragZone.getContainerSelector();
        const phItemClass = dragInfo.dragZone.getPlaceholder();
        const root = dragInfo.dragZone.getElement();

        while (el && el !== root && !el.dragZone) {
            if (
                el.matches(itemSelector)
                || el.matches(containerSelector)
                || (el.classList && el.classList.contains(phItemClass))
            ) {
                return el;
            }

            el = el.parentNode;
        }

        return (el?.dragZone) ? el : null;
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
        const dragZoneBeforeTarget = hasFlag(nodeCmp, 2);
        const dragZoneAfterTarget = hasFlag(nodeCmp, 4);
        const dragZoneContainsTarget = hasFlag(nodeCmp, 8);
        const targetContainsDragZone = hasFlag(nodeCmp, 16);
        const itemSelector = dragInfo.dragZone.getItemSelector();
        const containerSelector = dragInfo.dragZone.getContainerSelector();
        const targetContainer = this.targetElem.querySelector(containerSelector);

        // check drop target is already a placeholder
        if (this.targetElem.classList.contains(dragInfo.dragZone.getPlaceholder())) {
            const pos = avatar.getSortPosition();
            // swap drag zone with drop target
            if (dragZoneBeforeTarget) {
                insertAfter(dragInfo.dragZoneElem, this.targetElem);
            } else if (dragZoneAfterTarget) {
                insertBefore(dragInfo.dragZoneElem, this.targetElem);
            }

            if (this.targetElem !== pos.prev && this.targetElem !== pos.next) {
                if (pos.prev) {
                    insertAfter(this.targetElem, pos.prev);
                } else {
                    insertBefore(this.targetElem, pos.next);
                }
            }
        } else if (
            dragInfo.dragZoneElem.parentNode !== this.targetElem.parentNode
            && !dragZoneContainsTarget
        ) {
            /* move between different containers */
            if (this.targetElem.dragZone && !targetContainsDragZone) {
                this.targetElem.append(dragInfo.dragZoneElem);
            } else if (
                this.props.tree
                && targetContainsDragZone
                && (this.targetElem.dragZone || this.targetElem.matches(containerSelector))
            ) {
                const parentItem = dragInfo.dragZoneElem.parentNode.closest(itemSelector);
                if (parentItem && parentItem !== this.targetElem) {
                    const rect = parentItem.getBoundingClientRect();
                    if (event.clientY >= rect.bottom) {
                        insertAfter(dragInfo.dragZoneElem, parentItem);
                    } else if (event.clientY <= rect.top) {
                        insertBefore(dragInfo.dragZoneElem, parentItem);
                    }
                }
            } else if (!this.targetElem.dragZone) {
                if (this.props.tree && this.targetElem.matches(containerSelector)) {
                    if (this.targetElem.childElementCount === 0) {
                        this.targetElem.append(dragInfo.dragZoneElem);
                    }
                } else {
                    insertBefore(dragInfo.dragZoneElem, this.targetElem);
                }
            }
        } else if (
            this.props.tree
            && targetContainer
            && targetContainer.childElementCount === 0
            && !dragZoneContainsTarget
        ) {
            /* new target element has empty container */
            targetContainer.append(dragInfo.dragZoneElem);
        } else if (dragZoneBeforeTarget && !dragZoneContainsTarget) {
            /* drag zone element is before new drop target */
            insertAfter(dragInfo.dragZoneElem, this.targetElem);
        } else if (dragZoneAfterTarget && !dragZoneContainsTarget) {
            /* drag zone element is after new drop target */
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
        if (
            avatarInfo.initialPos.prev !== newPos.prev
            || avatarInfo.initialPos.next !== newPos.next
        ) {
            avatarInfo.dragZone.onInsertAt(avatarInfo.dragZoneElem, avatarInfo.sortTarget, newPos);
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
