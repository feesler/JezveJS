import { createElement, ge, selectedValue } from '@jezvejs/dom';
import { Input } from 'jezvejs/Input';

import { createSelect } from '../../Application/utils.js';

export const createOkBtn = ({ onClick, textContent = 'ok', disabled = false }) => (
    createElement('button', {
        props: {
            className: 'btn action-btn',
            type: 'button',
            textContent,
            disabled,
        },
        events: { click: (e) => onClick(e) },
    })
);

export const createCancelBtn = ({ onClick, textContent = 'cancel', disabled = false }) => (
    createElement('button', {
        props: {
            className: 'btn action-btn',
            type: 'button',
            textContent,
            disabled,
        },
        events: { click: (e) => onClick(e) },
    })
);

export const createInputField = ({ inputId, title }) => (
    createElement('div', {
        children: [
            createElement('label', { htmlFor: inputId, textContent: title }),
            Input.create({ id: inputId }).elem,
        ],
    })
);

export const createSelectField = ({ id, title, ...props }) => (
    createElement('div', {
        children: [
            createElement('label', { htmlFor: id, textContent: title }),
            createSelect({ id, ...props }),
        ],
    })
);

export const createFormContent = () => (
    createElement('div', {
        props: { id: 'formTemplate' },
        children: [
            createElement('div', {
                props: { textContent: 'This popup is created from template. Controls and title are added.' },
            }),
            createInputField({ title: 'New name', inputId: 'updname' }),
            createInputField({ title: 'New password', inputId: 'updpass' }),
        ],
    })
);

export const createNestedParentContent = () => (
    createElement('div', {
        props: { id: 'nestedParentTemplate' },
        children: [
            createElement('div', {
                props: { textContent: 'This popup will launch another popup.' },
            }),
            createElement('div', { props: { id: 'valueresult' } }),
        ],
    })
);

export const createNestedChildContent = () => (
    createElement('div', {
        props: { id: 'nestedChildTemplate' },
        children: [
            createElement('div', {
                props: { textContent: 'This popup is launched from another popup.' },
            }),
            createSelectField({
                id: 'valueselect',
                title: 'Values:',
                events: {
                    change: (e) => {
                        const resultEl = ge('valueresult');
                        if (resultEl) {
                            resultEl.textContent = selectedValue(e.target);
                        }
                    },
                },
            }),
        ],
    })
);
