import { svg, insertBefore } from '../../js/common.js';
import { BaseChart } from './BaseChart.js';

/**
 * Base chart component constructor
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class LineChart extends BaseChart {
    constructor(props) {
        super(props);

        this.line = null;
        this.props.visibilityOffset = 2;
        this.props.scaleAroundAxis = false;

        this.init();
    }

    /** Create items with default scale */
    createItems() {
        const { barOuterWidth } = this;
        const dw = barOuterWidth / 2;

        this.items = this.state.data.values.map((val, index) => {
            const leftPos = index * barOuterWidth;
            const item = {
                value: val,
                dot: {
                    x: leftPos + dw,
                    y: this.grid.getY(val),
                },
            };

            item.elem = svg('circle', {
                cx: item.dot.x,
                cy: item.dot.y,
                r: 4,
            });
            item.elem.classList.add('linechart__item');
            this.container.appendChild(item.elem);

            return item;
        });

        this.drawPath();
    }

    /** Draw path currently saved at nodes */
    drawPath() {
        if (this.line) {
            this.line.parentNode.removeChild(this.line);
        }

        let p = '';
        for (let i = 0, l = this.items.length - 1; i < l; i += 1) {
            const { dot } = this.items[i];
            const ndot = this.items[i + 1].dot;

            if (!i) {
                p += `M${dot.x},${dot.y}`;
            }
            p += `L${ndot.x},${ndot.y}`;
        }

        this.line = svg('path', { d: p });
        this.line.classList.add('linechart__path');
        this.container.appendChild(this.line);
        if (this.items.length && this.items[0].elem) {
            insertBefore(this.line, this.items[0].elem);
        }
    }

    /** Update scale of path */
    updateItemsScale(items) {
        if (!Array.isArray(items)) {
            return;
        }

        // update height of bars
        items.forEach((item) => {
            const { dot } = item;

            dot.y = this.grid.getY(item.value);
            item.elem.setAttribute('cy', dot.y);
        });

        this.drawPath();
    }

    /** Global Charts object public methods */
    static create(props) {
        return new LineChart(props);
    }
}
