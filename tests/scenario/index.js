import {
    assert,
    Runner,
    setBlock,
    getSelectedStory,
} from 'jezve-test';
import { commonTests } from './common.js';
import { datePickerTests } from './DatePicker.js';
import { dropDownTests } from './DropDown.js';
import { paginatorTests } from './Paginator.js';

const storiesMap = {
    common: commonTests,
    dropDown: dropDownTests,
    datePicker: datePickerTests,
    paginator: paginatorTests,
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
            setBlock(`Running '${story}' test story`, 1);
            await this.runStory(story);
        } else {
            await this.runFullScenario();
        }
    }

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
