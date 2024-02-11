import packageConfig from 'jezvejs/package.json';
import './app.scss';

export { default as navigationMenuSections } from './MainMenu.js';

export const getBaseURL = () => {
    const { origin } = window.location;
    const res = `${origin}/`;

    if (origin.includes('localtest')) {
        return `${res}jezvejs/dist/`;
    }
    if (origin.includes('localhost')) {
        return res;
    }

    return `${res}jezvejs/`;
};

/**
 * Returns version of jezvejs library from package data
 * @returns string
 */
export const getVersion = () => (packageConfig.version);
