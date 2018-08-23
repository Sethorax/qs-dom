export type SupportedElement = HTMLElement | Document | Window;
export type ElementsOrSelector =
    | SupportedElement[]
    | SupportedElement
    | NodeList
    | string;
type Queryable = HTMLElement | Document;

interface EventWithPath extends Event {
    path?: EventTarget[];
    composedPath?: () => EventTarget[];
}

interface Input {
    elements: SupportedElement[];
    isDocOrWin: boolean;
}

export class Quicksilver {
    private element?: SupportedElement;
    private elements?: SupportedElement[];

    public constructor(elementsOrSelector: ElementsOrSelector) {
        const input = this.normalizeInput(elementsOrSelector);

        if (input === null) {
            throw new Error("Invalid element or selector!");
        }

        if (input.isDocOrWin) {
            this.element = input.elements[0];
            this.elements = input.elements;
        } else {
            this.elements = input.elements as HTMLElement[];
            this.element = input.elements[0];
        }
    }

    /**
     * Shortcut for `$$().get(0)`
     */
    public get $() {
        return this.get(0);
    }

    /**
     * Returns the amount of elements passed to the selector method or matched by the CSS selector.
     */
    public get length() {
        return this.elements.length;
    }

    /**
     * Returns `true` if at least one element was passed to the selector method or matched by the CSS selector.
     */
    public get notEmpty() {
        return this.length > 0;
    }

    /**
     * Returns the width of the first element in the instance. If `document` or `window` were passed to the selector method the viewport width is returned insted.
     */
    public get width() {
        if (this.isElement(this.element)) {
            return this.element.clientWidth;
        }

        return (
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth
        );
    }

    /**
     * Returns the full width (this includes margin and padding) of the first element in the instance. If `document` or `window` were passed to the selector method the viewport width is returned insted.
     */
    public get fullWidth() {
        if (this.isElement(this.element)) {
            const styles = window.getComputedStyle(this.element);
            const margin =
                parseFloat(styles["marginLeft"]) +
                parseFloat(styles["marginRight"]);

            return Math.ceil(
                this.element.getBoundingClientRect().width + margin
            );
        }

        return this.width;
    }

    /**
     * Returns the height of the first element in the instance. If `document` or `window` were passed to the selector method the viewport height is returned insted.
     */
    public get height() {
        if (this.isElement(this.element)) {
            return this.element.clientHeight;
        }

        return (
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight
        );
    }

    /**
     * Returns the full height (this includes margin and padding) of the first element in the instance. If `document` or `window` were passed to the selector method the viewport height is returned insted.
     */
    public get fullHeight() {
        if (this.isElement(this.element)) {
            const styles = window.getComputedStyle(this.element);
            const margin =
                parseFloat(styles["marginTop"]) +
                parseFloat(styles["marginBottom"]);

            return Math.ceil(
                this.element.getBoundingClientRect().height + margin
            );
        }

        return this.height;
    }

    /**
     * Return the absolute offset of the first element in the instance. The returned object contains the offset values from the top and from the left.
     */
    public get absolutePosition() {
        if (this.isElement(this.element)) {
            let top = 0;
            let left = 0;
            let currentElement = this.element;

            do {
                top += currentElement.offsetTop || 0;
                left += currentElement.offsetLeft || 0;
                currentElement = currentElement.offsetParent as HTMLElement;
            } while (currentElement);

            return { top, left };
        }

        return { top: 0, left: 0 };
    }

    /**
     * Returns the element at the specified index.
     */
    public get(index = 0) {
        const e = this.elements[index];
        return this.isElement(e) && e;
    }

    /**
     * Returns all elements in the instance.
     */
    public getAll() {
        return this.elements;
    }

    /**
     * Returns the index the first element in the instance has within its parent element.
     */
    public getIndexInParent() {
        if (this.isElement(this.element)) {
            let pos = -1;
            const childs = this.element.parentElement.children;

            for (let i = 0; i < childs.length; i++) {
                if (childs[i] === this.element) pos = i;
            }

            return pos;
        }

        return -1;
    }

    /**
     * Queries all child elements of the first element in the instance for the given CSS selector. If a match was found the first matched element will be returned.
     */
    public find(selector: string) {
        return this.isQueryable(this.element)
            ? this.element.querySelector(selector)
            : null;
    }

    /**
     * Queries all child elements of the first element in the instance for the given CSS selector. If a match was found a new Quicksilver instance with the matched elements will be returned.
     */
    public findAll(selector: string) {
        return this.isQueryable(this.element)
            ? new Quicksilver(this.element.querySelectorAll(selector))
            : null;
    }

    /**
     * Iterates over all elements in the instance and runs the given callback function for each element.
     */
    public forEach(
        callback: (element: HTMLElement, index: number, total: number) => void
    ) {
        this.elements.forEach((element, index) => {
            this.isElement(element) && callback(element, index, this.length);
        });
    }

    /**
     * Runs the given callback function for each element in the instance and returns an array of the callback return values.
     */
    public map<T>(
        callback: (element: HTMLElement, index: number, total: number) => T
    ) {
        return this.elements.map((element, index) => {
            return (
                this.isElement(element) && callback(element, index, this.length)
            );
        });
    }

    /**
     * Runs the given callback function for each element in the instance and returns an array of all elements where the callback function had a truthy return value.
     */
    public filter(
        callback: (
            element: HTMLElement,
            index: number,
            total: number
        ) => boolean
    ) {
        return this.elements.filter((element, index) => {
            return this.isElement(element)
                ? callback(element, index, this.length)
                : false;
        });
    }

    /**
     * Adds the passed class names to the first element in the instance.
     */
    public addClass(...classNames: string[]) {
        this.isElement(this.element) &&
            this.element.classList.add(...classNames);
    }

    /**
     * Removes the passed class names from the first element in the instance.
     */
    public removeClass(...classNames: string[]) {
        this.isElement(this.element) &&
            this.element.classList.remove(...classNames);
    }

    /**
     * Returns `true` if the first element in the instance has the passed CSS class.
     */
    public hasClass(className: string) {
        return this.isElement(this.element)
            ? this.element.className.indexOf(className) > -1
            : false;
    }

    /**
     * Removes the first element in the instace from the DOM.
     */
    public remove() {
        this.isElement(this.element) &&
            this.element.parentNode.removeChild(this.element);
    }

    /**
     * Inserts the first element in the instance after the passed element.
     */
    public insertAfter(element: HTMLElement) {
        if (this.isElement(this.element)) {
            const pos = this.getIndexInParent();
            this.element.parentElement.insertBefore(
                element,
                this.element.parentElement.children[pos + 1]
            );
        }
    }

    /**
     * Inserts the first element in the instance before the passed element.
     */
    public insertBefore(element: HTMLElement) {
        if (this.isElement(this.element)) {
            this.element.parentElement.insertBefore(element, this.element);
        }
    }

    /**
     * Append the first element in the instance to the passed element.
     */
    public append(element: HTMLElement) {
        this.isElement(this.element) && this.element.appendChild(element);
    }

    /**
     * Prepend the first element in the instance to the passed element.
     */
    public prepend(element: HTMLElement) {
        this.isElement(this.element) &&
            this.element.insertBefore(element, this.element.firstChild);
    }

    /**
     * Attaches event listeners for the passed events to all elements in the instance. The callback function is called if one of the events gets triggered.
     */
    public on(eventNames: string, callback: EventListener) {
        eventNames.split(" ").forEach(eventName => {
            const check = (element: SupportedElement) => {
                element.addEventListener(eventName, callback);
            };

            this.isElement(this.element)
                ? this.forEach(check)
                : check(this.element);
        });
    }

    /**
     * Works similar to `$$().on` but with the difference that the event path is checked if the passed child element or selector was matched by the event. If a match is found the callback is called.
     */
    public onChildEventMatch(
        eventNames: string,
        elementOrSelector: string | HTMLElement,
        callback: (event: Event, matchedElement: HTMLElement) => void
    ) {
        const match = (element: SupportedElement) => {
            if (
                typeof elementOrSelector === "string" &&
                element instanceof HTMLElement
            ) {
                return this.elementMatchesSelector(element, elementOrSelector);
            }

            return element === elementOrSelector;
        };

        this.on(eventNames, event => {
            let matchFound = false;
            this.getEventPath(event).forEach(pathElement => {
                if (
                    !matchFound &&
                    pathElement instanceof HTMLElement &&
                    match(pathElement)
                ) {
                    matchFound = true;
                    callback(event, pathElement);
                }
            });
        });
    }

    public dispatchEvent<T>(eventName: string, data?: T) {
        let event;

        if (typeof CustomEvent === "function") {
            event = new CustomEvent(eventName, { detail: data });
        } else {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent(eventName, false, false, data);
        }

        this.element.dispatchEvent(event);
    }

    private getEventPath(event: Event) {
        const polyfill = () => {
            let element = event.target as Node;
            const pathArr = new Array(element);

            if (element === null || element.parentElement === null) {
                return [];
            }

            while (element.parentElement !== null) {
                element = element.parentElement;
                pathArr.unshift(element);
            }

            return pathArr;
        };

        return this.isEventWithPath(event)
            ? event.path || event.composedPath()
            : polyfill();
    }

    private normalizeInput(elementsOrSelector: any): Input {
        if (typeof elementsOrSelector === "string") {
            return {
                elements: this.getElementsFromSelector(elementsOrSelector),
                isDocOrWin: false,
            };
        }

        if (elementsOrSelector instanceof NodeList) {
            return {
                elements: this.convertNodeListToArray(elementsOrSelector),
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
    }

    private convertNodeListToArray(nodeList: NodeList | HTMLCollection) {
        const nodes = new Array<HTMLElement>();

        for (let i = 0; i < nodeList.length; i++) {
            const n = nodeList[i];

            if (n instanceof HTMLElement) {
                nodes.push(n);
            }
        }

        return nodes;
    }

    private getElementsFromSelector(selector: string) {
        return this.convertNodeListToArray(document.querySelectorAll(selector));
    }

    private elementMatchesSelector = (
        element: HTMLElement,
        selector: string
    ) => {
        return (
            (element.matches && element.matches(selector)) ||
            (element.webkitMatchesSelector &&
                element.webkitMatchesSelector(selector)) ||
            (element.msMatchesSelector &&
                element.msMatchesSelector(selector)) ||
            false
        );
    };

    private isEventWithPath(event: Event): event is EventWithPath {
        return (
            (<EventWithPath>event).path !== undefined ||
            (<EventWithPath>event).composedPath !== undefined
        );
    }

    private isQueryable(element: SupportedElement): element is Queryable {
        return (<Queryable>element).querySelector !== undefined;
    }

    private isElement(element: SupportedElement): element is HTMLElement {
        return element instanceof HTMLElement;
    }
}

export const factory = (elementsOrSelector: ElementsOrSelector) =>
    new Quicksilver(elementsOrSelector);

export default factory;
