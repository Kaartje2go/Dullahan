declare global {
    interface Element {
        computedStyleMap: undefined | (() => Map<string, {
            value: string | number;
            unit: string | undefined;
        }>);
    }
}

export type GetElementStylesOptions = {
    element: Element;
    styleNames: string[];
};

export function getElementStyles(this: void, optionsOrElement: GetElementStylesOptions | Element, _styleNames?: string[]): {
    value: string | null;
    unit: string | null;
}[] {
    var element = _styleNames ? optionsOrElement as Element : (optionsOrElement as GetElementStylesOptions).element;
    var styleNames = _styleNames ? _styleNames : (optionsOrElement as GetElementStylesOptions).styleNames;
    var csmResult = element.computedStyleMap ? element.computedStyleMap() : undefined;
    var csResult = window.getComputedStyle(element);

    function parse(propertyName: string): {
        value: string | null;
        unit: string | null;
    } {
        try {
            var csmEntry = csmResult!.get(propertyName)!;

            return {
                value: csmEntry.value.toString() || null,
                unit: csmEntry.unit ?? null
            };
        } catch (error) {}

        try {
            var csEntry = csResult![propertyName].toString();
            var number = parseFloat(csEntry);
            var value = isNaN(number) ? csEntry : number.toString();
            var unit = csEntry.replace(value, '') || null;

            return {
                value: value,
                unit: unit
            };
        } catch (error) {}

        return {
            value: null,
            unit: null
        };
    }

    return styleNames.map(parse);
}
