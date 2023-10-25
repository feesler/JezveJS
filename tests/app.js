import { TestApplication } from 'jezve-test';
import { formatDate } from '@jezvejs/datetime';
import { config } from './config.js';
import { Scenario } from './scenario/index.js';

class Application extends TestApplication {
    constructor() {
        super();

        this.config = config;
    }

    async init() {
        this.scenario = await Scenario.create(this.environment);

        const now = new Date();
        this.dates = {
            now,
            monthAgo: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
            weekAgo: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
            weekAfter: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
            yesterday: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
            yearAgo: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        };

        this.fmtDates = {};
        Object.keys(this.dates).forEach((key) => {
            this.fmtDates[key] = formatDate(this.dates[key]);
        });

        this.dateList = [...Object.values(this.dates)];
        this.fmtDateList = [...Object.values(this.fmtDates)];
    }

    async startTests() {
        await this.scenario.run();
    }
}

export const App = new Application();
