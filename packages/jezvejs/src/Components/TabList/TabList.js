import '../../css/common.scss';
import {
    isFunction,
    createElement,
    enable,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { LinkMenu } from '../LinkMenu/LinkMenu.js';
import { ListContainer } from '../ListContainer/ListContainer.js';
import { TabContentItem } from './TabContentItem.js';
import './TabList.scss';

const CONTAINER_CLASS = 'tab-list';
const HEADER_CLASS = 'tab-list_header';
const CONTENT_CLASS = 'tab-list__content';

const defaultProps = {
    items: [],
    disabled: false,
    selectedId: null,
    onChange: null,
};

export class TabList extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        const { items } = this.props;
        let { selectedId } = this.props;
        if (items.length === 0) {
            selectedId = null;
        } else if (selectedId === null) {
            selectedId = items[0].id.toString();
        }

        this.state = {
            ...this.props,
            selectedId,
        };

        this.init();
    }

    get disabled() {
        return this.state.disabled;
    }

    init() {
        this.tabs = LinkMenu.create({
            itemParam: 'id',
            className: HEADER_CLASS,
            onChange: (selection) => this.onChange(selection),
        });

        this.contentList = ListContainer.create({
            ItemComponent: TabContentItem,
            getItemProps: (item, { selectedId }) => ({
                ...item,
                active: item.id.toString() === selectedId,
            }),
            isListChanged: (state, prevState) => (
                state.items !== prevState.items
                || state.selectedId !== prevState.selectedId
            ),
            className: CONTENT_CLASS,
            itemSelector: TabContentItem.selector,
        });

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: [
                this.tabs.elem,
                this.contentList.elem,
            ],
        });

        this.setClassNames();
        this.render(this.state);
    }

    onChange(selected) {
        if (!selected) {
            return;
        }

        const strId = selected.toString();
        const itemToSelect = this.state.items.find((item) => item.id.toString() === strId);

        this.setState({
            ...this.state,
            selectedId: itemToSelect?.id?.toString() ?? null,
        });

        if (isFunction(this.props.onChange)) {
            this.props.onChange(itemToSelect);
        }
    }

    getItem(id) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return null;
        }

        return this.state.items.find((item) => item.id.toString() === strId);
    }

    enable(value = true) {
        const disabled = !value;
        if (this.state.disabled === disabled) {
            return;
        }
        this.setState({ ...this.state, disabled });
    }

    enableItem(id, value = true) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => (
                (item.id?.toString() !== strId)
                    ? item
                    : { ...item, disabled: !value }
            )),
        });
    }

    disableItem(id) {
        this.enableItem(id, false);
    }

    showItem(id, value = true) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return;
        }

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => (
                (item.id?.toString() !== strId)
                    ? item
                    : { ...item, hidden: !value }
            )),
        });
    }

    hideItem(id) {
        this.showItem(id, false);
    }

    setItems(items) {
        if (this.state.items === items) {
            return;
        }

        this.setState({
            ...this.state,
            items,
            selectedId: (items.length === 0) ? null : items[0].id.toString(),
        });
    }

    /** Render component state */
    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        if (
            state.items === prevState?.items
            && state.disabled === prevState?.disabled
            && state.selectedId === prevState?.selectedId
        ) {
            return;
        }

        enable(this.elem, !state.disabled);

        this.tabs.setState((tabsState) => ({
            ...tabsState,
            disabled: state.disabled,
            items: state.items.map((item) => ({
                id: item.id,
                title: item.title,
                selected: item.id?.toString() === state.selectedId,
                disabled: item.disabled,
                hidden: item.hidden,
            })),
        }));

        this.contentList.setState((listState) => ({
            ...listState,
            items: state.items,
            selectedId: state.selectedId,
        }));
    }
}
