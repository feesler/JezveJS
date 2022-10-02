import { Runner } from 'jezve-test';
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
        this.fullTest = true;

        if (this.fullTest) {
            await this.runFullScenario();
        } else {
            await this.runTestScenario();
        }
    }

    /* eslint-disable no-empty-function */
    async runTestScenario() {
    }
    /* eslint-enable no-empty-function */

    async runFullScenario() {
        await dropDownTests();
        await datePickerTests();
        await paginatorTests();
    }
}
