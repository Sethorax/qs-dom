export declare type SupportedElement = HTMLElement | Document | Window;
export declare type ElementsOrSelector = SupportedElement[] | SupportedElement | NodeList | string;
export declare class Quicksilver {
    private element?;
    private elements?;
    constructor(elementsOrSelector: ElementsOrSelector);
    /**
     * Shortcut for `$$().get(0)`
     */
    readonly $: HTMLElement;
    /**
     * Returns the amount of elements passed to the selector method or matched by the CSS selector.
     */
    readonly length: number;
    /**
     * Returns `true` if at least one element was passed to the selector method or matched by the CSS selector.
     */
    readonly notEmpty: boolean;
    /**
     * Returns the width of the first element in the instance. If `document` or `window` were passed to the selector method the viewport width is returned insted.
     */
    readonly width: number;
    /**
     * Returns the full width (this includes margin and padding) of the first element in the instance. If `document` or `window` were passed to the selector method the viewport width is returned insted.
     */
    readonly fullWidth: number;
    /**
     * Returns the height of the first element in the instance. If `document` or `window` were passed to the selector method the viewport height is returned insted.
     */
    readonly height: number;
    /**
     * Returns the full height (this includes margin and padding) of the first element in the instance. If `document` or `window` were passed to the selector method the viewport height is returned insted.
     */
    readonly fullHeight: number;
    /**
     * Return the absolute offset of the first element in the instance. The returned object contains the offset values from the top and from the left.
     */
    readonly absolutePosition: {
        top: number;
        left: number;
    };
    /**
     * Returns the element at the specified index.
     */
    get(index?: number): HTMLElement;
    /**
     * Returns all elements in the instance.
     */
    getAll(): SupportedElement[];
    /**
     * Returns the index the first element in the instance has within its parent element.
     */
    getIndexInParent(): number;
    /**
     * Queries all child elements of the first element in the instance for the given CSS selector. If a match was found the first matched element will be returned.
     */
    find(selector: string): Element;
    /**
     * Queries all child elements of the first element in the instance for the given CSS selector. If a match was found a new Quicksilver instance with the matched elements will be returned.
     */
    findAll(selector: string): Quicksilver;
    /**
     * Iterates over all elements in the instance and runs the given callback function for each element.
     */
    forEach(callback: (element: HTMLElement, index: number, total: number) => void): void;
    /**
     * Runs the given callback function for each element in the instance and returns an array of the callback return values.
     */
    map<T>(callback: (element: HTMLElement, index: number, total: number) => T): T[];
    /**
     * Runs the given callback function for each element in the instance and returns an array of all elements where the callback function had a truthy return value.
     */
    filter(callback: (element: HTMLElement, index: number, total: number) => boolean): SupportedElement[];
    /**
     * Adds the passed class names to the first element in the instance.
     */
    addClass(...classNames: string[]): void;
    /**
     * Removes the passed class names from the first element in the instance.
     */
    removeClass(...classNames: string[]): void;
    /**
     * Returns `true` if the first element in the instance has the passed CSS class.
     */
    hasClass(className: string): boolean;
    /**
     * Removes the first element in the instace from the DOM.
     */
    remove(): void;
    /**
     * Inserts the first element in the instance after the passed element.
     */
    insertAfter(element: HTMLElement): void;
    /**
     * Inserts the first element in the instance before the passed element.
     */
    insertBefore(element: HTMLElement): void;
    /**
     * Append the first element in the instance to the passed element.
     */
    append(element: HTMLElement): void;
    /**
     * Prepend the first element in the instance to the passed element.
     */
    prepend(element: HTMLElement): void;
    /**
     * Attaches event listeners for the passed events to all elements in the instance. The callback function is called if one of the events gets triggered.
     */
    on(eventNames: string, callback: EventListener): void;
    /**
     * Works similar to `$$().on` but with the difference that the event path is checked if the passed child element or selector was matched by the event. If a match is found the callback is called.
     */
    onChildEventMatch(eventNames: string, elementOrSelector: string | HTMLElement, callback: (event: Event, matchedElement: HTMLElement) => void): void;
    dispatchEvent<T>(eventName: string, data?: T): void;
    private normalizeInput;
    private getElementsFromSelector;
    private isQueryable;
    private isElement;
}
export declare const factory: (elementsOrSelector: ElementsOrSelector) => Quicksilver;
export default factory;
