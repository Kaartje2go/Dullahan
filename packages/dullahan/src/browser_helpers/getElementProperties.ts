/* eslint-disable */

export type GetElementPropertiesOptions = {
    element: Element;
    propertyNames: string[]
};

export function getElementProperties<T>(this: void, optionsOrElement: GetElementPropertiesOptions | Element, _propertyNames?: string[]): (T | null)[] {
    var element = _propertyNames ? optionsOrElement as Element : (optionsOrElement as GetElementPropertiesOptions).element;
    var propertyNames = _propertyNames ? _propertyNames : (optionsOrElement as GetElementPropertiesOptions).propertyNames;

    function parse(attributeName: string): T | null {
        var value = element[attributeName];

        if (value === undefined) {
            return null;
        }

        return value as T;
    }

    return propertyNames.map(parse);
}
