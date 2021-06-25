import { DullahanReadyState } from "../browser_helpers/waitForReadyState";
import { DullahanCallSpy } from "../DullahanCall";
import { DullahanClient } from "../DullahanClient";
import { DullahanCookie } from "../DullahanCookie";

import {
    DullahanAdapterDefaultOptions,
    DullahanAdapterUserOptions, GenericKey
} from "./DullahanAdapterOptions";

export type DullahanAdapterArguments<
    DullahanAdapterSubclassUserOptions extends DullahanAdapterUserOptions,
    DullahanAdapterSubclassDefaultOptions extends typeof DullahanAdapterDefaultOptions
> = {
    testId: string;
    client: DullahanClient;
    userOptions: DullahanAdapterSubclassUserOptions;
    defaultOptions?: DullahanAdapterSubclassDefaultOptions;
};

export abstract class DullahanAdapter<
    DullahanAdapterSubclassUserOptions extends DullahanAdapterUserOptions,
    DullahanAdapterSubclassDefaultOptions extends typeof DullahanAdapterDefaultOptions
> extends DullahanCallSpy {
    public readonly client: DullahanClient;

    protected readonly options: DullahanAdapterSubclassUserOptions &
        DullahanAdapterSubclassDefaultOptions;

    public constructor({
        testId,
        client,
        userOptions,
        defaultOptions = DullahanAdapterDefaultOptions as DullahanAdapterSubclassDefaultOptions,
    }: DullahanAdapterArguments<
        DullahanAdapterSubclassUserOptions,
        DullahanAdapterSubclassDefaultOptions
    >) {
        super({
            testId,
            client,
            functionScope: "adapter",
            slowMotion: userOptions.slowMotion ?? defaultOptions.slowMotion,
        });

        this.client = client;
        this.options = {
            ...defaultOptions,
            ...userOptions,
        };
    }

    public abstract clearText(selector: string, count: number): Promise<void>;

    public abstract click(selector: string): Promise<void>;

    public abstract clickAt(x: number, y: number): Promise<void>;

    public abstract clickAtElement(
        selector: string,
        offsetX: number,
        offsetY: number
    ): Promise<void>;

    public abstract clickAtElementCenter(
        selector: string,
        offsetCenterX: number,
        offsetCenterY: number
    ): Promise<void>;

    public abstract closeBrowser(): Promise<void>;

    public abstract displayPointer(): Promise<void>;

    public abstract executeScript<T>(script: string): Promise<T>;

    public abstract fillIFrameField(
        iFrameSelector: string,
        fieldSelector,
        value: string
    ): Promise<void>;

    public abstract clickIFrameElement(
        iFrameSelector: string,
        selector: string
    ): Promise<void>;

    public abstract getCookie(name: string): Promise<DullahanCookie | null>;

    public abstract getElementAttributes(
        selector: string,
        ...attributeNames: string[]
    ): Promise<(string | null)[]>;

    public abstract getElementBoundaries(
        selector: string
    ): Promise<{
        top: number;
        left: number;
        bottom: number;
        right: number;
        x: number;
        y: number;
        width: number;
        height: number;
    }>;

    public abstract getElementProperties<T>(
        selector: string,
        ...propertyNames: string[]
    ): Promise<(T | null)[]>;

    public abstract getElementStyles(
        selector: string,
        ...styleNames: string[]
    ): Promise<
        {
            value: string | null;
            unit: string | null;
        }[]
    >;

    public abstract getURL(): Promise<string>;

    public abstract isBrowserOpen(): Promise<boolean>;

    public abstract isElementPresent(selector: string): Promise<boolean>;

    public abstract isElementVisible(selector: string): Promise<boolean>;

    public abstract isElementInteractable(selector: string): Promise<boolean>;

    public abstract moveMouseTo(x: number, y: number): Promise<void>;

    public abstract moveMouseToElement(
        selector: string,
        offsetX: number,
        offsetY: number
    ): Promise<void>;

    public abstract moveMouseToElementCenter(
        selector: string,
        offsetCenterX: number,
        offsetCenterY: number
    ): Promise<void>;

    public abstract openBrowser(): Promise<{
        sessionId: string | null;
    }>;

    public abstract pressMouseAt(x: number, y: number): Promise<void>;

    public abstract pressMouseAtElement(
        selector: string,
        offsetX: number,
        offsetY: number
    ): Promise<void>;

    public abstract pressMouseAtElementCenter(
        selector: string,
        offsetCenterX: number,
        offsetCenterY: number
    ): Promise<void>;

    public abstract releaseMouseAt(x: number, y: number): Promise<void>;

    public abstract releaseMouseAtElement(
        selector: string,
        offsetX: number,
        offsetY: number
    ): Promise<void>;

    public abstract releaseMouseAtElementCenter(
        selector: string,
        offsetCenterX: number,
        offsetCenterY: number
    ): Promise<void>;

    public abstract reloadPage(options: {
        readyState: DullahanReadyState;
        timeout: number;
    }): Promise<void>;

    public abstract removeCookie(name: string): Promise<void>;

    public abstract screenshotPage(): Promise<string>;

    public abstract sendKeys(keys: string): Promise<void>;

    public abstract pressKey(keys: GenericKey): Promise<void>;

    public abstract sendKeysToElement(
        selector: string,
        keys: string
    ): Promise<void>;

    public abstract setCookie(cookie: DullahanCookie): Promise<void>;

    public abstract setElementAttribute(
        selector: string,
        attributeName: string,
        attributeValue: string
    ): Promise<void>;

    public abstract setElementInputFile(
        selector: string,
        file: string
    ): Promise<void>;

    public abstract setElementProperty(
        selector: string,
        propertyName: string,
        propertyValue: any
    ): Promise<void>;

    public abstract setURL(
        url: string,
        options: {
            readyState: DullahanReadyState;
            timeout: number;
        }
    ): Promise<void>;

    public abstract scrollToElement(selector: string): Promise<void>;

    public abstract waitForElementNotPresent(
        selector: string,
        options: {
            timeout: number;
        }
    ): Promise<void>;

    public abstract waitForElementNotVisible(
        selector: string,
        options: {
            timeout: number;
        }
    ): Promise<void>;

    public abstract waitForElementPresent(
        selector: string,
        options: {
            timeout: number;
        }
    ): Promise<void>;

    public abstract waitForElementVisible(
        selector: string,
        options: {
            timeout: number;
        }
    ): Promise<void>;

    public abstract waitForElementInteractive(
        selector: string,
        options: {
            timeout: number;
        }
    ): Promise<void>;

    public abstract waitForNavigation(
        trigger: () => Promise<void> | void,
        options: {
            timeout: number;
            readyState: DullahanReadyState;
        }
    ): Promise<void>;

    public async enableDialogs(): Promise<void> {
        await this.executeScript(`
            window.confirm = window.__DULLAHAN_CONFIRM__ || window.confirm;
            window.alert = window.__DULLAHAN_ALERT__ || window.alert;
            window.prompt = window.__DULLAHAN_PROMPT__ || window.prompt;
            window.onbeforeunload = window.__DULLAHAN_ONBEFOREUNLOAD__ || window.onbeforeunload;
        `);
    }

    public async disableDialogs(): Promise<void> {
        await this.executeScript(`
            window.__DULLAHAN_CONFIRM__ = window.confirm;
            window.__DULLAHAN_ALERT__ = window.alert;
            window.__DULLAHAN_PROMPT__ = window.prompt;
            window.__DULLAHAN_ONBEFOREUNLOAD__ = window.onbeforeunload;

            var noop = function () {};
            window.confirm = noop;
            window.alert = noop;
            window.prompt = noop;
            window.onbeforeunload = noop;
        `);
    }

    public abstract waitForDialog(options: {
        timeout: number;
    }): Promise<void>;

    public abstract setDialogValue(accept: boolean, value?: string): Promise<void>;
}
