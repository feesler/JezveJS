import { setupTest, formatDate, TestApplication } from 'jezve-test';
import { config } from './config.js';
import { Scenario } from './scenario.js';

class Application extends TestApplication {
    constructor() {
        super();

        this.config = config;
    }

    async init() {
        this.scenario = await Scenario.create(this.environment);

        this.dates = {};
        this.dateList = [];

        const now = new Date();
        this.dates.now = formatDate(now);
        this.dates.monthAgo = formatDate(
            new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        );
        this.dates.weekAgo = formatDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        );
        this.dates.weekAfter = formatDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        );
        this.dates.yesterday = formatDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
        );
        this.dates.yearAgo = formatDate(
            new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        );

        this.dateList.push(...Object.values(this.dates));

        setupTest(this.environment);
    }

    async startTests() {
        await this.scenario.run();
    }

    async goToMainView() {
        if (this.view) {
            await this.view.goToMainView();
        } else {
            await this.environment.goTo(this.environment.baseUrl());
        }
    }
}

export const App = new Application();
