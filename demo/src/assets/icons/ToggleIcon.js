import { createSVGElement } from '@jezvejs/dom';

export const ToggleIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 6.35 6.35',
        },
        children: createSVGElement('path', {
            attrs: { d: 'm1.0935 1.6138-.52039.52039 2.6019 2.6019 2.6019-2.6019-.52039-.52039-2.0815 2.0815z' },
        }),
    })
);
