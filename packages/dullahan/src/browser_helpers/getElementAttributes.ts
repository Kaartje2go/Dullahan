export type GetElementAttributesOptions = {
    element: Element;
    attributeNames: string[]
};

export function getElementAttributes(this: void, optionsOrElement: GetElementAttributesOptions | Element, _attributeNames?: string[]): (string | null)[] {
    var element = _attributeNames ? optionsOrElement as Element : (optionsOrElement as GetElementAttributesOptions).element;
    var attributeNames = _attributeNames ? _attributeNames : (optionsOrElement as GetElementAttributesOptions).attributeNames;

    function parse(attributeName: string): string | null {
        return element.getAttribute(attributeName);
    }

    return attributeNames.map(parse);
}
