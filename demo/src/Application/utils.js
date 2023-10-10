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

export const generateId = () => {
    while (true) {
        const id = (Date.now() + Math.round(Math.random() * 1000000000000)).toString(36);
        const found = document.getElementById(id);
        if (!found) {
            return id;
        }
    }
};
