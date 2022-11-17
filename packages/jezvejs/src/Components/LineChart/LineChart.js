import { svg, insertBefore, asArray } from '../../js/common.js';
import { BaseChart } from '../BaseChart/BaseChart.js';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'linechart';
const SHOW_NODES_CLASS = 'linechart__nodes';
const PATH_CLASS = 'linechart__path';
const ITEM_CLASS = 'linechart__item';
const CATEGORY_CLASS = 'linechart_category-';

/** Default properties */
const defaultProps = {
    drawNodeCircles: false,
    nodeCircleRadius: 4,
};

/**
 * Base chart component constructor
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class LineChart extends BaseChart {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            visibilityOffset: 2,
            scaleAroundAxis: false,
            className: [CONTAINER_CLASS, ...asArray(props.className)],
        });

        this.paths = [];

        this.init();
    }

    init() {
        super.init();

        if (this.state.drawNodeCircles) {
            this.chartContainer.classList.add(SHOW_NODES_CLASS);
        }
    }

    getItemBBox(item) {
        const radius = this.state.nodeCircleRadius;
        return {
            x: item.dot.x - radius,
            y: item.dot.y - radius,
            width: radius * 2,
            height: radius * 2,
        };
    }

    /** Find item by event object */
    findItemByEvent(e) {
        const result = super.findItemByEvent(e);
        if (!Array.isArray(result.item)) {
            return result;
        }

        const y = e.offsetY;
        const diffs = result.item.map((item, ind) => ({ ind, diff: Math.abs(y - item.dot.y) }));
        diffs.sort((a, b) => a.diff - b.diff);

        let item = null;
        let index = diffs[0].ind;
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

    getCoordinates(value, index, state) {
        const { grid } = state;
        const groupWidth = this.getGroupOuterWidth(state);
        return {
            x: index * groupWidth + groupWidth / 2,
            y: grid.getY(value),
        };
    }

    /** Set new position of item */
    setItemPos(item, y, state) {
        const point = item;

        if (point.dot.y === y) {
            return;
        }

        if (state.autoScale && state.animate) {
            point.elem.style.cy = this.formatCoord(y, true);
        } else {
            point.elem.setAttribute('cy', y);
        }

        point.dot.y = y;
    }

    createItem({
        value,
        index,
        categoryIndex = 0,
        valueOffset = 0,
    }, state) {
        const fixedValue = value ?? 0;
        const fixedOffset = valueOffset ?? 0;

        const item = {
            value: fixedValue,
            valueOffset: fixedOffset,
            dot: this.getCoordinates(fixedValue + fixedOffset, index, state),
        };

        if (Number.isNaN(item.dot.x) || Number.isNaN(item.dot.y)) {
            throw new Error('Invalid values');
        }

        const categoryClass = `${CATEGORY_CLASS}${categoryIndex + 1}`;
        item.elem = svg('circle', {
            class: [ITEM_CLASS, categoryClass].join(' '),
            cx: item.dot.x,
            cy: item.dot.y,
            r: state.nodeCircleRadius,
        });

        this.itemsGroup.append(item.elem);

        return item;
    }

    /** Create items with default scale */
    createItems(state) {
        const dataSets = this.getDataSets(false, state);
        if (dataSets.length === 0) {
            return;
        }

        this.paths = [];
        const longestSet = this.getLongestDataSet(state);
        longestSet.forEach((_, index) => {
            const group = [];
            let valueOffset = 0;

            dataSets.forEach((data, categoryIndex) => {
                const value = data[index] ?? 0;
                const item = this.createItem({
                    value,
                    index,
                    categoryIndex,
                    valueOffset,
                }, state);
                group.push(item);

                if (state.stacked) {
                    valueOffset += value;
                }
            });

            this.items.push(group);
        });

        this.renderPaths(state);
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
    drawPath(values, categoryIndex, state) {
        const groupWidth = this.getGroupOuterWidth(state);
        const coords = values.map((value, index) => ({
            x: index * groupWidth + groupWidth / 2,
            y: value,
        }));

        const isAnimated = state.autoScale && state.animate;
        const shape = this.formatPath(coords);

        let path = null;
        if (this.paths && this.paths[categoryIndex]) {
            path = this.paths[categoryIndex];
        } else {
            const categoryClass = `${CATEGORY_CLASS}${categoryIndex + 1}`;
            path = {
                elem: svg('path', {
                    class: [PATH_CLASS, categoryClass].join(' '),
                }),
            };

            this.itemsGroup.append(path.elem);
            // Insert path before circles
            const group = this.items[0];
            const groupItems = asArray(group);
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
            path.elem.append(path.animateElem);

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
            const group = asArray(item);
            if (categoryIndex < 0 || categoryIndex >= group.length) {
                throw new Error(`Invalid category ${categoryIndex}`);
            }

            return group[categoryIndex];
        });
    }

    renderPaths(state) {
        const dataSets = this.getDataSets(false, state);
        if (dataSets.length === 0) {
            return;
        }

        const categoriesCount = this.getCategoriesCount(state);
        for (let i = 0; i < categoriesCount; i += 1) {
            const items = this.getCategoryItems(i);
            const values = items.map((item) => item.dot.y);
            this.drawPath(values, i, state);
        }
    }

    /** Update scale of path */
    updateItemsScale(items, state) {
        if (!Array.isArray(items)) {
            return;
        }

        const { grid } = state;
        items.flat().forEach((item) => {
            const y = grid.getY(item.value + item.valueOffset);
            this.setItemPos(item, y, state);
        });

        this.renderPaths(state);
    }
}
