import { minmax } from 'jezvejs';

export const getSliderStart = (state) => (
    minmax(
        0,
        1,
        state.scrollLeft / state.scrollWidth,
    )
);

export const getSliderEnd = (state) => (
    minmax(
        0,
        1,
        (state.scrollLeft + state.scrollerWidth) / state.scrollWidth,
    )
);

export const getSliderChangeType = (value, state) => {
    const { start, end } = value;

    if (state.start === start && state.end === end) {
        return null;
    }

    if (state.start === start && state.end !== end) {
        return 'start';
    }

    if (state.start !== start && state.end === end) {
        return 'end';
    }

    if (
        (state.start > start && state.end > end)
        || (state.start < start && state.end < end)
    ) {
        return 'scroll';
    }

    return 'resize';
};
