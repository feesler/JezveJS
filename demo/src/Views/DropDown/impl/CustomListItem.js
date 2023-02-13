import {
    createElement,
    Component,
} from 'jezvejs';

/* CSS classes */
const LIST_ITEM_ACTIVE_CLASS = 'dd__list-item_active';
const SELECTED_LIST_ITEM_CLASS = 'dd__list-item_selected';

const defaultProps = {
    selected: false,
    active: false,
    hidden: false,
    disabled: false,
    multi: false,
    group: null,
};

const customColorsMap = {
    1: 'dd__custom-list-item_blue',
    2: 'dd__custom-list-item_red',
    3: 'dd__custom-list-item_green',
    4: 'dd__custom-list-item_yellow',
    5: 'dd__custom-list-item_pink',
    6: 'dd__custom-list-item_purple',
    7: 'dd__custom-list-item_orange',
    8: 'dd__custom-list-item_grey',
    9: 'dd__custom-list-item_brown',
    10: 'dd__custom-list-item_cyan',
    11: 'dd__custom-list-item_magenta',
};

export class CustomListItem extends Component {
    static get selector() {
        return 'li';
    }

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        if (typeof this.props.id === 'undefined' || this.props.id === null) {
            throw new Error('Invalid id');
        }

        this.state = {
            ...this.props,
            id: this.props.id.toString(),
        };

        this.init();
        this.render(this.state);
    }

    get id() {
        return this.state.id;
    }

    init() {
        const colorClass = customColorsMap[this.props.id];
        this.colorElem = createElement('span', {
            props: { className: `dd__custom-list-item_color ${colorClass}` },
        });
        this.titleElem = createElement('span', {
            props: { className: 'dd__custom-list-item_title' },
        });

        this.contentElem = createElement('div', {
            props: { className: 'dd__list-item dd__custom-list-item' },
            children: [this.colorElem, this.titleElem],
        });

        if (this.props.multi) {
            this.checkIcon = createElement('span', {
                props: { className: 'dd__custom-list-item_check', innerHTML: '&times;' },
            });
            this.colorElem.append(this.checkIcon);
        }

        this.elem = createElement('li', {
            children: this.contentElem,
        });
    }

    render(state) {
        this.titleElem.title = state.title;
        this.titleElem.textContent = state.title;

        const selected = (this.props.multi && state.selected);
        this.contentElem.classList.toggle(SELECTED_LIST_ITEM_CLASS, selected);
        this.contentElem.classList.toggle(LIST_ITEM_ACTIVE_CLASS, state.active);

        this.elem.dataset.id = state.id;
        this.enable(!state.disabled);
        this.show(!state.hidden);
    }
}
