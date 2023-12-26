import { createSVGElement } from '@jezvejs/dom';

export const DeleteIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 24 24',
        },
        children: createSVGElement('path', {
            attrs: {
                d: 'm9.97 4v.963h3.99v-.963h-3.99zm-3.95 1.99c-1.26-.0023-1.99.843-1.99 1.98h16c.0072-1-.848-1.97-1.99-1.98h-12zm-.0527 3v11h12.1v-11h-12.1zm2.01 2.01h2.02v7h-2.02v-7zm3.03 0h2.04v7h-2.04v-7zm2.99 0h2.02v7h-2.02v-7z',
            },
        }),
    })
);
