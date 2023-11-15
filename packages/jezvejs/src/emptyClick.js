import { isFunction, asArray } from '@jezvejs/types';
import { ge } from '@jezvejs/dom';

const clickHandlersMap = [];

/**
 * Handler for click on empty space event
 * @param {Event} e - click event object
 * @param {Function} callback - event handler
 * @param {Element[]} elem - elements to skip handler if click occurs on it
 */
const onEmptyClick = (e, callback, elem) => {
    let notExcluded = true;
    const elems = asArray(elem);

    if (!isFunction(callback)) {
        return;
    }

    if (e) {
        notExcluded = elems.every((el) => {
            const currentElem = ((typeof el === 'string') ? ge(el) : el) || null;

            return ((
                currentElem
                && !currentElem.contains(e.target)
                && currentElem !== e.target
            ) || !currentElem);
        });
    }

    if (notExcluded) {
        callback();
    }
};

/** Returns index of 'empty click' handler with specified callback */
const getEmptyClickHandlerIndex = (callback) => (
    clickHandlersMap.findIndex((item) => item.callback === callback)
);

/** Set event handler for click by empty place */
export const setEmptyClick = (callback, elem) => {
    if (!document.documentElement || !isFunction(callback)) {
        return;
    }

    setTimeout(() => {
        const ind = getEmptyClickHandlerIndex(callback);
        if (ind !== -1) {
            return;
        }

        const handler = (e) => onEmptyClick(e, callback, elem);
        clickHandlersMap.push({ callback, handler });

        document.documentElement.addEventListener(
            'click',
            handler,
        );
    });
};

/** Remove previously set event handler for click by empty place */
export const removeEmptyClick = (callback) => {
    const ind = getEmptyClickHandlerIndex(callback);
    if (ind === -1) {
        return;
    }

    const handlerItem = clickHandlersMap[ind];
    document.documentElement.removeEventListener(
        'click',
        handlerItem.handler,
    );

    clickHandlersMap.splice(ind, 1);
};
