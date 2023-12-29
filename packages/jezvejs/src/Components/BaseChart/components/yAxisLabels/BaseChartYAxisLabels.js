import { isFunction } from '@jezvejs/types';
import { createElement } from '@jezvejs/dom';

import { Component } from '../../../../Component.js';
import { px } from '../../../../common.js';

import './BaseChartYAxisLabels.scss';

/* CSS classes */
const CONTAINER_CLASS = 'chart-y-axis-labels';
const CONTENT_CLASS = 'chart-y-axis-labels__content';
const RIGHT_ALIGN_CLASS = 'chart-y-axis-labels_right-align';
const CENTER_ALIGN_CLASS = 'chart-y-axis-labels_center-align';
const LABEL_CLASS = 'chart__text chart-y-axis-labels__label';

const availablePositions = ['right', 'left', 'none'];
const availableAlign = ['right', 'left', 'center'];

const defaultProps = {
    yAxis: 'right',
    yAxisLabelsAlign: 'left',
    grid: null,
    renderYAxisLabel: null,
};

/**
 * Chart y-axis labels component
 */
export class BaseChartYAxisLabels extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.labels = [];

        this.state = {
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.container = createElement('div', {
            props: { className: CONTENT_CLASS },
        });

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: this.container,
        });
    }

    getLabelRenderer(state = this.state) {
        return isFunction(state.renderYAxisLabel)
            ? state.renderYAxisLabel
            : (value) => value?.toString();
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (!availablePositions.includes(state.yAxis)) {
            throw new Error('Invalid value of \'yAxis\' property');
        }
        if (!availableAlign.includes(state.yAxisLabelsAlign)) {
            throw new Error('Invalid value of \'yAxisLabelsAlign\' property');
        }

        if (state.yAxis === 'none') {
            this.elem?.remove();
            return;
        }

        // yAxisLabelsAlign
        const isRightAlign = state.yAxisLabelsAlign === 'right';
        const isCenterAlign = state.yAxisLabelsAlign === 'center';
        this.elem.classList.toggle(RIGHT_ALIGN_CLASS, isRightAlign);
        this.elem.classList.toggle(CENTER_ALIGN_CLASS, isCenterAlign);

        const { grid } = state;
        if (!grid?.steps) {
            this.container.replaceChildren();
            return;
        }

        const formatFunction = this.getLabelRenderer(state);

        let curY = grid.yFirst;
        const firstY = curY;
        let lastY = curY;

        let val = grid.valueFirst;
        let step = 0;

        this.labels = [];
        const elems = [];

        while (step <= grid.steps) {
            lastY = curY;

            const isZero = Math.abs(grid.toPrec(val)) === 0;
            const tVal = (isZero) ? 0 : grid.toPrecString(val);

            const label = {
                elem: createElement('span', {
                    props: {
                        className: LABEL_CLASS,
                        textContent: formatFunction(tVal),
                    },
                }),
            };

            elems.push(label.elem);
            this.labels.push(label);

            val -= grid.valueStep;
            curY += grid.yStep;
            step += 1;
        }

        this.container.replaceChildren(...elems);
        this.container.style.top = px(firstY);
        this.container.style.setProperty('--chart-grid-height', px(lastY - firstY));
    }
}
