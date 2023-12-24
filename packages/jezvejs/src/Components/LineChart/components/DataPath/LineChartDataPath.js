import { createSVGElement, getClassName, setAttributes } from '@jezvejs/dom';
import { Component } from '../../../../Component.js';
import './LineChartDataPath.scss';

/* CSS classes */
const PATH_CLASS = 'linechart__path';
const CATEGORY_CLASS = 'linechart_category-';
const CATEGORY_INDEX_CLASS = 'linechart_category-ind-';
const ACTIVE_ITEM_CLASS = 'chart__item_active';

const defaultProps = {
    shape: null,
    groupIndex: 0,
    category: null,
    categoryIndex: 0,
    active: false,
    autoScale: false,
    animate: false,
    animateNow: false,
    onAnimationDone: null,
};

/**
 * LineChart data path component
 */
export class LineChartDataPath extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    get shape() {
        return this.state.shape;
    }

    get groupIndex() {
        return this.state.groupIndex;
    }

    get category() {
        return this.state.category;
    }

    get categoryIndex() {
        return this.state.categoryIndex;
    }

    init() {
        this.elem = createSVGElement('path', {
            attrs: {
                class: PATH_CLASS,
            },
        });
    }

    setShape(shape) {
        if (this.state.shape === shape) {
            return;
        }

        this.setState({ ...this.state, shape });
    }

    renderClassName(state, prevState) {
        if (
            state.categoryIndex === prevState?.categoryIndex
            && state.category === prevState?.category
        ) {
            return;
        }

        const categoryIndexClass = `${CATEGORY_INDEX_CLASS}${state.categoryIndex + 1}`;
        const classNames = [PATH_CLASS, categoryIndexClass];
        if (state.category !== null) {
            const categoryClass = `${CATEGORY_CLASS}${state.category}`;
            classNames.push(categoryClass);
        }
        setAttributes(this.elem, { class: getClassName(classNames) });
    }

    renderShape(state, prevState) {
        const isAnimated = state.autoScale && state.animate && state.animateNow;

        if (!isAnimated) {
            this.animateElem?.remove();
            this.animateElem = null;
            this.elem.setAttribute('d', state.shape);
            return;
        }

        if (!this.animateElem) {
            this.animateElem = createSVGElement('animate', {
                attrs: {
                    attributeType: 'XML',
                    attributeName: 'd',
                    dur: '0.5s',
                    begin: 'indefinite',
                    fill: 'freeze',
                    repeatCount: '1',
                    calcMode: 'linear',
                },
                events: {
                    endEvent: () => this.notifyEvent('onAnimationDone'),
                },
            });
        }

        if (state.shape !== prevState.shape) {
            this.animateElem.setAttribute('from', prevState.shape);
            this.animateElem.setAttribute('to', state.shape);
        }

        this.elem.append(this.animateElem);
        this.animateElem.beginElement();
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error(state);
        }

        this.renderClassName(state, prevState);
        this.renderShape(state, prevState);

        this.elem.classList.toggle(ACTIVE_ITEM_CLASS, !!state.active);
    }
}
