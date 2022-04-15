import {AdapterError, DullahanAdapter, DullahanErrorMessage, tryX} from "@k2g/dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.getElementStyles', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.getElementStyles('#dullahan', 'font-size', 'fontSize');
        } catch (error: any) {
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
            await adapter.getElementStyles('#dullahan');
        } catch (error: any) {
            expect(error.message).toMatchSnapshot();
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it('returns an empty array if no styles are specified', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementPresent('body', {
            timeout: 2000
        });
        const result = await adapter.getElementStyles('body');
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(0);
    });

    it('returns "null" values for missing styles', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080/clickbox', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementPresent('.clickbox', {
            timeout: 2000
        });
        const [doesNotExist] = await adapter.getElementStyles('.clickbox', 'does-not-exist');
        expect(doesNotExist).toBeTruthy();
        expect(doesNotExist.unit).toBe(null);
        expect(doesNotExist.value).toBe(null);
    });

    it('returns styles in order', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080/clickbox', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementPresent('.clickbox', {
            timeout: 2000
        });
        const [position, width] = await adapter.getElementStyles('.clickbox', 'position', 'width');
        expect(position).toBeTruthy();
        expect(position.unit).toBe(null);
        expect(position.value).toBe('absolute');
        expect(width).toBeTruthy();
        expect(width.unit).toBe('px');
        expect(width.value).toBe('100');
    });

    it('handles dashed style names as well as camelCased style names', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080/clickbox', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementPresent('.clickbox', {
            timeout: 2000
        });
        const [backgroundColor1, backgroundColor2] = await adapter.getElementStyles('.clickbox', 'background-color', 'backgroundColor');
        expect(backgroundColor1).toBeTruthy();
        expect(backgroundColor1.unit).toBe(null);
        expect(backgroundColor1.value).toBe('rgb(255, 255, 0)');
        expect(backgroundColor2).toBeTruthy();
        expect(backgroundColor2.unit).toBe(null);
        expect(backgroundColor2.value).toBe('rgb(255, 255, 0)');
    });
});
