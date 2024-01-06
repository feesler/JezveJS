import { isFunction } from '@jezvejs/types';
import { createSVGElement, getClassName, setAttributes } from '@jezvejs/dom';

import { Component } from '../../../../Component.js';

import { formatCoord } from '../../helpers.js';

import './BaseChartActiveGroup.scss';

/* CSS classes */
const ACTIVE_GROUP_CLASS = 'chart__active-group';
const RECT_CLASS = 'chart__active-group-back';

const defaultProps = {
    getGroupOuterWidth: null,
};

/**
 * Chart active group component
 */
export class BaseChartActiveGroup extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(ACTIVE_GROUP_CLASS, props.className),
        });

        if (!isFunction(this.props.getGroupOuterWidth)) {
            throw new Error('Invalid getGroupOuterWidth callback');
        }

        this.state = {
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.rect = createSVGElement('rect', {
            attrs: { class: RECT_CLASS },
        });

        this.elem = createSVGElement('g', {
            attrs: { class: this.props.className },
            children: this.rect,
        });
    }

    getGroupOuterWidth(state) {
        return this.props.getGroupOuterWidth(state);
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (!state.activeGroup) {
            return;
        }

        const groupWidth = this.getGroupOuterWidth(state);
        const { groupIndex } = state.activeGroup;

        setAttributes(this.rect, {
            x: formatCoord(groupIndex * groupWidth),
            y: 0,
            width: formatCoord(groupWidth),
            height: formatCoord(state.height),
        });
    }
}
