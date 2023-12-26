import { createSVGElement } from '@jezvejs/dom';

export const PlusIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 24 24',
        },
        children: createSVGElement('path', {
            attrs: { d: 'm11 4v7h-7v2l7 1e-4v7h2v-7l7-1e-4v-2h-7v-7l-2-1e-5z' },
        }),
    })
);
