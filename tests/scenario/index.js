import {
    assert,
    Runner,
    setBlock,
    getSelectedStory,
} from 'jezve-test';
import { commonTests } from './common.js';
import { collapsibleTests } from './Collapsible.js';
import { datePickerTests } from './DatePicker.js';
import { dropDownTests } from './DropDown.js';
import { paginatorTests } from './Paginator.js';
import { loadTests } from './Load.js';
import { tabListTests } from './TabList.js';

const storiesMap = {
    common: commonTests,
    collapsible: collapsibleTests,
    dropDown: dropDownTests,
    datePicker: datePickerTests,
    paginator: paginatorTests,
    tabList: tabListTests,
    load: loadTests,
};

export class Scenario {
    constructor(environment) {
        this.environment = environment;
    }

    static async create(environment) {
        const instance = new this(environment);
        await instance.init();
        return instance;
    }

    async init() {
        // Setup test runner
        this.runner = new Runner();
    }

    async run() {
        const story = getSelectedStory();
        if (story) {
            if (!this.checkSelectedStory(story)) {
                return;
            }

            setBlock(`Running '${story}' test story`, 1);
            await this.runStory(story);
        } else {
            await this.runFullScenario();
        }
    }

    /* eslint-disable no-console */
    checkSelectedStory(story) {
        if (typeof story !== 'string') {
            return false;
        }
        if (story in storiesMap) {
            return true;
        }

        console.log(`Invalid story name: ${story}`);
        console.log('Available test stories:');
        const storyNames = this.getStorieNames();
        storyNames.forEach((name) => console.log(`  ${name}`));

        return false;
    }
    /* eslint-enable no-console */

    getStory(name) {
        assert(name in storiesMap, `Invalid story name: ${name}`);

        return storiesMap[name];
    }

    getStorieNames() {
        return Object.keys(storiesMap);
    }

    async runStory(name) {
        const story = this.getStory(name);
        await story();
    }

    async runFullScenario() {
        setBlock('Running full test scenario', 1);

        const stories = this.getStorieNames();
        for (const story of stories) {
            await this.runStory(story);
        }
    }
}
