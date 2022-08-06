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

        const y = e.offsetY;
        const diffs = result.map((item, index) => ({ index, diff: Math.abs(y - item.dot.y) }));
        diffs.sort((a, b) => a.diff - b.diff);

        const itemIndex = diffs[0].index;
        if (itemIndex < 0 || itemIndex >= result.length) {
            return null;
        }

        return result[itemIndex];
    }

    getCoordinates(value, index) {
        const { barOuterWidth } = this;
        return {
            x: index * barOuterWidth + barOuterWidth / 2,
            y: this.grid.getY(value),
        };
    }

    createItem({ value, index, categoryIndex = 0 }) {
        const item = {
            value,
            dot: this.getCoordinates(value, index),
        };

        item.elem = svg('circle', {
            cx: item.dot.x,
            cy: item.dot.y,
            r: 4,
        });
        item.elem.classList.add('linechart__item');
        if (categoryIndex > 0) {
            const categoryClass = `linechart__item--cat-${categoryIndex}`;
            item.elem.classList.add(categoryClass);
        }

        this.container.appendChild(item.elem);

        return item;
    }

    /** Create items with default scale */
    createItems() {
        const dataSets = this.getDataSets();
        if (dataSets.length === 0) {
            return;
        }

        this.items = [];
        const [firstSet] = dataSets;
        firstSet.forEach((_, index) => {
            const group = dataSets.map(
                (data, categoryIndex) => this.createItem({
                    value: data[index],
                    index,
                    categoryIndex,
                }),
            );
            this.items.push(group);
        });

        this.renderPaths();
    }

    /** Draw path currently saved at nodes */
    drawPath(values, categoryIndex = 0) {
        const coords = values.map((value, index) => {
            const point = this.getCoordinates(value, index);
            return `${point.x},${point.y}`;
        });

        const path = svg('path', { d: `M${coords.join('L')}` });
        path.classList.add('linechart__path');
        if (categoryIndex > 0) {
            const categoryClass = `linechart--cat-${categoryIndex}`;
            path.classList.add(categoryClass);
        }

        this.container.appendChild(path);
        // Insert path before circles
        const group = this.items[0];
        const groupItems = Array.isArray(group) ? group : [group];
        insertBefore(path, groupItems[0].elem);

        return path;
    }

    renderPaths() {
        const dataSets = this.getDataSets();
        if (dataSets.length === 0) {
            return;
        }

        this.removeElements(this.paths);
        this.paths = dataSets.map((values, index) => this.drawPath(values, index));
    }

    /** Update scale of path */
    updateItemsScale(items) {
        if (!Array.isArray(items)) {
            return;
        }

        // update height of bars
        items.flat().forEach((item) => {
            const { dot } = item;

            dot.y = this.grid.getY(item.value);
            item.elem.setAttribute('cy', dot.y);
        });

        this.renderPaths();
    }

    /** Global Charts object public methods */
    static create(props) {
        return new LineChart(props);
    }
}
