import { createElement } from '../../../../js/common.js';
import { Component } from '../../../../js/Component.js';
import { isVisibleItem } from '../../utils.js';
import './GroupItem.scss';

/* CSS classes */
const GROUP_CLASS = 'dd__list-group';
const HEADER_CLASS = 'dd__list-group__label';

const defaultProps = {
    id: null,
    title: null,
    multi: false,
    filtered: false,
    components: {
        MenuList: null,
        ListItem: null,
    },
};

/**
 * Items group component
 */
export class DropDownGroupItem extends Component {
    static get className() {
        return GROUP_CLASS;
    }

    static get selector() {
        return 'li';
    }

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        if (typeof this.props.id === 'undefined' || this.props.id === null) {
            throw new Error('Invalid id');
        }

        this.state = {
            ...this.props,
            id: this.props.id.toString(),
        };

        this.init();
    }

    get id() {
        return this.state.id;
    }

    init() {
        this.titleElem = createElement('div', {
            props: { className: HEADER_CLASS },
        });

        const { MenuList, ListItem } = this.props.components;
        if (!MenuList) {
            throw new Error('Invalid menu list component');
        }
        if (!ListItem) {
            throw new Error('Invalid list item component');
        }

        this.list = MenuList.create({
            multi: this.props.multi,
            noItemsMessage: null,
            components: {
                ListItem,
                GroupItem: null,
            },
        });

        this.elem = createElement('div', {
            props: { className: GROUP_CLASS },
            children: [
                this.titleElem,
                this.list.elem,
            ],
        });

        this.render(this.state);
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.titleElem.textContent = state.title;

        this.list.setState((listState) => ({
            ...listState,
            items: state.items,
            filtered: state.filtered,
            multi: state.multi,
        }));

        const showGroup = state.items.some((item) => isVisibleItem(item, state));
        this.show(showGroup);
    }
}
