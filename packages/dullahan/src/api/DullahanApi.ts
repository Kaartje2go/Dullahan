import {DullahanAdapter} from '../adapter';
import {DullahanCallSpy} from '../DullahanCall';
import {DullahanCookie} from '../DullahanCookie';
import {DullahanClient} from '../DullahanClient';
import {DullahanKey} from '../DullahanKey';
import {DullahanTest} from '../DullahanTest';
import {resolve as resolvePath} from 'path';
import {DullahanApiUserOptions, DullahanApiDefaultOptions} from './DullahanApiOptions';
import {Expect} from "expect/build/types";
import * as expect from 'expect';

export type DullahanApiArguments<
    DullahanApiSubclassUserOptions extends DullahanApiUserOptions,
    DullahanApiSubclassDefaultOptions extends typeof DullahanApiDefaultOptions
> = {
    testId: string;
    test: DullahanTest;
    client: DullahanClient;
    adapter: DullahanAdapter<any, any>;
    userOptions: DullahanApiSubclassUserOptions;
    defaultOptions?: DullahanApiSubclassDefaultOptions;
};

export class DullahanApi<
    DullahanApiSubclassUserOptions extends DullahanApiUserOptions = DullahanApiUserOptions,
    DullahanApiSubclassDefaultOptions extends typeof DullahanApiDefaultOptions = typeof DullahanApiDefaultOptions
> extends DullahanCallSpy {

    protected readonly client: unknown;

    protected readonly adapter: DullahanAdapter<any, any>;

    protected readonly test: DullahanTest;

    protected readonly options: DullahanApiSubclassUserOptions & DullahanApiSubclassDefaultOptions;

    public constructor({
        testId,
        client,
        adapter,
        test,
        userOptions,
        defaultOptions = DullahanApiDefaultOptions as DullahanApiSubclassDefaultOptions
    }: DullahanApiArguments<DullahanApiSubclassUserOptions, DullahanApiSubclassDefaultOptions>) {
        super({
            testId,
            client,
            functionScope: 'api',
            slowMotion: userOptions.slowMotion ?? defaultOptions.slowMotion
        });

        this.test = test;
        this.client = client;
        this.adapter = adapter;
        this.options = {...defaultOptions, ...userOptions};
    }

    public async sleep(milliseconds: number): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    public async assert(message: string, assertion: (this: void, expect: Expect) => Promise<void>): Promise<void> {
        await assertion(expect);
    }

    public async clickAt(x: number, y: number): Promise<void> {
        return this.adapter.clickAt(x, y);
    }

    public async clickAtElement(selector: string, offsetX: number = 0, offsetY: number = 0, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });
        await adapter.clickAtElement(selector, offsetX, offsetY);
    }

    public async click(selector: string, offsetCenterX?: number, offsetCenterY?: number, timeout?: number): Promise<void> {
        if (offsetCenterX && offsetCenterY) {
            return this.clickAtElementCenter(selector, offsetCenterX, offsetCenterY, timeout);
        }

        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementInteractable(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementInteractive(selector, {
            timeout: timeout ?? defaultTimeout
        });
        await adapter.click(selector);
    }

    public async clickAtElementCenter(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });
        await adapter.clickAtElementCenter(selector, offsetCenterX, offsetCenterY);
    }

    public async displayPointer(): Promise<void> {
        return this.adapter.displayPointer();
    }

    public async getCookie(name: string): Promise<DullahanCookie | null> {
        return this.adapter.getCookie(name);
    }

    public async getElementAttributes(selector: string, attributeNames: string[], timeout?: number): Promise<(string | null)[]> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.getElementAttributes(selector, ...attributeNames);
    }

    public async getElementBoundaries(selector: string, timeout?: number): Promise<{ top: number; left: number; bottom: number; right: number; x: number; y: number; width: number; height: number }> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.getElementBoundaries(selector);
    }

    public async getElementProperties<T>(selector: string, propertyNames: string[], timeout?: number): Promise<(T | null)[]> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.getElementProperties<T>(selector, ...propertyNames);
    }

    public async getElementStyles(selector: string, styleNames: string[], timeout?: number): Promise<{ value: string | null; unit: string | null }[]> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.getElementStyles(selector, ...styleNames);
    }

    public async getURL(): Promise<string> {
        return this.adapter.getURL();
    }

    public async getValue(selector: string, timeout?: number): Promise<string | null> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        const [value] = await adapter.getElementProperties<string>(selector, 'value');

        return value;
    }

    public async isElementPresent(selector: string): Promise<boolean> {
        return this.adapter.isElementPresent(selector);
    }

    public async isElementVisible(selector: string): Promise<boolean> {
        return this.adapter.isElementVisible(selector);
    }

    public async moveMouseTo(x: number, y: number): Promise<void> {
        return this.adapter.moveMouseTo(x, y);
    }

    public async moveMouseToElement(selector: string, offsetX: number = 0, offsetY: number = 0, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.moveMouseToElement(selector, offsetX, offsetY);
    }

    public async moveMouseToElementCenter(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.moveMouseToElementCenter(selector, offsetCenterX, offsetCenterY);
    }

    public async pressMouseAt(x: number, y: number): Promise<void> {
        return this.adapter.pressMouseAt(x, y);
    }

    public async pressMouseAtElement(selector: string, offsetX: number = 0, offsetY: number = 0, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.pressMouseAtElement(selector, offsetX, offsetY);
    }

    public async pressMouse(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
        return this.pressMouseAtElementCenter(selector, offsetCenterX, offsetCenterY, timeout);
    }

    public async pressMouseAtElementCenter(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.pressMouseAtElementCenter(selector, offsetCenterX, offsetCenterY);
    }

    public async releaseMouseAt(x: number, y: number): Promise<void> {
        return this.adapter.releaseMouseAt(x, y);
    }

    public async releaseMouseAtElement(selector: string, offsetX: number = 0, offsetY: number = 0, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.releaseMouseAtElement(selector, offsetX, offsetY);
    }

    public async releaseMouse(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
        return this.releaseMouseAtElementCenter(selector, offsetCenterX, offsetCenterY, timeout);
    }

    public async releaseMouseAtElementCenter(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.releaseMouseAtElementCenter(selector, offsetCenterX, offsetCenterY);
    }

    public async reloadPage(timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultNetworkTimeout, displayPointer} = options;

        await adapter.reloadPage({
            readyState: 'interactive',
            timeout: timeout ?? defaultNetworkTimeout
        });

        if (displayPointer) {
            await this.displayPointer();
        }
    }

    public async removeCookie(name: string): Promise<void> {
        return this.adapter.removeCookie(name);
    }

    public async screenshotPage(): Promise<string> {
        return this.adapter.screenshotPage();
    }

    public async scrollToElement(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.scrollToElement(selector);
    }

    public async sendKeys(keys: string): Promise<void> {
        return this.adapter.sendKeys(keys);
    }

    public async pressKey(key: DullahanKey): Promise<void> {
        return this.adapter.pressKey(key);
    }

    public async sendKeysToElement(selector: string, keys: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.sendKeysToElement(selector, keys);
    }

    public async setCookie(cookie: DullahanCookie): Promise<void> {
        return this.adapter.setCookie(cookie);
    }

    public async setElementAttribute(selector: string, attributeName: string, attributeValue: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.setElementAttribute(selector, attributeName, attributeValue);
    }

    public async setElementInputFile(selector: string, file: string, isAbsolute: boolean = false, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.setElementInputFile(selector, isAbsolute ? file : resolvePath(process.cwd(), file));
    }

    public async setElementProperty(selector: string, propertyName: string, propertyValue: any, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.setElementProperty(selector, propertyName, propertyValue);
    }

    public async goto(url: string, timeout?: number): Promise<void> {
        return this.setURL(url, timeout);
    }

    public async setURL(url: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultNetworkTimeout, displayPointer} = options;

        await adapter.setURL(url, {
            readyState: 'interactive',
            timeout: timeout ?? defaultNetworkTimeout
        });

        if (displayPointer) {
            await this.displayPointer();
        }
    }

    public async setValue(selector: string, value: any, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.setElementProperty(selector, 'value', value);
    }

    public async waitForElementNotPresent(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementNotPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });
    }

    public async waitForElementNotVisible(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementNotVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });
    }

    public async waitForElementPresent(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });
    }

    public async waitForElementVisible(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });
    }

    public async waitForElementInteractive(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementInteractive(selector, {
            timeout: timeout ?? defaultTimeout
        });
    }

    public async waitForNavigation(trigger: () => (Promise<void> | void), timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultNetworkTimeout, displayPointer} = options;

        await adapter.waitForNavigation(trigger, {
            readyState: 'interactive',
            timeout: timeout ?? defaultNetworkTimeout
        });

        if (displayPointer) {
            await this.displayPointer();
        }
    }

    public async getText(selector: string, timeout?: number): Promise<string> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        const [value, innerText] = await adapter.getElementProperties(selector, 'value', 'innerText');

        if (value) {
            return value.toString();
        } else if (innerText) {
            return innerText.toString();
        }

        return '';
    }

    public async appendText(selector: string, text: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });

        await adapter.sendKeysToElement(selector, text);
    }

    public async clearText(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        const existingText = await this.getText(selector, timeout);
        await adapter.clearText(selector, existingText.length);
    }

    public async setText(selector: string, text: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });

        const [value, innerText] = await adapter.getElementProperties(selector, 'value', 'innerText');
        const existingText = typeof value === 'string' ? value : typeof innerText === 'string' ? innerText : '';

        await adapter.clearText(selector, existingText.length);
        await adapter.sendKeysToElement(selector, text);
    }

    public async executeScript<T = any>(script: string): Promise<T> {
        return this.adapter.executeScript<T>(script);
    }

    public async fillIFrameField(iFrameSelector: string, fieldSelector: string, value: string) {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(iFrameSelector))) {
            await this.scrollToElement(iFrameSelector, defaultTimeout);
        }

        await adapter.waitForElementVisible(iFrameSelector, {
            timeout: defaultTimeout
        });

        await adapter.fillIFrameField(iFrameSelector, fieldSelector, value);
    }

    public async clickIFrameElement(iFrameSelector: string, selector: string) {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(iFrameSelector))) {
            await this.scrollToElement(iFrameSelector, defaultTimeout);
        }

        await adapter.waitForElementVisible(iFrameSelector, {
            timeout: defaultTimeout
        });

        await adapter.clickIFrameElement(iFrameSelector, selector);
    }

    public async disableDialogs(): Promise<void> {
        return this.adapter.disableDialogs();
    }

    public async enableDialogs(): Promise<void> {
        return this.adapter.enableDialogs();
    }

    public async acceptDialog(value?: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForDialog({
            timeout: timeout ?? defaultTimeout
        });
        await adapter.setDialogValue(true, value);
    }

    public async dismissDialog(timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForDialog({
            timeout: timeout ?? defaultTimeout
        });
        await adapter.setDialogValue(false);
    }
}
