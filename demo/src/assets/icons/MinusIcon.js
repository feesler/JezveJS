import { createSVGElement } from '@jezvejs/dom';

export const MinusIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '-0.5 -0.5 16.5 16.5',
        },
        children: createSVGElement('path', {
            attrs: { d: 'm13.5 7.5c.667 0 .667 1 0 1h-11c-.667 0-.667-1 0-1h11z' },
        }),
    })
);
