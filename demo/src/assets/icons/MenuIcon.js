import { createSVGElement } from '@jezvejs/dom';

export const MenuIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 24 24',
        },
        children: createSVGElement('path', {
            attrs: { d: 'm5.31 10.3c-.914 0-1.65.736-1.65 1.65 0 .943.736 1.68 1.65 1.68.943 0 1.68-.736 1.68-1.68 0-.914-.738-1.65-1.68-1.65zm6.67 0c-.914 0-1.65.736-1.65 1.65 0 .943.736 1.68 1.65 1.68.914 0 1.68-.736 1.68-1.68 0-.914-.766-1.65-1.68-1.65zm6.69 0c-.922 0-1.67.736-1.67 1.65 0 .943.744 1.68 1.67 1.68.922 0 1.66-.736 1.66-1.68 0-.914-.743-1.65-1.66-1.65z' },
        }),
    })
);
