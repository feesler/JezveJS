import { createSVGElement } from '@jezvejs/dom';

export const CalendarIcon = (props = {}) => (
    createSVGElement('svg', {
        attrs: {
            ...props,
            viewBox: '0 0 24 24',
        },
        children: [
            createSVGElement('path', {
                attrs: {
                    d: 'm3.01 3.99v16h18v-16zm.992 2.02h16v13h-16z',
                },
            }),
            createSVGElement('path', {
                attrs: {
                    d: 'm8 7v2.02h2.02v-2.02h-2.02zm3.01 0v2.02h1.98v-2.02h-1.98zm2.98 0v2.02h2.02v-2.02h-2.02zm3.01.00977v2.01h2.02v-2.01h-2.02zm-12 3v1.98h2.02v-1.98h-2.02zm3.01 0v1.98h2.02v-1.98h-2.02zm3.01 0v1.98h1.98v-1.98h-1.98zm2.98 0v1.98h2.02v-1.98h-2.02zm3.01.00781v1.97h2.02v-1.97h-2.02zm-12 2.96v2.02h2.02v-2.02h-2.02zm3.01 0v2.02h2.02v-2.02h-2.02zm3.01 0v2.02h1.98v-2.02h-1.98zm2.98 0v2.02h2.02v-2.02h-2.02zm3.01.043v1.97h2.02v-1.97h-2.02zm-12 2.96v2.02h2.02v-2.02h-2.02zm3.01 0v2.02h2.02v-2.02h-2.02zm3.01 0v2.02h1.98v-2.02h-1.98zm2.98 0v2.02h2.02v-2.02h-2.02z',
                },
            }),
        ],
    })
);
