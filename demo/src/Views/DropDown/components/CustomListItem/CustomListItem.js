import {
    createElement,
} from 'jezvejs';
import { CheckboxItem } from 'jezvejs/Menu';

const defaultProps = {
    selected: false,
    active: false,
    hidden: false,
    disabled: false,
    multiple: false,
    group: null,
};

const customColorsMap = {
    1: 'blue',
    2: 'red',
    3: 'green',
    4: 'yellow',
    5: 'pink',
    6: 'purple',
    7: 'orange',
    8: 'grey',
    9: 'brown',
    10: 'cyan',
    11: 'magenta',
};

export class CustomListItem extends CheckboxItem {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });
    }

    createContent() {
        if (this.titleElem) {
            return;
        }

        this.titleElem = createElement('span', {
            props: { className: 'dd__custom-list-item_title' },
        });

        this.contentElem.append(this.titleElem);
        this.contentElem.classList.add('dd__custom-list-item');
    }

    renderBeforeContent(state, prevState) {
        if (
            (
                state.checkboxSide === prevState?.checkboxSide
                && state.type === prevState?.type
            )
            || !state.beforeContent
        ) {
            return;
        }

        if (state.checkboxSide !== 'left') {
            super.renderBeforeContent(state, prevState);
            return;
        }

        this.colorElem = createElement('span', {
            props: {
                className: 'dd__custom-list-item_color',
                dataset: { color: customColorsMap[state.id] },
            },
        });

        if (state.multiple) {
            this.checkIcon = createElement('span', {
                props: { className: 'dd__custom-list-item_check', innerHTML: '&times;' },
            });
            this.colorElem.append(this.checkIcon);
        }

        this.beforeElem.textContent = '';
        this.beforeElem.append(this.colorElem);
    }

    renderContent(state) {
        this.createContent();

        const title = state.title ?? '';
        this.titleElem.title = title;
        this.titleElem.textContent = title;
    }
}
