/* eslint-disable */

type MouseEvents = 'mousedown' | 'mouseup' | 'click' | 'mousemove';

export type EmitFakeEventOptions = {
    type: MouseEvents;
    clientX: number;
    clientY: number;
    element?: Element;
};

export function emitFakeEvent(this: void, optionsOrType: EmitFakeEventOptions | MouseEvents, _clientX?: number, _clientY?: number, _element?: Element): void {
    var type: MouseEvents = typeof optionsOrType === 'string' ? optionsOrType : optionsOrType.type;
    var clientX: number = typeof optionsOrType === 'string' ? _clientX as number : optionsOrType.clientX;
    var clientY: number = typeof optionsOrType === 'string' ? _clientY as number : optionsOrType.clientY;
    var element: Element = (typeof optionsOrType === 'string' ? _element : optionsOrType.element)
        || document.elementFromPoint(clientX, clientY) || document.body;

    var canBubble = true;
    var cancelable = true;
    var view = window;
    var detail = 0;
    var screenX = 0;
    var screenY = 0;
    var ctrlKey = false;
    var altKey = false;
    var shiftKey = false;
    var metaKey = false;
    var button = 0;
    var relatedTarget = null;

    var down = document.createEvent('MouseEvent');
    down.initMouseEvent(type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
    element.dispatchEvent(down);
}
