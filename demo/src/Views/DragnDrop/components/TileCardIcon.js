import { createSVGElement } from '@jezvejs/dom';

export const TileCardIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            width: 60,
            height: 54,
            viewBox: '0 0 16 14',
        },
        children: [
            createSVGElement('path', {
                attrs: {
                    d: 'm2.01 2.47c-.497 0-.946.431-.946.933v.4h13.9v-.4c0-.503-.449-.933-.955-.933h-12zm-.946 3v5.4c0 .503.448.933.946.933h12c.506 0 .955-.431.955-.933v-5.4h-13.9z',
                },
            }),
        ],
    })
);
