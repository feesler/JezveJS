import { createSVGElement } from '@jezvejs/dom';

export const SmallCloseIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 14 14',
        },
        children: createSVGElement('path', {
            attrs: { d: 'M 1.1415,2.4266 5.7838,7 1.1415,11.5356 2.4644,12.8585 7,8.2162 11.5734,12.8585 12.8585,11.5356 8.2162,7 12.8585,2.4266 11.5734,1.1415 7,5.7838 2.4644,1.1415 Z' },
        }),
    })
);
