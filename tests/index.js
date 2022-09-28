import { onReady } from 'jezve-test';
import EnvironmentClass from 'jezve-test/NodeEnvironment';
import options from './options.js';

const envOptions = { ...options };
const isBrowser = typeof window !== 'undefined';

const run = async () => {
    if (isBrowser) {
        const { origin } = window.location;
        if (origin.includes('jezve.net')) {
            envOptions.appPath = '/jezvejs/';
        } else if (origin.includes('localtest')) {
            envOptions.appPath = '/jezvejs/dist/';
        }

        envOptions.container = document.getElementById('testscontainer');
    }

    const environment = new EnvironmentClass();
    environment.init(envOptions);
};

if (isBrowser) {
    onReady(() => run());
} else {
    run();
}
