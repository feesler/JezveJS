import { Runner, isFullScenario } from 'jezve-test';
import { commonTests } from './common.js';
import { datePickerTests } from './DatePicker.js';
import { dropDownTests } from './DropDown.js';
import { paginatorTests } from './Paginator.js';

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
        const fullTest = isFullScenario();
        if (fullTest) {
            await this.runFullScenario();
        } else {
            await this.runTestScenario();
        }
    }

    async runTestScenario() {
        await commonTests();
    }

    async runFullScenario() {
        await commonTests();
        await dropDownTests();
        await datePickerTests();
        await paginatorTests();
    }
}
