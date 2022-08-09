import { svg, insertBefore } from '../../js/common.js';
import { BaseChart } from './BaseChart.js';

/* CSS classes */
const PATH_CLASS = 'linechart__path';
const ITEM_CLASS = 'linechart__item';
const CATEGORY_CLASS = 'linechart--cat-';

/**
 * Base chart component constructor
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class LineChart extends BaseChart {
    constructor(props) {
        super(props);

        this.paths = [];
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

    /** Set new position of item */
    setItemPos(item, y) {
        const point = item;

        if (point.dot.y === y) {
            return;
        }

        if (this.props.autoScale && this.props.animate) {
            point.elem.style.cy = this.formatCoord(y, true);
        } else {
            point.elem.setAttribute('cy', y);
        }

        point.dot.y = y;
    }

    createItem({ value, index, categoryIndex = 0 }) {
        const item = {
            value,
            dot: this.getCoordinates(value, index),
        };

        item.elem = svg('circle', {
            class: ITEM_CLASS,
            cx: item.dot.x,
            cy: item.dot.y,
            r: 4,
        });

        if (categoryIndex > 0) {
            const categoryClass = `${CATEGORY_CLASS}${categoryIndex}`;
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

    formatPath(points) {
        const coords = points.map((point) => {
            const x = this.formatCoord(point.x);
            const y = this.formatCoord(point.y);
            return `${x}, ${y}`;
        });

        return `M ${coords.join(' ')}`;
    }

    /** Draw path currently saved at nodes */
    drawPath(values, categoryIndex = 0) {
        const { barOuterWidth } = this;

        const coords = values.map((value, index) => ({
            x: index * barOuterWidth + barOuterWidth / 2,
            y: value,
        }));

        const isAnimated = this.props.autoScale && this.props.animate;
        const shape = this.formatPath(coords);

        let path = null;
        if (this.paths && this.paths[categoryIndex]) {
            path = this.paths[categoryIndex];
        } else {
            path = {
                elem: svg('path', {}),
            };

            path.elem.classList.add(PATH_CLASS);
            if (categoryIndex > 0) {
                const categoryClass = `${CATEGORY_CLASS}${categoryIndex}`;
                path.elem.classList.add(categoryClass);
            }

            this.container.appendChild(path.elem);
            // Insert path before circles
            const group = this.items[0];
            const groupItems = Array.isArray(group) ? group : [group];
            insertBefore(path.elem, groupItems[0].elem);

            path.animateElem = svg('animate', {
                attributeType: 'XML',
                attributeName: 'd',
                dur: '0.5s',
                begin: 'indefinite',
                fill: 'freeze',
                repeatCount: '1',
                calcMode: 'linear',
            });
            path.elem.appendChild(path.animateElem);

            this.paths[categoryIndex] = path;
        }

        if (isAnimated) {
            if (shape !== path.shape) {
                path.animateElem.setAttribute('from', path.shape);
                path.animateElem.setAttribute('to', shape);
                path.animateElem.beginElement();
            }
        } else {
            path.elem.setAttribute('d', shape);
        }
        path.shape = shape;
    }

    getCategoryItems(categoryIndex = 0) {
        return this.items.map((item) => {
            const group = Array.isArray(item) ? item : [item];
            if (categoryIndex < 0 || categoryIndex >= group.length) {
                throw new Error(`Invalid category ${categoryIndex}`);
            }

            return group[categoryIndex];
        });
    }

    renderPaths() {
        const dataSets = this.getDataSets();
        if (dataSets.length === 0) {
            return;
        }

        const categoriesCount = this.getCategoriesCount();
        for (let i = 0; i < categoriesCount; i += 1) {
            const items = this.getCategoryItems(i);
            const values = items.map((item) => item.dot.y);
            this.drawPath(values, i);
        }
    }

    /** Update scale of path */
    updateItemsScale(items) {
        if (!Array.isArray(items)) {
            return;
        }

        // update height of bars
        items.flat().forEach((item) => {
            const y = this.grid.getY(item.value);
            this.setItemPos(item, y);
        });

        this.renderPaths();
    }

    /** Global Charts object public methods */
    static create(props) {
        return new LineChart(props);
    }
}
