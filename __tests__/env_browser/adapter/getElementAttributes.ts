/* eslint-disable  */

import {AdapterError, DullahanAdapter, DullahanErrorMessage, tryX} from "@k2g/dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.getElementAttributes', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.getElementAttributes('#dullahan', 'href', 'data-dullahan-io');
        } catch (error) {
            expect(error.message).toStrictEqual(DullahanErrorMessage.NO_BROWSER);
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it('throws a valid error when an element cannot be found', async () => {
        try {
            expect.hasAssertions();
            await tryX(3, () => adapter.openBrowser());
            await adapter.setURL('http://localhost:8080', {
                timeout: 10000,
                readyState: 'interactive'
            });
            await adapter.getElementAttributes('#dullahan');
        } catch (error) {
            expect(error.message).toMatchSnapshot();
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it('returns an empty array if no attributes are specified', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementPresent('body', {
            timeout: 2000
        });
        const result = await adapter.getElementAttributes('body');
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(0);
    });

    it('returns "null" for missing attributes', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080/clickbox', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementPresent('.clickbox', {
            timeout: 2000
        });
        const [doesNotExist] = await adapter.getElementAttributes('.clickbox', 'does-not-exist');
        expect(doesNotExist).toBe(null);
    });

    it('returns attributes in order', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080/clickbox', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementPresent('.clickbox', {
            timeout: 2000
        });
        const [className, id] = await adapter.getElementAttributes('.clickbox', 'class', 'id');
        expect(className).toContain('clickbox');
        expect(id).toBe(null);
    });
});
