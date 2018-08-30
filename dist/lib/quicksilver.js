"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var browser_utils_1 = require("@sethorax/browser-utils");
var Quicksilver = /** @class */ (function () {
    function Quicksilver(elementsOrSelector) {
        var input = this.normalizeInput(elementsOrSelector);
        if (input === null) {
            throw new Error("Invalid element or selector!");
        }
        if (input.isDocOrWin) {
            this.element = input.elements[0];
            this.elements = input.elements;
        }
        else {
            this.elements = input.elements;
            this.element = input.elements[0];
        }
    }
    Object.defineProperty(Quicksilver.prototype, "$", {
        /**
         * Shortcut for `$$().get(0)`
         */
        get: function () {
            return this.get(0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quicksilver.prototype, "length", {
        /**
         * Returns the amount of elements passed to the selector method or matched by the CSS selector.
         */
        get: function () {
            return this.elements.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quicksilver.prototype, "notEmpty", {
        /**
         * Returns `true` if at least one element was passed to the selector method or matched by the CSS selector.
         */
        get: function () {
            return this.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quicksilver.prototype, "width", {
        /**
         * Returns the width of the first element in the instance. If `document` or `window` were passed to the selector method the viewport width is returned insted.
         */
        get: function () {
            if (this.isElement(this.element)) {
                return this.element.clientWidth;
            }
            return (window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quicksilver.prototype, "fullWidth", {
        /**
         * Returns the full width (this includes margin and padding) of the first element in the instance. If `document` or `window` were passed to the selector method the viewport width is returned insted.
         */
        get: function () {
            if (this.isElement(this.element)) {
                var styles = window.getComputedStyle(this.element);
                var margin = parseFloat(styles["marginLeft"]) +
                    parseFloat(styles["marginRight"]);
                return Math.ceil(this.element.getBoundingClientRect().width + margin);
            }
            return this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quicksilver.prototype, "height", {
        /**
         * Returns the height of the first element in the instance. If `document` or `window` were passed to the selector method the viewport height is returned insted.
         */
        get: function () {
            if (this.isElement(this.element)) {
                return this.element.clientHeight;
            }
            return (window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quicksilver.prototype, "fullHeight", {
        /**
         * Returns the full height (this includes margin and padding) of the first element in the instance. If `document` or `window` were passed to the selector method the viewport height is returned insted.
         */
        get: function () {
            if (this.isElement(this.element)) {
                var styles = window.getComputedStyle(this.element);
                var margin = parseFloat(styles["marginTop"]) +
                    parseFloat(styles["marginBottom"]);
                return Math.ceil(this.element.getBoundingClientRect().height + margin);
            }
            return this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quicksilver.prototype, "absolutePosition", {
        /**
         * Return the absolute offset of the first element in the instance. The returned object contains the offset values from the top and from the left.
         */
        get: function () {
            if (this.isElement(this.element)) {
                var top_1 = 0;
                var left = 0;
                var currentElement = this.element;
                do {
                    top_1 += currentElement.offsetTop || 0;
                    left += currentElement.offsetLeft || 0;
                    currentElement = currentElement.offsetParent;
                } while (currentElement);
                return { top: top_1, left: left };
            }
            return { top: 0, left: 0 };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the element at the specified index.
     */
    Quicksilver.prototype.get = function (index) {
        if (index === void 0) { index = 0; }
        var e = this.elements[index];
        return this.isElement(e) && e;
    };
    /**
     * Returns all elements in the instance.
     */
    Quicksilver.prototype.getAll = function () {
        return this.elements;
    };
    /**
     * Returns the index the first element in the instance has within its parent element.
     */
    Quicksilver.prototype.getIndexInParent = function () {
        if (this.isElement(this.element)) {
            var pos = -1;
            var childs = this.element.parentElement.children;
            for (var i = 0; i < childs.length; i++) {
                if (childs[i] === this.element)
                    pos = i;
            }
            return pos;
        }
        return -1;
    };
    /**
     * Queries all child elements of the first element in the instance for the given CSS selector. If a match was found the first matched element will be returned.
     */
    Quicksilver.prototype.find = function (selector) {
        return this.isQueryable(this.element)
            ? this.element.querySelector(selector)
            : null;
    };
    /**
     * Queries all child elements of the first element in the instance for the given CSS selector. If a match was found a new Quicksilver instance with the matched elements will be returned.
     */
    Quicksilver.prototype.findAll = function (selector) {
        return this.isQueryable(this.element)
            ? new Quicksilver(this.element.querySelectorAll(selector))
            : null;
    };
    /**
     * Iterates over all elements in the instance and runs the given callback function for each element.
     */
    Quicksilver.prototype.forEach = function (callback) {
        var _this = this;
        this.elements.forEach(function (element, index) {
            _this.isElement(element) && callback(element, index, _this.length);
        });
    };
    /**
     * Runs the given callback function for each element in the instance and returns an array of the callback return values.
     */
    Quicksilver.prototype.map = function (callback) {
        var _this = this;
        return this.elements.map(function (element, index) {
            return (_this.isElement(element) && callback(element, index, _this.length));
        });
    };
    /**
     * Runs the given callback function for each element in the instance and returns an array of all elements where the callback function had a truthy return value.
     */
    Quicksilver.prototype.filter = function (callback) {
        var _this = this;
        return this.elements.filter(function (element, index) {
            return _this.isElement(element)
                ? callback(element, index, _this.length)
                : false;
        });
    };
    /**
     * Adds the passed class names to the first element in the instance.
     */
    Quicksilver.prototype.addClass = function () {
        var classNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classNames[_i] = arguments[_i];
        }
        var _a;
        this.isElement(this.element) && (_a = this.element.classList).add.apply(_a, classNames);
    };
    /**
     * Removes the passed class names from the first element in the instance.
     */
    Quicksilver.prototype.removeClass = function () {
        var classNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classNames[_i] = arguments[_i];
        }
        var _a;
        this.isElement(this.element) && (_a = this.element.classList).remove.apply(_a, classNames);
    };
    /**
     * Returns `true` if the first element in the instance has the passed CSS class.
     */
    Quicksilver.prototype.hasClass = function (className) {
        return this.isElement(this.element)
            ? this.element.className.indexOf(className) > -1
            : false;
    };
    /**
     * Removes the first element in the instace from the DOM.
     */
    Quicksilver.prototype.remove = function () {
        this.isElement(this.element) &&
            this.element.parentNode.removeChild(this.element);
    };
    /**
     * Inserts the first element in the instance after the passed element.
     */
    Quicksilver.prototype.insertAfter = function (element) {
        if (this.isElement(this.element)) {
            var pos = this.getIndexInParent();
            this.element.parentElement.insertBefore(element, this.element.parentElement.children[pos + 1]);
        }
    };
    /**
     * Inserts the first element in the instance before the passed element.
     */
    Quicksilver.prototype.insertBefore = function (element) {
        if (this.isElement(this.element)) {
            this.element.parentElement.insertBefore(element, this.element);
        }
    };
    /**
     * Append the first element in the instance to the passed element.
     */
    Quicksilver.prototype.append = function (element) {
        this.isElement(this.element) && this.element.appendChild(element);
    };
    /**
     * Prepend the first element in the instance to the passed element.
     */
    Quicksilver.prototype.prepend = function (element) {
        this.isElement(this.element) &&
            this.element.insertBefore(element, this.element.firstChild);
    };
    /**
     * Attaches event listeners for the passed events to all elements in the instance. The callback function is called if one of the events gets triggered.
     */
    Quicksilver.prototype.on = function (eventNames, callback) {
        var _this = this;
        eventNames.split(" ").forEach(function (eventName) {
            var check = function (element) {
                element.addEventListener(eventName, callback);
            };
            _this.isElement(_this.element)
                ? _this.forEach(check)
                : check(_this.element);
        });
    };
    /**
     * Works similar to `$$().on` but with the difference that the event path is checked if the passed child element or selector was matched by the event. If a match is found the callback is called.
     */
    Quicksilver.prototype.onChildEventMatch = function (eventNames, elementOrSelector, callback) {
        var match = function (element) {
            if (typeof elementOrSelector === "string" &&
                element instanceof HTMLElement) {
                return browser_utils_1.elementMatches(element, elementOrSelector);
            }
            return element === elementOrSelector;
        };
        this.on(eventNames, function (event) {
            var matchFound = false;
            browser_utils_1.getEventPath(event).forEach(function (pathElement) {
                if (!matchFound &&
                    pathElement instanceof HTMLElement &&
                    match(pathElement)) {
                    matchFound = true;
                    callback(event, pathElement);
                }
            });
        });
    };
    Quicksilver.prototype.dispatchEvent = function (eventName, data) {
        var event;
        if (typeof CustomEvent === "function") {
            event = new CustomEvent(eventName, { detail: data });
        }
        else {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent(eventName, false, false, data);
        }
        this.element.dispatchEvent(event);
    };
    Quicksilver.prototype.normalizeInput = function (elementsOrSelector) {
        if (typeof elementsOrSelector === "string") {
            return {
                elements: this.getElementsFromSelector(elementsOrSelector),
                isDocOrWin: false,
            };
        }
        if (elementsOrSelector instanceof NodeList) {
            return {
                elements: browser_utils_1.listToArray(elementsOrSelector),
                isDocOrWin: false,
            };
        }
        if (elementsOrSelector instanceof HTMLElement) {
            return {
                elements: new Array(elementsOrSelector),
                isDocOrWin: false,
            };
        }
        if (elementsOrSelector === document || elementsOrSelector === window) {
            return {
                elements: new Array(elementsOrSelector),
                isDocOrWin: true,
            };
        }
        return null;
    };
    Quicksilver.prototype.getElementsFromSelector = function (selector) {
        return browser_utils_1.listToArray(document.querySelectorAll(selector));
    };
    Quicksilver.prototype.isQueryable = function (element) {
        return element.querySelector !== undefined;
    };
    Quicksilver.prototype.isElement = function (element) {
        return element instanceof HTMLElement;
    };
    return Quicksilver;
}());
exports.Quicksilver = Quicksilver;
exports.factory = function (elementsOrSelector) {
    return new Quicksilver(elementsOrSelector);
};
exports.default = exports.factory;
