import { test } from 'jezve-test';
import { App } from '../app.js';

export async function goToNextPage(name) {
    await test(`[${name}] Go to next page`, () => App.view.goToNextPage(name));
}

export async function goToPrevPage(name) {
    await test(`[${name}] Go to previous page`, () => App.view.goToPrevPage(name));
}

export async function goToFirstPage(name) {
    await test(`[${name}] Go to first page`, () => App.view.goToFirstPage(name));
}

export async function goToLastPage(name) {
    await test(`[${name}] Go to last page`, () => App.view.goToLastPage(name));
}
