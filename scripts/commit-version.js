import * as dotenv from 'dotenv';
import { commitVersion } from '@jezvejs/release-tools';

dotenv.config();

commitVersion({
    versionFiles: [
        'demo/package.json',
        'package-lock.json',
        'package.json',
        'packages/jezvejs/package.json',
    ],
    packageName: 'jezvejs',
    gitDir: process.env.PROJECT_GIT_DIR,
    mainBranch: 'master',
});
