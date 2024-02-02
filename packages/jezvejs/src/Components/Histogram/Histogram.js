import { asArray } from '@jezvejs/types';
import { afterTransition } from '@jezvejs/dom';

import { BaseChart } from '../BaseChart/BaseChart.js';
import { findItem } from '../BaseChart/helpers.js';

import { HistogramDataItem } from './components/DataItem/HistogramDataItem.js';

import './Histogram.scss';

/* CSS classes */
const CONTAINER_CLASS = 'histogram';

/** Default properties */
const defaultProps = {
    columnGap: 0,
    components: {
        DataItem: HistogramDataItem,
    },
};

/**
 * Base chart component constructor
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class Histogram extends BaseChart {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            visibilityOffset: 1,
            scaleAroundAxis: true,
            className: [CONTAINER_CLASS, ...asArray(props.className)],
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });
    }

    getColumnOuterWidth(state = this.state) {
        return state.columnWidth + state.columnGap;
    }

    getGroupWidth(state = this.state) {
        return this.getColumnOuterWidth(state) * state.columnsInGroup - state.columnGap;
    }

    getGroupOuterWidth(state = this.state) {
        return this.getGroupWidth(state) + state.groupsGap;
    }

    /** Find item by event object */
    findItemByEvent(e) {
        const result = super.findItemByEvent(e);
        if (!Array.isArray(result.item)) {
            return result;
        }

        let item = null;
        let index = -1;

        const groupWidth = this.getGroupWidth();
        const groupOuterWidth = this.getGroupOuterWidth();
        const groupX = groupOuterWidth * result.index;
        let { x } = result;

        if (this.state.data.stacked) {
            // Fix x coordinate if curson is between groups
            if (x >= groupX + groupWidth && x < groupX + groupOuterWidth) {
                x = groupX + groupWidth - 1;
            }

            const y = e.offsetY;
            index = result.item.findIndex((bar) => (
                x >= bar.x
                && x < bar.x + bar.width
                && y >= bar.y
                && y < bar.y + bar.height
            ));
            // Find column closest to the mouse coordinates
            if (index === -1) {
                const diffs = result.item.map((bar, ind) => ({
                    bar,
                    ind,
                    diff: Math.min(
                        Math.abs(y - bar.y),
                        Math.abs(y - bar.y - bar.height),
                    ),
                })).filter(({ bar }) => (x >= bar.x && x < bar.x + bar.width));

                if (diffs.length > 0) {
                    diffs.sort((a, b) => a.diff - b.diff);
                    index = diffs[0].ind;
                }
            }
        } else {
            index = result.item.findIndex((bar) => (
                x >= bar.x
                && x < bar.x + bar.width
            ));
        }

        if (index >= 0 && index < result.item.length) {
            item = result.item[index];
        } else {
            index = -1;
        }

        const res = {
            item,
            index,
            group: result.item,
            value: item?.value,
            valueOffset: item?.valueOffset,
            groupIndex: item?.groupIndex,
            columnIndex: item?.columnIndex,
            category: item?.category,
            categoryIndex: item?.categoryIndex,
            series: result.series,
        };

        return res;
    }

    getX(item, groupWidth, columnWidth) {
        return item.groupIndex * groupWidth + item.columnIndex * columnWidth;
    }

    getAlignedX(options = {}) {
        const {
            item = null,
            groupWidth = 0,
            columnWidth = 0,
            alignColumns = 'left',
            groupsGap = 0,
        } = options;

        let x = this.getX(item, groupWidth, columnWidth);
        if (alignColumns === 'right') {
            x += groupsGap;
        } else if (alignColumns === 'center') {
            x += groupsGap / 2;
        }

        return x;
    }

    isVisibleValue(value) {
        return value < 0 || value > 0;
    }

    createItem(data, state) {
        const value = data?.value ?? 0;
        if (!this.isVisibleValue(value)) {
            return null;
        }

        const { grid } = state;
        const valueOffset = data?.valueOffset ?? 0;
        const y0 = grid.getY(valueOffset);
        const y1 = grid.getY(value + valueOffset);
        const height = grid.roundToPrecision(Math.abs(y0 - y1), 1);
        const groupWidth = this.getGroupOuterWidth(state);
        const columnWidth = this.getColumnOuterWidth(state);

        const itemProps = {
            ...data,
            value,
            valueOffset,
            y: Math.min(y0, y1),
            width: state.columnWidth,
            height,
            autoScale: state.autoScale,
            animate: state.animate,
            stacked: state.data?.stacked ?? false,
        };

        itemProps.x = this.getAlignedX({
            item: itemProps,
            groupWidth,
            columnWidth,
            alignColumns: state.alignColumns,
            groupsGap: state.groupsGap,
        });

        const DataItem = this.getComponent('DataItem');
        const item = DataItem.create(itemProps);

        this.itemsGroup.append(item.elem);

        return item;
    }

    /** Returns current count of columns in group */
    getColumnsInGroupCount(state) {
        const stackedGroups = this.getStackedGroups(state);
        return (state.data.stacked)
            ? Math.max(stackedGroups.length, 1)
            : state.dataSets.length;
    }

    /** Create items with default scale */
    createItems(state) {
        const { dataSets, activeTarget } = state;
        if (dataSets.length === 0) {
            return;
        }

        const stackedGroups = this.getStackedGroups(state);
        const stackedCategories = this.getStackedCategories(state);
        const firstGroupIndex = this.getFirstVisibleGroupIndex(state);
        const visibleGroups = this.getVisibleGroupsCount(firstGroupIndex, state);
        const activeCategory = state.activeCategory?.toString() ?? null;

        const flatItems = this.items.flat();
        const newItems = [];
        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;
            const group = [];
            const posValueOffset = Array(state.columnsInGroup).fill(0);
            const negValueOffset = Array(state.columnsInGroup).fill(0);

            dataSets.forEach((dataSet, dataSetIndex) => {
                const value = dataSet.data[groupIndex] ?? 0;
                if (!this.isVisibleValue(value)) {
                    return;
                }

                const category = dataSet.category ?? null;
                const categoryIndex = (category && stackedCategories.includes(category))
                    ? stackedCategories.indexOf(category)
                    : dataSetIndex;
                const groupName = dataSet.group ?? null;
                const columnIndex = (state.data.stacked)
                    ? stackedGroups.indexOf(groupName)
                    : categoryIndex;
                const valueOffset = (value >= 0)
                    ? posValueOffset[columnIndex]
                    : negValueOffset[columnIndex];

                let [item] = findItem(flatItems, {
                    groupIndex,
                    columnIndex,
                    category,
                    categoryIndex,
                });

                const active = (
                    (!!category && category.toString() === activeCategory)
                    || (categoryIndex.toString() === activeCategory)
                    || (
                        !!activeTarget
                        && activeTarget.groupIndex === groupIndex
                        && activeTarget.categoryIndex === categoryIndex
                        && activeTarget.columnIndex === columnIndex
                    )
                );

                const itemProps = {
                    value,
                    groupIndex,
                    columnIndex,
                    category,
                    categoryIndex,
                    active,
                    valueOffset,
                    groupName,
                    animateNow: state.animateNow,
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

                if (!state.data.stacked) {
                    return;
                }
                if (value >= 0) {
                    posValueOffset[columnIndex] += value;
                } else {
                    negValueOffset[columnIndex] += value;
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
    }

    /** Update scale of items */
    updateItemsScale(items, state) {
        if (!Array.isArray(items)) {
            return;
        }

        const { grid } = state;
        items.flat().forEach((item) => {
            const y0 = grid.getY(item.valueOffset);
            const y1 = grid.getY(item.value + item.valueOffset);
            const newY = Math.min(y0, y1);
            const height = grid.roundToPrecision(Math.abs(y0 - y1), 1);

            item.setVerticalPos(newY, height);
        });

        if (state.animateNow && !this.scrollRequested) {
            afterTransition(this.content, {
                duration: this.props.animationEndTimeout,
            }, () => this.onAnimationDone());
        }
    }

    isHorizontalScaleNeeded(state, prevState = {}) {
        return (
            super.isHorizontalScaleNeeded(state, prevState)
            || state.columnGap !== prevState?.columnGap
        );
    }

    /** Update horizontal scale of items */
    updateHorizontalScale(state) {
        const groupWidth = this.getGroupOuterWidth(state);
        const columnWidth = this.getColumnOuterWidth(state);

        this.items.flat().forEach((item) => {
            const newX = this.getAlignedX({
                item,
                groupWidth,
                columnWidth,
                alignColumns: state.alignColumns,
                groupsGap: state.groupsGap,
            });

            item.setHorizontalPos(newX, state.columnWidth);
        });
    }
}
