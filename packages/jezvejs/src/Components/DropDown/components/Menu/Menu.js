import { getClassName, isFunction } from '../../../../js/common.js';
import { Menu } from '../../../Menu/Menu.js';

import './Menu.scss';

/* CSS classes */
const LIST_CLASS = 'dd__list';

const defaultProps = {
    parentId: null,
    items: [],
    showInput: false,
    getItemById: null,
    onItemActivate: null,
    onItemClick: null,
    onPlaceholderClick: null,
    multiple: false,
    filtered: false,
    getPlaceholderProps: null,
    header: {
        inputElem: null,
        inputString: '',
        inputPlaceholder: '',
        useSingleSelectionAsPlaceholder: false,
        onInput: null,
    },
    components: {
        Header: null,
        Input: null,
        MenuList: null,
        ListItem: null,
        ListPlaceholder: null,
        GroupItem: null,
    },
};

/**
 * DropDown Menu container component
 */
export class DropDownMenu extends Menu {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(LIST_CLASS, props.className),
            renderTime: props.renderTime,
            header: {
                ...defaultProps.header,
                ...(props?.header ?? {}),
            },
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        this.elem.dataset.parent = this.props.parentId;
    }

    onInput(e) {
        if (isFunction(this.props.onInput)) {
            this.props.onInput(e);
        }
    }

    setActive(itemId) {
        if (isFunction(this.props.onItemActivate)) {
            this.props.onItemActivate(itemId);
        }
    }
}
