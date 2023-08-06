import { asArray, createElement, getClassName } from 'jezvejs';
import { Button } from 'jezvejs/Button';

export const createContainer = (id, children) => createElement('div', {
    props: { id },
    children,
});

export const createForm = (id, children) => createElement('form', {
    props: { id },
    children,
});

export const createControls = (children) => (
    createElement('div', {
        props: { className: 'section-controls' },
        children,
    })
);

export const createButtons = (items) => (
    createControls(
        asArray(items).map((item) => (
            Button.create({
                ...item,
                className: getClassName('action-btn', item.className),
            }).elem
        )),
    )
);
