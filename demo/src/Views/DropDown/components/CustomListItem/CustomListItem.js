import {
    createElement,
} from 'jezvejs';
import { MenuItem } from 'jezvejs/Menu';

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

export class CustomListItem extends MenuItem {
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
        if (state.checkboxSide !== 'left') {
            return super.renderBeforeContent(state, prevState);
        }

        if (!this.colorElem) {
            this.colorElem = createElement('span', {
                props: { className: 'dd__custom-list-item_color' },
            });

            if (state.multiple) {
                this.checkIcon = createElement('span', {
                    props: { className: 'dd__custom-list-item_check', innerHTML: '&times;' },
                });
                this.colorElem.append(this.checkIcon);
            }
        }

        this.colorElem.dataset.color = customColorsMap[state.id];

        return this.colorElem;
    }

    renderContent(state) {
        this.createContent();

        const title = state.title ?? '';
        this.titleElem.title = title;
        this.titleElem.textContent = title;
    }
}
