(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.qsDom = {})));
}(this, (function (exports) { 'use strict';

    var QSDom = /** @class */ (function () {
        function QSDom(elementsOrSelector) {
            this.elementMatchesSelector = function (element, selector) {
                return element.matches(selector) || element.webkitMatchesSelector(selector) || element.msMatchesSelector(selector) || false;
            };
            var input = this.normalizeInput(elementsOrSelector);
            if (input === null) {
                throw new Error('Invalid element or selector!');
            }
            if (input.isDocOrWin) {
                this.element = input.elements[0];
            }
            else {
                this.elements = input.elements;
                this.element = input.elements[0];
            }
        }
        Object.defineProperty(QSDom.prototype, "$", {
            get: function () {
                return this.get(0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QSDom.prototype, "length", {
            get: function () {
                return this.elements.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QSDom.prototype, "notEmpty", {
            get: function () {
                return this.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QSDom.prototype, "width", {
            get: function () {
                if (this.isElement(this.element)) {
                    return this.element.clientWidth;
                }
                return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QSDom.prototype, "fullWidth", {
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
        Object.defineProperty(QSDom.prototype, "height", {
            get: function () {
                if (this.isElement(this.element)) {
                    return this.element.clientHeight;
                }
                return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QSDom.prototype, "fullHeight", {
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
        Object.defineProperty(QSDom.prototype, "absolutePosition", {
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
        QSDom.prototype.get = function (index) {
            if (index === void 0) { index = 0; }
            return this.elements[index];
        };
        QSDom.prototype.getAll = function () {
            return this.elements;
        };
        QSDom.prototype.find = function (selector) {
            return this.isQueryable(this.element) ? this.element.querySelector(selector) : null;
        };
        QSDom.prototype.forEach = function (callback) {
            var _this = this;
            this.elements.forEach(function (element, index) {
                callback(element, index, _this.length);
            });
        };
        QSDom.prototype.map = function (callback) {
            var _this = this;
            return this.elements.map(function (element, index) {
                return callback(element, index, _this.length);
            });
        };
        QSDom.prototype.filter = function (callback) {
            var _this = this;
            return this.elements.filter(function (element, index) {
                return callback(element, index, _this.length);
            });
        };
        QSDom.prototype.addClass = function () {
            var classNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classNames[_i] = arguments[_i];
            }
            var _a;
            this.isElement(this.element) && (_a = this.element.classList).add.apply(_a, classNames);
        };
        QSDom.prototype.removeClass = function () {
            var classNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classNames[_i] = arguments[_i];
            }
            var _a;
            this.isElement(this.element) && (_a = this.element.classList).remove.apply(_a, classNames);
        };
        QSDom.prototype.hasClass = function (className) {
            return this.isElement(this.element) ? this.element.className.indexOf(className) > -1 : false;
        };
        QSDom.prototype.remove = function () {
            this.isElement(this.element) && this.element.parentNode.removeChild(this.element);
        };
        QSDom.prototype.insertAfter = function (element) {
            this.isElement(this.element) && this.element.insertAdjacentElement('afterend', element);
        };
        QSDom.prototype.insertBefore = function (element) {
            this.isElement(this.element) && this.element.insertAdjacentElement('beforebegin', element);
        };
        QSDom.prototype.append = function (element) {
            this.isElement(this.element) && this.element.appendChild(element);
        };
        QSDom.prototype.prepend = function (element) {
            this.isElement(this.element) && this.element.insertAdjacentElement('afterbegin', element);
        };
        QSDom.prototype.on = function (eventNames, callback) {
            var _this = this;
            eventNames.split(" ").forEach(function (eventName) {
                _this.forEach(function (element) { return element.addEventListener(eventName, callback); });
            });
        };
        QSDom.prototype.onChildEventMatch = function (eventName, ElementsOrSelector, callback) {
            var _this = this;
            var match = function (element) {
                if (typeof ElementsOrSelector === 'string' && element instanceof HTMLElement) {
                    return _this.elementMatchesSelector(element, ElementsOrSelector);
                }
                return element === ElementsOrSelector;
            };
            eventName.split(" ").forEach(function (eventName) {
                _this.forEach(function (element) { return element.addEventListener(eventName, function (event) {
                    var matchFound = false;
                    _this.getEventPath(event).forEach(function (pathElement) {
                        if (!matchFound && pathElement instanceof HTMLElement && match(pathElement)) {
                            matchFound = true;
                            callback(event, pathElement);
                        }
                    });
                }); });
            });
        };
        QSDom.prototype.dispatchEvent = function (eventName, data) {
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
        QSDom.prototype.getEventPath = function (event) {
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
            return this.isEventWithPath(event) ? event.path || event.composedPath : polyfill();
        };
        QSDom.prototype.normalizeInput = function (elementsOrSelector) {
            if (typeof elementsOrSelector === "string") {
                return { elements: this.getElementsFromSelector(elementsOrSelector), isDocOrWin: false };
            }
            if (elementsOrSelector instanceof NodeList) {
                return { elements: this.convertNodeListToArray(elementsOrSelector), isDocOrWin: false };
            }
            if (elementsOrSelector instanceof HTMLElement) {
                return { elements: new Array(elementsOrSelector), isDocOrWin: false };
            }
            if (elementsOrSelector instanceof Document || elementsOrSelector instanceof Window) {
                return { elements: new Array(elementsOrSelector), isDocOrWin: true };
            }
            return null;
        };
        QSDom.prototype.convertNodeListToArray = function (nodeList) {
            var nodes = new Array();
            for (var i = 0; i < nodeList.length; i++) {
                var n = nodeList[i];
                if (n instanceof HTMLElement) {
                    nodes.push(n);
                }
            }
            return nodes;
        };
        QSDom.prototype.getElementsFromSelector = function (selector) {
            return this.convertNodeListToArray(document.querySelectorAll(selector));
        };
        QSDom.prototype.isEventWithPath = function (event) {
            return event.path !== undefined || event.composedPath !== undefined;
        };
        QSDom.prototype.isQueryable = function (element) {
            return element.querySelector !== undefined;
        };
        QSDom.prototype.isElement = function (element) {
            return element instanceof HTMLElement;
        };
        return QSDom;
    }());
    var qsDom = (function (elementsOrSelector) { return new QSDom(elementsOrSelector); });

    exports.QSDom = QSDom;
    exports.default = qsDom;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
