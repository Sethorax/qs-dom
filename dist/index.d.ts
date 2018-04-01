declare module 'qs-dom' {
    export = QSDomFactory;

    interface QSDom {
        /**
         * Get the total **number of elements** currently stored in the object.
         * 
         * @type {number}
         */
        length: number,

        /**
         * Get the **width** of the current element.
         * If the current element is `document` or `body`, the **viewport width** is returned instead.
         * 
         * @type {number}
         */
        width: number,

        /**
         * Returns the **full width** of the current element.
         * This includes padding, border and margin.
         * 
         * @type {number}
         */
        fullWidth: number,

        /**
         * Get the **height** of the current element.
         * If the current element is `document` or `body`, the **viewport height** is returned instead.
         * 
         * @type {number}
         */
        height: number,

        /**
         * Returns the **full height** of the current element.
         * This includes padding, border and margin.
         * 
         * @type {number}
         */
        fullHeight: number,

        /**
         * Returns the **absolute position** of the current element from the top left corner of the document.
         * Returns both the `left` and `top` offset.
         * 
         * @type {object}
         */
        absolutePosition: object,

        /**
         * Get the HTMLElement at the specified index.
         * If no index is given, returns the first element.
         * 
         * @param {number} index Index of the element to retrieve
         * @returns {HTMLElement} 
         */
        get(index = 0): HTMLElement;

        /**
         * Checks if the current element has the given css class.
         * 
         * @param {string} className CSS class name
         * @returns {boolean} 
         */
        hasClass(className: string): boolean;

        /**
         * Adds the given css class to the current element.
         * 
         * @param {string} className CSS class name
         */
        addClass(className: string): void;

        /**
         * Removes the given css class from the current elemnt.
         * 
         * @param {string} className CSS class name
         */
        removeClass(className: string): void;

        /**
         * Removes the current element from the DOM.
         */
        remove(): void;

        /**
         * Adds the callback function as an **event listener** for the given event names to all elements.
         * Different event names have to be separated by a space.
         * 
         * @param {string} eventNames Event names, separated by space
         * @param {onCallback} callback Callback function
         */
        on(eventNames: string, callback: onCallback): void;

        /**
         * Adds the callback function as an event listener for the given event names to all elements.
         * The callback function is only called if the given target element  is in the event path,
         * or a element in the event path matches the target selector.
         * 
         * This method is useful if you want to handle events of dynamically added elements (e.g. AJAX content).
         * 
         * @param {string} eventNames Event names, separated by space
         * @param {(string | HTMLElement)} targetElementOrSelector Element or selector to match against
         * @param {onChildEventMatchCallback} callback Callback function
         */
        onChildEventMatch(eventNames: string, targetElementOrSelector: string | HTMLElement, callback: onChildEventMatchCallback): void;

        /**
         * Dispatches a **custom event** with the given name on the current element.
         * 
         * @param {string} eventName Name of the event
         */
        dispatchEvent(eventName: string): void;

        /**
         * Calls the **callback function** for each element in the object.
         * Same functionality as `Array.prototype.forEach`.
         * 
         * @param {forEachCallback} callback Callback function
         */
        forEach(callback: forEachCallback): void;

        /**
         * Calls the **callback function** for each element in the object.
         * Returns an array of all callback results.
         * Same functionality as `Array.prototype.map`.
         * 
         * @param {mapCallback} callback Callback function
         * @returns {Array} 
         */
        map(callback: mapCallback): Array;
    }

    declare type onCallback = (event: Event) => void;
    declare type onChildEventMatchCallback = (event: Event, matchingElement: HTMLElement) => void;
    declare type forEachCallback = (element: HTMLElement, index: number, totalElements: number) => void;
    declare type mapCallback = (element: HTMLElement, index: number, totalElements: number) => any;

    /**
     * Create a new QSDom object.
     * 
     * @param {(string | HTMLElement | HTMLDocument | Window)} elementsOrSelector 
     * @returns {QSDom} 
     */
    declare function QSDomFactory(elementsOrSelector: string | HTMLElement | HTMLDocument | Window): QSDom;
}