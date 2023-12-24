import { asArray } from '@jezvejs/types';
import { createSVGElement, getClassName } from '@jezvejs/dom';
import { BaseChart } from '../BaseChart/BaseChart.js';
import { findItem } from '../BaseChart/helpers.js';

import { LineChartDataItem } from './components/DataItem/LineChartDataItem.js';
import './LineChart.scss';

/* CSS classes */
const CONTAINER_CLASS = 'linechart';
const SHOW_NODES_CLASS = 'linechart__nodes';
const PATH_CLASS = 'linechart__path';
const CATEGORY_CLASS = 'linechart_category-';
const CATEGORY_INDEX_CLASS = 'linechart_category-ind-';

/** Default properties */
const defaultProps = {
    drawNodeCircles: false,
    nodeCircleRadius: 4,
    components: {
        DataItem: LineChartDataItem,
    },
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
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });
    }

    init() {
        this.paths = [];
        this.pathsGroup = null;

        super.init();
    }

    /** Find item by event object */
    findItemByEvent(e) {
        const result = super.findItemByEvent(e);
        if (!Array.isArray(result.item)) {
            return result;
        }

        const y = e.offsetY;
        const diffs = result.item.map((item, ind) => ({ ind, diff: Math.abs(y - item.cy) }));
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

    getX(groupIndex, groupWidth) {
        return groupIndex * groupWidth;
    }

    getAlignedX(options = {}) {
        const {
            groupIndex = 0,
            groupWidth = 0,
            alignColumns = 'left',
        } = options;

        let x = this.getX(groupIndex, groupWidth);
        if (alignColumns === 'right') {
            x += groupWidth;
        } else if (alignColumns === 'center') {
            x += groupWidth / 2;
        }

        return x;
    }

    getGroupIndexByX(value) {
        const { alignColumns } = this.state;
        const groupWidth = this.getGroupOuterWidth();

        let x = parseFloat(value);
        if (alignColumns === 'left') {
            x += groupWidth / 2;
        } else if (alignColumns === 'right') {
            x -= groupWidth / 2;
        }

        return Math.floor(x / groupWidth);
    }

    createItem(data, state) {
        const { grid, alignColumns } = state;
        const value = data?.value ?? 0;
        const valueOffset = data?.valueOffset ?? 0;
        const groupWidth = this.getGroupOuterWidth(state);

        const itemProps = {
            ...data,
            value,
            valueOffset,
            cx: this.getAlignedX({
                groupIndex: data.groupIndex,
                groupWidth,
                alignColumns,
            }),
            cy: grid.getY(value + valueOffset),
            r: state.nodeCircleRadius,
        };

        if (state.xAxis === 'top') {
            itemProps.cy += state.hLabelsHeight;
        }

        const DataItem = this.getComponent('DataItem');
        const item = DataItem.create(itemProps);

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
        const activeCategory = state.activeCategory?.toString() ?? null;

        const flatItems = this.items.flat();
        const newItems = [];
        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;
            const group = [];
            let valueOffset = 0;

            dataSets.forEach((dataSet, categoryIndex) => {
                const value = dataSet.data[groupIndex] ?? 0;
                const category = dataSet.category ?? null;
                const active = (
                    (category?.toString() === activeCategory)
                    || (categoryIndex.toString() === activeCategory)
                );

                let [item] = findItem(flatItems, {
                    groupIndex,
                    category,
                    categoryIndex,
                });

                const itemProps = {
                    value,
                    groupIndex,
                    category,
                    categoryIndex,
                    active,
                    valueOffset,
                };

                if (!item) {
                    item = this.createItem(itemProps, state);
                } else {
                    item.setState((itemState) => ({
                        ...itemState,
                        ...itemProps,
                    }));
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
                item?.elem?.remove();
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
            x: this.getAlignedX({
                groupIndex: firstGroupIndex + index,
                groupWidth,
                alignColumns: state.alignColumns,
            }),
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
                    events: {
                        endEvent: () => this.onAnimationDone(),
                    },
                });
            }

            if (shape !== path.shape) {
                path.animateElem.setAttribute('from', path.shape);
                path.animateElem.setAttribute('to', shape);
            }

            path.elem.append(path.animateElem);
            path.animateElem.beginElement();
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
        const activeCategory = state.activeCategory?.toString() ?? null;

        for (let i = 0; i < categoriesCount; i += 1) {
            const items = this.getCategoryItems(i);
            if (items.length === 0) {
                continue;
            }

            const { category, categoryIndex } = items[0];
            const active = (
                (category?.toString() === activeCategory)
                || (categoryIndex.toString() === activeCategory)
            );

            this.drawPath({
                values: items.map((item) => item.cy),
                categoryIndex,
                category,
                active,
            }, state);
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
            item.setVerticalPos(y);
        });

        this.renderPaths(state);
    }

    /** Update horizontal scale of items */
    updateHorizontalScale(state) {
        const groupWidth = this.getGroupOuterWidth(state);

        this.items.flat().forEach((item) => {
            const newX = this.getAlignedX({
                groupIndex: item.groupIndex,
                groupWidth,
                alignColumns: state.alignColumns,
            });
            item.setHorizontalPos(newX);
        });

        this.renderPaths(state);
    }

    render(state, prevState = {}) {
        this.chartContainer.classList.toggle(SHOW_NODES_CLASS, state.drawNodeCircles);

        super.render(state, prevState);
    }
}
