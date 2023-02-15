import {
    assert,
    query,
    asyncMap,
    click,
} from 'jezve-test';
import { Collapsible } from 'jezvejs-test';
import { AppView } from './AppView.js';

const componentsList = [
    'defaultContainer',
    'styledContainer',
    'custom',
    'disabledToggle',
    'methodsContainer',
];

const toggleableList = [
    'defaultContainer',
    'styledContainer',
    'custom',
];

export class CollapsibleView extends AppView {
    async parseContent() {
        const res = {};

        await asyncMap(componentsList, async (id) => {
            res[id] = await Collapsible.create(this, await query(`#${id} .collapsible`));
            assert(res[id], `Failed to initialize component '${id}'`);
        });

        res.toggleDisabledBtn = { elem: await query(res.disabledToggle.elem, '.custom-header-btn') };
        res.expandBtn = { elem: await query('#expandBtn') };
        res.collapseBtn = { elem: await query('#collapseBtn') };
        res.toggleBtn = { elem: await query('#toggleBtn') };
        assert(
            res.toggleDisabledBtn.elem
            && res.expandBtn.elem
            && res.collapseBtn.elem
            && res.toggleBtn.elem,
            'Invalid structure of Collapsible view',
        );

        return res;
    }

    buildModel(cont) {
        const res = {};

        componentsList.forEach((id) => {
            res[id] = { collapsed: cont[id].collapsed };
        });

        return res;
    }

    getExpectedState(model = this.model) {
        const res = {
            toggleDisabledBtn: { visible: true },
            expandBtn: { visible: true },
            collapseBtn: { visible: true },
            toggleBtn: { visible: true },
        };

        componentsList.forEach((id) => {
            const { collapsed } = model[id];

            res[id] = {
                collapsed,
                content: { visible: !collapsed },
            };
        });

        return res;
    }

    getComponentById(id) {
        assert(this.content[id], 'Invalid component');
        return this.content[id];
    }

    async toggleById(id) {
        const component = this.getComponentById(id);

        if (toggleableList.includes(id)) {
            this.model[id].collapsed = !this.model[id].collapsed;
        }
        const expected = this.getExpectedState();

        await this.performAction(() => component.toggle());

        return this.checkState(expected);
    }

    async toggleDisabled() {
        this.model.disabledToggle.collapsed = !this.model.disabledToggle.collapsed;
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.toggleDisabledBtn.elem));

        return this.checkState(expected);
    }

    async expand() {
        this.model.methodsContainer.collapsed = false;
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.expandBtn.elem));

        return this.checkState(expected);
    }

    async collapse() {
        this.model.methodsContainer.collapsed = true;
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.collapseBtn.elem));

        return this.checkState(expected);
    }

    async toggle() {
        this.model.methodsContainer.collapsed = !this.model.methodsContainer.collapsed;
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.toggleBtn.elem));

        return this.checkState(expected);
    }
}
