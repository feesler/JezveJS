import { isFunction } from '@jezvejs/types';
import { createElement, createSVGElement, setAttributes } from '@jezvejs/dom';
import { Component } from '../../../../Component.js';
import './BaseChartYAxisLabels.scss';

/* CSS classes */
const CONTAINER_CLASS = 'chart-y-axis-labels';
const CONTENT_CLASS = 'chart-y-axis-labels__content';
const LEFT_POSITION_CLASS = 'chart-y-axis-labels_left';
const RIGHT_ALIGN_CLASS = 'chart-y-axis-labels_right-align';
const CENTER_ALIGN_CLASS = 'chart-y-axis-labels_center-align';
const LABEL_CLASS = 'chart__text chart-y-axis-labels__label';

const WIDTH_PADDING = 10;
const X_OFFSET = 5;
const Y_OFFSET = 5.5;

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
        if (!availableAlign.includes(state.yAxisLabelsAlign)) {
            throw new Error('Invalid value of \'yAxisLabelsAlign\' property');
        }

        if (state.yAxis === 'none') {
            this.elem?.remove();
            return;
        }

        // yAxis
        this.elem.classList.toggle(LEFT_POSITION_CLASS, state.yAxis === 'left');

        // yAxisLabelsAlign
        const isRightAlign = state.yAxisLabelsAlign === 'right';
        const isCenterAlign = state.yAxisLabelsAlign === 'center';
        this.elem.classList.toggle(RIGHT_ALIGN_CLASS, isRightAlign);
        this.elem.classList.toggle(CENTER_ALIGN_CLASS, isCenterAlign);

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

        this.labels = [];
        this.labelsGroup = createSVGElement('g');

        while (step <= grid.steps) {
            const isZero = Math.abs(grid.toPrec(val)) === 0;
            const tVal = (isZero) ? 0 : grid.toPrecString(val);

            const label = {
                elem: createSVGElement('text', {
                    attrs: {
                        class: LABEL_CLASS,
                        x: X_OFFSET,
                        y: Math.round(curY) + Y_OFFSET,
                    },
                }),
            };
            label.elem.textContent = formatFunction(tVal);

            this.labelsGroup.append(label.elem);
            this.labels.push(label);

            val -= grid.valueStep;
            curY += grid.yStep;
            step += 1;
        }

        this.container.append(this.labelsGroup);

        const labelRect = this.labelsGroup.getBBox();
        const labelsWidth = Math.ceil(labelRect.width) + WIDTH_PADDING;

        // Update positions
        if (isRightAlign || isCenterAlign) {
            const x = (isRightAlign) ? (labelsWidth - X_OFFSET) : (labelsWidth / 2);
            for (let ind = 0; ind < this.labels.length; ind += 1) {
                const label = this.labels[ind];
                setAttributes(label.elem, { x });
            }
        }

        this.container.setAttribute('width', labelsWidth);
    }
}
