import { App } from './app.js';

export const baseUrl = () => App.environment.baseUrl();

export const url = () => App.environment.url();

export const isFullScenario = () => App.environment.isFullScenario();

export const navigation = (action) => App.environment.navigation(action);

export const setErrorHandler = () => App.environment.setErrorHandler();

export const goTo = (link) => App.environment.goTo(link);

export const parentNode = (elem) => App.environment.parentNode(elem);

export const query = (...args) => App.environment.query(...args);

export const queryAll = (...args) => App.environment.queryAll(...args);

export const closest = (elem, selector) => App.environment.closest(elem, selector);

export const hasClass = (elem, className) => App.environment.hasClass(elem, className);

export const isVisible = (elem, recursive) => App.environment.isVisible(elem, recursive);

export const selectByValue = (elem, value, bool) => (
    App.environment.selectByValue(elem, value, bool)
);

export const onChange = (elem) => App.environment.onChange(elem);

export const onBlur = (elem) => App.environment.onBlur(elem);

export const prop = (elem, property) => App.environment.prop(elem, property);

export const waitForSelector = (selector, options) => (
    App.environment.waitForSelector(selector, options)
);

export const waitForFunction = (condition, options) => (
    App.environment.waitForFunction(condition, options)
);

export const wait = (condition, options) => App.environment.wait(condition, options);

export const timeout = (ms) => App.environment.timeout(ms);

export const global = (property) => App.environment.global(property);

export const click = (elem) => App.environment.click(elem);

export const input = (elem, val) => App.environment.input(elem, val);

export const httpReq = (method, link, data, headers) => (
    App.environment.httpReq(method, link, data, headers)
);

export const addResult = (descr, res) => App.environment.addResult(descr, res);

export const setBlock = (title, category) => App.environment.setBlock(title, category);

export const setDuration = (duration) => App.environment.setDuration(duration);

export const getContent = () => App.environment.getContent();
