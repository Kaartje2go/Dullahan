import {DullahanReadyState} from '../browser_helpers/waitForReadyState';
import {DullahanCallSpy} from '../DullahanCall';
import {DullahanClient} from '../DullahanClient';
import {DullahanCookie} from '../DullahanCookie';

import {DullahanAdapterDefaultOptions, DullahanAdapterUserOptions} from './DullahanAdapterOptions';

export type DullahanAdapterArguments<DullahanAdapterSubclassUserOptions extends DullahanAdapterUserOptions,
    DullahanAdapterSubclassDefaultOptions extends typeof DullahanAdapterDefaultOptions> = {
    testId: string;
    client: DullahanClient;
    userOptions: DullahanAdapterSubclassUserOptions;
    defaultOptions: DullahanAdapterSubclassDefaultOptions;
};

export abstract class DullahanAdapter<DullahanAdapterSubclassUserOptions extends DullahanAdapterUserOptions,
    DullahanAdapterSubclassDefaultOptions extends typeof DullahanAdapterDefaultOptions> extends DullahanCallSpy {

    public readonly client: DullahanClient;

    protected readonly options: DullahanAdapterSubclassUserOptions & DullahanAdapterSubclassDefaultOptions;

    public constructor({
                           testId,
                           client,
                           userOptions,
                           defaultOptions
                       }: DullahanAdapterArguments<DullahanAdapterSubclassUserOptions, DullahanAdapterSubclassDefaultOptions>) {
        super({
            testId,
            client,
            functionScope: 'adapter',
            slowMotion: userOptions.slowMotion ?? defaultOptions.slowMotion
        });

        this.client = client;
        this.options = {
            ...defaultOptions,
            ...userOptions
        };
    }

    public abstract async clearText(selector: string, count: number): Promise<void>;

    public abstract async click(selector: string): Promise<void>;

    public abstract async clickAt(x: number, y: number): Promise<void>;

    public abstract async clickAtElement(selector: string, offsetX: number, offsetY: number): Promise<void>;

    public abstract async clickAtElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void>;

    public abstract async closeBrowser(): Promise<void>;

    public abstract async displayPointer(): Promise<void>;

    public abstract async executeScript<T>(script: string): Promise<T>;

    public abstract async getCookie(name: string): Promise<DullahanCookie | null>;

    public abstract async getElementAttributes(selector: string, ...attributeNames: string[]): Promise<(string | null)[]>;

    public abstract async getElementBoundaries(selector: string): Promise<{
        top: number;
        left: number;
        bottom: number;
        right: number;
        x: number;
        y: number;
        width: number;
        height: number;
    }>;

    public abstract async getElementProperties<T>(selector: string, ...propertyNames: string[]): Promise<(T | null)[]>;

    public abstract async getElementStyles(selector: string, ...styleNames: string[]): Promise<{
        value: string | null;
        unit: string | null;
    }[]>;

    public abstract async getURL(): Promise<string>;

    public abstract async isBrowserOpen(): Promise<boolean>;

    public abstract async isElementPresent(selector: string): Promise<boolean>;

    public abstract async isElementVisible(selector: string): Promise<boolean>;

    public abstract async isElementInteractable(selector: string): Promise<boolean>;

    public abstract async moveMouseTo(x: number, y: number): Promise<void>;

    public abstract async moveMouseToElement(selector: string, offsetX: number, offsetY: number): Promise<void>;

    public abstract async moveMouseToElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void>;

    public abstract async openBrowser(): Promise<{
        sessionId: string | null
    }>;

    public abstract async pressMouseAt(x: number, y: number): Promise<void>;

    public abstract async pressMouseAtElement(selector: string, offsetX: number, offsetY: number): Promise<void>;

    public abstract async pressMouseAtElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void>;

    public abstract async releaseMouseAt(x: number, y: number): Promise<void>;

    public abstract async releaseMouseAtElement(selector: string, offsetX: number, offsetY: number): Promise<void>;

    public abstract async releaseMouseAtElementCenter(selector: string, offsetCenterX: number, offsetCenterY: number): Promise<void>;

    public abstract async reloadPage(options: {
        readyState: DullahanReadyState;
        timeout: number;
    }): Promise<void>;

    public abstract async removeCookie(name: string): Promise<void>;

    public abstract async screenshotPage(): Promise<string>;

    public abstract async sendKeys(keys: string): Promise<void>;

    public abstract async sendKeysToElement(selector: string, keys: string): Promise<void>;

    public abstract async setCookie(cookie: DullahanCookie): Promise<void>;

    public abstract async setElementAttribute(selector: string, attributeName: string, attributeValue: string): Promise<void>;

    public abstract async setElementInputFile(selector: string, file: string): Promise<void>;

    public abstract async setElementProperty(selector: string, propertyName: string, propertyValue: any): Promise<void>;

    public abstract async setURL(url: string, options: {
        readyState: DullahanReadyState;
        timeout: number;
    }): Promise<void>;

    public abstract async scrollToElement(selector: string): Promise<void>;

    public abstract async waitForElementNotPresent(selector: string, options: {
        timeout: number;
    }): Promise<void>;

    public abstract async waitForElementNotVisible(selector: string, options: {
        timeout: number;
    }): Promise<void>;

    public abstract async waitForElementPresent(selector: string, options: {
        timeout: number;
    }): Promise<void>;

    public abstract async waitForElementVisible(selector: string, options: {
        timeout: number;
    }): Promise<void>;

    public abstract async waitForElementInteractive(selector: string, options: {
        timeout: number;
    }): Promise<void>;

    public abstract async waitForNavigation(trigger: () => (Promise<void> | void), options: {
        timeout: number;
        readyState: DullahanReadyState;
    }): Promise<void>;
}
