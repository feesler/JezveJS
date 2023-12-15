import { asArray } from '@jezvejs/types';
import { afterTransition, createSVGElement } from '@jezvejs/dom';
import { BaseChart } from '../BaseChart/BaseChart.js';
import { findItem } from '../BaseChart/helpers.js';
import './Histogram.scss';

/* CSS classes */
const CONTAINER_CLASS = 'histogram';
const BAR_CLASS = 'histogram__bar';
const CATEGORY_INDEX_CLASS = 'histogram_category-ind-';
const CATEGORY_CLASS = 'histogram_category-';
const COLUMN_CLASS = 'histogram_column-';
const ACTIVE_ITEM_CLASS = 'chart__item_active';

/** Default properties */
const defaultProps = {
    columnGap: 0,
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

    getItemBBox(item) {
        return {
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
        };
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
            groupIndex: result.index,
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

    createItem(data, state) {
        const {
            value,
            width,
            groupIndex,
            category = null,
            columnIndex = 0,
            categoryIndex = 0,
            active = false,
            valueOffset = 0,
            groupName = null,
        } = data;
        const { grid, xAxis } = state;
        const fixedValue = value ?? 0;
        if (fixedValue === 0) {
            return null;
        }

        const fixedOffset = valueOffset ?? 0;
        const y0 = grid.getY(fixedOffset);
        const y1 = grid.getY(fixedValue + fixedOffset);
        const height = grid.roundToPrecision(Math.abs(y0 - y1), 1);
        const groupWidth = this.getGroupOuterWidth(state);
        const columnWidth = this.getColumnOuterWidth(state);

        const item = {
            value: fixedValue,
            valueOffset: fixedOffset,
            y: Math.min(y0, y1),
            width,
            height,
            groupIndex,
            columnIndex,
            category,
            categoryIndex,
            active,
            groupName,
        };

        if (xAxis === 'top') {
            item.y += state.hLabelsHeight;
        }

        item.x = this.getAlignedX({
            item,
            groupWidth,
            columnWidth,
            alignColumns: state.alignColumns,
            groupsGap: state.groupsGap,
        });

        if (
            Number.isNaN(item.x)
            || Number.isNaN(item.y)
            || Number.isNaN(item.width)
            || Number.isNaN(item.height)
        ) {
            throw new Error('Invalid values');
        }

        const columnClass = `${COLUMN_CLASS}${columnIndex + 1}`;
        const classNames = [BAR_CLASS, columnClass];
        if (state.data.stacked) {
            const categoryIndexClass = `${CATEGORY_INDEX_CLASS}${categoryIndex + 1}`;
            classNames.push(categoryIndexClass);

            if (category !== null) {
                const categoryClass = `${CATEGORY_CLASS}${category}`;
                classNames.push(categoryClass);
            }
        }

        if (active) {
            classNames.push(ACTIVE_ITEM_CLASS);
        }

        item.elem = createSVGElement('rect', {
            attrs: {
                class: classNames.join(' '),
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height,
            },
        });

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
        const { dataSets } = state;
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
                if (value === 0) {
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
                );

                if (!item) {
                    item = this.createItem({
                        value,
                        width: state.columnWidth,
                        groupIndex,
                        columnIndex,
                        category,
                        categoryIndex,
                        active,
                        valueOffset,
                        groupName,
                    }, state);
                }
                item.active = active;
                item.elem.classList.toggle(ACTIVE_ITEM_CLASS, active);

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

    /** Set vertical position and height of item */
    setItemVerticalPos(item, y, height, state) {
        const bar = item;
        if (bar.y === y && bar.height === height) {
            return;
        }

        bar.y = y;
        bar.height = height;
        if (state.autoScale && state.animate) {
            bar.elem.style.y = this.formatCoord(bar.y, true);
            bar.elem.style.height = this.formatCoord(bar.height, true);
        } else {
            bar.elem.setAttribute('y', bar.y);
            bar.elem.setAttribute('height', bar.height);
        }
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

            this.setItemVerticalPos(item, newY, height, state);
        });

        if (state.animateNow) {
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

    /** Set vertical position and height of item */
    setItemHorizontalPos(item, x, width) {
        const bar = item;
        if (bar.x === x && bar.width === width) {
            return;
        }

        bar.x = x;
        bar.width = width;
        bar.elem.setAttribute('x', bar.x);
        bar.elem.setAttribute('width', bar.width);
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

            this.setItemHorizontalPos(item, newX, state.columnWidth);
        });
    }
}
