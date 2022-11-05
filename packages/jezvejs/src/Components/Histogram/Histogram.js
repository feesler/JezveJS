import { asArray, svg } from '../../js/common.js';
import { BaseChart } from '../BaseChart/BaseChart.js';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'histogram';
const BAR_CLASS = 'histogram__bar';
const CATEGORY_CLASS = 'histogram_category-';

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
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
            visibilityOffset: 1,
            scaleAroundAxis: true,
            className: [CONTAINER_CLASS, ...asArray(this.props.className)],
        };

        this.init();
    }

    /** Find item by event object */
    findItemByEvent(e) {
        const result = super.findItemByEvent(e);
        if (!Array.isArray(result.item)) {
            return result;
        }

        let item = null;
        let index = -1;

        if (this.props.stacked) {
            const { x } = result;
            const y = e.offsetY;
            index = result.item.findIndex((bar) => (
                x >= bar.x
                && x < bar.x + bar.width
                && y >= bar.y
                && y < bar.y + bar.height
            ));
        } else {
            const groupX = this.barOuterWidth * result.index;
            const innerX = result.x - groupX;
            const barWidth = this.state.barWidth / result.item.length;

            index = Math.floor(innerX / barWidth);
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
    setItemPos(item, y, height) {
        const bar = item;

        if (bar.y === y && bar.height === height) {
            return;
        }

        if (this.props.autoScale && this.props.animate) {
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
    }) {
        const fixedValue = value ?? 0;
        const fixedOffset = valueOffset ?? 0;

        const y0 = this.grid.getY(fixedOffset);
        const y1 = this.grid.getY(fixedValue + fixedOffset);

        const item = {
            value: fixedValue,
            valueOffset: fixedOffset,
            x: index * this.barOuterWidth,
            y: Math.min(y0, y1),
            width,
            height: Math.abs(y0 - y1),
        };

        item.x += columnIndex * (width + this.props.columnGap);

        if (
            Number.isNaN(item.x)
            || Number.isNaN(item.y)
            || Number.isNaN(item.width)
            || Number.isNaN(item.height)
        ) {
            throw new Error('Invalid values');
        }

        const categoryClass = `${CATEGORY_CLASS}${categoryIndex + 1}`;
        item.elem = svg('rect', {
            class: [BAR_CLASS, categoryClass].join(' '),
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
        });

        this.itemsGroup.append(item.elem);

        return item;
    }

    getStackedGroups(dataSets) {
        if (!this.props.stacked) {
            return [];
        }

        return dataSets.reduce((res, item) => {
            const group = item.group ?? null;
            return res.includes(group) ? res : [...res, group];
        }, []);
    }

    /** Create items with default scale */
    createItems() {
        const dataSets = this.getDataSets(true);
        if (dataSets.length === 0) {
            return;
        }

        const stackedGroups = this.getStackedGroups(dataSets);
        const columnsInGroup = (this.props.stacked)
            ? Math.max(stackedGroups.length, 1)
            : dataSets.length;
        const gapsWidth = this.props.columnGap * (columnsInGroup - 1);
        const width = (this.state.barWidth - gapsWidth) / columnsInGroup;

        const longestSet = this.getLongestDataSet();
        longestSet.forEach((_, index) => {
            const group = [];
            const posValueOffset = Array(columnsInGroup).fill(0);
            const negValueOffset = Array(columnsInGroup).fill(0);

            dataSets.forEach((dataSet, categoryIndex) => {
                const value = dataSet.data[index] ?? 0;

                let columnIndex = 0;
                if (this.props.stacked) {
                    const groupName = dataSet.group ?? null;
                    columnIndex = stackedGroups.indexOf(groupName);
                } else {
                    columnIndex = categoryIndex;
                }

                const valueOffset = (value >= 0)
                    ? posValueOffset[columnIndex]
                    : negValueOffset[columnIndex];

                const item = this.createItem({
                    value,
                    width,
                    index,
                    columnIndex,
                    categoryIndex,
                    valueOffset,
                });
                group.push(item);

                if (!this.props.stacked) {
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
    updateItemsScale(items) {
        if (!Array.isArray(items)) {
            return;
        }

        items.flat().forEach((item) => {
            const y0 = this.grid.getY(item.valueOffset);
            const y1 = this.grid.getY(item.value + item.valueOffset);
            const newY = Math.min(y0, y1);
            const barHeight = Math.abs(y0 - y1);

            this.setItemPos(item, newY, barHeight);
        });
    }
}
