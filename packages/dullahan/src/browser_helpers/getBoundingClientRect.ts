/* eslint-disable */

export function getBoundingClientRect(this: void, element: Element): {
    top: number;
    left: number;
    bottom: number;
    right: number;
    x: number;
    y: number;
    width: number;
    height: number;
} {
    var bounds = element.getBoundingClientRect();

    return {
        top: bounds.top,
        left: bounds.left,
        bottom: bounds.bottom,
        right: bounds.right,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
        x: typeof bounds.x === 'number' ? bounds.x : bounds.left + window.pageXOffset,
        y: typeof bounds.y === 'number' ? bounds.y : bounds.top + window.pageYOffset
    };
}
