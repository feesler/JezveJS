import { isNumber } from '@jezvejs/types';
import { createSVGElement, getClassName, setAttributes } from '@jezvejs/dom';
import { Component } from '../../../../Component.js';

import { formatCoord } from '../../../BaseChart/helpers.js';

import './LineChartDataItem.scss';

/* CSS classes */
const ITEM_CLASS = 'linechart__item';
const CATEGORY_CLASS = 'linechart_category-';
const CATEGORY_INDEX_CLASS = 'linechart_category-ind-';
const ACTIVE_ITEM_CLASS = 'chart__item_active';

const defaultProps = {
    cx: 0,
    cy: 0,
    r: 4,
    groupIndex: 0,
    columnIndex: 0,
    category: null,
    categoryIndex: 0,
    active: false,
    autoScale: false,
    animate: false,
};

/**
 * LineChart data item component
 */
export class LineChartDataItem extends Component {
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

    get cx() {
        return this.state.cx;
    }

    get cy() {
        return this.state.cy;
    }

    get r() {
        return this.state.r;
    }

    get groupIndex() {
        return this.state.groupIndex;
    }

    get columnIndex() {
        return this.state.columnIndex;
    }

    get category() {
        return this.state.category;
    }

    get categoryIndex() {
        return this.state.categoryIndex;
    }

    get value() {
        return this.state.value;
    }

    get valueOffset() {
        return this.state.valueOffset;
    }

    init() {
        this.elem = createSVGElement('circle', {
            attrs: {
                class: ITEM_CLASS,
            },
        });
    }

    /** Sets vertical position of item */
    setVerticalPos(cy) {
        if (this.state.cy === cy) {
            return;
        }

        this.setState({ ...this.state, cy });
    }

    /** Sets horizontal position of item */
    setHorizontalPos(cx) {
        if (this.state.cx === cx) {
            return;
        }

        this.setState({ ...this.state, cx });
    }

    renderAttributes(state, prevState) {
        const animateAttributes = ['cy'];
        const availAttributes = ['cx', 'cy', 'r'];
        const attrs = {};

        for (let i = 0; i < availAttributes.length; i += 1) {
            const name = availAttributes[i];
            if (state[name] === prevState?.[name]) {
                continue;
            }
            if (!isNumber(state[name])) {
                throw new Error(`Invalid value of '${name}' property: ${state[name]}`);
            }

            if (
                state.autoScale
                && state.animate
                && animateAttributes.includes(name)
            ) {
                if (state.animateNow) {
                    this.elem.style[name] = formatCoord(state[name], true);
                } else {
                    this.elem.style[name] = '';
                    attrs[name] = state[name];
                }
            } else {
                attrs[name] = state[name];
            }
        }

        setAttributes(this.elem, attrs);
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error(state);
        }

        const categoryIndexClass = `${CATEGORY_INDEX_CLASS}${state.categoryIndex + 1}`;
        const classNames = [ITEM_CLASS, categoryIndexClass];
        if (state.category !== null) {
            const categoryClass = `${CATEGORY_CLASS}${state.category}`;
            classNames.push(categoryClass);
        }
        setAttributes(this.elem, { class: getClassName(classNames) });

        this.elem.classList.toggle(ACTIVE_ITEM_CLASS, !!state.active);

        this.renderAttributes(state, prevState);
    }
}
