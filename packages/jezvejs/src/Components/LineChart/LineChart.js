import {
    createSVGElement,
    asArray,
    getClassName,
} from '../../js/common.js';
import { BaseChart } from '../BaseChart/BaseChart.js';
import { findItem } from '../BaseChart/helpers.js';
import './LineChart.scss';

/* CSS classes */
const CONTAINER_CLASS = 'linechart';
const SHOW_NODES_CLASS = 'linechart__nodes';
const PATH_CLASS = 'linechart__path';
const ITEM_CLASS = 'linechart__item';
const CATEGORY_CLASS = 'linechart_category-';
const CATEGORY_INDEX_CLASS = 'linechart_category-ind-';

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
    }

    init() {
        this.paths = [];
        this.pathsGroup = null;

        super.init();
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
        const { grid, xAxis } = state;
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

        if (xAxis === 'top') {
            item.dot.y += state.hLabelsHeight;
        }

        const categoryIndexClass = `${CATEGORY_INDEX_CLASS}${categoryIndex + 1}`;
        const classNames = [ITEM_CLASS, categoryIndexClass];
        if (category !== null) {
            const categoryClass = `${CATEGORY_CLASS}${category}`;
            classNames.push(categoryClass);
        }

        item.elem = createSVGElement('circle', {
            attrs: {
                class: getClassName(classNames),
                cx: item.dot.x,
                cy: item.dot.y,
                r: state.nodeCircleRadius,
            },
        });

        this.itemsGroup.append(item.elem);

        return item;
    }

    /** Remove all items from chart */
    resetItems() {
        super.resetItems();

        this.pathsGroup?.remove();
        this.pathsGroup = createSVGElement('g');
        this.itemsGroup.before(this.pathsGroup);
        this.paths = [];
    }

    /** Create items with default scale */
    createItems(state) {
        const { dataSets } = state;
        if (dataSets.length === 0) {
            return;
        }

        const firstGroupIndex = this.getFirstVisibleGroupIndex(state);
        const visibleGroups = this.getVisibleGroupsCount(firstGroupIndex, state);

        const flatItems = this.items.flat();
        const newItems = [];
        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;
            const group = [];
            let valueOffset = 0;

            dataSets.forEach((dataSet, categoryIndex) => {
                const value = dataSet.data[groupIndex] ?? 0;
                const category = dataSet.category ?? null;

                let [item] = findItem(flatItems, {
                    groupIndex,
                    category,
                    categoryIndex,
                });
                if (!item) {
                    item = this.createItem({
                        value,
                        groupIndex,
                        category,
                        categoryIndex,
                        valueOffset,
                    }, state);
                }
                group.push(item);

                if (state.data.stacked) {
                    valueOffset += value;
                }
            });

            newItems.push(group);
        }

        const flatNewItems = newItems.flat();
        flatItems.forEach((item) => {
            if (!flatNewItems.includes(item)) {
                item.elem?.remove();
            }
        });

        this.items = newItems;

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
    drawPath(data, state) {
        const {
            values,
            categoryIndex = 0,
            category = null,
        } = data;

        const firstGroupIndex = this.getFirstVisibleGroupIndex(state);
        const groupWidth = this.getGroupOuterWidth(state);
        const coords = values.map((value, index) => ({
            x: (firstGroupIndex + index) * groupWidth + groupWidth / 2,
            y: value,
        }));

        const isAnimated = state.autoScale && state.animate && state.animateNow;
        const shape = this.formatPath(coords);

        let path = null;
        if (this.paths && this.paths[categoryIndex]) {
            path = this.paths[categoryIndex];
        } else {
            const categoryIndexClass = `${CATEGORY_INDEX_CLASS}${categoryIndex + 1}`;
            const classNames = [PATH_CLASS, categoryIndexClass];
            if (category !== null) {
                const categoryClass = `${CATEGORY_CLASS}${category}`;
                classNames.push(categoryClass);
            }

            path = {
                elem: createSVGElement('path', {
                    attrs: {
                        class: getClassName(classNames),
                    },
                }),
            };

            this.pathsGroup.append(path.elem);
            this.paths[categoryIndex] = path;
        }

        if (isAnimated) {
            if (!path.animateElem) {
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
            }

            if (shape !== path.shape) {
                path.animateElem.setAttribute('from', path.shape);
                path.animateElem.setAttribute('to', shape);
                path.animateElem.beginElement();
            }

            path.elem.append(path.animateElem);
        } else {
            path.animateElem?.remove();
            path.animateElem = null;

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
            if (items.length === 0) {
                continue;
            }

            this.drawPath({
                values: items.map((item) => item.dot.y),
                categoryIndex: i,
                category: items[0].category,
            }, state);
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
