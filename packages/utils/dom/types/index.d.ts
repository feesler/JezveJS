/**
 * Native event listener used by .addEventListener() and .removeEventListener() methods
 */
export interface ListenerFunction<T extends Event = Event> {
    (e: T): void;
}

export interface ListenerOptions {
    passive?: boolean;
    capture?: boolean;
    once?: boolean;
    signal?: AbortSignal;
}

/**
 * Event listener object supported by setEvents() and removeEvents() functions
 */
export interface ListenerObject {
    listener: ListenerFunction;
    options?: ListenerOptions;
}

export type Listener = ListenerFunction | ListenerObject;

export interface ListenerFunctionsGroup {
    [type: string]: ListenerFunction;
}

export interface ListenersGroup {
    [type: string]: Listener;
}

/**
 * Coordinates point
 */
export interface Point {
    x: number;
    y: number;
}

/**
 * Range type
 */
export interface RangeType {
    start: number;
    end: number;
}

/**
 * Indexed CSS style object
 */
export type StyleDeclaration = Partial<CSSStyleDeclaration> & { [propName: string]: string };

/** Return DOM element by id */
export const ge: (id: string) => Element | null;

/**
 * Assign properties from second object to first
 * @param {Object} obj - object to assign properties to
 * @param {Object} props - object to obtain properties from
 */
export const setProps: (obj: object, props: object) => void;

/** Set attributes to specified element */
export const setAttributes: (element: Element, attrs: object) => void;

/**
 * Append child to specified element
 * @param {Element} elem - element to append child to
 * @param {Element[]} childs - element or array of elements to append
 */
export const addChilds: (elem: Element, childs: Element | Element[] | null) => void;

/**
 * Set up event handlers for specified element
 * @param {EventTarget} elem - element to set event handlers
 * @param {object} events - event handlers object
 * @param {boolean|object} options - useCapture flag or options object
 */
export const setEvents: (
    elem: EventTarget | null | undefined,
    events: ListenerFunctionsGroup | ListenersGroup,
    options?: boolean | object | undefined,
) => void;

/**
 * Remove event handlers from specified element
 * @param {EventTarget} elem - element to remove event handlers from
 * @param {object} events - event handlers object
 * @param {boolean|object} options - useCapture flag or options object
 */
export const removeEvents: (
    elem: EventTarget | null | undefined,
    events: ListenerFunctionsGroup | ListenersGroup,
    options?: boolean | object | undefined,
) => void;

export interface CreateElementOptions {
    props?: object;
    attrs?: object;
    children?: Element | Element[] | string | null;
    events: object;
}

/**
 * Applies options to element
 * @param {Element} elem - element to apply options
 * @param {Object} options
 * @param {Object} options.attrs - attributes to set for created element
 * @param {Object} options.props - properties to set for created element
 * @param {Element[]} options.children - element or array of elements to append
 * @param {Object} options.events - event handlers object
 */
export const applyElementOptions: (
    elem: Element,
    options?: CreateElementOptions,
) => void;

/**
 * Creates specified DOM element and sets parameters if specified
 * @param {string} tagName - tag name of element to create
 * @param {Object} options
 * @param {Object} options.attrs - attributes to set for created element
 * @param {Object} options.props - properties to set for created element
 * @param {Element[]} options.children - element or array of elements to append
 * @param {Object} options.events - event handlers object
 */
export const createElement: (
    tagName: string,
    options?: CreateElementOptions,
) => Element | null;

/**
 * Creates specified SVG element and sets parameters if specified
 * @param {string} tagName - tag name of element to create
 * @param {Object} options
 * @param {Object} options.attrs - attributes to set for created element
 * @param {Object} options.props - properties to set for created element
 * @param {Element[]} options.children - element or array of elements to append
 * @param {Object} options.events - event handlers object
 */
export const createSVGElement: (
    tagName: string,
    options?: CreateElementOptions,
) => SVGElement | null;

/** Returns splitted and filtered array of class names */
export const getClassNames: (...args: string[]) => string[];

/** Returns arguments converted to className string */
export const getClassName: (...args: string[]) => string;

export interface FormDataType {
    [name: string]: string;
}

/**
 * Obtain request data of specified form element
 * @param {HTMLFormElement} form - form element to obtain data from
 */
export const getFormData: (form: HTMLFormElement) => FormDataType | null;

/** Return current computed style of element */
export const computedStyle: (elem: Element) => CSSStyleDeclaration;

/**
 * Return visibility of specified element
 * @param {Element|string} target - element to check visibility of
 * @param {boolean} recursive - if set to true will check visibility of all parent nodes
 */
export const isVisible: (target: Element | string, recursive: boolean) => boolean;

/**
 * Show/hide specified element
 * @param {Element|string} target - element or id to show/hide
 * @param {*} val - if set to true then element will be shown, hidden otherwise
 */
export const show: (target: Element | string, val?: boolean) => void;

/**
 * Enable or disable specified element
 * @param {Element|string} target - element or id to show/hide
 * @param {boolean} val - if set to true then element will be enabled, disable otherwise
 */
export const enable: (target: Element | string, val?: boolean) => void;

/** Return caret position in specified input control */
export const getCaretPos: (elem: Element) => number;

export interface CursorPos {
    start: number;
    end: number;
}

/**
 * Return curson/selection position for specified input element
 * @param {Element} input
 */
export const getCursorPos: (input: Element) => CursorPos | null;

/**
 * Set curson position for specified input element
 * @param {Element} input
 * @param {number} startPos
 * @param {number} endPos
 */
export const selectText: (input: Element, startPos: number, endPos: number) => void;

/**
 * Set curson position for specified input element
 * @param {Element} input
 * @param {number} pos
 */
export const setCursorPos: (input: Element, pos: number) => void;

/** Return text of selected option of select object */
export const selectedText: (selectObj) => string | number;

/** Return value of selected option of select object */
export const selectedValue: (selectObj: Element) => string | number;

/**
 * Select item with specified value if exist
 * @param {Element} selectObj - select element
 * @param {string} selValue - option value to select
 * @param {boolean} selBool - if set to false then deselect option, select otherwise
 */
export const selectByValue: (
    selectObj: Element,
    selValue: string,
    selBool: boolean,
) => boolean;

export interface Offset {
    left: number;
    top: number;
}

/** Calculate offset of element by sum of offsets of parents */
export const getOffsetSum: (elem) => Offset;

/** Calculate offset of element using getBoundingClientRect() method */
export const getOffsetRect: (elem) => Offset;

/** Calculate offset of element */
export const getOffset: (elem) => Offset;

/** Compare position of two node in the document */
export const comparePosition: (a: Element, b: Element) => number;

/** Return page scroll */
export const getPageScroll: () => Offset;

/** Cross-browser find head element */
export const head: () => Element | null;

/** Set cross-browser transform value */
export const transform: (elem: HTMLElement, value: string) => void;

export type AfterTransitionCallback = () => void;
export type CancelTransitionCallback = () => void;

/**
 * Runs specified callback after transition end or timeout
 * @param {Element} elem
 * @param {Object} options
 * @param {Function} callback
 */
export const afterTransition: (
    elem: Element,
    options: object,
    callback: AfterTransitionCallback,
) => CancelTransitionCallback;

/**
 * Restarts animation of element
 * @param {Element} elem
 */
export const reflow: (elem: Element) => number | undefined;

/** Return fixed DPI value */
export const getRealDPI: () => number;

/** Add new DOM ready event handler to the queue */
export const onReady: (handler: () => void) => void;
