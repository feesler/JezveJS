import {
    query,
    asyncMap,
    click,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { TabList } from 'jezvejs-test';
import { AppView } from './AppView.js';

const componentsList = [
    'default',
    'styled',
    'hiddenItem',
    'disabledItem',
    'disabled',
];

const controlIds = [
    'toggleShowItemBtn',
    'toggleEnableItemBtn',
    'toggleEnableBtn',
];

export class TabListView extends AppView {
    async parseContent() {
        const res = {};

        await asyncMap(componentsList, async (id) => {
            res[id] = await TabList.create(this, await query(`#${id} + .demo-section__content .tab-list`));
            assert(res[id], `Failed to initialize component '${id}'`);
        });

        await asyncMap(controlIds, async (id) => {
            res[id] = { elem: await query(`#${id}`) };
            assert(res[id].elem, `Failed to initialize control '${id}'`);
        });

        return res;
    }

    buildModel(cont) {
        const res = {};

        componentsList.forEach((id) => {
            res[id] = {
                disabled: cont[id].disabled,
                selectedId: cont[id].selectedId,
                items: cont[id].tabs.items.map((item) => ({
                    id: item.value,
                    hidden: item.hidden,
                    disabled: item.disabled,
                    title: item.title,
                    active: item.selected,
                })),
            };
        });

        return res;
    }

    getExpectedState(model = this.model) {
        const res = {
            toggleShowItemBtn: { visible: true },
            toggleEnableItemBtn: { visible: true },
            toggleEnableBtn: { visible: true },
        };

        componentsList.forEach((id) => {
            const { selectedId, disabled, items } = model[id];

            res[id] = {
                selectedId,
                disabled,
                visible: true,
                tabs: {
                    items: items.map((item) => ({
                        value: item.id,
                        hidden: item.hidden,
                        disabled: item.disabled,
                        title: item.title,
                        selected: item.active,
                    })),
                },
            };
        });

        return res;
    }

    getComponent(name) {
        assert(this.content[name], 'Invalid component');
        return this.content[name];
    }

    async selectTabById(name, id) {
        const component = this.getComponent(name);
        const selectedId = id.toString();

        this.model[name].selectedId = selectedId;
        this.model[name].items = this.model[name].items.map((item) => ({
            ...item,
            active: (item.id === selectedId),
        }));

        const expected = this.getExpectedState();

        await this.performAction(() => component.selectTabById(id));

        return this.checkState(expected);
    }

    async toggleShowItem() {
        const { items } = this.model.hiddenItem;

        this.model.hiddenItem.items = items.map((item) => (
            (item.id === '2')
                ? { ...item, hidden: !item.hidden }
                : item
        ));
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.toggleShowItemBtn.elem));

        return this.checkState(expected);
    }

    async toggleEnableItem() {
        const { items } = this.model.disabledItem;

        this.model.disabledItem.items = items.map((item) => (
            (item.id === 'str')
                ? { ...item, disabled: !item.disabled }
                : item
        ));
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.toggleEnableItemBtn.elem));

        return this.checkState(expected);
    }

    async toggleEnable() {
        const { disabled, items } = this.model.disabled;

        this.model.disabled.disabled = !disabled;
        this.model.disabled.items = items.map((item) => ({
            ...item,
            disabled: !disabled,
        }));
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.toggleEnableBtn.elem));

        return this.checkState(expected);
    }
}
