import { createSVGElement } from '@jezvejs/dom';

export const CheckIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 9.2604 9.2604',
        },
        children: createSVGElement('path', {
            attrs: { d: 'M1.08 4.93a.28.28 0 000 .4l2.35 2.34c.1.11.29.11.4 0l4.59-4.59a.28.28 0 000-.4l-.6-.6a.28.28 0 00-.4 0l-3.8 3.8-1.54-1.55a.28.28 0 00-.4 0z' },
        }),
    })
);
