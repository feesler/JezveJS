import { isFunction } from '@jezvejs/types';
import { createSVGElement, setAttributes } from '@jezvejs/dom';

import { Component } from '../../../../Component.js';

import { formatCoord } from '../../helpers.js';

import './BaseChartGrid.scss';

/* CSS classes */
const GRID_LINE_CLASS = 'chart__grid-line';

const defaultProps = {
    grid: null,
    yAxisGrid: true,
    xAxisGrid: false,
    getGroupOuterWidth: null,
    getFirstVisibleGroupIndex: null,
    getVisibleGroupsCount: null,
};

/**
 * Chart grid component
 */
export class BaseChartGrid extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        if (!isFunction(this.props.getGroupOuterWidth)) {
            throw new Error('Invalid getGroupOuterWidth callback');
        }
        if (!isFunction(this.props.getFirstVisibleGroupIndex)) {
            throw new Error('Invalid getFirstVisibleGroupIndex callback');
        }
        if (!isFunction(this.props.getVisibleGroupsCount)) {
            throw new Error('Invalid getVisibleGroupsCount callback');
        }

        this.xAxisGridGroup = null;
        this.xAxisGridLines = [];
        this.yAxisGridGroup = null;
        this.yAxisGridLines = [];

        this.state = {
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.elem = createSVGElement('g');
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

    renderYAxisGrid(state) {
        const { grid } = state;

        if (!grid?.steps || !state.yAxisGrid) {
            this.yAxisGridGroup?.remove();
            this.yAxisGridGroup = null;
            return;
        }

        const width = state.chartWidth;

        const yAxisGridGroup = this.yAxisGridGroup ?? createSVGElement('g');
        const yAxisGridLines = [];
        let step = 0;
        let curY = grid.yFirst;

        while (step <= grid.steps) {
            let rY = Math.round(curY);
            if (rY > curY) {
                rY -= 0.5;
            } else {
                rY += 0.5;
            }

            const linePath = `M0,${rY}L${width},${rY}`;

            let gridLine = this.yAxisGridLines.find((item) => !yAxisGridLines.includes(item));
            if (gridLine) {
                setAttributes(gridLine.elem, { d: linePath });
            } else {
                gridLine = {
                    elem: createSVGElement('path', {
                        attrs: {
                            class: GRID_LINE_CLASS,
                            d: linePath,
                        },
                    }),
                };
                yAxisGridGroup.append(gridLine.elem);
            }

            yAxisGridLines.push(gridLine);

            curY += grid.yStep;
            step += 1;
        }

        // Remove grid lines not included to new state
        for (let ind = 0; ind < this.yAxisGridLines.length; ind += 1) {
            const item = this.yAxisGridLines[ind];
            if (!yAxisGridLines.includes(item)) {
                item?.elem?.remove();
            }
        }

        if (!this.yAxisGridGroup) {
            this.elem.append(yAxisGridGroup);
            this.yAxisGridGroup = yAxisGridGroup;
        }

        this.yAxisGridLines = yAxisGridLines;
    }

    renderXAxisGrid(state) {
        const { grid } = state;

        if (!grid?.steps || !state.xAxisGrid) {
            this.xAxisGridGroup?.remove();
            this.xAxisGridGroup = null;
            this.xAxisGridLines = [];
            return;
        }

        const xAxisGridLines = [];
        const xAxisGridGroup = this.xAxisGridGroup ?? createSVGElement('g');
        const groupOuterWidth = this.getGroupOuterWidth(state);
        const firstGroupIndex = this.getFirstVisibleGroupIndex(state);
        const visibleGroups = this.getVisibleGroupsCount(firstGroupIndex, state);

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

            // Try to find lint with same groupIndex first
            let gridLine = this.xAxisGridLines.find((item) => item?.groupIndex === groupIndex);
            // If not found take last not reused item
            if (!gridLine) {
                gridLine = this.xAxisGridLines.findLast((item) => !xAxisGridLines.includes(item));
            }
            // Create new item if there is nothing to reuse
            if (!gridLine) {
                gridLine = {
                    elem: createSVGElement('path', {
                        attrs: { class: GRID_LINE_CLASS },
                    }),
                };
                xAxisGridGroup.append(gridLine.elem);
            }
            gridLine.groupIndex = groupIndex;

            const curX = groupIndex * groupOuterWidth;
            let rX = Math.round(curX);
            rX += (rX > curX) ? -0.5 : 0.5;
            rX = formatCoord(rX);

            const y0 = formatCoord(state.grid.yFirst);
            const y1 = formatCoord(state.grid.yLast);

            setAttributes(gridLine.elem, {
                d: `M${rX},${y0}L${rX},${y1}`,
            });

            xAxisGridLines.push(gridLine);
        }

        // Remove grid lines not included to new state
        for (let ind = 0; ind < this.xAxisGridLines.length; ind += 1) {
            const item = this.xAxisGridLines[ind];
            if (!xAxisGridLines.includes(item)) {
                item?.elem?.remove();
            }
        }

        if (!this.xAxisGridGroup) {
            this.xAxisGridGroup = xAxisGridGroup;
            this.elem.append(this.xAxisGridGroup);
        }

        this.xAxisGridLines = xAxisGridLines;
    }

    render(state, prevState = {}) {
        this.renderYAxisGrid(state, prevState);
        this.renderXAxisGrid(state, prevState);
    }
}
