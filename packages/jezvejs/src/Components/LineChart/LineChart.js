import { createSVGElement, insertBefore, asArray } from '../../js/common.js';
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
            series: result.series,
            group: result.item,
            groupIndex: result.index,
        };

        return res;
    }

    getX(index, groupWidth) {
        return index * groupWidth + groupWidth / 2;
    }

    createItem({
        value,
        groupIndex,
        category = null,
        categoryIndex = 0,
        valueOffset = 0,
    }, state) {
        const { grid } = state;
        const fixedValue = value ?? 0;
        const fixedOffset = valueOffset ?? 0;
        const groupWidth = this.getGroupOuterWidth(state);

        const item = {
            value: fixedValue,
            valueOffset: fixedOffset,
            groupIndex,
            category,
            categoryIndex,
            dot: {
                x: this.getX(groupIndex, groupWidth),
                y: grid.getY(fixedValue + fixedOffset),
            },
        };

        if (Number.isNaN(item.dot.x) || Number.isNaN(item.dot.y)) {
            throw new Error('Invalid values');
        }

        const categoryClass = `${CATEGORY_CLASS}${categoryIndex + 1}`;
        item.elem = createSVGElement('circle', {
            attrs: {
                class: [ITEM_CLASS, categoryClass].join(' '),
                cx: item.dot.x,
                cy: item.dot.y,
                r: state.nodeCircleRadius,
            },
        });

        this.itemsGroup.append(item.elem);

        return item;
    }

    /** Create items with default scale */
    createItems(state) {
        const { dataSets } = state;
        if (dataSets.length === 0) {
            return;
        }

        this.paths = [];
        const longestSet = this.getLongestDataSet(state);
        longestSet.forEach((_, groupIndex) => {
            const group = [];
            let valueOffset = 0;

            dataSets.forEach((dataSet, categoryIndex) => {
                const value = dataSet.data[groupIndex] ?? 0;
                const category = dataSet.category ?? null;

                const item = this.createItem({
                    value,
                    groupIndex,
                    category,
                    categoryIndex,
                    valueOffset,
                }, state);
                group.push(item);

                if (state.data.stacked) {
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
                elem: createSVGElement('path', {
                    attrs: {
                        class: [PATH_CLASS, categoryClass].join(' '),
                    },
                }),
            };

            this.itemsGroup.append(path.elem);
            // Insert path before circles
            const group = this.items[0];
            const groupItems = asArray(group);
            insertBefore(path.elem, groupItems[0].elem);

            path.animateElem = createSVGElement('animate', {
                attrs: {
                    attributeType: 'XML',
                    attributeName: 'd',
                    dur: '0.5s',
                    begin: 'indefinite',
                    fill: 'freeze',
                    repeatCount: '1',
                    calcMode: 'linear',
                },
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
        const { dataSets } = state;
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

    /** Set vertical position of item */
    setItemVerticalPos(item, y, state) {
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

    /** Update scale of path */
    updateItemsScale(items, state) {
        if (!Array.isArray(items)) {
            return;
        }

        const { grid } = state;
        items.flat().forEach((item) => {
            const y = grid.getY(item.value + item.valueOffset);
            this.setItemVerticalPos(item, y, state);
        });

        this.renderPaths(state);
    }

    /** Set horizontal position of item */
    setItemHorizontalPos(item, x) {
        const point = item;
        if (point.dot.x === x) {
            return;
        }

        point.dot.x = x;
        point.elem.setAttribute('cx', point.dot.x);
    }

    /** Update horizontal scale of items */
    updateHorizontalScale(state) {
        const groupWidth = this.getGroupOuterWidth(state);

        this.items.flat().forEach((item) => {
            const newX = this.getX(item.groupIndex, groupWidth);
            this.setItemHorizontalPos(item, newX);
        });

        this.renderPaths(state);
    }

    render(state, prevState = {}) {
        this.chartContainer.classList.toggle(SHOW_NODES_CLASS, state.drawNodeCircles);

        super.render(state, prevState);
    }
}
