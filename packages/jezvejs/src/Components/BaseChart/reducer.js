import { createSlice } from '../Store/Store.js';

import {
    isSameTarget,
    updateChartWidth,
    updateColumnWidth,
    getDataState,
} from './helpers.js';

// Reducers
const slice = createSlice({
    setScroll: (state, scrollLeft) => (
        (state.scrollLeft === scrollLeft)
            ? state
            : { ...state, scrollLeft }
    ),

    setColumnWidth: (state, value) => {
        const width = parseFloat(value, 10);
        if (Number.isNaN(width) || width < 1 || state.columnWidth === width) {
            return state;
        }

        return updateChartWidth({
            ...state,
            columnWidth: Math.min(width, state.maxColumnWidth),
            lastHLabelOffset: 0,
        });
    },

    setGroupsGap: (state, value) => {
        const groupsGap = parseFloat(value, 10);
        if (Number.isNaN(groupsGap) || state.groupsGap === groupsGap) {
            return state;
        }

        return updateChartWidth({
            ...state,
            groupsGap,
            lastHLabelOffset: 0,
        });
    },

    setActiveCategory: (state, activeCategory) => (
        (state.activeCategory === activeCategory)
            ? state
            : { ...state, activeCategory }
    ),

    activateTarget: (state, target) => {
        if (
            !target?.item
            || isSameTarget(state.activeTarget, target)
        ) {
            return state;
        }

        const { item, ...targetProps } = target;

        return {
            ...state,
            activeTarget: { item: item.state, ...targetProps },
        };
    },

    deactivateTarget: (state) => (
        (state.activeTarget)
            ? { ...state, activeTarget: null }
            : state
    ),

    ignoreTouch: (state) => (
        (state.ignoreTouch)
            ? state
            : { ...state, ignoreTouch: true }
    ),

    itemClicked: (state) => ({
        ...state,
        popupTarget: (
            (state.showPopupOnClick && !state.pinPopupOnClick)
                ? state.activeTarget
                : null
        ),
        pinnedTarget: (state.pinPopupOnClick) ? state.activeTarget : null,
    }),

    itemOver: (state) => (
        (state.showPopupOnHover)
            ? { ...state, popupTarget: state.activeTarget }
            : state
    ),

    hidePopup: (state) => (
        (state.popupTarget)
            ? { ...state, popupTarget: null }
            : state
    ),

    animationDone: (state) => (
        (state.animateNow)
            ? { ...state, animateNow: false }
            : state
    ),

    scroll: (state, layout) => ({
        ...state,
        ...layout,
        animateNow: false,
    }),

    resize: (state, layout) => {
        let newState = {
            ...state,
            ...layout,
        };

        newState = {
            ...newState,
            grid: state.calculateGrid(newState.data.values, newState),
        };

        newState = updateColumnWidth(newState);

        // Update width of x axis labels
        newState.lastHLabelOffset = (!newState.fitToWidth)
            ? Math.ceil(newState.lastHLabelOffset)
            : 0;

        return updateChartWidth({
            ...newState,
            animateNow: false,
        });
    },

    setData: (state, { data, layout }) => {
        if (state.data === data) {
            return state;
        }

        let newState = {
            ...getDataState(data, state),
            ...layout,
            activeTarget: null,
            popupTarget: null,
            pinnedTarget: null,
            activeCategory: null,
            animateNow: false,
        };

        newState = updateColumnWidth(newState);
        return updateChartWidth(newState);
    },

    scaleVisible: (state, values) => (
        (state.autoScale && values?.length > 0)
            ? {
                ...state,
                grid: state.calculateGrid(values, state),
                animateNow: state.animate,
            }
            : state
    ),
});

export const { actions, reducer } = slice;
