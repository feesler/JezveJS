import {
    query,
    asyncMap,
    click,
    waitForFunction,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { Collapsible } from 'jezvejs-test';
import { AppView } from './AppView.js';

const componentsList = [
    'default',
    'styled',
    'customHeader',
    'toggleOnClick',
    'methods',
];

const toggleableList = [
    'default',
    'styled',
    'customHeader',
];

export class CollapsibleView extends AppView {
    async parseContent() {
        const res = {};

        await asyncMap(componentsList, async (id) => {
            res[id] = await Collapsible.create(this, await query(`#${id} + .demo-section__content .collapsible`));
            assert(res[id], `Failed to initialize component '${id}'`);
        });

        res.toggleDisabledBtn = { elem: await query(res.toggleOnClick.elem, '.custom-header-btn') };
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
        const componentModel = this.model[id];
        const collapsedExpected = (toggleableList.includes(id))
            ? !componentModel.collapsed
            : componentModel.collapsed;
        this.model[id].collapsed = collapsedExpected;

        return this.runTestAction(async () => {
            const component = this.getComponentById(id);
            await component.toggle();

            await waitForFunction(async () => {
                await this.parse();

                const collapsible = this.getComponentById(id);
                return (
                    collapsible.collapsed === collapsedExpected
                    && !collapsible.animationInProgress
                );
            });
        });
    }

    async toggleDisabled() {
        const collapsedExpected = !this.model.toggleOnClick.collapsed;
        this.model.toggleOnClick.collapsed = collapsedExpected;

        return this.runTestAction(async () => {
            await click(this.content.toggleDisabledBtn.elem);

            await waitForFunction(async () => {
                await this.parse();

                const collapsible = this.getComponentById('toggleOnClick');
                return (
                    collapsible.collapsed === collapsedExpected
                    && !collapsible.animationInProgress
                );
            });
        });
    }

    async expand() {
        this.model.methods.collapsed = false;

        return this.runTestAction(() => click(this.content.expandBtn.elem));
    }

    async collapse() {
        this.model.methods.collapsed = true;

        return this.runTestAction(() => click(this.content.collapseBtn.elem));
    }

    async toggle() {
        this.model.methods.collapsed = !this.model.methods.collapsed;

        return this.runTestAction(() => click(this.content.toggleBtn.elem));
    }
}
