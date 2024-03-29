import { getClassName } from '@jezvejs/dom';
import { deepMeet } from '../../../../../common.js';
import { Menu } from '../../../../Menu/Menu.js';

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
        Check: null,
        Checkbox: null,
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
        this.notifyEvent('onInput', e);
    }

    setActive(itemId) {
        this.notifyEvent('onItemActivate', itemId);
    }

    getItemProps(item, state) {
        const props = super.getItemProps(item, state);

        props.multiple = state.multiple;
        props.filtered = state.filtered;
        props.hidden = item.hidden || (state.filtered && !item.matchFilter);

        return props;
    }

    isListChanged(state, prevState) {
        return (
            super.isListChanged(state, prevState)
            || !deepMeet(state.items, prevState?.items)
            || state.multiple !== prevState?.multiple
            || state.filtered !== prevState?.filtered
            || state.inputString !== prevState?.inputString
            || state.PlaceholderComponent !== prevState?.PlaceholderComponent
        );
    }
}
