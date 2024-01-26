import { asArray, isFunction } from '@jezvejs/types';

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
