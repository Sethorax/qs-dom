export const convertNodeListToArray = nodeList => {
    const nodes = [];

    for (let i = 0; i < nodeList.length; i++) {
        nodes.push(nodeList[i]);
    }

    return nodes;
};

export const isNode = element => element instanceof HTMLElement;

export const normalizeElementsOrSelector = elementsOrSelector => {
    if (typeof elementsOrSelector === 'string') {
        return convertNodeListToArray(document.querySelectorAll(elementsOrSelector));
    }

    if (elementsOrSelector instanceof HTMLCollection || elementsOrSelector instanceof NodeList) {
        return convertNodeListToArray(elementsOrSelector);
    }

    if (elementsOrSelector instanceof HTMLElement || elementsOrSelector === document || elementsOrSelector === window) {
        return [elementsOrSelector];
    }

    return [];
};

export const getEventPath = event => {
    const polyfill = () => {
        let element = event.target;
        const pathArr = [element];

        if (element === null || element.parentElement === null) {
            return [];
        }

        while (element.parentElement !== null) {
            element = element.parentElement;
            pathArr.unshift(element);
        }

        return pathArr;
    };

    return event.path || (event.composedPath && event.composedPath()) || polyfill();
};

export const elementMatchesSelector = (element, selector) => {
    if (element.matches) {
        return element.matches(selector);
    } else if (element.matchesSelector) {
        return element.matchesSelector(selector);
    }

    return false;
};