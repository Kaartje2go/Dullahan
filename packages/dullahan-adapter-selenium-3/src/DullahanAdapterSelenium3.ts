import {Builder, WebDriver, WebElement} from 'selenium-webdriver';

import {
    buildChrome,
    buildEdgeChromium,
    buildEdgeClassic,
    buildFirefox,
    buildInternetExplorer,
    buildUnknown
} from './browsers';
import {
    DullahanAdapterSelenium3DefaultOptions,
    DullahanAdapterSelenium3UserOptions
} from './DullahanAdapterSelenium3Options';

import {
    AdapterError,
    displayPointer,
    DullahanAdapter,
    DullahanClient,
    DullahanCookie,
    DullahanErrorMessage,
    DullahanReadyState,
    emitFakeEvent,
    findElement,
    FindElementOptions,
    getBoundingClientRect,
    getElementAttributes,
    getElementProperties,
    getElementStyles,
    scrollToElement,
    setElementAttribute,
    setElementProperty,
    sleep,
    tryIgnore,
    tryX,
    waitForReadyState
} from '@k2g/dullahan';

export default class DullahanAdapterSelenium3 extends DullahanAdapter<DullahanAdapterSelenium3UserOptions,
    typeof DullahanAdapterSelenium3DefaultOptions> {

    protected driver?: WebDriver;

    protected readonly supportsPromises: boolean;

    protected readonly supportsActions: boolean;

    protected readonly supportsShadowDom: boolean;

    public constructor(args: {
        testId: string;
        client: DullahanClient;
        userOptions: DullahanAdapterSelenium3UserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanAdapterSelenium3DefaultOptions
        });

        const {browserName, browserVersion, appium} = this.options;

        // Safari and Edge 18 do not support returning Promise<WebElement>
        this.supportsPromises = !/safari/i.test(browserName) && !(/egde/i.test(browserName) && parseInt(browserVersion ?? '19') <= 18);

        // Firefox and Internet Explorer do not (fully) support actions
        this.supportsActions = !appium && !/firefox|ie/i.test(browserName);

        // Firefox, Internet Explorer and Safari do not (fully) support shadow dom
        this.supportsShadowDom = !/firefox|ie|safari/i.test(browserName);
    }

    public async getCookie(name: string): Promise<DullahanCookie | null> {
        const {driver} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        return driver.manage().getCookie(name);
    }

    public async getElementBoundaries(selector: string): Promise<{ top: number; left: number; bottom: number; right: number; x: number; y: number; width: number; height: number }> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        return driver.executeScript(getBoundingClientRect, element);
    }

    public async pressMouseAtElement(selector: string, offsetX: number, offsetY: number): Promise<void> {
        const {driver, supportsActions, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        if (!supportsActions) {
            const {top, left} = await driver.executeScript<{
                top: number;
                left: number;
            }>(getBoundingClientRect, element);

            const x = left + offsetX;
            const y = top + offsetY;

            await driver.executeScript<void>(emitFakeEvent, 'mousemove', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mousedown', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mouseup', x, y, element);
            return driver.executeScript<void>(emitFakeEvent, 'click', x, y, element);
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(offsetX),
            y: Math.round(offsetY)
        }).mouseDown().perform();
    }

    public async pressMouseAtElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void> {
        const {driver, supportsPromises, supportsActions} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {top, left, width, height} = await driver.executeScript<{
            top: number;
            left: number;
            width: number;
            height: number;
        }>(getBoundingClientRect, element);

        if (!supportsActions) {
            const x = left + offsetCenterX + width / 2;
            const y = top + offsetCenterY + height / 2;

            await driver.executeScript<void>(emitFakeEvent, 'mousemove', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mousedown', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mouseup', x, y, element);
            return driver.executeScript<void>(emitFakeEvent, 'click', x, y, element);
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(offsetCenterX + width / 2),
            y: Math.round(offsetCenterY + height / 2)
        }).mouseDown().perform();
    }

    public async releaseMouseAtElement(selector: string, offsetX: number, offsetY: number): Promise<void> {
        const {driver, supportsActions, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        if (!supportsActions) {
            const {top, left} = await driver.executeScript<{
                top: number;
                left: number;
            }>(getBoundingClientRect, element);

            const x = left + offsetX;
            const y = top + offsetY;

            await driver.executeScript<void>(emitFakeEvent, 'mousemove', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mousedown', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mouseup', x, y, element);
            return driver.executeScript<void>(emitFakeEvent, 'click', x, y, element);
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(offsetX),
            y: Math.round(offsetY)
        }).mouseUp().perform();
    }

    public async releaseMouseAtElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void> {
        const {driver, supportsPromises, supportsActions} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {top, left, width, height} = await driver.executeScript<{
            top: number;
            left: number;
            width: number;
            height: number;
        }>(getBoundingClientRect, element);

        if (!supportsActions) {
            const x = left + offsetCenterX + width / 2;
            const y = top + offsetCenterY + height / 2;

            await driver.executeScript<void>(emitFakeEvent, 'mousemove', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mousedown', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mouseup', x, y, element);
            return driver.executeScript<void>(emitFakeEvent, 'click', x, y, element);
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(offsetCenterX + width / 2),
            y: Math.round(offsetCenterY + height / 2)
        }).mouseUp().perform();
    }

    public async reloadPage(options: { readyState: DullahanReadyState; timeout: number }): Promise<void> {
        const {driver} = this;
        const {timeout, readyState} = options;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const randomKey = `__dullahan_navigate_${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

        await driver.executeScript<void>(`
            window.${randomKey} = ${Date.now()};
            location.reload();
        `);

        await driver.wait(async () => {
            const randomKeyValue = await driver.executeScript<number | null>(`return window.${randomKey}`);

            return randomKeyValue === null;
        }, timeout);

        await driver.wait(async () => driver.executeScript<boolean>(waitForReadyState, {
            readyState,
            timeout
        }), timeout);
    }

    public async removeCookie(name: string): Promise<void> {
        const {driver} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await driver.manage().deleteCookie(name);
    }

    public async sendKeys(keys: string): Promise<void> {
        const {driver} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await driver.actions().sendKeys(keys).perform();
    }

    public async clearText(selector: string, count: number): Promise<void> {
        const keys = Array(count).fill('\uE003').join('');
        return this.sendKeysToElement(selector, keys);
    }

    public async sendKeysToElement(selector: string, keys: string): Promise<void> {
        const {driver, supportsPromises, supportsShadowDom} = this;

        if (!supportsShadowDom) {
            return this.setElementProperty(selector, 'value', keys);
        }

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await driver.executeScript(`
            var el = arguments[0];
            el.style.opacity = 1;
            el.style.display = 'block';
            el.style.visibility = 'visible';
        `.trim(), element);

        try {
            await element.sendKeys(keys);
        } catch (error) {
            if (error.message === 'One or more files could not be selected.') {
                console.warn(error);
            } else {
                throw error;
            }
        }
    }

    public async setCookie(cookie: DullahanCookie): Promise<void> {
        const {driver} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await driver.manage().addCookie(cookie);
    }

    public async setElementAttribute(selector: string, attributeName: string, attributeValue: string): Promise<void> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await driver.executeScript(setElementAttribute, element, attributeName, attributeValue);
    }

    public async setElementInputFile(selector: string, file: string): Promise<void> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await driver.executeScript(`
            var el = arguments[0];
            el.style.opacity = 1;
            el.style.display = 'block';
            el.style.visibility = 'visible';
        `.trim(), element);

        try {
            await element.sendKeys(file);
        } catch (error) {
            if (error.message === 'One or more files could not be selected.') {
                console.warn(error);
            } else {
                throw error;
            }
        }
    }

    public async setElementProperty(selector: string, propertyName: string, propertyValue: unknown): Promise<void> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await driver.executeScript(setElementProperty, element, propertyName, propertyValue);
    }

    public async waitForElementNotPresent(selector: string, options: { timeout: number }): Promise<void> {
        const {driver, supportsPromises} = this;
        const {timeout} = options;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout,
            promise: supportsPromises,
            expectNoMatches: true
        };

        try {
            const element = await driver.wait(async () => driver.executeScript<WebElement | null>(findElement, findOptions), timeout || 15000);

            if (element) {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            } else if (/unloaded|destroyed/ui.test(error.message)) {
                return this.waitForElementNotPresent(selector, options);
            }

            throw error;
        }
    }

    public async waitForElementNotVisible(selector: string, options: { timeout: number }): Promise<void> {
        const {driver, supportsPromises} = this;
        const {timeout} = options;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: false,
            timeout,
            promise: supportsPromises,
            expectNoMatches: true
        };

        try {
            await driver.wait(async () => driver.executeScript<WebElement | null>(findElement, findOptions), timeout || 1);
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            } else if (/unloaded|destroyed/ui.test(error.message)) {
                return this.waitForElementNotVisible(selector, options);
            }

            throw error;
        }
    }

    public async waitForNavigation(trigger: () => void | Promise<void>, options: { timeout: number; readyState: DullahanReadyState }): Promise<void> {
        const {driver} = this;
        const {timeout, readyState} = options;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const startUrl = await driver.getCurrentUrl();

        await trigger();

        await driver.wait(async () => {
            const currentUrl = await driver.getCurrentUrl();

            return currentUrl !== startUrl;
        }, timeout);

        await driver.wait(async () => driver.executeScript<boolean>(waitForReadyState, {
            readyState,
            timeout
        }), timeout);
    }

    public async click(selector: string): Promise<void> {
        const {driver, supportsPromises, supportsActions} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        if (!supportsActions) {
            const {top, left} = await driver.executeScript<{
                top: number;
                left: number;
            }>(getBoundingClientRect, element);

            const x = left;
            const y = top;

            await driver.executeScript<void>(emitFakeEvent, 'mousemove', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mousedown', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mouseup', x, y, element);
            return driver.executeScript<void>(emitFakeEvent, 'click', x, y, element);
        }

        await driver.actions().mouseMove(element).click().perform();
    }

    public async clickAt(x: number, y: number): Promise<void> {
        const {driver, supportsPromises, supportsActions} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        if (!supportsActions) {
            await driver.executeScript<void>(emitFakeEvent, 'mousemove', x, y);
            await driver.executeScript<void>(emitFakeEvent, 'mousedown', x, y);
            await driver.executeScript<void>(emitFakeEvent, 'mouseup', x, y);
            return driver.executeScript<void>(emitFakeEvent, 'click', x, y);
        }

        const findOptions: FindElementOptions = {
            selector: 'body',
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(x),
            y: Math.round(y)
        }).click().perform();
    }

    public async clickAtElement(selector: string, offsetX: number, offsetY: number): Promise<void> {
        const {driver, supportsPromises, supportsActions} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        if (!supportsActions) {
            const {top, left} = await driver.executeScript<{
                top: number;
                left: number;
            }>(getBoundingClientRect, element);

            const x = left + offsetX;
            const y = top + offsetY;

            await driver.executeScript<void>(emitFakeEvent, 'mousemove', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mousedown', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mouseup', x, y, element);
            return driver.executeScript<void>(emitFakeEvent, 'click', x, y, element);
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(offsetX),
            y: Math.round(offsetY)
        }).click().perform();
    }

    public async clickAtElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void> {
        const {driver, supportsPromises, supportsActions} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {top, left, width, height} = await driver.executeScript<{
            top: number;
            left: number;
            width: number;
            height: number;
        }>(getBoundingClientRect, element);

        if (!supportsActions) {
            const x = left + offsetCenterX + width / 2;
            const y = top + offsetCenterY + height / 2;

            await driver.executeScript<void>(emitFakeEvent, 'mousemove', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mousedown', x, y, element);
            await driver.executeScript<void>(emitFakeEvent, 'mouseup', x, y, element);
            return driver.executeScript<void>(emitFakeEvent, 'click', x, y, element);
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(offsetCenterX + width / 2),
            y: Math.round(offsetCenterY + height / 2)
        }).click().perform();
    }

    public async closeBrowser(): Promise<void> {
        const {driver} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await driver.quit();

        this.driver = undefined;
    }

    public async displayPointer(): Promise<void> {
        const {driver} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await driver.executeScript(displayPointer);
    }

    public async getElementAttributes(selector: string, ...attributeNames: string[]): Promise<(string | null)[]> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        return driver.executeScript(getElementAttributes, element, attributeNames);
    }

    public async getElementProperties<T>(selector: string, ...propertyNames: string[]): Promise<(T | null)[]> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        return driver.executeScript(getElementProperties, element, propertyNames);
    }

    public async getElementStyles(selector: string, ...styleNames: string[]): Promise<{ value: string | null; unit: string | null }[]> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        return driver.executeScript(getElementStyles, element, styleNames);
    }

    public async getURL(): Promise<string> {
        const {driver} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        return driver.getCurrentUrl();
    }

    public async isBrowserOpen(): Promise<boolean> {
        const {driver} = this;

        return !!driver;
    }

    public async isElementPresent(selector: string): Promise<boolean> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        try {
            const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

            return !!element;
        } catch (error) {
            if (/unloaded|destroyed/ui.test(error.message)) {
                return this.isElementPresent(selector);
            }

            throw error;
        }
    }

    public async isElementVisible(selector: string): Promise<boolean> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        try {
            const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

            return !!element;
        } catch (error) {
            if (/unloaded|destroyed/ui.test(error.message)) {
                return this.isElementVisible(selector);
            }

            throw error;
        }
    }

    public async isElementInteractable(selector: string): Promise<boolean> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        try {
            const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

            return !!element;
        } catch (error) {
            if (/unloaded|destroyed/ui.test(error.message)) {
                return this.isElementInteractable(selector);
            }

            throw error;
        }
    }

    public async moveMouseTo(x: number, y: number): Promise<void> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector: 'body',
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(x),
            y: Math.round(y)
        }).perform();
    }

    public async moveMouseToElement(selector: string, offsetX: number, offsetY: number): Promise<void> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(offsetX),
            y: Math.round(offsetY)
        }).perform();
    }

    public async moveMouseToElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {width, height} = await driver.executeScript<{
            width: number;
            height: number;
        }>(getBoundingClientRect, element);

        await driver.actions().mouseMove(element, {
            x: Math.round(offsetCenterX + width / 2),
            y: Math.round(offsetCenterY + height / 2)
        }).perform();
    }

    public async openBrowser(): Promise<{
        sessionId: string | null
    }> {
        const {options} = this;
        const {browserVersion, browserName, seleniumRemoteUrl, rawCapabilities, maximizeWindow, appium} = options;

        if (this.driver) {
            throw new AdapterError(DullahanErrorMessage.ACTIVE_BROWSER);
        }

        if (seleniumRemoteUrl) {
            const builder = new Builder().forBrowser(browserName, browserVersion).usingServer(seleniumRemoteUrl);

            builder.withCapabilities(builder.getCapabilities().merge({
                browser: browserName,
                browser_version: browserVersion
            }).merge(rawCapabilities));

            this.driver = await builder.build();
        } else if (/chrome/i.test(browserName)) {
            this.driver = await buildChrome(options);
        } else if (/edge/i.test(browserName)) {
            if (parseInt(browserVersion ?? '19') > 18) {
                this.driver = await buildEdgeChromium(options);
            } else {
                this.driver = await buildEdgeClassic(options);
            }
        } else if (/ie/i.test(browserName)) {
            this.driver = await buildInternetExplorer(options);
        } else if (/firefox/i.test(browserName)) {
            this.driver = await buildFirefox(options);
        } else {
            this.driver = await buildUnknown(options);
        }

        if (!appium && maximizeWindow) {
            const {driver} = this;
            tryIgnore(1, async () => {
                await driver.manage().window().maximize();
            });
        }

        return {
            sessionId: (await (this.driver as any).session_).id_
        };
    }

    public async pressMouseAt(x: number, y: number): Promise<void> {
        const {driver, supportsPromises, supportsActions} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        if (!supportsActions) {
            await driver.executeScript<void>(emitFakeEvent, 'mousemove', x, y);
            return driver.executeScript<void>(emitFakeEvent, 'mousedown', x, y);
        }

        const findOptions: FindElementOptions = {
            selector: 'body',
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(x),
            y: Math.round(y)
        }).mouseDown().perform();
    }

    public async releaseMouseAt(x: number, y: number): Promise<void> {
        const {driver, supportsPromises, supportsActions} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        if (!supportsActions) {
            await driver.executeScript<void>(emitFakeEvent, 'mousemove', x, y);
            return driver.executeScript<void>(emitFakeEvent, 'mouseup', x, y);
        }

        const findOptions: FindElementOptions = {
            selector: 'body',
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await driver.actions().mouseMove(element, {
            x: Math.round(x),
            y: Math.round(y)
        }).mouseUp().perform();
    }

    public async scrollToElement(selector: string): Promise<void> {
        const {driver, supportsPromises} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: supportsPromises,
            expectNoMatches: false
        };

        const element = await driver.executeScript<WebElement | null>(findElement, findOptions);

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await driver.executeScript(scrollToElement, element);
    }

    public async screenshotPage(): Promise<string> {
        const {driver} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const screenshot = await driver.takeScreenshot();

        return screenshot.replace(/^data:image\/png;base64,/, '');
    }

    public async setURL(url: string, options: {
        readyState: DullahanReadyState;
        timeout: number;
    }): Promise<void> {
        const {driver} = this;
        const {readyState, timeout} = options;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await driver.executeScript<void>(`window.location = ${JSON.stringify(url)}`);

        await tryX(2, async () => {
            await sleep(100);

            await driver.wait(() => driver.executeScript<boolean>(waitForReadyState, {
                readyState,
                timeout: timeout / 2
            }), timeout / 2);
        });
    }

    public async waitForElementPresent(selector: string, options: {
        timeout: number;
    }): Promise<void> {
        const {driver, supportsPromises} = this;
        const {timeout} = options;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout,
            promise: supportsPromises,
            expectNoMatches: false
        };

        try {
            const element = await driver.wait(() => driver.executeScript<WebElement | null>(findElement, findOptions), timeout || 1);

            if (!element) {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            } else if (/unloaded|destroyed/ui.test(error.message)) {
                return this.waitForElementPresent(selector, options);
            }

            throw error;
        }
    }

    public async waitForElementVisible(selector: string, options: {
        timeout: number;
    }): Promise<void> {
        const {driver, supportsPromises} = this;
        const {timeout} = options;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: false,
            timeout,
            promise: supportsPromises,
            expectNoMatches: false
        };

        try {
            const element = await driver.wait(() => driver.executeScript<WebElement | null>(findElement, findOptions), timeout || 1);

            if (!element) {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            } else if (/unloaded|destroyed/ui.test(error.message)) {
                return this.waitForElementVisible(selector, options);
            }

            throw error;
        }
    }

    public async waitForElementInteractive(selector: string, options: {
        timeout: number;
    }): Promise<void> {
        const {driver, supportsPromises} = this;
        const {timeout} = options;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout,
            promise: supportsPromises,
            expectNoMatches: false
        };

        try {
            const element = await driver.wait(() => driver.executeScript<WebElement | null>(findElement, findOptions), timeout || 1);

            if (!element) {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            } else if (/unloaded|destroyed/ui.test(error.message)) {
                return this.waitForElementInteractive(selector, options);
            }

            throw error;
        }
    }

    public async executeScript<T>(script: string): Promise<T> {
        const {driver} = this;

        if (!driver) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        return driver.executeScript<T>((_script: string) => new Function(_script)(), script);
    }

    public async fillIFrameField(iFrameSelector: string, fieldSelector: string, value: string) {
        throw new AdapterError('Function not implemented!');
    }

    public async clickIFrameElement(iFrameSelector: string, fieldSelector: string) {
        throw new AdapterError('Function not implemented!');
    }

}
