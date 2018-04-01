import {
    normalizeElementsOrSelector,
    convertNodeListToArray,
    elementMatchesSelector,
    getEventPath,
    isNode
} from './utils/index';

export const QSDomCore = function(elementsOrSelector) {
    const elements = normalizeElementsOrSelector(elementsOrSelector);
    const element = elements[0] || {};

    return {
        get $() { return this.get(); },

        get length() { return elements.length; },

        get width() {
            return isNode(element) ? element.clientWidth : (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
        },

        get fullWidth() {
            const styles = window.getComputedStyle(element);
            const margin = parseFloat(styles['marginLeft']) + parseFloat(styles['marginRight']);

            return Math.ceil(element.offsetWidth + margin);
        },

        get height() {
            return isNode(element) ? element.clientHeight : (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
        },

        get fullHeight() {
            if (!isNode(element)) return this.height;

            const styles = window.getComputedStyle(element);
            const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

            return Math.ceil(element.offsetHeight + margin);
        },

        get absolutePosition() {
            let top = 0;
            let left = 0;

            let currentElement = element;

            do {
                top += currentElement.offsetTop || 0;
                left += currentElement.offsetLeft || 0;
                currentElement = currentElement.offsetParent;
            } while(currentElement);

            return { top, left };
        },

        get(index = 0) {
            return elements[index];
        },

        hasClass(className) {
            return element.className.indexOf(className) > -1;
        },

        addClass(className) {
            element.classList.add(className);
        },

        removeClass(className) {
            element.classList.remove(className);
        },

        remove() {
            element.parentNode.removeChild(element);
        },

        on(eventNames, callback) {
            eventNames.split(' ').forEach(eventName => {
                this.forEach(element => element.addEventListener(eventName, callback));
            });
        },

        onChildEventMatch(eventNames, targetElementOrSelector, callback) {
            const match = element => {
                if (typeof targetElementOrSelector === 'string') {
                    return elementMatchesSelector(element, targetElementOrSelector);
                }

                return element === targetElementOrSelector;
            };

            eventNames.split(' ').forEach(eventName => {
                this.forEach(element => element.addEventListener(eventName, event => {
                    let matchFound = false;

                    getEventPath(event).forEach(pathElement => {
                        if (!matchFound && match(pathElement)) {
                            matchFound = true;
                            callback(event, pathElement);
                        }
                    });
                }));
            });
        },

        dispatchEvent(eventName) {
            let event;

            if (typeof Event === 'function') {
                event = new Event(eventName);
            } else {
                event = document.createEvent('Event'),
                event.initEvent(eventName, true, true);
            }

            element.dispatchEvent(event);
        },

        forEach(callback) {
            elements.forEach((element, index) => {
                callback(element, index, elements.length);
            });
        },

        map(callback) {
            return elements.map((element, index) => {
                return callback(element, index, elements.length);
            });
        }
    };
};