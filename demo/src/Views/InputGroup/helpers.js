import { createElement, getClassName } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { Input } from 'jezvejs/Input';

export const createInput = (props = {}) => (
    Input.create({
        ...props,
        className: getClassName('input-group__input', props.className),
    }).elem
);

export const createText = (textContent) => (
    createElement('div', {
        props: {
            className: 'input-group__text',
            textContent,
        },
    })
);

export const createButton = (textContent) => (
    Button.create({
        className: 'input-group__btn',
        title: createElement('div', {
            props: {
                className: 'input-group__btn-title',
                textContent,
            },
        }),
    }).elem
);

export const createInnerButton = (props = {}) => (
    Button.create({
        ...props,
        className: getClassName('input-group__inner-btn', props.className),
    }).elem
);

export const createOuterContainer = (children) => (
    createElement('div', {
        props: { className: 'input-group__input-outer' },
        children,
    })
);
