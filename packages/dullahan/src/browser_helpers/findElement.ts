/* eslint-disable */

declare global {
    interface Element {
        computedStyleMap: undefined | (() => Map<string, {
            value: string | number;
            unit: string | undefined;
        }>);
    }

    interface Window {
        __DULLAHAN_FIND_ELEMENT__?: typeof findElement;
    }
}

export type FindElementOptions = {
    selector: string;
    visibleOnly: boolean;
    onScreenOnly: boolean;
    interactiveOnly: boolean;
    expectNoMatches: boolean;
    timeout: number;
    promise: boolean;
};

/**
 * Finds an element in the DOM based on the given criteria.
 *
 * If multiple elements match, only the first matched element is used
 * as not all libraries support the returning of multiple elements.
 *
 * @param options
 * @param options.selector A CSS selector, xPath or JSPath selector.
 * @param options.visibleOnly Enable to only match elements that are visible.
 * @param options.onScreenOnly Enable to only match elements that are on screen.
 * @param options.expectNoMatches Converts the return value to the inverse boolean value of the return value.
 * @param options.timeout The maximum amount of time to spend polling in case of modern browsers, in milliseconds.
 * @param options.promise Set `false` to disable Promise support.
 *
 * @return A Promise if the browser supports it (either natively or through an already-applied polyfill),
 * otherwise an immediate result.
 */
export function findElement(this: void, options: FindElementOptions): Element | boolean | void | Promise<Element | boolean | void> {
    var selector = options.selector;
    var visibleOnly = options.visibleOnly;
    var onScreenOnly = options.onScreenOnly;
    var interactiveOnly = options.interactiveOnly;
    var expectNoMatches = options.expectNoMatches;
    var timeout = options.timeout;
    var promise = options.promise !== false && typeof Promise !== 'undefined' && timeout > 0;
    var interval = Math.floor(timeout / 100);
    var endTime = Date.now() + timeout;

    window.__DULLAHAN_FIND_ELEMENT__ = findElement.bind(this, options);

    function isXPath(): boolean {
        return selector[0] === '/';
    }

    function isJSPath(): boolean {
        return /querySelector/.test(selector);
    }

    function getByXPath(): Node[] {
        var nodeMatches: Node[] = [];
        var xPathMatches = document.evaluate(selector, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < xPathMatches.snapshotLength; i++) {
            var snapshot = xPathMatches.snapshotItem(i);

            if (snapshot) {
                nodeMatches.push(snapshot);
            }
        }

        return nodeMatches;
    }

    function getByJSPath(): Node[] {
        try {
            var jsPathMatches = eval(selector);

            if (jsPathMatches instanceof Element) {
                return [jsPathMatches];
            } else if (jsPathMatches instanceof NodeList) {
                return Array.prototype.slice.call(jsPathMatches);
            }
        } catch (error) {
            if (/'querySelectorAll'.*?'Document(?:Fragment)?'/.test(error.message)) {
                throw error;
            }
        }

        return [];
    }

    function getByCSSPath(): Node[] {
        var nodeMatches: NodeListOf<Element> = document.querySelectorAll(selector);

        return Array.prototype.slice.call(nodeMatches);
    }

    function filterNodeToElement(node: Node): node is Element {
        return (node instanceof Element);
    }

    function formatReturnValue(value: Element[]): Element | boolean | void {
        if (value[0] && (value[0] as HTMLElement).style) {
            (value[0] as HTMLElement).style.outline = '1px solid blue'
        }

        return expectNoMatches ? !value[0] : value[0];
    }

    function isOnScreen(top: number, left: number, width: number, height: number): boolean {
        return left + width >= 0 && top + height >= 0 && left < window.innerWidth && top < window.innerHeight;
    }

    function hasDimensions(width: number, height: number) {
        return width > 0 && height > 0;
    }

    function hasValidStyles(element: Element): boolean {
        var csmResult = element.computedStyleMap ? element.computedStyleMap() : undefined;
        var csResult = csmResult ? undefined : window.getComputedStyle(element);

        function parse(propertyName: string, defaultValue: string): string {
            try {
                return csmResult!.get(propertyName)!.value.toString();
            } catch (error) {
            }

            try {
                return csResult![propertyName].toString();
            } catch (error) {
            }

            return defaultValue;
        }

        var opacity: number = parseFloat(parse('opacity', '1.0'));
        var display: string = parse('display', 'block');
        var visibility: string = parse('visibility', 'visible');

        return opacity > 0 && visibility === 'visible' && display !== 'none';
    }

    function findParentNode<T>(element: Element, predicate: (element: Node & ParentNode) => boolean): T | null {
        var parent: Node & ParentNode | null = element;

        while (parent && parent.parentNode) {
            if (predicate(parent.parentNode)) {
                return parent.parentNode as unknown as T;
            }

            parent = parent.parentNode;
        }

        return null;
    }

    function getDocumentRoot(element: Element): DocumentOrShadowRoot | null {
        return findParentNode<DocumentOrShadowRoot>(element, function (parentNode: Node & ParentNode): boolean {
            return 'elementFromPoint' in parentNode;
        });
    }

    function isChildOf(suspectedChild: Element, suspectedParent: Element): boolean {
        return !!findParentNode(suspectedChild, function (parentNode: Node & ParentNode): boolean {
            return parentNode === suspectedParent;
        });
    }

    function isInteractable(element, top, left, width, height): boolean {
        var documentRoot = getDocumentRoot(element);
        var topElement = documentRoot && documentRoot.elementFromPoint(left + width / 2, top + height / 2);

        return !!topElement && (topElement === element || isChildOf(topElement, element));
    }

    function performSearch(): Element | boolean | void {
        var nodeMatches: Node[] = isXPath() ? getByXPath() : isJSPath() ? getByJSPath() : getByCSSPath();
        var elementMatches: Element[] = nodeMatches.filter(filterNodeToElement);

        if (!visibleOnly && !onScreenOnly) {
            return formatReturnValue(elementMatches);
        }

        var filteredMatches = elementMatches.filter(function (element) {
            var boundingClientRect = element.getBoundingClientRect();
            var top = boundingClientRect.top;
            var left = boundingClientRect.left;
            var width = boundingClientRect.width;
            var height = boundingClientRect.height;

            if (onScreenOnly && !isOnScreen(top, left, width, height)) {
                console.log('findElement', 'onScreenOnly', selector, element);
                return false;
            }

            if (visibleOnly && (!hasDimensions(width, height) || !hasValidStyles(element))) {
                console.log('findElement', 'visibleOnly', selector, element);
                return false;
            }

            if (interactiveOnly && !isInteractable(element, top, left, width, height)) {
                console.log('findElement', 'interactiveOnly', selector, element);
                return false;
            }

            return true;
        });

        return formatReturnValue(filteredMatches);
    }

    if (interval && promise) {
        return new Promise(function poll(resolve, reject) {
            try {
                var result = performSearch();

                if (result) {
                    console.log('findElement', 'return', result);
                    resolve(result);
                } else if (Date.now() < endTime) {
                    setTimeout(poll, interval, resolve, reject);
                } else {
                    console.log('findElement', 'return', result);
                    resolve();
                }
            } catch (error) {
                reject(error);
            }
        });
    } else {
        var result = performSearch();
        console.log('findElement', 'return', result);

        return result;
    }
}
