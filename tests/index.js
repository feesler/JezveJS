import { environment } from 'jezve-test/NodeEnvironment';
import { onReady } from 'jezve-test';
import options from './options.js';

const envOptions = { ...options };
const isBrowser = typeof window !== 'undefined';

const run = async () => {
    if (isBrowser) {
        const { origin } = window.location;
        envOptions.appPath = origin.includes('localtest')
            ? '/jezvejs/dist/'
            : '/jezvejs/';

        envOptions.container = document.getElementById('testscontainer');
    }

    await environment.init(envOptions);

    if (isBrowser) {
        const baseURL = await environment.baseUrl();
        environment.goTo(`${baseURL}/demo/`);
    }
};

if (isBrowser) {
    onReady(() => run());
} else {
    run();
}
