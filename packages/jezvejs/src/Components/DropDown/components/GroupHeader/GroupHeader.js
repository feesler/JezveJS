import { getClassName } from '../../../../js/common.js';
import { MenuGroupHeader } from '../../../Menu/Menu.js';

import './GroupHeader.scss';

/* CSS classes */
const HEADER_CLASS = 'dd__list-group__label';

const defaultProps = {
    title: null,
};

/**
 * Menu group header component
 */
export class DropDownGroupHeader extends MenuGroupHeader {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(HEADER_CLASS, props.className),
        });
    }
}
