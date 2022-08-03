import { svg } from '../../js/common.js';
import { BaseChart } from './BaseChart.js';

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
        if (!Array.isArray(result)) {
            return result;
        }

        const x = e.clientX - this.containerOffset.left + this.chartContent.scrollLeft;
        const groupIndex = Math.floor(x / this.barOuterWidth);
        if (groupIndex < 0 || groupIndex >= this.items.length) {
            return null;
        }

        const groupX = this.barOuterWidth * groupIndex;
        const innerX = x - groupX;
        const innerBarWidth = this.state.barWidth / result.length;
        const index = Math.floor(innerX / innerBarWidth);
        if (index < 0 || index >= result.length) {
            return null;
        }

        return result[index];
    }

    /** Create items with default scale */
    createItems() {
        const { barOuterWidth } = this;
        const y0 = this.grid.getY(0);

        this.items = this.state.data.values.map((val, index) => {
            if (Array.isArray(val)) {
                const innerBarWidth = this.state.barWidth / val.length;

                return val.map((innerVal, innerIndex) => {
                    const leftPos = index * barOuterWidth + innerIndex * innerBarWidth;
                    const y1 = this.grid.getY(innerVal);
                    const barHeight = Math.abs(y0 - y1);
                    const y = Math.min(y0, y1);

                    const item = { value: innerVal };

                    item.elem = svg('rect', {
                        class: 'histogram__bar',
                        x: leftPos,
                        y,
                        width: innerBarWidth,
                        height: barHeight,
                    });
                    if (innerIndex > 0) {
                        const categoryClass = `histogram__bar--cat-${innerIndex}`;
                        item.elem.classList.add(categoryClass);
                    }

                    this.container.appendChild(item.elem);

                    return item;
                });
            } else {
                const leftPos = index * barOuterWidth;
                const y1 = this.grid.getY(val);
                const barHeight = Math.abs(y0 - y1);
                const y = Math.min(y0, y1);

                const item = { value: val };

                item.elem = svg('rect', {
                    class: 'histogram__bar',
                    x: leftPos,
                    y,
                    width: this.state.barWidth,
                    height: barHeight,
                });
                this.container.appendChild(item.elem);

                return item;
            }
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

            item.elem.setAttribute('y', newY);
            item.elem.setAttribute('height', barHeight);
        });
    }

    /** Global Charts object public methods */
    static create(props) {
        return new Histogram(props);
    }
}
