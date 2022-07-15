import { getOffset, px } from '../../js/index.js';
import { SortableDragAvatar } from './SortableDragAvatar.js';

// Sortable table drag avatar
export class SortableTableDragAvatar extends SortableDragAvatar {
    initFromEvent(downX, downY, e) {
        this.dragZoneElem = this.dragZone.findDragZoneItem(e.target);
        if (!this.dragZoneElem) {
            return false;
        }

        this.initialPos = this.getSortPosition();
        const tbl = this.dragZoneElem.closest('table').cloneNode(false);
        tbl.appendChild(this.dragZoneElem.cloneNode(true));

        const elem = tbl;
        this.elem = elem;

        const offset = getOffset(this.dragZoneElem);
        this.shiftX = downX - offset.left;
        this.shiftY = downY - offset.top;

        if (this.dragZone.params.copyWidth) {
            let srcCell = this.dragZoneElem.querySelector('td');
            let destCell = tbl.querySelector('td');
            while (srcCell && destCell) {
                const tmp = destCell.firstElementChild;

                tmp.style.width = px(srcCell.offsetWidth);

                srcCell = srcCell.nextElementSibling;
                destCell = destCell.nextElementSibling;
            }

            elem.style.width = px(this.dragZoneElem.offsetWidth);
        }

        this.dragZoneElem.classList.add(this.dragZone.getPlaceholder());

        document.body.appendChild(elem);
        elem.style.zIndex = 9999;
        elem.style.position = 'absolute';

        return true;
    }
}
