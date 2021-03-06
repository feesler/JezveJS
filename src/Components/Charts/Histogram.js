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

    /** Create items with default scale */
    createItems() {
        const { barOuterWidth } = this;
        const y0 = this.grid.getY(0);

        this.items = this.state.data.values.map((val, index) => {
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
        });
    }

    /** Update scale of items */
    updateItemsScale(items) {
        if (!Array.isArray(items)) {
            return;
        }

        const y0 = this.grid.getY(0);
        items.forEach((item) => {
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
