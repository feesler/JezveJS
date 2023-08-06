import 'jezvejs/style';
import { createElement } from 'jezvejs';
import { Button } from 'jezvejs/Button';
import { WeekDaySelect } from 'jezvejs/WeekDaySelect';

import { DemoView } from '../../Application/DemoView.js';
import { LocalesContainer } from '../../Components/LocalesContainer/LocalesContainer.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';
import './WeekDaySelectView.scss';

const createContainer = (id, children) => createElement('div', {
    props: { id },
    children,
});

const createControls = (children) => (
    createElement('div', {
        props: { className: 'section-controls' },
        children,
    })
);

/**
 * WeekDaySelect component demo view
 */
class WeekDaySelectView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDefault();
        this.initStyled();
        this.initMultiSelect();
        this.initLocale();
        this.initDisabledItem();
        this.initDisabled();
    }

    initDefault() {
        const logsField = LogsField.create();

        const select = WeekDaySelect.create({
            onChange: (sel) => logsField.write(`Selected: [${sel}]`),
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                createContainer('defaultContainer', select.elem),
                logsField.elem,
            ],
        });
    }

    initStyled() {
        this.addSection({
            id: 'styled',
            title: 'Styled',
            content: createContainer(
                'styledContainer',
                WeekDaySelect.create({
                    className: 'styled bold',
                }).elem,
            ),
        });
    }

    initMultiSelect() {
        const select = WeekDaySelect.create({
            className: 'styled bold',
            multiple: true,
            type: 'buttons',
        });
        select.setSelection(['1', '2']);

        this.addSection({
            id: 'multiSelect',
            title: 'Multiple select',
            content: createContainer('multiSelectContainer', select.elem),
        });
    }

    initLocale() {
        this.addSection({
            id: 'locales',
            title: 'Locales',
            content: LocalesContainer.create({
                items: [{
                    id: 'enLocale',
                    title: 'en-US',
                    locales: ['en-US'],
                }, {
                    id: 'frLocale',
                    title: 'fr',
                    locales: ['fr'],
                }, {
                    id: 'ruLocale',
                    title: 'ru',
                    locales: ['ru'],
                }],
                renderItem: ({ locales }) => WeekDaySelect.create({ locales }).elem,
            }).elem,
        });
    }

    initDisabledItem() {
        const select = WeekDaySelect.create({
            className: 'styled',
        });
        select.enableItem('2', false);

        const btn = Button.create({
            id: 'toggleEnableItemBtn',
            title: 'Enable item',
            className: 'action-btn',
            onClick: () => {
                const item = select.getItemByValue('2');
                select.enableItem('2', item?.disabled);
                btn.setTitle((item.disabled) ? 'Disable item' : 'Enable item');
            },
        });

        this.addSection({
            id: 'disabledItem',
            title: 'Disabled item',
            content: [
                createContainer('disabledItemContainer', select.elem),
                createControls(btn.elem),
            ],
        });
    }

    initDisabled() {
        const select = WeekDaySelect.create({
            disabled: true,
            className: 'styled',
        });

        const btn = Button.create({
            id: 'toggleEnableBtn',
            title: 'Enable',
            className: 'action-btn',
            onClick: () => {
                const { disabled } = select;
                btn.setTitle((disabled) ? 'Disable' : 'Enable');
                select.enable(disabled);
            },
        });

        this.addSection({
            id: 'disabled',
            title: 'Disabled component',
            content: [
                createContainer('disabledContainer', select.elem),
                createControls(btn.elem),
            ],
        });
    }
}

WeekDaySelectView.create();
