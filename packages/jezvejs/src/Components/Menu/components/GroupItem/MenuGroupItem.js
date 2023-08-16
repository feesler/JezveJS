import { createElement, enable } from '../../../../js/common.js';
import { Component } from '../../../../js/Component.js';
// import { isVisibleItem } from '../../utils.js';
import './MenuGroupItem.scss';

/* CSS classes */
const GROUP_CLASS = 'menu-item menu-group';

const defaultProps = {
    id: null,
    title: null,
    items: [],
    defaultItemType: 'button',
    useURLParam: false,
    itemParam: 'value',
    components: {
        GroupHeader: null,
        MenuList: null,
        ListItem: null,
    },
};

/**
 * Menu list group component
 */
export class MenuGroupItem extends Component {
    static get className() {
        return GROUP_CLASS;
    }

    static get selector() {
        return `.${GROUP_CLASS}`;
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
        this.postInit();
        this.render(this.state);
    }

    get id() {
        return this.state.id;
    }

    init() {
        this.createHeader();
        this.createList();

        this.elem = createElement('div', {
            props: { className: GROUP_CLASS },
            children: [
                this.header.elem,
                this.list.elem,
            ],
        });
    }

    postInit() {
        this.setClassNames();
    }

    createHeader() {
        const { GroupHeader } = this.props.components;
        if (!GroupHeader) {
            throw new Error('Invalid group header component');
        }

        this.header = GroupHeader.create({
            title: this.props.title,
        });
    }

    createList() {
        const { MenuList, ListItem } = this.props.components;
        if (!MenuList) {
            throw new Error('Invalid menu list component');
        }
        if (!ListItem) {
            throw new Error('Invalid list item component');
        }

        this.list = MenuList.create({
            beforeContent: this.props.beforeContent,
            afterContent: this.props.afterContent,
            iconAlign: this.props.iconAlign,
            checkboxSide: this.props.checkboxSide,
            useURLParam: this.props.useURLParam,
            itemParam: this.props.itemParam,
            defaultItemType: this.props.defaultItemType,
            components: {
                ListItem,
                GroupItem: null,
            },
        });
    }

    renderHeader(state, prevState) {
        if (state.title === prevState?.title) {
            return;
        }

        this.header.setState((headerState) => ({
            ...headerState,
            title: state.title,
        }));
    }

    renderList(state, prevState) {
        if (
            state.items === prevState?.items
            && state.beforeContent === prevState?.beforeContent
            && state.afterContent === prevState?.afterContent
            && state.iconAlign === prevState?.iconAlign
            && state.checkboxSide === prevState?.checkboxSide
            && state.useURLParam === prevState?.useURLParam
            && state.itemParam === prevState?.itemParam
        ) {
            return;
        }

        this.list.setState((listState) => ({
            ...listState,
            items: state.items,
            beforeContent: state.beforeContent,
            afterContent: state.afterContent,
            iconAlign: state.iconAlign,
            checkboxSide: state.checkboxSide,
            useURLParam: state.useURLParam,
            itemParam: state.itemParam,
        }));
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        enable(this.elem, !state.disabled);

        this.renderHeader(state, prevState);
        this.renderList(state, prevState);

        /*
        const showGroup = state.items.some((item) => isVisibleItem(item, state));
        this.show(showGroup);
        */
    }
}
