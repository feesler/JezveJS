import { createElement, createSVGElement } from '@jezvejs/dom';
import { Component } from '../../../../js/Component.js';
import { Icon } from '../../../Icon/Icon.js';

import './MenuCheckbox.scss';

/* CSS classes */
const CHECKBOX_CLASS = 'menu-checkbox';
const ICON_CLASS = 'menu-checkbox__icon';

const ICON_PATH = 'm17.5 6.31a.555.555 0 01.542.148l1.19 1.19a.555.555 0 010 .793l-9.1 9.1c-.218.218-.595.218-.793 0l-4.66-4.64a.555.555 0 010-.793l1.19-1.19a.555.555 0 01.793 0l3.05 3.07 7.53-7.53a.555.555 0 01.251-.148z';
const ICON_VIEWBOX = '0 0 24 24';

const defaultProps = {
    selected: false,
    checkboxSide: 'left', // available value: 'left', 'right'
};

/**
 * Checkbox menu list item component
 */
export class MenuCheckbox extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        this.elem = createElement('div', {
            props: { className: CHECKBOX_CLASS },
            children: Icon.create({
                icon: this.createCheckIcon(),
                className: ICON_CLASS,
            }).elem,
        });
    }

    createCheckIcon() {
        return createSVGElement('svg', {
            attrs: { viewBox: ICON_VIEWBOX },
            children: createSVGElement('path', { attrs: { d: ICON_PATH } }),
        });
    }
}
