import { test } from 'jezve-test';
import { App } from '../app.js';

export const goToNextPage = async (name) => {
    await test(`[${name}] Go to next page`, () => App.view.goToNextPage(name));
};

export const goToPrevPage = async (name) => {
    await test(`[${name}] Go to previous page`, () => App.view.goToPrevPage(name));
};

export const goToFirstPage = async (name) => {
    await test(`[${name}] Go to first page`, () => App.view.goToFirstPage(name));
};

export const goToLastPage = async (name) => {
    await test(`[${name}] Go to last page`, () => App.view.goToLastPage(name));
};
