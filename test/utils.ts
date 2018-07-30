export const triggerEvent = (eventName: string, target: Element|Document) => {
    const evt = document.createEvent("HTMLEvents");
    evt.initEvent(eventName, true, true);
    target.dispatchEvent(evt);
};