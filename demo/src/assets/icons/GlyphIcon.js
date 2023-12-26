import { createSVGElement } from '@jezvejs/dom';

export const GlyphIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 24 24',
        },
        children: createSVGElement('path', {
            attrs: { d: 'm7.2867 19.994 7.5036-8.0126-7.5036-7.9748h1.8853l7.5413 7.9748-7.5413 8.0126z' },
        }),
    })
);
