/* eslint-disable */

export type SetElementPropertyOptions = {
    element: Element;
    propertyName: string;
    propertyValue: any;
};

export function setElementProperty(this: void, optionsOrElement: SetElementPropertyOptions | Element, _propertyName?: string, _propertyValue?: any): void {
    var element = _propertyName ? optionsOrElement as Element : (optionsOrElement as SetElementPropertyOptions).element;
    var propertyName = _propertyName ? _propertyName : (optionsOrElement as SetElementPropertyOptions).propertyName;
    var propertyValue = _propertyValue ? _propertyValue : (optionsOrElement as SetElementPropertyOptions).propertyValue;

    element[propertyName] = propertyValue;

    if (propertyName === 'value') {
        var inputEvent = document.createEvent('Event');
        inputEvent.initEvent('input', true);
        element.dispatchEvent(inputEvent);

        var changeEvent = document.createEvent('Event');
        changeEvent.initEvent('change', true);
        element.dispatchEvent(changeEvent);
    }
}
