import 'jezvejs/style';
import { Button } from 'jezvejs/Button';
import { LinkMenu } from 'jezvejs/LinkMenu';

import { DemoView } from '../../Application/DemoView.js';
import { createContainer, createControls } from '../../Application/utils.js';

/**
 * LinkMenu component demo view
 */
class LinkMenuView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDynamicSingle();
        this.initDynamicMultiple();
        this.initButtonsType();
        this.initDisabledItem();
        this.initHiddenItem();
        this.initDisabledComponent();
    }

    initDynamicSingle() {
        this.addSection({
            id: 'single',
            title: 'Single select with icons',
            content: createContainer(
                'dynamic',
                LinkMenu.create({
                    itemParam: 'action',
                    beforeContent: true,
                    useURLParam: true,
                    preventNavigation: true,
                    items: [
                        { icon: 'plus', title: 'Create', value: 'create' },
                        { icon: 'update', title: 'Update', value: 'update' },
                        { icon: 'del', title: 'Delete', value: 'delete' },
                    ],
                }).elem,
            ),
        });
    }

    initDynamicMultiple() {
        const menu = LinkMenu.create({
            itemParam: 'action',
            beforeContent: true,
            allowActiveLink: true,
            multiple: true,
            useURLParam: true,
            defaultItemType: 'checkbox-link',
            items: [
                {
                    title: 'Clear',
                    value: null,
                    selectable: false,
                    beforeContent: false,
                },
                { title: 'Zero', value: 0 },
                { title: 'Create', value: 'create' },
                { title: 'Update', value: 'update' },
                { title: 'Delete', value: 'delete' },
            ],
        });

        this.addSection({
            id: 'allowActiveLink',
            title: '\'allowActiveLink\' option',
            content: createContainer('dynamicMulti', menu.elem),
        });
    }

    initButtonsType() {
        const menu = LinkMenu.create({
            beforeContent: true,
            multiple: true,
            defaultItemType: 'checkbox',
            items: [
                { title: 'Create', value: 'create' },
                { title: 'Update', value: 'update' },
                { title: 'Delete', value: 'delete' },
            ],
        });

        this.addSection({
            id: 'buttonType',
            title: 'Buttons',
            content: createContainer('buttonTypeContainer', menu.elem),
        });
    }

    initDisabledItem() {
        const menu = LinkMenu.create({
            itemParam: 'action',
            beforeContent: true,
            multiple: true,
            defaultItemType: 'checkbox-link',
            items: [
                {
                    title: 'Clear',
                    value: null,
                    selectable: false,
                    beforeContent: false,
                },
                { title: 'Create', value: 'create' },
                { title: 'Update', value: 'update' },
                { title: 'Delete', value: 'delete', disabled: true },
            ],
        });

        const btn = Button.create({
            id: 'toggleEnableItemBtn',
            title: 'Enable item',
            className: 'action-btn',
            onClick: () => {
                const item = menu.getItemByValue('delete');
                btn.setTitle((item.disabled) ? 'Disable item' : 'Enable item');
                menu.enableItem('delete', item.disabled);
            },
        });

        this.addSection({
            id: 'disabledItem',
            title: 'Disabled item',
            content: [
                createContainer('disabledItemContainer', menu.elem),
                createControls(btn.elem),
            ],
        });
    }

    initHiddenItem() {
        const menu = LinkMenu.create({
            itemParam: 'action',
            beforeContent: true,
            multiple: true,
            defaultItemType: 'checkbox-link',
            items: [
                {
                    title: 'Clear',
                    value: null,
                    selectable: false,
                    beforeContent: false,
                },
                { title: 'Create', value: 'create' },
                { title: 'Update', value: 'update' },
                { title: 'Delete', value: 'delete' },
            ],
        });

        const btn = Button.create({
            id: 'toggleShowItemBtn',
            title: 'Hide item',
            className: 'action-btn',
            onClick: () => {
                const item = menu.getItemByValue('delete');
                btn.setTitle((item.hidden) ? 'Hide item' : 'Show item');
                menu.showItem('delete', !!item.hidden);
            },
        });

        this.addSection({
            id: 'hiddenItem',
            title: 'Hidden item',
            content: [
                createContainer('hiddenItemContainer', menu.elem),
                createControls(btn.elem),
            ],
        });
    }

    initDisabledComponent() {
        const menu = LinkMenu.create({
            itemParam: 'action',
            multiple: true,
            beforeContent: true,
            disabled: true,
            defaultItemType: 'checkbox-link',
            items: [
                {
                    title: 'Clear',
                    value: null,
                    selectable: false,
                    beforeContent: false,
                },
                { title: 'Create', value: 'create' },
                { title: 'Update', value: 'update' },
                { title: 'Delete', value: 'delete', disabled: true },
            ],
        });

        const btn = Button.create({
            id: 'toggleEnableBtn',
            title: 'Enable',
            className: 'action-btn',
            onClick: () => {
                const { enabled } = menu;
                btn.setTitle((enabled) ? 'Enable' : 'Disable');
                menu.enable(!enabled);
            },
        });

        this.addSection({
            id: 'disabled',
            title: 'Disabled component',
            content: [
                createContainer('disabledContainer', menu.elem),
                createControls(btn.elem),
            ],
        });
    }
}

LinkMenuView.create();
