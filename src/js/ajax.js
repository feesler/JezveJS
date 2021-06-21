import { isFunction, copyObject } from './common.js';
/* global ActiveXObject */

export const ajax = new (function () {
    /** Create AJAX object */
    function createRequestObject() {
        try {
            return new XMLHttpRequest();
        } catch (e) {
            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e2) {
                try {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                } catch (e3) {
                    return null;
                }
            }
        }
    }

    /** Request ready status change event handler */
    function onStateChange(callback) {
        if (this.readyState === 4) {
            if (callback) {
                callback(this.responseText);
            }
        }
    }

    /** Return value of specified header from headers object */
    function getHeader(headers, name) {
        if (!headers || !name) {
            return null;
        }

        const lname = name.toLowerCase();
        const res = Object.keys(headers).find((key) => lname === key.toLowerCase());

        return (res) ? headers[res] : null;
    }

    /**
     * Make asynchronous request
     * @param {Object} options
     * @param {string} options.url - request URL
     * @param {string} options.method - request method
     */
    function sendRequest(options) {
        const supportedMethods = ['get', 'head', 'post', 'put', 'delete', 'options'];

        if (!options || !options.url || !options.method) {
            return false;
        }

        const http = createRequestObject();
        if (!http) {
            return false;
        }

        const method = options.method.toLowerCase();
        if (!supportedMethods.includes(method)) {
            return false;
        }

        http.open(method, options.url, true);
        if (options.headers) {
            Object.keys(options.headers).forEach((key) => {
                http.setRequestHeader(key, options.headers[key]);
            });
        }

        if (method === 'post') {
            const contentType = getHeader(options.headers, 'Content-Type');
            if (!contentType) {
                http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
        }

        if (isFunction(options.callback)) {
            http.onreadystatechange = onStateChange.bind(http, options.callback);
        }

        const data = ('data' in options) ? options.data : null;
        http.send(data);

        return true;
    }

    /* ajax global object public methods */

    /** Send GET request */
    this.get = function (options) {
        if (!options || !options.url) {
            return false;
        }

        const request = copyObject(options);
        request.method = 'get';
        request.data = null;

        return sendRequest(request);
    };

    /** Send POST request */
    this.post = function (options) {
        if (!options || !options.url) {
            return false;
        }

        const request = copyObject(options);
        request.method = 'post';

        return sendRequest(request);
    };
})();
