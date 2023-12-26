import { createSVGElement } from '@jezvejs/dom';

export const UpdateIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 24 24',
        },
        children: createSVGElement('path', {
            attrs: {
                d: 'm17.1 3.17-2 2.04 3.7 3.74 2.04-2.04-3.74-3.74zm-3.02 3.06-6.95 7.05 3.66 3.71 6.94-7.08-3.65-3.69zm-8.05 8.13-1.89 5.52 5.6-1.78-3.71-3.74z',
            },
        }),
    })
);
