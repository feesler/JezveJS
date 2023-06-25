import {
    assert,
    query,
    asyncMap,
    click,
    queryAll,
} from 'jezve-test';
import { PopupMenu } from 'jezvejs-test';
import { AppView } from './AppView.js';

const componentSelectors = {
    default: '#defaultMenu',
    absPosition: '#absPosMenu',
    clipping: '#clippingMenu',
    list: '#listMenu',
};

const controlSelectors = {
    defaultBtn: '#defaultContainer .menu-btn',
    attachTarget: '#attachTarget',
    listContainer: '#listContainer',
    clippingBtn: '#headerContent .menu-btn',
};

export class PopupMenuView extends AppView {
    constructor(...args) {
        super(...args);

        this.listMenuInex = -1;
    }

    async parseContent() {
        const res = {};

        const components = Object.entries(componentSelectors);
        await asyncMap(components, async ([name, selector]) => {
            res[name] = await PopupMenu.create(this, await query(selector));
            if (!res[name]) {
                res[name] = { visible: false };
            }
        });

        const controls = Object.entries(controlSelectors);
        await asyncMap(controls, async ([name, selector]) => {
            res[name] = { elem: await query(selector) };
            assert(res[name].elem, `Failed to initialize control '${name}'`);
        });

        res.listContainer.menuButtons = await queryAll(res.listContainer.elem, '.menu-btn');

        return res;
    }

    buildModel(cont) {
        const res = {};

        const components = Object.keys(componentSelectors);
        components.forEach((name) => {
            res[name] = {
                visible: cont[name].visible,
            };
        });

        return res;
    }

    getExpectedState(model = this.model) {
        const res = {
        };

        const components = Object.keys(componentSelectors);
        components.forEach((id) => {
            const { visible } = model[id];

            res[id] = {
                visible,
            };
        });

        return res;
    }

    getComponent(name) {
        assert(this.content[name], 'Invalid component');
        return this.content[name];
    }

    onToggleMenu(name, model = this.model) {
        const components = Object.keys(componentSelectors);
        components.forEach((key) => {
            const menuModel = model[key];
            menuModel.visible = (key === name) ? !menuModel.visible : false;
        });
    }

    onToggleListMenu(index, model = this.model) {
        const components = Object.keys(componentSelectors);
        components.forEach((key) => {
            const menuModel = model[key];

            if (key === 'list') {
                menuModel.visible = (this.listMenuInex === index) ? !menuModel.visible : true;
                this.listMenuInex = index;
            } else {
                menuModel.visible = false;
            }
        });
    }

    async toggleDefault() {
        this.onToggleMenu('default');
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.defaultBtn.elem));

        return this.checkState(expected);
    }

    async toggleAbsPosition() {
        this.onToggleMenu('absPosition');
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.attachTarget.elem));

        return this.checkState(expected);
    }

    async toggleClipping() {
        this.onToggleMenu('clipping');
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.clippingBtn.elem));

        return this.checkState(expected);
    }

    async toggleListMenu(index) {
        this.onToggleListMenu(index);
        const expected = this.getExpectedState();

        await this.performAction(() => click(this.content.listContainer.menuButtons[index]));

        return this.checkState(expected);
    }

    async toggleMenu(name, ...args) {
        const menuTogglersMap = {
            default: 'toggleDefault',
            absPosition: 'toggleAbsPosition',
            clipping: 'toggleClipping',
            list: 'toggleListMenu',
        };

        const method = menuTogglersMap[name];
        assert.isFunction(this[method], `Invalid component '${name}'`);

        return this[method](...args);
    }

    async openMenu(name, ...args) {
        if (this.model[name]?.visible) {
            return true;
        }

        return this.toggleMenu(name, ...args);
    }

    async selectItemByIndex(name, index, ...args) {
        await this.openMenu(name, ...args);
        const expected = this.getExpectedState();

        await this.performAction(() => this.getComponent(name)?.selectItemByIndex(index));

        return this.checkState(expected);
    }

    async selectItemById(name, id, ...args) {
        await this.openMenu(name, ...args);
        const expected = this.getExpectedState();

        await this.performAction(() => this.getComponent(name)?.selectItemById(id));

        return this.checkState(expected);
    }
}
