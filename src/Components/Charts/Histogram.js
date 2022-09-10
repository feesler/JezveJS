import { svg } from '../../js/common.js';
import { BaseChart } from './BaseChart.js';

/* CSS classes */
const BAR_CLASS = 'histogram__bar';
const CATEGORY_CLASS = 'histogram--cat-';

/**
 * Base chart component constructor
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class Histogram extends BaseChart {
    constructor(props) {
        super(props);

        this.props.visibilityOffset = 1;
        this.props.scaleAroundAxis = true;

        this.init();
    }

    /** Find item by event object */
    findItemByEvent(e) {
        const result = super.findItemByEvent(e);
        if (!Array.isArray(result.item)) {
            return result;
        }

        const groupX = this.barOuterWidth * result.index;
        const innerX = result.x - groupX;
        const barWidth = this.state.barWidth / result.item.length;
        let item = null;
        let index = Math.floor(innerX / barWidth);
        if (index >= 0 && index < result.item.length) {
            item = result.item[index];
        } else {
            index = -1;
        }

        const res = {
            item,
            index,
            group: result.item,
            groupIndex: result.index,
        };

        return res;
    }

    /** Set new position of item */
    setItemPos(item, y, height) {
        const bar = item;

        if (bar.y === y && bar.height === height) {
            return;
        }

        if (this.props.autoScale && this.props.animate) {
            bar.elem.style.y = this.formatCoord(y, true);
            bar.elem.style.height = this.formatCoord(height, true);
        } else {
            bar.elem.setAttribute('y', y);
            bar.elem.setAttribute('height', height);
        }

        bar.y = y;
        bar.height = height;
    }

    createItem({
        value,
        width,
        index,
        categoryIndex = 0,
    }) {
        const { y0 } = this.state;

        const fixedValue = value ?? 0;
        const y1 = this.grid.getY(fixedValue);

        const item = {
            value: fixedValue,
            x: index * this.barOuterWidth + categoryIndex * width,
            y: Math.min(y0, y1),
            width,
            height: Math.abs(y0 - y1),
        };

        item.elem = svg('rect', {
            class: BAR_CLASS,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
        });
        if (categoryIndex > 0) {
            const categoryClass = `${CATEGORY_CLASS}${categoryIndex}`;
            item.elem.classList.add(categoryClass);
        }

        this.content.append(item.elem);

        return item;
    }

    /** Create items with default scale */
    createItems() {
        const dataSets = this.getDataSets();
        if (dataSets.length === 0) {
            return;
        }

        this.state.y0 = this.grid.getY(0);
        const width = this.state.barWidth / dataSets.length;

        this.removeAllItems();
        const [firstSet] = dataSets;
        firstSet.forEach((_, index) => {
            const group = dataSets.map(
                (data, categoryIndex) => this.createItem({
                    value: data[index],
                    width,
                    index,
                    categoryIndex,
                }),
            );
            this.items.push(group);
        });
    }

    /** Update scale of items */
    updateItemsScale(items) {
        if (!Array.isArray(items)) {
            return;
        }

        const y0 = this.grid.getY(0);
        items.flat().forEach((item) => {
            const y1 = this.grid.getY(item.value);
            const newY = Math.min(y0, y1);
            const barHeight = Math.abs(y0 - y1);

            this.setItemPos(item, newY, barHeight);
        });
    }

    /** Global Charts object public methods */
    static create(props) {
        return new Histogram(props);
    }
}
