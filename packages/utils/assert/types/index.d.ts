export type AssertFunction = {
    (obj: any, message?: string): void;
};

export type CompareAssertFunction = {
    (objA: any, objB: any, message?: string): void;
};

export interface MeetFailResult {
    key: string;
    value?: any;
    expected?: any;
}

export type MeetAssertFunction = {
    (obj: any, expectedObj: any, ret?: boolean): boolean | MeetFailResult;
};

/** Throws an exception if expression is not thuthy */
export const assert: AssertFunction & {
    /**
     * Throws an exception if object is not instance of specified class
     * @param {Object} obj - object to check
     * @param {Constructor } constructor - expected class
     * @param {String|null} message - optional error message
     */
    instanceOf: CompareAssertFunction,

    /**
     * Throws an exception if object is not array
     * @param {*} obj - object to check
     * @param {String|null} message - optional error message
     */
    isArray: AssertFunction,


    /**
     * Throws an exception if object is not object
     * @param {*} obj - object to check
     * @param {String|null} message - optional error message
     */
    isObject: AssertFunction,

    /**
     * Throws an exception if object is not function
     * @param {*} obj - object to check
     * @param {String|null} message - optional error message
     */
    isFunction: AssertFunction,

    /**
     * Throws an exception if object is not Date
     * @param {*} obj - object to check
     * @param {String|null} message - optional error message
     */
    isDate: AssertFunction,

    /**
     * Throws an exception if object is not string
     * @param {*} obj - object to check
     * @param {String|null} message - optional error message
     */
    isString: AssertFunction,

    /**
     * Throws an exception if object is undefined
     * @param {*} obj - object to check
     * @param {String|null} message - optional error message
     */
    isDefined: AssertFunction,

    /**
     * Throws an exception if object is defined
     * @param {*} obj - object to check
     * @param {String|null} message - optional error message
     */
    isUndefined: AssertFunction,

    /**
     * Throws an exception if object is not number
     * @param {*} obj - object to check
     * @param {String|null} message - optional error message
     */
    isNumber: AssertFunction,

    /**
     * Throws an exception if object is not integer
     * @param {*} obj - object to check
     * @param {String|null} message - optional error message
     */
    isInteger: AssertFunction,

    /**
     * Throws an exception if index is not valid for specified array
     * @param {Array} arr
     * @param {Number} ind
     * @param {String|null} message
     */
    arrayIndex: CompareAssertFunction,

    /**
     * Throws an exception if specified value is not strictly equal to expected value
     * @param {*} value
     * @param {*} expected
     * @param {String|null} message
     */
    equal: CompareAssertFunction,

    /**
     * Throws an exception if specified value is equal to expected value
     * @param {*} value
     * @param {*} expected
     * @param {String|null} message
     */
    notEqual: CompareAssertFunction,

    /**
     * Throws an exception if specified value is not less than expected value
     * @param {*} value
     * @param {*} expected
     * @param {String|null} message
     */
    less: CompareAssertFunction,

    /**
     * Throws an exception if specified value is not less than or equal to expected value
     * @param {*} value
     * @param {*} expected
     * @param {String|null} message
     */
    lessOrEqual: CompareAssertFunction,

    /**
     * Throws an exception if specified value is not greater than expected value
     * @param {*} value
     * @param {*} expected
     * @param {String|null} message
     */
    greater: CompareAssertFunction,

    /**
     * Throws an exception if specified value is not greater than expected value
     * @param {*} value
     * @param {*} expected
     * @param {String|null} message
     */
    greaterOrEqual: CompareAssertFunction,

    /**
     * Throws an exception if specified object does not match with the expected object
     * @param {Object} obj
     * @param {Object} expectedObj
     * @param {boolean} ret - return or throw
     */
    deepMeet: MeetAssertFunction,

    /**
     * Throws an exception if specified object does not exactly match with the expected object
     * @param {Object} obj
     * @param {Object} expectedObj
     * @param {boolean} ret - return or throw
     */
    exactMeet: MeetAssertFunction,
};
