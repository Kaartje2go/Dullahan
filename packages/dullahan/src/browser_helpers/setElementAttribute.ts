export type SetElementAttributeOptions = {
    element: Element;
    attributeName: string;
    attributeValue: any;
};

export function setElementAttribute(this: void, optionsOrElement: SetElementAttributeOptions | Element, _attributeName?: string, _attributeValue?: any): void {
    var element = _attributeName ? optionsOrElement as Element : (optionsOrElement as SetElementAttributeOptions).element;
    var attributeName = _attributeName ? _attributeName : (optionsOrElement as SetElementAttributeOptions).attributeName;
    var attributeValue = _attributeValue ? _attributeValue : (optionsOrElement as SetElementAttributeOptions).attributeValue;

    element.setAttribute(attributeName, attributeValue);
}
