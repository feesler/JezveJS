import { createSVGElement } from '@jezvejs/dom';

export const SearchIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 24 24',
        },
        children: createSVGElement('path', {
            attrs: { d: 'm9.01 3.8c-1.32 0-2.65.536-3.65 1.54-2.04 2.04-2.04 5.34 0 7.38 1.81 1.84 4.68 2.02 6.72.533l6.67 6.95 1.43-1.43-6.94-6.69c1.47-2.04 1.29-4.9-.547-6.73-1-1-2.36-1.54-3.69-1.54zm0 1.66c.931 0 1.81.359 2.49 1.04 1.43 1.43 1.43 3.62 0 5.01-1.4 1.4-3.58 1.4-5.01 0-1.4-1.4-1.4-3.58 0-5.01.716-.68 1.59-1.04 2.53-1.04z' },
        }),
    })
);
