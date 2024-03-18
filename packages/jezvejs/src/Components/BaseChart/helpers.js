import { asArray, isFunction, isObject } from '@jezvejs/types';

import { minmax } from '../../common.js';

const SVG_VALUE_PRECISION = 3;

/**
 * Returns array of items filtered by specified query object
 *
 * @param {Array} items
 * @param {object} query
 * @returns {Array}
 */
export const findItem = (items, query) => {
    const condition = Object.keys(query);
    return asArray(items).filter((item) => (
        !!item
        && condition.every((prop) => item[prop] === query[prop])
    ));
};

/**
 * Returns true if objects target to the same data items
 *
 * @param {object} a
 * @param {object} b
 * @returns {boolean}
 */
export const isSameTarget = (a, b) => (
    (a === b) || (
        !!a
        && !!b
        && a.groupIndex === b.groupIndex
        && a.categoryIndex === b.categoryIndex
        && a.columnIndex === b.columnIndex
    )
);

/** Returns array of data sets */
export const getDataSets = (state) => {
    const { values } = state.data;
    if (values.length === 0) {
        return [];
    }

    const [firstItem] = values;
    if (!isObject(firstItem)) {
        const data = values;
        return [{ data }];
    }

    return values;
};

/** Returns longest data set */
export const getLongestDataSet = (state) => {
    const resIndex = state.dataSets.reduce((res, item, index) => (
        (state.dataSets[res].data.length < item.data.length) ? index : res
    ), 0);

    return state.dataSets[resIndex]?.data ?? [];
};

/** Returns array of groups for stacked chart data */
export const getStackedGroups = (state) => {
    if (!state.data.stacked) {
        return [];
    }

    return state.dataSets.reduce((res, item) => {
        const group = item.group ?? null;
        return res.includes(group) ? res : [...res, group];
    }, []);
};

/** Returns categories for stacked chart data */
export const getStackedCategories = (state) => {
    if (!state.data.stacked) {
        return [];
    }

    return state.dataSets.reduce((res, item) => {
        let category = item.category ?? null;
        if (res.includes(category)) {
            return res;
        }

        const categoryIndex = res.length;
        if (category === null && !res.includes(categoryIndex)) {
            category = categoryIndex;
        }

        return [...res, category];
    }, []);
};

/** Returns index of first visible item for specified state */
export const getFirstVisibleGroupIndex = (state) => {
    const groupWidth = state.getGroupOuterWidth(state);
    const offs = state.visibilityOffset;

    const left = state.scrollLeft - offs;
    const firstItem = Math.floor(left / groupWidth);
    return Math.max(0, firstItem);
};

/** Returns count of visible items from specified index */
export const getVisibleGroupsCount = (firstItemIndex, state) => {
    const groupWidth = state.getGroupOuterWidth(state);
    const longestSet = getLongestDataSet(state);
    const offs = state.visibilityOffset;
    const first = Math.max(0, firstItemIndex);

    const width = state.containerWidth + 2 * offs;
    const itemsOnWidth = Math.round(width / groupWidth);
    return Math.min(longestSet.length - first, itemsOnWidth);
};

/** Returns group index for specified position on x-axis */
export const getGroupIndexByX = (x, state) => {
    const groupOuterWidth = state.getGroupOuterWidth(state);
    return Math.floor(x / groupOuterWidth);
};

/** Returns series value for specified items group */
export const getSeriesByIndex = (index, state) => {
    if (index === -1) {
        return null;
    }

    const { series } = state.data;
    const ind = minmax(0, series.length - 1, index);
    return series[ind];
};

/** Return array of values */
export const mapValues = (items) => {
    if (!items || !Array.isArray(items)) {
        return null;
    }

    return items.flat().map((item) => item.value + item.valueOffset);
};

/**
 * Returns specified value rounded to default precision for SVG
 *
 * @param {number|string} value
 * @param {boolean} asPixels
 * @returns {string}
 */
export const formatCoord = (value, asPixels = false) => {
    const fmt = parseFloat(parseFloat(value).toFixed(SVG_VALUE_PRECISION)).toString();
    return (asPixels) ? `${fmt}px` : fmt;
};

/** Updates width of chart component */
export const updateChartWidth = (state) => {
    const groupsWidth = (isFunction(state.getGroupOuterWidth))
        ? state.groupsCount * state.getGroupOuterWidth(state)
        : 0;
    const contentWidth = Math.max(groupsWidth, state.lastHLabelOffset);

    return {
        ...state,
        chartContentWidth: contentWidth,
        chartWidth: Math.max(state.scrollerWidth, contentWidth),
    };
};

/** Calculate width and margin of bar for fitToWidth option */
export const updateColumnWidth = (state) => {
    if (!state.fitToWidth) {
        return state;
    }

    const groupOuterWidth = (state.groupsCount > 0)
        ? state.scrollerWidth / state.groupsCount
        : 0;
    const groupsGap = groupOuterWidth / 5;
    const groupWidth = groupOuterWidth - groupsGap;
    const columnWidth = (state.columnsInGroup > 0)
        ? Math.min(state.maxColumnWidth, groupWidth / state.columnsInGroup)
        : 0;

    return {
        ...state,
        columnWidth,
        groupsGap,
    };
};

/** Calculates new state for specified chart data */
export const getDataState = (data, state) => {
    if (state.data === data) {
        return state;
    }

    const newState = {
        ...state,
        data: {
            values: [],
            series: [],
            stacked: false,
            ...data,
        },
        lastHLabelOffset: 0,
    };

    newState.dataSets = state.getDataSets(newState);
    newState.groupsCount = state.getGroupsCount(newState);
    newState.columnsInGroup = state.getColumnsInGroupCount(newState);
    newState.grid = state.calculateGrid(data.values, newState);

    return newState;
};
