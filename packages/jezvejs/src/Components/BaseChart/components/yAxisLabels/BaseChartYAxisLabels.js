import { isFunction } from '@jezvejs/types';
import { createElement, createSVGElement } from '@jezvejs/dom';
import { Component } from '../../../../Component.js';
import './BaseChartYAxisLabels.scss';

/* CSS classes */
const CONTAINER_CLASS = 'chart-y-axis-labels';
const CONTENT_CLASS = 'chart-y-axis-labels__content';
const LEFT_POSITION_CLASS = 'chart-y-axis-labels_left';
const LABEL_CLASS = 'chart__text chart-y-axis-labels__label';

const WIDTH_PADDING = 10;
const X_OFFSET = 5;
const Y_OFFSET = 5.5;

const availablePositions = ['right', 'left', 'none'];

const defaultProps = {
    yAxis: 'right',
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

        this.labelsGroup = null;

        this.state = {
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.container = createSVGElement('svg', {
            attrs: {
                class: CONTENT_CLASS,
                width: WIDTH_PADDING,
            },
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

        if (state.yAxis === 'none') {
            this.elem?.remove();
            return;
        }

        this.elem.classList.toggle(LEFT_POSITION_CLASS, state.yAxis === 'left');

        this.labelsGroup?.remove();
        this.labelsGroup = null;
        const { grid } = state;
        if (!grid?.steps) {
            return;
        }

        const formatFunction = this.getLabelRenderer(state);

        let curY = grid.yFirst;
        if (state.xAxis === 'top') {
            curY += state.hLabelsHeight;
        }

        let val = grid.valueFirst;
        let step = 0;

        this.labelsGroup = createSVGElement('g');

        while (step <= grid.steps) {
            const isZero = Math.abs(grid.toPrec(val)) === 0;
            const tVal = (isZero) ? 0 : grid.toPrecString(val);

            const el = createSVGElement('text', {
                attrs: {
                    class: LABEL_CLASS,
                    x: X_OFFSET,
                    y: Math.round(curY) + Y_OFFSET,
                },
            });
            el.textContent = formatFunction(tVal);

            this.labelsGroup.append(el);

            val -= grid.valueStep;
            curY += grid.yStep;
            step += 1;
        }

        this.container.append(this.labelsGroup);

        const labelRect = this.labelsGroup.getBBox();
        const labelsWidth = Math.ceil(labelRect.width) + WIDTH_PADDING;

        this.container.setAttribute('width', labelsWidth);
    }
}
