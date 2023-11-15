import { asArray, isDate } from '@jezvejs/types';
import { isSameDate } from '@jezvejs/datetime';
import { createSlice } from '../Store/Store.js';

import {
    MONTH_VIEW,
    YEAR_VIEW,
    YEARRANGE_VIEW,
    getPrevViewDate,
    includesDate,
    getNextViewDate,
} from './utils.js';

// Reducers
const slice = createSlice({
    show: (state, visible) => (
        (state.visible === visible)
            ? state
            : { ...state, visible }
    ),

    setRangePart: (state, rangePart) => (
        (state.rangePart === rangePart)
            ? state
            : { ...state, rangePart }
    ),

    setReadyState: (state, update) => ({
        ...state,
        ...update,
        transition: null,
        secondViewTransition: false,
    }),

    resize: (state, update) => ({
        ...state,
        ...update,
        secondViewTransition: false,
    }),

    zoomIn: (state, { date, secondViewTransition }) => (
        ([YEAR_VIEW, YEARRANGE_VIEW].includes(state.viewType))
            ? {
                ...state,
                transition: 'zoomIn',
                viewType: (state.viewType === YEAR_VIEW) ? MONTH_VIEW : YEAR_VIEW,
                date,
                secondViewTransition,
            }
            : state
    ),

    zoomOut: (state, { secondViewTransition }) => (
        ([MONTH_VIEW, YEAR_VIEW].includes(state.viewType))
            ? {
                ...state,
                transition: 'zoomOut',
                viewType: (state.viewType === MONTH_VIEW) ? YEAR_VIEW : YEARRANGE_VIEW,
                secondViewTransition,
            }
            : state
    ),

    navigateToPrev: (state) => ({
        ...state,
        date: getPrevViewDate(state.date, state.viewType),
        transition: 'slideToPrevious',
    }),

    navigateToNext: (state) => ({
        ...state,
        date: getNextViewDate(state.date, state.viewType),
        transition: 'slideToNext',
    }),

    showMonth: (state, date) => ({
        ...state,
        viewType: MONTH_VIEW,
        date,
    }),

    showYear: (state, date) => ({
        ...state,
        viewType: YEAR_VIEW,
        date,
    }),

    showYearRange: (state, date) => ({
        ...state,
        viewType: YEARRANGE_VIEW,
        date,
    }),

    selectDay: (state, date) => {
        if (!state.multiple) {
            return {
                ...state,
                actDate: date,
            };
        }

        return {
            ...state,
            actDate: (includesDate(state.actDate, date))
                ? asArray(state.actDate).filter((item) => !isSameDate(item, date))
                : [...asArray(state.actDate), date],
        };
    },

    startRangeSelect: (state, date) => ({
        ...state,
        curRange: { start: null, end: null },
        selRange: {
            start: date,
            end: null,
        },
    }),

    setSelection: (state, options) => {
        const {
            startDate,
            endDate,
            navigateToFirst = true,
        } = options;

        if (!isDate(startDate)) {
            return state;
        }

        const date = startDate.getTime();
        const newState = {
            ...state,
        };
        if (navigateToFirst) {
            newState.viewType = MONTH_VIEW;
            newState.date = new Date(date);
        }

        if (isDate(endDate)) {
            const dateTo = endDate.getTime();
            newState.curRange = {
                start: new Date(Math.min(date, dateTo)),
                end: new Date(Math.max(date, dateTo)),
            };
            newState.selRange = { start: null, end: null };
        } else {
            newState.actDate = new Date(date);
        }

        return newState;
    },

    clearSelection: (state) => ({
        ...state,
        curRange: { start: null, end: null },
        selRange: { start: null, end: null },
        actDate: null,
    }),

    setDisabledDateFilter: (state, disabledDateFilter) => (
        (state.disabledDateFilter === disabledDateFilter)
            ? state
            : { ...state, disabledDateFilter }
    ),
});

export const { actions, reducer } = slice;
