import { isFunction } from '@jezvejs/types';
import { createElement } from '@jezvejs/dom';

import { Component } from '../../../../Component.js';
import { px } from '../../../../common.js';

import './BaseChartXAxisLabels.scss';

/* CSS classes */
const CONTAINER_CLASS = 'chart-x-axis-labels';
const LABEL_CLASS = 'chart__text chart-x-axis__label';

const availablePositions = ['bottom', 'top', 'none'];

const defaultProps = {
    xAxis: 'bottom', // available values: 'bottom', 'top' and 'none'
    hLabelsHeight: 25,
    allowLastXAxisLabelOverflow: true,
    renderXAxisLabel: null,
    isHorizontalScaleNeeded: null,
    getGroupOuterWidth: null,
    getFirstVisibleGroupIndex: null,
    getVisibleGroupsCount: null,
    onResize: null,
};

/**
 * Chart x-axis labels component
 */
export class BaseChartXAxisLabels extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        if (!isFunction(this.props.isHorizontalScaleNeeded)) {
            throw new Error('Invalid isHorizontalScaleNeeded callback');
        }
        if (!isFunction(this.props.getGroupOuterWidth)) {
            throw new Error('Invalid getGroupOuterWidth callback');
        }
        if (!isFunction(this.props.getFirstVisibleGroupIndex)) {
            throw new Error('Invalid getFirstVisibleGroupIndex callback');
        }
        if (!isFunction(this.props.getVisibleGroupsCount)) {
            throw new Error('Invalid getVisibleGroupsCount callback');
        }
        if (!isFunction(this.props.onResize)) {
            throw new Error('Invalid onResize callback');
        }

        this.labels = [];

        this.state = {
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
        });
    }

    isHorizontalScaleNeeded(state, prevState) {
        return this.props.isHorizontalScaleNeeded(state, prevState);
    }

    getGroupOuterWidth(state) {
        return this.props.getGroupOuterWidth(state);
    }

    getFirstVisibleGroupIndex(state) {
        return this.props.getFirstVisibleGroupIndex(state);
    }

    getVisibleGroupsCount(firstGroupIndex, state) {
        return this.props.getVisibleGroupsCount(firstGroupIndex, state);
    }

    getLabelRenderer(state = this.state) {
        return isFunction(state.renderXAxisLabel)
            ? state.renderXAxisLabel
            : (value) => value?.toString();
    }

    onResize() {
        return this.props.onResize();
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        const { xAxis } = state;
        if (!availablePositions.includes(xAxis)) {
            throw new Error('Invalid value of \'xAxis\' property');
        }

        if (xAxis === 'none') {
            this.elem?.remove();
            return;
        }

        const dyOffset = 5.5;

        const groupOuterWidth = this.getGroupOuterWidth(state);
        const firstGroupIndex = this.getFirstVisibleGroupIndex(state);
        const visibleGroups = this.getVisibleGroupsCount(firstGroupIndex, state);
        const formatFunction = this.getLabelRenderer(state);

        const labels = [];
        for (let i = 0; i < visibleGroups; i += 1) {
            const groupIndex = firstGroupIndex + i;
            const value = state.data.series[groupIndex];
            if (typeof value === 'undefined') {
                break;
            }

            const prevValue = state.data.series[groupIndex - 1] ?? null;
            if (value === prevValue) {
                continue;
            }

            let label = this.labels.find((item) => item?.groupIndex === groupIndex);
            if (label) {
                label.reused = true;
            } else {
                label = {
                    reused: false,
                    groupIndex,
                    value,
                    formattedValue: formatFunction(value),
                    elem: createElement('span', {
                        props: { className: LABEL_CLASS },
                    }),
                };

                label.elem.textContent = label.formattedValue;
                this.elem.append(label.elem);
            }

            label.elem.style.left = px(groupIndex * groupOuterWidth);
            label.elem.style.top = px(dyOffset);

            labels.push(label);
        }

        let lastOffset = 0;
        const lblMarginLeft = 10;
        const labelsToRemove = [];
        let resizeRequested = false;
        let prevLabel = null;
        const toLeft = (
            !this.isHorizontalScaleNeeded(state, prevState)
            && prevState.scrollLeft > 0
            && state.scrollLeft < prevState.scrollLeft
        );

        for (let ind = 0; ind < labels.length; ind += 1) {
            const index = (toLeft) ? (labels.length - ind - 1) : ind;
            const label = labels[index];
            const labelRect = label.elem.getBoundingClientRect();
            const currentOffset = Math.ceil(labelRect.x + labelRect.width);

            const overflow = (toLeft)
                ? (currentOffset + lblMarginLeft > lastOffset)
                : (labelRect.x < lastOffset + lblMarginLeft);

            // Check current label not intersects previous one
            if (lastOffset > 0 && overflow) {
                labelsToRemove.push((!prevLabel.reused && label.reused) ? prevLabel : label);
                if (prevLabel?.reused || !label.reused) {
                    continue;
                }
            }

            // Check last label not overflow chart to prevent
            // horizontal scroll in fitToWidth mode
            if (currentOffset - state.chartContentWidth > 1) {
                resizeRequested = !state.fitToWidth;
                if (state.fitToWidth || !state.allowLastXAxisLabelOverflow) {
                    labelsToRemove.push(label);
                    continue;
                }
            }

            lastOffset = (toLeft) ? labelRect.x : currentOffset;
            prevLabel = label;
        }

        // Remove overflow labels
        for (let ind = 0; ind < labelsToRemove.length; ind += 1) {
            const label = labelsToRemove[ind];
            label?.elem?.remove();

            const labelsIndex = labels.indexOf(label);
            if (labelsIndex !== -1) {
                labels.splice(labelsIndex, 1);
            }
        }

        // Remove labels not included to new state
        for (let ind = 0; ind < this.labels.length; ind += 1) {
            const label = this.labels[ind];
            if (!labels.includes(label)) {
                label?.elem?.remove();
            }
        }

        this.labels = labels;

        if (resizeRequested) {
            setTimeout(() => this.onResize());
        }
    }
}
