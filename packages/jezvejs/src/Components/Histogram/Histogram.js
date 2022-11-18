import { asArray, svg } from '../../js/common.js';
import { BaseChart } from '../BaseChart/BaseChart.js';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'histogram';
const BAR_CLASS = 'histogram__bar';
const CATEGORY_CLASS = 'histogram_category-';
const COLUMN_CLASS = 'histogram_column-';

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

        this.init();
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

        if (this.state.data.stacked) {
            const { x } = result;
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
            const groupX = this.getGroupOuterWidth() * result.index;
            const innerX = result.x - groupX;

            index = Math.floor(innerX / this.getColumnOuterWidth());
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
        };

        return res;
    }

    /** Set new position of item */
    setItemPos(item, y, height, state) {
        const bar = item;

        if (bar.y === y && bar.height === height) {
            return;
        }

        if (state.autoScale && state.animate) {
            bar.elem.style.y = this.formatCoord(y, true);
            bar.elem.style.height = this.formatCoord(height, true);
        } else {
            bar.elem.setAttribute('y', y);
            bar.elem.setAttribute('height', height);
        }

        bar.y = y;
        bar.height = height;
    }

    createItem({
        value,
        width,
        index,
        columnIndex = 0,
        categoryIndex = 0,
        valueOffset = 0,
        groupName = null,
    }, state) {
        const { grid } = state;
        const fixedValue = value ?? 0;
        const fixedOffset = valueOffset ?? 0;

        const y0 = grid.getY(fixedOffset);
        const y1 = grid.getY(fixedValue + fixedOffset);
        const height = grid.roundToPrecision(Math.abs(y0 - y1), 1);
        const groupWidth = this.getGroupOuterWidth(state);
        const columnWidth = this.getColumnOuterWidth(state);

        const item = {
            value: fixedValue,
            valueOffset: fixedOffset,
            x: index * groupWidth + columnIndex * columnWidth,
            y: Math.min(y0, y1),
            width,
            height,
            columnIndex,
            categoryIndex,
            groupName,
        };

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
            const categoryClass = `${CATEGORY_CLASS}${categoryIndex + 1}`;
            classNames.push(categoryClass);
        }

        item.elem = svg('rect', {
            class: classNames.join(' '),
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
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
        const longestSet = this.getLongestDataSet(state);
        longestSet.forEach((_, index) => {
            const group = [];
            const posValueOffset = Array(state.columnsInGroup).fill(0);
            const negValueOffset = Array(state.columnsInGroup).fill(0);

            dataSets.forEach((dataSet, dataSetIndex) => {
                const value = dataSet.data[index] ?? 0;
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

                const item = this.createItem({
                    value,
                    width: state.columnWidth,
                    index,
                    columnIndex,
                    categoryIndex,
                    valueOffset,
                    groupName,
                }, state);
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
            this.items.push(group);
        });
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

            this.setItemPos(item, newY, height, state);
        });
    }
}
