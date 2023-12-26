import { createSVGElement } from '@jezvejs/dom';

export const HeaderMenuIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 24 24',
        },
        children: createSVGElement('path', {
            attrs: { d: 'm4 5c-.554 0-1 .446-1 1s.446 1 1 1h16c.554 0 1-.446 1-1s-.446-1-1-1zm0 6c-.554 0-1 .446-1 1s.446 1 1 1h16c.554 0 1-.446 1-1s-.446-1-1-1zm0 6c-.554 0-1 .446-1 1s.446 1 1 1h16c.554 0 1-.446 1-1s-.446-1-1-1z' },
        }),
    })
);
