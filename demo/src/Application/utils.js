import { asArray } from '@jezvejs/types';
import { createElement, getClassName } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';

export const createContainer = (id, children) => createElement('div', {
    props: { id },
    children,
});

export const createForm = (id, children) => createElement('form', {
    props: { id },
    children,
});

export const createControls = (children) => (
    createElement('div', {
        props: { className: 'section-controls' },
        children,
    })
);

export const createButtons = (items) => (
    createControls(
        asArray(items).map((item) => (
            Button.create({
                ...item,
                className: getClassName('action-btn', item.className),
            }).elem
        )),
    )
);

export const generateId = () => {
    while (true) {
        const id = (Date.now() + Math.round(Math.random() * 1000000000000)).toString(36);
        const found = document.getElementById(id);
        if (!found) {
            return id;
        }
    }
};

export const getDefaultOptionProps = (index) => ({
    value: index.toString(),
    textContent: `Item ${index}`,
    selected: false,
    disabled: false,
});

export const createOption = (index, options = {}) => {
    const {
        getOptionProps = getDefaultOptionProps,
    } = options;
    const {
        disabled = false,
        attrs = {},
        events = {},
        ...props
    } = getOptionProps(index);

    if (disabled) {
        attrs.disabled = '';
    }

    return createElement('option', { props, attrs, events });
};

export const createOptions = (options = {}) => {
    const {
        startFrom = 1,
        itemsCount = 5,
        getOptionProps = getDefaultOptionProps,
    } = options;

    const res = [];

    for (let ind = startFrom; ind < startFrom + itemsCount; ind += 1) {
        const option = createOption(ind, { getOptionProps });
        res.push(option);
    }

    return res;
};

export const createSelect = (options = {}) => {
    const {
        content = null,
        disabled = false,
        startFrom = 1,
        itemsCount = 5,
        getOptionProps = getDefaultOptionProps,
        attrs = {},
        events = {},
        ...props
    } = options;

    if (disabled) {
        attrs.disabled = '';
    }

    const contentProps = { startFrom, itemsCount, getOptionProps };

    return createElement('select', {
        props,
        attrs,
        events,
        children: content ?? createOptions(contentProps),
    });
};

export const createOptGroup = (options = {}) => {
    const {
        content = null,
        disabled = false,
        startFrom = 1,
        itemsCount = 5,
        getOptionProps = getDefaultOptionProps,
        attrs = {},
        events = {},
        ...props
    } = options;

    if (disabled) {
        attrs.disabled = '';
    }

    const contentProps = { startFrom, itemsCount, getOptionProps };

    return createElement('optgroup', {
        props,
        attrs,
        events,
        children: content ?? createOptions(contentProps),
    });
};
