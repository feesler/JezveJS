import { isNumber } from '@jezvejs/types';
import { createSVGElement, getClassName, setAttributes } from '@jezvejs/dom';
import { Component } from '../../../../Component.js';

import { formatCoord } from '../../../BaseChart/helpers.js';

import './HistogramDataItem.scss';

/* CSS classes */
const BAR_CLASS = 'histogram__bar';
const CATEGORY_INDEX_CLASS = 'histogram_category-ind-';
const CATEGORY_CLASS = 'histogram_category-';
const COLUMN_CLASS = 'histogram_column-';
const ACTIVE_ITEM_CLASS = 'chart__item_active';

const defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    groupIndex: 0,
    columnIndex: 0,
    category: null,
    categoryIndex: 0,
    active: false,
    groupName: null,
    autoScale: false,
    animate: false,
    stacked: false,
};

/**
 * Histogram chart data item component
 */
export class HistogramDataItem extends Component {
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

    get x() {
        return this.state.x;
    }

    get y() {
        return this.state.y;
    }

    get width() {
        return this.state.width;
    }

    get height() {
        return this.state.height;
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

    get groupName() {
        return this.state.groupName;
    }

    init() {
        this.elem = createSVGElement('rect', {
            attrs: {
                class: BAR_CLASS,
            },
        });
    }

    /** Sets vertical position and height of item */
    setVerticalPos(y, height) {
        if (this.state.y === y && this.state.height === height) {
            return;
        }

        this.setState({ ...this.state, y, height });
    }

    /** Sets horizontal position and width of item */
    setHorizontalPos(x, width) {
        if (this.state.x === x && this.state.width === width) {
            return;
        }

        this.setState({ ...this.state, x, width });
    }

    renderAttributes(state, prevState) {
        const animateAttributes = ['y', 'height'];
        const availAttributes = ['x', 'y', 'width', 'height'];
        const attrs = {};

        for (let i = 0; i < availAttributes.length; i += 1) {
            const name = availAttributes[i];
            if (
                state[name] === prevState?.[name]
                && state.animateNow === prevState.animateNow
            ) {
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

        const columnClass = `${COLUMN_CLASS}${state.columnIndex + 1}`;
        const classNames = [BAR_CLASS, columnClass];
        if (state.stacked) {
            const categoryIndexClass = `${CATEGORY_INDEX_CLASS}${state.categoryIndex + 1}`;
            classNames.push(categoryIndexClass);

            if (state.category !== null) {
                const categoryClass = `${CATEGORY_CLASS}${state.category}`;
                classNames.push(categoryClass);
            }
        }
        setAttributes(this.elem, { class: getClassName(classNames) });

        this.elem.classList.toggle(ACTIVE_ITEM_CLASS, !!state.active);

        this.renderAttributes(state, prevState);
    }
}
