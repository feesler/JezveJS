import { BrowserEnvironment } from 'jezve-test/BrowserEnvironment';
import { onReady } from 'jezve-test';
import options from './options.js';

onReady(() => {
    setTimeout(() => {
        const environment = new BrowserEnvironment();

        const envOptions = { ...options };
        const { origin } = window.location;
        if (origin.includes('jezve.net')) {
            envOptions.appPath = '/jezvejs/';
        } else if (origin.includes('localtest')) {
            envOptions.appPath = '/jezvejs/dist/';
        }

        envOptions.container = document.getElementById('testscontainer');

        environment.init(envOptions);
    });
});
