import {DullahanAdapter} from '../adapter';
import {DullahanCallSpy} from '../DullahanCall';
import {DullahanCookie} from '../DullahanCookie';
import {DullahanClient} from '../DullahanClient';
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
    adapter: DullahanAdapter<never, never>;
    userOptions: DullahanApiSubclassUserOptions;
    defaultOptions: DullahanApiSubclassDefaultOptions;
};

export class DullahanApi<
    DullahanApiSubclassUserOptions extends DullahanApiUserOptions = DullahanApiUserOptions,
    DullahanApiSubclassDefaultOptions extends typeof DullahanApiDefaultOptions = typeof DullahanApiDefaultOptions
> extends DullahanCallSpy {

    protected readonly client: unknown;

    protected readonly adapter: DullahanAdapter<never, never>;

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

    async clickAt(x: number, y: number): Promise<void> {
        return this.adapter.clickAt(x, y);
    }

    async clickAtElement(selector: string, offsetX: number = 0, offsetY: number = 0, timeout?: number): Promise<void> {
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

    async click(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
        return this.clickAtElementCenter(selector, offsetCenterX, offsetCenterY, timeout);
    }

    async clickAtElementCenter(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
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

    async displayPointer(): Promise<void> {
        return this.adapter.displayPointer();
    }

    async getCookie(name: string): Promise<DullahanCookie | null> {
        return this.adapter.getCookie(name);
    }

    async getElementAttributes(selector: string, attributeNames: string[], timeout?: number): Promise<(string | null)[]> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.getElementAttributes(selector, ...attributeNames);
    }

    async getElementBoundaries(selector: string, timeout?: number): Promise<{ top: number; left: number; bottom: number; right: number; x: number; y: number; width: number; height: number }> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.getElementBoundaries(selector);
    }

    async getElementProperties<T>(selector: string, propertyNames: string[], timeout?: number): Promise<(T | null)[]> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.getElementProperties<T>(selector, ...propertyNames);
    }

    async getElementStyles(selector: string, styleNames: string[], timeout?: number): Promise<{ value: string | null; unit: string | null }[]> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.getElementStyles(selector, ...styleNames);
    }

    async getURL(): Promise<string> {
        return this.adapter.getURL();
    }

    async getValue(selector: string, timeout?: number): Promise<string | null> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        const [value] = await adapter.getElementProperties<string>(selector, 'value');

        return value;
    }

    async isElementPresent(selector: string): Promise<boolean> {
        return this.adapter.isElementPresent(selector);
    }

    async isElementVisible(selector: string): Promise<boolean> {
        return this.adapter.isElementVisible(selector);
    }

    async moveMouseTo(x: number, y: number): Promise<void> {
        return this.adapter.moveMouseTo(x, y);
    }

    async moveMouseToElement(selector: string, offsetX: number = 0, offsetY: number = 0, timeout?: number): Promise<void> {
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

    async moveMouseToElementCenter(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
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

    async pressMouseAt(x: number, y: number): Promise<void> {
        return this.adapter.pressMouseAt(x, y);
    }

    async pressMouseAtElement(selector: string, offsetX: number = 0, offsetY: number = 0, timeout?: number): Promise<void> {
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

    async pressMouse(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
        return this.pressMouseAtElementCenter(selector, offsetCenterX, offsetCenterY, timeout);
    }

    async pressMouseAtElementCenter(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
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

    async releaseMouseAt(x: number, y: number): Promise<void> {
        return this.adapter.releaseMouseAt(x, y);
    }

    async releaseMouseAtElement(selector: string, offsetX: number = 0, offsetY: number = 0, timeout?: number): Promise<void> {
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

    async releaseMouse(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
        return this.releaseMouseAtElementCenter(selector, offsetCenterX, offsetCenterY, timeout);
    }

    async releaseMouseAtElementCenter(selector: string, offsetCenterX: number = 0, offsetCenterY: number = 0, timeout?: number): Promise<void> {
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

    async reloadPage(timeout?: number): Promise<void> {
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

    async removeCookie(name: string): Promise<void> {
        return this.adapter.removeCookie(name);
    }

    async screenshotPage(): Promise<string> {
        return this.adapter.screenshotPage();
    }

    async scrollToElement(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.scrollToElement(selector);
    }

    async sendKeys(keys: string): Promise<void> {
        return this.adapter.sendKeys(keys);
    }

    async sendKeysToElement(selector: string, keys: string, timeout?: number): Promise<void> {
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

    async setCookie(cookie: DullahanCookie): Promise<void> {
        return this.adapter.setCookie(cookie);
    }

    async setElementAttribute(selector: string, attributeName: string, attributeValue: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.setElementAttribute(selector, attributeName, attributeValue);
    }

    async setElementInputFile(selector: string, file: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.setElementInputFile(selector, resolvePath(process.cwd(), file));
    }

    async setElementProperty(selector: string, propertyName: string, propertyValue: any, timeout?: number): Promise<void> {
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

    async setURL(url: string, timeout?: number): Promise<void> {
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

    async setValue(selector: string, value: any, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });

        return adapter.setElementProperty(selector, 'value', value);
    }

    async waitForElementNotPresent(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementNotPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });
    }

    async waitForElementNotVisible(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementNotVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });
    }

    async waitForElementPresent(selector: string, timeout?: number): Promise<void> {
        const {adapter, options} = this;
        const {defaultTimeout} = options;

        await adapter.waitForElementPresent(selector, {
            timeout: timeout ?? defaultTimeout
        });
    }

    async waitForElementVisible(selector: string, timeout?: number): Promise<void> {
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

    async waitForElementInteractive(selector: string, timeout?: number): Promise<void> {
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

    async waitForNavigation(trigger: () => (Promise<void> | void), timeout?: number): Promise<void> {
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
        const {adapter} = this;

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? 10000
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
        const {defaultTimeout, autoScroll} = options;

        if (autoScroll && !(await adapter.isElementVisible(selector))) {
            await this.scrollToElement(selector, timeout);
        }

        await adapter.waitForElementVisible(selector, {
            timeout: timeout ?? defaultTimeout
        });

        const [value, innerText] = await adapter.getElementProperties(selector, 'value', 'innerText');
        const existingText = typeof value === 'string' ? value : typeof innerText === 'string' ? innerText : '';

        await adapter.sendKeysToElement(selector, Array(existingText.length).fill('\b').join(''));
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

        await adapter.sendKeysToElement(selector, Array(existingText.length).fill('\b').join(''));
        await adapter.sendKeysToElement(selector, text);
    }

    public async executeScript(script: string) {
        return this.adapter.executeScript(script);
    }
}
