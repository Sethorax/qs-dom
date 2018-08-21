(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.quicksilver = {})));
}(this, (function (exports) { 'use strict';

    var Quicksilver = /** @class */ (function () {
        function Quicksilver(elementsOrSelector) {
            this.elementMatchesSelector = function (element, selector) {
                return (element.matches && element.matches(selector)) ||
                    (element.webkitMatchesSelector && element.webkitMatchesSelector(selector)) ||
                    (element.msMatchesSelector && element.msMatchesSelector(selector)) ||
                    false;
            };
            var input = this.normalizeInput(elementsOrSelector);
            if (input === null) {
                throw new Error('Invalid element or selector!');
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
            get: function () {
                return this.get(0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quicksilver.prototype, "length", {
            get: function () {
                return this.elements.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quicksilver.prototype, "notEmpty", {
            get: function () {
                return this.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quicksilver.prototype, "width", {
            get: function () {
                if (this.isElement(this.element)) {
                    return this.element.clientWidth;
                }
                return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quicksilver.prototype, "fullWidth", {
            get: function () {
                if (this.isElement(this.element)) {
                    var styles = window.getComputedStyle(this.element);
                    var margin = parseFloat(styles['marginLeft']) + parseFloat(styles['marginRight']);
                    return Math.ceil(this.element.getBoundingClientRect().width + margin);
                }
                return this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quicksilver.prototype, "height", {
            get: function () {
                if (this.isElement(this.element)) {
                    return this.element.clientHeight;
                }
                return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quicksilver.prototype, "fullHeight", {
            get: function () {
                if (this.isElement(this.element)) {
                    var styles = window.getComputedStyle(this.element);
                    var margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
                    return Math.ceil(this.element.getBoundingClientRect().height + margin);
                }
                return this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quicksilver.prototype, "absolutePosition", {
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
        Quicksilver.prototype.get = function (index) {
            if (index === void 0) { index = 0; }
            var e = this.elements[index];
            return this.isElement(e) && e;
        };
        Quicksilver.prototype.getAll = function () {
            return this.elements;
        };
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
        Quicksilver.prototype.find = function (selector) {
            return this.isQueryable(this.element) ? this.element.querySelector(selector) : null;
        };
        Quicksilver.prototype.findAll = function (selector) {
            return this.isQueryable(this.element) ? new Quicksilver(this.element.querySelectorAll(selector)) : null;
        };
        Quicksilver.prototype.forEach = function (callback) {
            var _this = this;
            this.elements.forEach(function (element, index) {
                _this.isElement(element) && callback(element, index, _this.length);
            });
        };
        Quicksilver.prototype.map = function (callback) {
            var _this = this;
            return this.elements.map(function (element, index) {
                return _this.isElement(element) && callback(element, index, _this.length);
            });
        };
        Quicksilver.prototype.filter = function (callback) {
            var _this = this;
            return this.elements.filter(function (element, index) {
                return _this.isElement(element) ? callback(element, index, _this.length) : false;
            });
        };
        Quicksilver.prototype.addClass = function () {
            var classNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classNames[_i] = arguments[_i];
            }
            var _a;
            this.isElement(this.element) && (_a = this.element.classList).add.apply(_a, classNames);
        };
        Quicksilver.prototype.removeClass = function () {
            var classNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classNames[_i] = arguments[_i];
            }
            var _a;
            this.isElement(this.element) && (_a = this.element.classList).remove.apply(_a, classNames);
        };
        Quicksilver.prototype.hasClass = function (className) {
            return this.isElement(this.element) ? this.element.className.indexOf(className) > -1 : false;
        };
        Quicksilver.prototype.remove = function () {
            this.isElement(this.element) && this.element.parentNode.removeChild(this.element);
        };
        Quicksilver.prototype.insertAfter = function (element) {
            if (this.isElement(this.element)) {
                var pos = this.getIndexInParent();
                this.element.parentElement.insertBefore(element, this.element.parentElement.children[pos + 1]);
            }
        };
        Quicksilver.prototype.insertBefore = function (element) {
            if (this.isElement(this.element)) {
                this.element.parentElement.insertBefore(element, this.element);
            }
        };
        Quicksilver.prototype.append = function (element) {
            this.isElement(this.element) && this.element.appendChild(element);
        };
        Quicksilver.prototype.prepend = function (element) {
            this.isElement(this.element) && this.element.insertBefore(element, this.element.firstChild);
        };
        Quicksilver.prototype.on = function (eventNames, callback) {
            var _this = this;
            eventNames.split(" ").forEach(function (eventName) {
                var check = function (element) {
                    element.addEventListener(eventName, callback);
                };
                _this.isElement(_this.element) ? _this.forEach(check) : check(_this.element);
            });
        };
        Quicksilver.prototype.onChildEventMatch = function (eventNames, elementOrSelector, callback) {
            var _this = this;
            var match = function (element) {
                if (typeof elementOrSelector === 'string' && element instanceof HTMLElement) {
                    return _this.elementMatchesSelector(element, elementOrSelector);
                }
                return element === elementOrSelector;
            };
            this.on(eventNames, function (event) {
                var matchFound = false;
                _this.getEventPath(event).forEach(function (pathElement) {
                    if (!matchFound && pathElement instanceof HTMLElement && match(pathElement)) {
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
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, false, false, data);
            }
            this.element.dispatchEvent(event);
        };
        Quicksilver.prototype.getEventPath = function (event) {
            var polyfill = function () {
                var element = event.target;
                var pathArr = new Array(element);
                if (element === null || element.parentElement === null) {
                    return [];
                }
                while (element.parentElement !== null) {
                    element = element.parentElement;
                    pathArr.unshift(element);
                }
                return pathArr;
            };
            return this.isEventWithPath(event) ? event.path || event.composedPath() : polyfill();
        };
        Quicksilver.prototype.normalizeInput = function (elementsOrSelector) {
            if (typeof elementsOrSelector === "string") {
                return { elements: this.getElementsFromSelector(elementsOrSelector), isDocOrWin: false };
            }
            if (elementsOrSelector instanceof NodeList) {
                return { elements: this.convertNodeListToArray(elementsOrSelector), isDocOrWin: false };
            }
            if (elementsOrSelector instanceof HTMLElement) {
                return { elements: new Array(elementsOrSelector), isDocOrWin: false };
            }
            if (elementsOrSelector === document || elementsOrSelector === window) {
                return { elements: new Array(elementsOrSelector), isDocOrWin: true };
            }
            return null;
        };
        Quicksilver.prototype.convertNodeListToArray = function (nodeList) {
            var nodes = new Array();
            for (var i = 0; i < nodeList.length; i++) {
                var n = nodeList[i];
                if (n instanceof HTMLElement) {
                    nodes.push(n);
                }
            }
            return nodes;
        };
        Quicksilver.prototype.getElementsFromSelector = function (selector) {
            return this.convertNodeListToArray(document.querySelectorAll(selector));
        };
        Quicksilver.prototype.isEventWithPath = function (event) {
            return event.path !== undefined || event.composedPath !== undefined;
        };
        Quicksilver.prototype.isQueryable = function (element) {
            return element.querySelector !== undefined;
        };
        Quicksilver.prototype.isElement = function (element) {
            return element instanceof HTMLElement;
        };
        return Quicksilver;
    }());
    var factory = function (elementsOrSelector) { return new Quicksilver(elementsOrSelector); };

    exports.Quicksilver = Quicksilver;
    exports.factory = factory;
    exports.default = factory;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
