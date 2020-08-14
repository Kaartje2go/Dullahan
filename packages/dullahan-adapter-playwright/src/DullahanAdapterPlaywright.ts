import * as Playwright from 'playwright';

import {
    DullahanAdapterPlaywrightDefaultOptions,
    DullahanAdapterPlaywrightUserOptions
} from './DullahanAdapterPlaywrightOptions';

import {
    AdapterError,
    displayPointer,
    DullahanAdapter,
    DullahanClient,
    DullahanCookie,
    DullahanErrorMessage,
    DullahanReadyState,
    findElement,
    FindElementOptions,
    getBoundingClientRect,
    getElementStyles,
    scrollToElement,
    setElementAttribute,
    setElementProperty,
    sleep,
    tryX,
    waitForReadyState
} from '@k2g/dullahan';

export default class DullahanAdapterPlaywright extends DullahanAdapter<DullahanAdapterPlaywrightUserOptions,
    typeof DullahanAdapterPlaywrightDefaultOptions> {

    protected browser?: Playwright.Browser;

    protected page?: Playwright.Page;

    public constructor(args: {
        testId: string;
        client: DullahanClient;
        userOptions: DullahanAdapterPlaywrightUserOptions;
    }) {
        super({
            ...args,
            defaultOptions: DullahanAdapterPlaywrightDefaultOptions
        });
    }

    public async getCookie(name: string): Promise<DullahanCookie | null> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const cookies = await page.context().cookies();

        return cookies.find((cookie) => cookie.name === name) ?? null;
    }

    public async getElementBoundaries(selector: string): Promise<{ top: number; left: number; bottom: number; right: number; x: number; y: number; width: number; height: number }> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        return page.evaluate(getBoundingClientRect, element);
    }

    public async pressMouseAtElement(selector: string, offsetX: number, offsetY: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {x: elementX, y: elementY} = await page.evaluate(getBoundingClientRect, element);
        await page.mouse.move(elementX + offsetX, elementY + offsetY);
        await page.mouse.down();
    }

    public async pressMouseAtElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {x: elementX, y: elementY, width, height} = await page.evaluate(getBoundingClientRect, element);
        await page.mouse.move(elementX + offsetCenterX + width / 2, elementY + offsetCenterY + height / 2);
        await page.mouse.down();
    }

    public async releaseMouseAtElement(selector: string, offsetX: number, offsetY: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {x: elementX, y: elementY} = await page.evaluate(getBoundingClientRect, element);
        await page.mouse.move(elementX + offsetX, elementY + offsetY);
        await page.mouse.up();
    }

    public async releaseMouseAtElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {x: elementX, y: elementY, width, height} = await page.evaluate(getBoundingClientRect, element);
        await page.mouse.move(elementX + offsetCenterX + width / 2, elementY + offsetCenterY + height / 2);
        await page.mouse.up();
    }

    public async reloadPage(options: { readyState: DullahanReadyState; timeout: number }): Promise<void> {
        const {page} = this;
        const {readyState, timeout} = options;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await page.evaluate('location.reload()');

        await tryX(2, async () => {
            await page.waitForFunction(waitForReadyState, {
                readyState,
                timeout: timeout / 2
            }, {timeout: timeout / 2});
        });
    }

    public async removeCookie(name: string): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const cookies = await page.context().cookies();
        const matches = cookies.filter((cookie) => cookie.name === name);

        if (matches.length) {
            await page.context().addCookies(matches.map((cookie) => ({
                ...cookie,
                expires: 0
            })));
        }
    }

    public async sendKeys(keys: string): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await page.keyboard.type(keys);
    }

    public async sendKeysToElement(selector: string, keys: string): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await element.type(keys);
    }

    public async setCookie(cookie: DullahanCookie): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await page.context().addCookies([cookie]);
    }

    public async setElementAttribute(selector: string, attributeName: string, attributeValue: string): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await page.evaluate(setElementAttribute, {element, attributeName, attributeValue});
    }

    public async setElementInputFile(selector: string, file: string): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await element.setInputFiles(file);
    }

    public async setElementProperty(selector: string, propertyName: string, propertyValue: any): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await page.evaluate(setElementProperty, {element, propertyName, propertyValue});
    }

    public async waitForElementNotPresent(selector: string, options: { timeout: number }): Promise<void> {
        const {page} = this;
        const {timeout} = options;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout,
            promise: true,
            expectNoMatches: true
        };

        try {
            const elementHandle = await page.evaluateHandle(findElement, findOptions);
            const element = elementHandle.asElement();

            if (element) {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }

            throw error;
        }
    }

    public async waitForElementNotVisible(selector: string, options: { timeout: number }): Promise<void> {
        const {page} = this;
        const {timeout} = options;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: false,
            timeout,
            promise: true,
            expectNoMatches: true
        };

        try {
            const elementHandle = await page.evaluateHandle(findElement, findOptions);
            const element = elementHandle.asElement();

            if (element) {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }

            throw error;
        }
    }

    public async waitForNavigation(trigger: () => void | Promise<void>, options: { timeout: number; readyState: DullahanReadyState }): Promise<void> {
        const {page} = this;
        const {timeout, readyState} = options;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const startTime = Date.now();
        const startUrl = page.url();

        await trigger();

        while (Date.now() < startTime + timeout) {
            await sleep(100);
            const url = page.url();

            if (url !== startUrl) {
                break;
            }
        }

        await tryX(2, async () => {
            await page.waitForFunction(waitForReadyState, {
                readyState,
                timeout: timeout / 2
            }, {timeout: timeout / 2});
        });
    }

    public async clickAt(x: number, y: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await page.mouse.click(x, y);
    }

    public async clickAtElement(selector: string, offsetX: number, offsetY: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await element.click({
            position: {
                x: offsetX,
                y: offsetY
            }
        });
    }

    public async clickAtElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {width, height} = await page.evaluate(getBoundingClientRect, element);

        await element.click({
            position: {
                x: offsetCenterX + width / 2,
                y: offsetCenterY + height / 2
            }
        });
    }

    public async closeBrowser(): Promise<void> {
        const {browser} = this;

        if (!browser) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await browser.close();

        this.browser = undefined;
        this.page = undefined;
    }

    public async displayPointer(): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await page.evaluate(displayPointer);
    }

    public async getElementAttributes(selector: string, ...attributeNames: string[]): Promise<(string | null)[]> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        return Promise.all(attributeNames.map((attributeName: string) => element.getAttribute(attributeName)));
    }

    public async getElementProperties<T>(selector: string, ...propertyNames: string[]): Promise<(T | null)[]> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        return Promise.all(propertyNames.map(async (attributeName: string) => {
            const valueHandle = await element.getProperty(attributeName);
            const value = await valueHandle.jsonValue();

            return value ?? null;
        }));
    }

    public async getElementStyles(selector: string, ...styleNames: string[]): Promise<{
        value: string | null;
        unit: string | null;
    }[]> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        return page.evaluate(getElementStyles, {element, styleNames});
    }

    public async getURL(): Promise<string> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        return page.url();
    }

    public async isBrowserOpen(): Promise<boolean> {
        const {browser, page} = this;

        return (browser?.isConnected() && !page?.isClosed()) ?? false;
    }

    public async isElementPresent(selector: string): Promise<boolean> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        return element !== null;
    }

    public async isElementVisible(selector: string): Promise<boolean> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        return element !== null;
    }

    public async moveMouseTo(x: number, y: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await page.mouse.move(x, y);
    }

    public async moveMouseToElement(selector: string, offsetX: number, offsetY: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {x: elementX, y: elementY} = await page.evaluate(getBoundingClientRect, element);

        await page.mouse.move(elementX + offsetX, elementY + offsetY);
    }

    public async moveMouseToElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: true,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        const {x: elementX, y: elementY, width, height} = await page.evaluate(getBoundingClientRect, element);

        await page.mouse.move(elementX + offsetCenterX + width / 2, elementY + offsetCenterY + height / 2);
    }

    public async openBrowser(): Promise<{
        sessionId: string | null
    }> {
        const {options} = this;
        const {headless, browserName, emulateDevice} = options;

        if (this.browser) {
            throw new AdapterError(DullahanErrorMessage.ACTIVE_BROWSER);
        }

        const browser = await Playwright[browserName].launch({
            headless,
            args: ['--no-sandbox']
        });

        const contextOptions = emulateDevice ? Playwright.devices[emulateDevice] : {};
        const context = await browser.newContext(contextOptions);
        const page = await context.newPage();

        this.browser = browser;
        this.page = page;

        return {
            sessionId: null
        };
    }

    public async pressMouseAt(x: number, y: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await page.mouse.move(x, y);
        await page.mouse.down();
    }

    public async releaseMouseAt(x: number, y: number): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await page.mouse.move(x, y);
        await page.mouse.up();
    }

    public async scrollToElement(selector: string): Promise<void> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout: 200,
            promise: true,
            expectNoMatches: false
        };

        const elementHandle = await page.evaluateHandle(findElement, findOptions);
        const element = elementHandle.asElement();

        if (!element) {
            throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
        }

        await page.evaluate(scrollToElement, element);
    }

    public async screenshotPage(): Promise<string> {
        const {page} = this;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const screenshot = await page.screenshot({
            type: 'png',
            fullPage: true
        });

        return screenshot.toString('base64').replace(/^data:image\/png;base64,/, '');
    }

    public async setURL(url: string, options: {
        readyState: DullahanReadyState;
        timeout: number;
    }): Promise<void> {
        const {page} = this;
        const {readyState, timeout} = options;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        await page.evaluate(`window.location = ${JSON.stringify(url)}`);

        await tryX(2, async () => {
            await sleep(100);

            await page.waitForFunction(waitForReadyState, {
                readyState,
                timeout: timeout / 2
            }, {timeout: timeout / 2});
        });
    }

    public async waitForElementPresent(selector: string, options: {
        timeout: number;
    }): Promise<void> {
        const {page} = this;
        const {timeout} = options;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: false,
            onScreenOnly: false,
            interactiveOnly: false,
            timeout,
            promise: true,
            expectNoMatches: false
        };

        try {
            const elementHandle = await page.evaluateHandle(findElement, findOptions);
            const element = elementHandle.asElement();

            if (!element) {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }

            throw error;
        }
    }

    public async waitForElementVisible(selector: string, options: {
        timeout: number;
    }): Promise<void> {
        const {page} = this;
        const {timeout} = options;

        if (!page) {
            throw new AdapterError(DullahanErrorMessage.NO_BROWSER);
        }

        const findOptions: FindElementOptions = {
            selector,
            visibleOnly: true,
            onScreenOnly: true,
            interactiveOnly: false,
            timeout,
            promise: true,
            expectNoMatches: false
        };

        try {
            const elementHandle = await page.evaluateHandle(findElement, findOptions);
            const element = elementHandle.asElement();

            if (!element) {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new AdapterError(DullahanErrorMessage.findElementResult(findOptions));
            }

            throw error;
        }
    }
}
