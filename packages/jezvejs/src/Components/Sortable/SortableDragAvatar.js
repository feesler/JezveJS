import { re, getOffset } from '@jezvejs/dom';
import { px } from '../../common.js';
import { DragAvatar } from '../DragnDrop/DragAvatar.js';

/* eslint no-unused-vars: "warn" */

// Sortable drag avatar
export class SortableDragAvatar extends DragAvatar {
    initFromEvent(downX, downY, e) {
        // Overwrite drag zone here to find exact item to manipulate
        this.dragZoneElem = this.dragZone.findDragZoneItem(e.target);
        if (!this.dragZoneElem) {
            return false;
        }

        this.initialPos = this.getSortPosition();
        const elem = this.dragZoneElem.cloneNode(true);
        this.elem = elem;

        const offset = getOffset(this.dragZoneElem);
        this.shiftX = downX - offset.left;
        this.shiftY = downY - offset.top;
        this.width = this.dragZoneElem.offsetWidth;
        this.height = this.dragZoneElem.offsetHeight;

        this.dragZoneElem.classList.add(this.dragZone.getPlaceholder());

        if (this.dragZone.props.copyWidth) {
            const width = px(this.dragZoneElem.offsetWidth);
            elem.style.setProperty('width', width, 'important');
        }

        document.body.appendChild(elem);
        elem.style.zIndex = 9999;
        elem.style.position = 'absolute';

        elem.classList.add(this.dragZone.getDragClass());

        return true;
    }

    destroy() {
        re(this.elem);

        this.dragZoneElem.classList.remove(this.dragZone.getPlaceholder());
    }

    onDragCancel(e) {
        if (this.dropTarget) {
            this.dropTarget.onDragCancel(this, e);
        }

        this.destroy();
    }

    onDragEnd() {
        this.destroy();
    }

    saveSortTarget(dropTarget) {
        this.dropTarget = dropTarget;
        this.sortTarget = dropTarget.targetElem;
    }

    getSortPosition() {
        return {
            prev: this.dragZoneElem.previousElementSibling,
            next: this.dragZoneElem.nextElementSibling,
        };
    }

    // Return drag information object for DropTarget
    getDragInfo() {
        const info = super.getDragInfo();

        return {
            ...info,
            sortTarget: this.sortTarget,
            initialPos: this.initialPos,
        };
    }
}
