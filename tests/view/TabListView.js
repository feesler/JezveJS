import {
    assert,
    query,
    asyncMap,
    click,
} from 'jezve-test';
import { TabList } from 'jezvejs-test';
import { AppView } from './AppView.js';

const componentsList = [
    'default',
    'styled',
    'disabledItem',
    'disabled',
];

const controlIds = [
    'toggleEnableItemBtn',
    'toggleEnableBtn',
];

export class TabListView extends AppView {
    async parseContent() {
        const res = {};

        await asyncMap(componentsList, async (id) => {
            res[id] = await TabList.create(this, await query(`#${id} + section .tab-list`));
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
            toggleEnableItemBtn: { visible: true },
            toggleEnableBtn: { visible: true },
        };

        componentsList.forEach((id) => {
            const { selectedId, disabled } = model[id];

            res[id] = {
                selectedId,
                disabled,
                visible: true,
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

        this.model[name].selectedId = id.toString();
        const expected = this.getExpectedState();

        await this.performAction(() => component.selectTabById(id));

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
        const { disabled } = this.model.disabled;

        this.model.disabled.disabled = !disabled;
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.toggleEnableBtn.elem));

        return this.checkState(expected);
    }
}
